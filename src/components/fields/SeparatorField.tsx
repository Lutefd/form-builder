"use client";

import { Minus } from "lucide-react";
import {
  type ElementsType,
  type FormElement,
  type FormElementInstance,
} from "../FormElements";
import { Label } from "../ui/label";

import { Separator } from "../ui/separator";

const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: Minus,
    label: "Separador",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Separador</Label>
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <Separator />;
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <p>Não temos nenhuma propriedade para esse elemento. </p>;
}
