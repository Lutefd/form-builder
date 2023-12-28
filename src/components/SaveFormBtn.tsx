import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2, SaveIcon } from "lucide-react";
import useDesigner from "./hooks/useDesigner";
import { toast } from "./ui/use-toast";
import { UpdateFormContent } from "@/actions/form";

function SaveFormBtn({ id }: { id: string }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const JSONElements = JSON.stringify(elements);
      await UpdateFormContent(id, JSONElements);
      toast({
        title: "Formulário salvo com sucesso",
        description: "O formulário foi salvo com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar formulário",
        description:
          "Algo deu errado ao salvar o formulário, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant="outline"
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      {!loading && (
        <>
          <SaveIcon className="h-5 w-5" /> <p>Salvar</p>
        </>
      )}
      {loading && <Loader2 className="h-5 w-5 animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
