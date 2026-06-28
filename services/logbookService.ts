import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface LogItem {
  id: string;
  type:
    | "Feeding"
    | "Water Change"
    | "Health Observation"
    | "Disease Treatment"
    | "New Fish Added"
    | "Tank Maintenance";
  note?: string;
  date: string;
}

export const getLogs = async (userId: string): Promise<LogItem[]> => {
  const q = query(
    collection(db, "users", userId, "logs"),
    orderBy("date", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<LogItem, "id">),
  }));
};

export const subscribeToLogs = (
  userId: string,
  callback: (logs: LogItem[]) => void,
) => {
  const q = query(
    collection(db, "users", userId, "logs"),
    orderBy("date", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<LogItem, "id">),
    }));

    callback(logs);
  });
};

export const addLog = async (
  userId: string,
  log: Omit<LogItem, "id">,
): Promise<string> => {
  const docRef = await addDoc(collection(db, "users", userId, "logs"), log);

  return docRef.id;
};

export const deleteLog = async (userId: string, logId: string) => {
  await deleteDoc(doc(db, "users", userId, "logs", logId));
};
