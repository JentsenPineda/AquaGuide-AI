import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
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

export const addScan = async (
  userId: string,
  scan: Omit<ScanItem, "id" | "createdAt">,
) => {
  await addDoc(collection(db, "users", userId, "scans"), {
    ...scan,
    createdAt: serverTimestamp(),
  });
};

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
