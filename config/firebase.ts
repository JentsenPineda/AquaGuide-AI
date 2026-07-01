import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdxT0-_lPMG4_dx0nW2zFtubzkQhUwq7U",
  authDomain: "aquaguideai.firebaseapp.com",
  projectId: "aquaguideai",
  storageBucket: "aquaguideai.firebasestorage.app",
  messagingSenderId: "690991011437",
  appId: "1:690991011437:web:aec9e590994cb3eed4d164",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;
