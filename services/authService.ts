import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const registerUser = async (
  fullName: string,
  username: string,
  email: string,
  password: string,
) => {
  const normalizedEmail = email.trim();

  const credential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password,
  );

  const user = credential.user;

  await updateProfile(user, {
    displayName: fullName,
  });

  await sendEmailVerification(user);

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName,
    username,
    email: normalizedEmail,
    createdAt: serverTimestamp(),
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const reauthenticateCurrentUser = async (password: string) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  if (!user.email) {
    throw new Error("This account does not have an email address.");
  }

  const credential = EmailAuthProvider.credential(user.email, password);

  await reauthenticateWithCredential(user, credential);
};

export const deleteCurrentUserAccount = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No authenticated user found.");
  }

  const uid = user.uid;

  const subcollections = ["logs", "reminders", "scans", "scanUsage"];

  for (const subcollectionName of subcollections) {
    const collectionRef = collection(db, "users", uid, subcollectionName);

    const snapshot = await getDocs(collectionRef);

    for (const document of snapshot.docs) {
      await deleteDoc(document.ref);
    }
  }

  await deleteDoc(doc(db, "users", uid));

  await deleteUser(user);
};
