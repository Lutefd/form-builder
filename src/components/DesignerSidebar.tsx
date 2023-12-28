import React from "react";
import { FormElements } from "./FormElements";
import SidebarBtnElement from "./SidebarBtnElement";

function DesignerSidebar() {
  return (
    <aside className="flex h-full w-[400px] max-w-[400px] flex-col gap-2 overflow-y-auto border-l-2 border-muted bg-background p-4">
      Elementos
      <SidebarBtnElement formElement={FormElements.TextField} />
    </aside>
  );
}

export default DesignerSidebar;
