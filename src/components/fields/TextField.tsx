"use client";

import { Type } from "lucide-react";
import type {
  FormElementInstance,
  ElementsType,
  FormElement,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";

const type: ElementsType = "TextField";

const extraAttributes = {
  label: "Campo de Texto",
  helperText: "Texto auxiliar",
  required: false,
  placeholder: "Placeholder",
};

const propertiesSchema = z.object({
  label: z
    .string()
    .min(2, {
      message: "O label deve ter pelo menos 2 caracteres",
    })
    .max(50, {
      message: "O label deve ter no máximo 50 caracteres",
    }),
  helperText: z.string().max(200, {
    message: "O texto auxiliar deve ter no máximo 200 caracteres",
  }),
  required: z.boolean().default(false),
  placeholder: z.string().max(50, {
    message: "O placeholder deve ter no máximo 50 caracteres",
  }),
});

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Type,
    label: "Campo de Texto",
  },

  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean => {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }

    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};
type propertiesFormSchema = z.infer<typeof propertiesSchema>;

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, placeholder, helperText, required } = element.extraAttributes;
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

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const form = useForm<propertiesFormSchema>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchema) {
    const { label, helperText, placeholder, required } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        placeholder,
        required,
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                O label do campo. <br /> Vai ser exibido acima do campo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>O placeholder do campo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto auxiliar</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                O texto auxiliar do campo. <br />
                Vai ser exibido abaixo do campo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Obrigatoriedade</FormLabel>
                <FormDescription>
                  Se o campo é obrigatório ou não.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, placeholder, helperText, required } = element.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input placeholder={placeholder}></Input>
      {helperText && (
        <p className="text-[0.8rem] text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
