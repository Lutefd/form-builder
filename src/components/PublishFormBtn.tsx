import React from "react";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { PublishForm } from "@/actions/form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import useDesigner from "./hooks/useDesigner";

function PublishFormBtn({ id }: { id: string }) {
  const [loading, startTransition] = useTransition();
  const { elements } = useDesigner();

  const router = useRouter();

  async function publishForm() {
    try {
      const JSONElements = JSON.stringify(elements);

      await PublishForm(id, JSONElements);
      toast({
        title: "Successo",
        description: "Seu formulário foi publicado com sucesso.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Algo deu errado ao publicar o formulário.",
        variant: "destructive",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpenCheck className="h-5 w-5" />
          Publicar{" "}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Após publicar o formulário, você
            não poderá mais editá-lo.
            <br />
            <br />
            <span className="font-medium">
              Ao publicar o formulário, você o torna disponível para o público.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
          >
            Publicar {loading && <Loader2 className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
