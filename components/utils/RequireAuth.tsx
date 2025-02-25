"use client";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { ClipLoader } from "react-spinners";
interface Props {
  children: ReactNode;
}

function RequireAuth({ children }: Props) {
  const { isAuthenticated, isLoading } = useAppSelector((store) => store.auth);

  if (isLoading) {
    return (
      <div className="flex justify-center py-5 ">
        <ClipLoader size={50} />
      </div>
    );
  }

  console.log(isAuthenticated);
  if (!isAuthenticated) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default RequireAuth;
