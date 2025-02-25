import { type ReactNode } from "react";
import Setup from "@/components/utils/Setup";
interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  return (
    <>
      <Setup />
      {children}
    </>
  );
}

export default Layout;
