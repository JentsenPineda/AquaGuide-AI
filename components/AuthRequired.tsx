import React from "react";

import { useAuth } from "../contexts/AuthContext";
import LoginRequired from "./LoginRequired";

interface Props {
  children: React.ReactNode;
}

export default function AuthRequired({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <LoginRequired />;
  }

  return <>{children}</>;
}
