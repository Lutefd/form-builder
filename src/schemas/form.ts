import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(4, {
      message: "O nome do formulário deve ter no mínimo 4 caracteres",
    })
    .max(255, {
      message: "O nome do formulário deve ter no máximo 255 caracteres",
    }),
  description: z
    .string()
    .max(255, {
      message: "A descrição do formulário deve ter no máximo 255 caracteres",
    })
    .optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
