import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

export type FishCareStatus = "active" | "completed";

export interface FishCareDay {
  day: number;
  completed: boolean;
  completedAt?: Timestamp;
}

export interface FishCareProgram {
  id: string;

  fishName: string;
  species: string;
  purchaseDate: string;

  currentDay: number;

  days: FishCareDay[];

  status: FishCareStatus;

  startedAt: Timestamp;
  completedAt?: Timestamp;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const FISH_CARE_TOTAL_DAYS = 7;

const createDefaultDays = (): FishCareDay[] =>
  Array.from({ length: FISH_CARE_TOTAL_DAYS }, (_, index) => ({
    day: index + 1,
    completed: false,
  }));

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Converts Firestore Timestamp / Date / milliseconds
 * into a JavaScript Date when possible.
 */
const toDate = (value?: Timestamp | Date | number | null): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    return new Date(value);
  }

  return null;
};

/**
 * Determines whether 24 hours have passed since
 * the previous day was completed.
 */
export const hasDayUnlocked = (previousCompletedAt?: Timestamp): boolean => {
  if (!previousCompletedAt) {
    return false;
  }

  const completedDate = toDate(previousCompletedAt);

  if (!completedDate) {
    return false;
  }

  const now = Date.now();

  const elapsed = now - completedDate.getTime();

  const twentyFourHours = 24 * 60 * 60 * 1000;

  return elapsed >= twentyFourHours;
};

/**
 * Returns the next day that should normally be completed.
 */
export const getNextIncompleteDay = (days: FishCareDay[]): number => {
  const nextDay = days.find((day) => !day.completed);

  return nextDay?.day ?? FISH_CARE_TOTAL_DAYS;
};

/**
 * Returns the remaining time until the next day unlocks.
 */
export const getNextUnlockTime = (previousCompletedAt?: Timestamp): number => {
  if (!previousCompletedAt) {
    return 0;
  }

  const completedDate = toDate(previousCompletedAt);

  if (!completedDate) {
    return 0;
  }

  const unlockTime = completedDate.getTime() + 24 * 60 * 60 * 1000;

  return Math.max(0, unlockTime - Date.now());
};

/* -------------------------------------------------------------------------- */
/* Get Programs                                                               */
/* -------------------------------------------------------------------------- */

export const getPrograms = async (
  userId: string,
): Promise<FishCareProgram[]> => {
  const q = query(
    collection(db, "users", userId, "fishCarePrograms"),
    orderBy("startedAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as Omit<FishCareProgram, "id">),
  }));
};

/* -------------------------------------------------------------------------- */
/* Get Single Program                                                         */
/* -------------------------------------------------------------------------- */

export const getProgram = async (
  userId: string,
  programId: string,
): Promise<FishCareProgram | null> => {
  const programRef = doc(db, "users", userId, "fishCarePrograms", programId);

  const snapshot = await getDoc(programRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<FishCareProgram, "id">),
  };
};

/* -------------------------------------------------------------------------- */
/* Real-Time Program Listener                                                 */
/* -------------------------------------------------------------------------- */

export const subscribeToPrograms = (
  userId: string,
  callback: (programs: FishCareProgram[]) => void,
) => {
  const q = query(
    collection(db, "users", userId, "fishCarePrograms"),
    orderBy("startedAt", "desc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const programs = snapshot.docs.map((document) => ({
        id: document.id,
        ...(document.data() as Omit<FishCareProgram, "id">),
      }));

      callback(programs);
    },
    (error) => {
      if (error.code !== "permission-denied") {
        console.error("Fish care subscription error:", error);
      }
    },
  );
};

/* -------------------------------------------------------------------------- */
/* Create Program                                                             */
/* -------------------------------------------------------------------------- */

export const createProgram = async (
  userId: string,
  fishName: string,
  species: string,
  purchaseDate: string,
): Promise<string> => {
  const cleanFishName = fishName.trim();
  const cleanSpecies = species.trim();

  if (!cleanFishName) {
    throw new Error("Fish name is required.");
  }

  if (!cleanSpecies) {
    throw new Error("Fish species is required.");
  }

  const days = createDefaultDays();

  const docRef = await addDoc(
    collection(db, "users", userId, "fishCarePrograms"),
    {
      fishName: cleanFishName,
      species: cleanSpecies,
      purchaseDate,

      currentDay: 1,

      days,

      status: "active",

      startedAt: serverTimestamp(),
    },
  );

  return docRef.id;
};

/* -------------------------------------------------------------------------- */
/* Update Program                                                             */
/* -------------------------------------------------------------------------- */

export const updateProgram = async (
  userId: string,
  programId: string,
  data: Partial<Omit<FishCareProgram, "id">>,
) => {
  await updateDoc(
    doc(db, "users", userId, "fishCarePrograms", programId),
    data,
  );
};

/* -------------------------------------------------------------------------- */
/* Complete Day                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Marks exactly one day as completed.
 *
 * Important:
 * - A completed day cannot be completed again.
 * - Future days cannot be completed before their turn.
 * - Normal progression requires 24 hours after the
 *   previous day's completion.
 *
 * `allowEarlyAccess` only controls whether the user
 * may OPEN a day early. It does NOT bypass the
 * completion rules.
 */
export const completeFishCareDay = async (
  userId: string,
  programId: string,
  dayNumber: number,
  options?: {
    allowEarlyCompletion?: boolean;
  },
): Promise<{
  success: boolean;
  completedDay: number;
  nextDay: number;
  programCompleted: boolean;
}> => {
  if (dayNumber < 1 || dayNumber > FISH_CARE_TOTAL_DAYS) {
    throw new Error("Invalid fish care day.");
  }

  const programRef = doc(db, "users", userId, "fishCarePrograms", programId);

  const snapshot = await getDoc(programRef);

  if (!snapshot.exists()) {
    throw new Error("Fish care program not found.");
  }

  const program = snapshot.data() as Omit<FishCareProgram, "id">;

  const days = Array.isArray(program.days)
    ? [...program.days]
    : createDefaultDays();

  const targetIndex = days.findIndex((item) => item.day === dayNumber);

  if (targetIndex === -1) {
    throw new Error("Fish care day not found.");
  }

  const targetDay = days[targetIndex];

  /* Already completed — do nothing. */
  if (targetDay.completed) {
    const nextDay = getNextIncompleteDay(days);

    return {
      success: false,
      completedDay: dayNumber,
      nextDay,
      programCompleted: days.every((item) => item.completed),
    };
  }

  /*
   * Prevent skipping days.
   *
   * Example:
   * Day 1 incomplete → Day 3 cannot be completed.
   */
  const previousDay =
    dayNumber > 1 ? days.find((item) => item.day === dayNumber - 1) : undefined;

  if (dayNumber > 1 && !previousDay?.completed) {
    throw new Error(`Day ${dayNumber - 1} must be completed first.`);
  }

  /*
   * Normal 24-hour protection.
   *
   * Early access may allow the user to VIEW a future/current
   * day from Home, but completion still requires the normal
   * unlock unless explicitly allowed by the caller.
   */
  if (
    dayNumber > 1 &&
    previousDay?.completedAt &&
    !options?.allowEarlyCompletion
  ) {
    const unlocked = hasDayUnlocked(previousDay.completedAt);

    if (!unlocked) {
      throw new Error(
        "This day is not unlocked yet. Please wait 24 hours after completing the previous day.",
      );
    }
  }

  const completedAt = Timestamp.now();

  days[targetIndex] = {
    ...targetDay,
    completed: true,
    completedAt,
  };

  const allCompleted = days.every((item) => item.completed);

  const nextDay = getNextIncompleteDay(days);

  await updateDoc(programRef, {
    days,

    currentDay: allCompleted ? FISH_CARE_TOTAL_DAYS : nextDay,

    status: allCompleted ? "completed" : "active",

    ...(allCompleted
      ? {
          completedAt,
        }
      : {}),
  });

  return {
    success: true,
    completedDay: dayNumber,
    nextDay,
    programCompleted: allCompleted,
  };
};

/* -------------------------------------------------------------------------- */
/* Get Current Progress                                                       */
/* -------------------------------------------------------------------------- */

export const getProgramProgress = (program: FishCareProgram) => {
  const completedDays = program.days.filter((day) => day.completed).length;

  const nextDay = getNextIncompleteDay(program.days);

  const progress = (completedDays / FISH_CARE_TOTAL_DAYS) * 100;

  const previousDay =
    nextDay > 1
      ? program.days.find((day) => day.day === nextDay - 1)
      : undefined;

  const remainingMilliseconds = previousDay?.completedAt
    ? getNextUnlockTime(previousDay.completedAt)
    : 0;

  return {
    completedDays,
    totalDays: FISH_CARE_TOTAL_DAYS,
    progress,
    nextDay,
    remainingMilliseconds,
    completed: completedDays === FISH_CARE_TOTAL_DAYS,
  };
};

/* -------------------------------------------------------------------------- */
/* Delete Program                                                             */
/* -------------------------------------------------------------------------- */

export const deleteProgram = async (userId: string, programId: string) => {
  await deleteDoc(doc(db, "users", userId, "fishCarePrograms", programId));
};
