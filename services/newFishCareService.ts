import {
    addDoc,
    collection,
    deleteDoc,
    doc,
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

const defaultDays: FishCareDay[] = [
  { day: 1, completed: false },
  { day: 2, completed: false },
  { day: 3, completed: false },
  { day: 4, completed: false },
  { day: 5, completed: false },
  { day: 6, completed: false },
  { day: 7, completed: false },
];

export const getPrograms = async (
  userId: string,
): Promise<FishCareProgram[]> => {
  const q = query(
    collection(db, "users", userId, "fishCarePrograms"),
    orderBy("startedAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FishCareProgram, "id">),
  }));
};

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
      const programs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FishCareProgram, "id">),
      }));

      callback(programs);
    },
    (error) => {
      if (error.code !== "permission-denied") {
        console.error(error);
      }
    },
  );
};

export const createProgram = async (
  userId: string,
  fishName: string,
  species: string,
  purchaseDate: string,
): Promise<string> => {
  const docRef = await addDoc(
    collection(db, "users", userId, "fishCarePrograms"),
    {
      fishName,
      species,
      purchaseDate,

      currentDay: 1,

      days: defaultDays,

      status: "active",

      startedAt: serverTimestamp(),
    },
  );

  return docRef.id;
};

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

export const deleteProgram = async (userId: string, programId: string) => {
  await deleteDoc(doc(db, "users", userId, "fishCarePrograms", programId));
};
