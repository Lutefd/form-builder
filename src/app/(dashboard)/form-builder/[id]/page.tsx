import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";

async function BuilderPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const form = await GetFormById(params.id);
  if (!form) {
    throw new Error("Formulário não encontrado");
  }
  return <FormBuilder form={form} />;
}

export default BuilderPage;
