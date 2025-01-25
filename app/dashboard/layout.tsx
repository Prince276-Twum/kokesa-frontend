import RequireAuth from "@/components/utils/RequireAuth";
import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function layout({ children }: Props) {
  return (
    <>
      <RequireAuth>{children}</RequireAuth>
    </>
  );
}

export default layout;
