import { User, onAuthStateChanged, reload, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../config/firebase";
import {
  startNetworkSync,
  stopNetworkSync,
} from "../services/networkSyncService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  emailVerified: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  emailVerified: false,
  logout: async () => {},
  refreshUser: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  const logout = async () => {
    await signOut(auth);

    setUser(null);
    setEmailVerified(false);
  };

  const refreshUser = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setUser(null);
      setEmailVerified(false);
      return null;
    }

    try {
      await reload(currentUser);
    } catch (error) {
      console.log("AUTH USER RELOAD ERROR:", error);
    }

    const refreshedUser = auth.currentUser;

    setUser(refreshedUser);
    setEmailVerified(refreshedUser?.emailVerified ?? false);

    return refreshedUser;
  };

  // Firebase authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(
        "AUTH STATE CHANGED:",
        currentUser?.email,
        "verified:",
        currentUser?.emailVerified,
      );

      if (!currentUser) {
        setUser(null);
        setEmailVerified(false);
        setLoading(false);
        return;
      }

      /*
       * Firebase can restore a cached user whose emailVerified
       * value has not yet been refreshed from the server.
       *
       * Reload the user so the navigation gate receives the
       * latest verification status.
       */
      try {
        await reload(currentUser);
      } catch (error) {
        console.log("AUTH INITIAL RELOAD ERROR:", error);
      }

      const refreshedUser = auth.currentUser;

      setUser(refreshedUser);
      setEmailVerified(refreshedUser?.emailVerified ?? false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Start automatic offline → online synchronization
  useEffect(() => {
    if (!user) {
      stopNetworkSync();
      return;
    }

    console.log("NETWORK SYNC: Starting for user:", user.uid);

    const cleanup = startNetworkSync(user.uid);

    return cleanup;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        emailVerified,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
