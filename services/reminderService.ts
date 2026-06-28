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
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";

export interface Reminder {
  id: string;

  type:
    | "Feeding"
    | "Water Change"
    | "Water Testing"
    | "Medication"
    | "Tank Cleaning"
    | "Plant Maintenance";

  repeat: "Daily" | "Weekly" | "Monthly";

  weekDay?: string;

  monthDay?: number;

  time: string;

  note?: string;

  notificationId?: string;
}

export const getReminders = async (uid: string) => {
  const q = query(
    collection(db, "users", uid, "reminders"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Reminder[];
};
export const subscribeToReminders = (
  uid: string,
  callback: (reminders: Reminder[]) => void,
) => {
  const q = query(
    collection(db, "users", uid, "reminders"),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const reminders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Reminder[];

    callback(reminders);
  });
};
export const addReminder = async (
  uid: string,
  reminder: Omit<Reminder, "id">,
) => {
  const data: Record<string, any> = {
    createdAt: serverTimestamp(),
  };

  Object.entries(reminder).forEach(([key, value]) => {
    if (value !== undefined) {
      data[key] = value;
    }
  });

  await addDoc(collection(db, "users", uid, "reminders"), data);
};

export const updateReminder = async (
  uid: string,
  id: string,
  reminder: Reminder,
) => {
  await updateDoc(doc(db, "users", uid, "reminders", id), {
    ...reminder,
  });
};

export const deleteReminder = async (uid: string, id: string) => {
  await deleteDoc(doc(db, "users", uid, "reminders", id));
};
