"use client";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

function RequireAuth({ children }: Props) {
  const { isAuthenticated, isLoading } = useAppSelector((store) => store.auth);

  if (isLoading) {
    return <>spinner........</>;
  }

  console.log(isAuthenticated);
  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default RequireAuth;
