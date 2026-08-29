import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
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

let auth: FirebaseAuth.Auth;

if (Platform.OS === "web") {
  // Web Firebase Auth
  auth = FirebaseAuth.getAuth(app);
} else {
  // React Native Firebase Auth
  const { initializeAuth, getReactNativePersistence } =
    FirebaseAuth as typeof FirebaseAuth & {
      getReactNativePersistence: (
        storage: typeof AsyncStorage,
      ) => FirebaseAuth.Persistence;
    };

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
