import React from "react";

import { useAuth } from "../contexts/AuthContext";
import LoginRequired from "./LoginRequired";

type LoginRedirect = "reminder" | "logbook";

interface Props {
  children: React.ReactNode;
  redirect: LoginRedirect;
}

export default function AuthRequired({ children, redirect }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <LoginRequired redirect={redirect} />;
  }

  return <>{children}</>;
}
