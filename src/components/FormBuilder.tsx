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
import { Loader, Loader2 } from "lucide-react";

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
    const elements = JSON.parse(form.content) as FormElementInstance[];
    setElements(elements);
    setIsReady(true);
  }, [form, setElements, isReady]);

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
                <PublishFormBtn />
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
