import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../config/firebase";

export interface ScanItem {
  id: string;
  label: string;
  confidence: number;
  note: string;
  createdAt?: any;
}

const DAILY_SCAN_LIMIT = 5;

/**
 * Returns today's date using the device's local date.
 *
 * Example:
 * 2026-08-19
 */
const getLocalDateKey = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Get the user's scan usage for today.
 */
export const getDailyScanUsage = async (userId: string) => {
  const dateKey = getLocalDateKey();

  const usageRef = doc(db, "users", userId, "scanUsage", dateKey);

  const snapshot = await getDoc(usageRef);

  const used = snapshot.exists() ? Number(snapshot.data().count ?? 0) : 0;

  return {
    used,
    remaining: Math.max(0, DAILY_SCAN_LIMIT - used),
    limit: DAILY_SCAN_LIMIT,
  };
};

/**
 * Reserve one scan for today.
 *
 * A Firestore transaction is used so two rapid scan
 * requests cannot both bypass the 5-scan limit.
 */
export const reserveDailyScan = async (userId: string) => {
  const dateKey = getLocalDateKey();

  const usageRef = doc(db, "users", userId, "scanUsage", dateKey);

  return await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(usageRef);

    const currentCount = snapshot.exists()
      ? Number(snapshot.data().count ?? 0)
      : 0;

    if (currentCount >= DAILY_SCAN_LIMIT) {
      return {
        allowed: false,
        used: currentCount,
        remaining: 0,
      };
    }

    const newCount = currentCount + 1;

    transaction.set(
      usageRef,
      {
        count: newCount,
        date: dateKey,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    return {
      allowed: true,
      used: newCount,
      remaining: DAILY_SCAN_LIMIT - newCount,
    };
  });
};

/**
 * Release a previously reserved scan.
 *
 * This is used when the AI scan fails after
 * the scan was already reserved.
 */
export const releaseDailyScan = async (userId: string) => {
  const dateKey = getLocalDateKey();

  const usageRef = doc(db, "users", userId, "scanUsage", dateKey);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(usageRef);

    if (!snapshot.exists()) {
      return;
    }

    const currentCount = Number(snapshot.data().count ?? 0);

    const newCount = Math.max(0, currentCount - 1);

    transaction.set(
      usageRef,
      {
        count: newCount,
        date: dateKey,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );
  });
};

/**
 * Save a completed AI fish scan.
 *
 * Existing scan history structure is preserved:
 *
 * users/{userId}/scans/{scanId}
 */
export const addScan = async (
  userId: string,
  scan: Omit<ScanItem, "id" | "createdAt">,
) => {
  await addDoc(collection(db, "users", userId, "scans"), {
    ...scan,
    createdAt: serverTimestamp(),
  });
};

/**
 * Subscribe to the user's scan history.
 */
export const subscribeToScans = (
  userId: string,
  callback: (scans: ScanItem[]) => void,
) => {
  const q = query(
    collection(db, "users", userId, "scans"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const scans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ScanItem, "id">),
      }));

      callback(scans);
    },
    (error) => {
      if (error.code !== "permission-denied") {
        console.error("Scan subscription error:", error);
      }
    },
  );
};
