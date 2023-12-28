import { GetFormContentByUrl } from "@/actions/form";
import { type FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import React from "react";

async function SubmitPage({ params }: { params: { formUrl: string } }) {
  const form = await GetFormContentByUrl(params.formUrl);
  if (!form) {
    throw new Error("Formulário não encontrado");
  }
  const formContent = JSON.parse(form.content) as FormElementInstance[];
  return <FormSubmitComponent formUrl={params.formUrl} content={formContent} />;
}

export default SubmitPage;
