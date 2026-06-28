import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";

export const registerUser = async (
  fullName: string,
  username: string,
  email: string,
  password: string,
) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
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
    email,
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
