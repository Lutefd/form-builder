import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./FormElements";
import { Separator } from "./ui/separator";

function FormElementsSidebar() {
  return (
    <div>
      <p className="text-sm text-foreground/70">Elementos de Drag and Drop</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 place-items-center gap-2 md:grid-cols-2">
        <p className="col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2">
          Elementos de Layout
        </p>
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubTitleField} />

        <p className="col-span-1 my-2 place-self-start text-sm text-muted-foreground md:col-span-2">
          Elementos de Formulário
        </p>
        <SidebarBtnElement formElement={FormElements.TextField} />
      </div>
    </div>
  );
}

export default FormElementsSidebar;
