"use client";

import { Type } from "lucide-react";
import type {
  FormElementInstance,
  ElementsType,
  FormElement,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const type: ElementsType = "TextField";

const extraAtributtes = {
  label: "Label",
  placeholder: "Placeholder",
  helperText: "Helper Text",
  required: false,
};

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAtributtes,
  }),
  designerBtnElement: {
    icon: Type,
    label: "Campo de Texto",
  },

  designerComponent: DesignerComponent,
  formComponent: () => <div>Form Component</div>,
  propertiesComponent: () => <div>Properties Component</div>,
};

type CustomInstance = FormElementInstance & {
  extraAtributtes: typeof extraAtributtes;
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, placeholder, helperText, required } = element.extraAtributtes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input readOnly disabled placeholder={placeholder}></Input>
      {helperText && (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
