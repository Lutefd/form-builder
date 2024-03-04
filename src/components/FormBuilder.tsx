"use client";

import { type Form } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import useDesigner from "./hooks/useDesigner";
import type { FormElementInstance } from "./FormElements";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import Link from "next/link";

function FormBuilder({ form }: { form: Form }) {
  const { setElements } = useDesigner();
  const [isReady, setIsReady] = useState(false);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    const elements = form.content as FormElementInstance[];
    setElements(elements);
    setIsReady(true);
  }, [form, setElements, isReady]);

  const shareUrl = `${window.location.origin}/published-forms/${form.ShareURL}`;

  if (form.published) {
    return (
      <>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="max-w-md">
            <h1 className="mb-10 border-b pb-2 text-center text-4xl font-bold text-primary">
              Formulário Publicado
            </h1>
            <h3 className="border-b pb-10 text-xl text-muted-foreground">
              Qualquer pessoa com o link abaixo pode acessar o formulário
            </h3>
            <div className="my-4 flex w-full flex-col items-center gap-2 border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="mt-2 w-full"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Copiado!",
                    description: "Link copiado para a área de transferência.",
                  });
                }}
              >
                Copiar Link
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link href={"/"} className="gap-2">
                  <ArrowLeft />
                  Voltar para o dashboard
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link href={`/forms/${form.id}`} className="gap-2">
                  Detalhes do formulário
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors} id="dnd-context">
      <main className="flex w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
          <h2 className="truncate font-medium capitalize">
            <span className="mr-2 capitalize text-muted-foreground">
              Formulário:
            </span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>
        <div className="relative flex h-[200px] w-full flex-grow items-center justify-center overflow-y-auto bg-accent bg-[url(/graph-paper.svg)]">
          {isReady && <Designer />}
          {!isReady && (
            <div className="flex h-full w-full flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;
