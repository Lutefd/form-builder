import DesignerContextProvider from "@/components/context/DesignerContext";
import { type ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <DesignerContextProvider>
      <div className="mx-auto flex w-full flex-grow flex-col">{children}</div>
    </DesignerContextProvider>
  );
}

export default layout;
