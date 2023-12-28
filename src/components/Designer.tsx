"use client";

import { cn, idGenerator } from "@/lib/utils";
import DesignerSidebar from "./DesignerSidebar";
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import useDesigner from "./hooks/useDesigner";
import {
  FormElements,
  type ElementsType,
  type FormElementInstance,
} from "./FormElements";
import { useState } from "react";
import { Button } from "./ui/button";
import { LucideTrash } from "lucide-react";
interface Current {
  isDesignerBtnElement: boolean;
  type: ElementsType;
}
function Designer() {
  const { elements, addElement } = useDesigner();
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });
  useDndMonitor({
    onDragEnd(event) {
      const { active, over } = event;
      if (!active || !over) return;
      const isDesignerBtnElement = (active.data?.current as Current)
        .isDesignerBtnElement;
      if (isDesignerBtnElement) {
        const type = (active.data?.current as Current).type;
        const newElement =
          FormElements[type as ElementsType].construct(idGenerator());
        addElement(0, newElement);
      }
    },
  });
  return (
    <div className="flex h-full w-full">
      <div className="w-full p-4">
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "m-auto flex h-full max-w-[920px] flex-1 flex-grow flex-col items-center justify-start overflow-y-auto rounded-xl bg-background",
            droppable.isOver && "ring-2 ring-primary/20",
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="flex flex-grow items-center text-3xl font-bold text-muted-foreground">
              Arraste e solte os componentes
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="w-full p-4">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex w-full flex-col gap-2 p-4 ">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const DesignerElement = FormElements[element.type].designerComponent;
  const { removeElement } = useDesigner();
  const [mouseOver, setMouseOver] = useState(false);
  const topHalf = useDroppable({
    id: `designer-element-${element.id}-top-half`,
    data: {
      isDesignerElementTopHalf: true,
      elementId: element.id,
      type: element.type,
    },
  });
  const bottomHalf = useDroppable({
    id: `designer-element-${element.id}-bottom-half`,
    data: {
      isDesignerElementBottomHalf: true,
      elementId: element.id,
      type: element.type,
    },
  });
  const draggable = useDraggable({
    id: `designer-element-${element.id}-draggable`,
    data: {
      isDesignerElement: true,
      elementId: element.id,
      type: element.type,
    },
  });

  if (draggable.isDragging) return null;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      className="relative flex h-[120px] flex-col rounded-md text-foreground ring-1 ring-inset ring-accent hover:cursor-pointer"
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className={cn("absolute h-1/2 w-full rounded-t-md")}
      />
      <div
        ref={bottomHalf.setNodeRef}
        className={cn("absolute  bottom-0 h-1/2 w-full rounded-b-md")}
      />
      {mouseOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="z-50 flex h-full justify-center rounded-md rounded-l-none border bg-red-500"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <LucideTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-sm text-muted-foreground">
              Clique para acessar as propriedades ou arraste para mover
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 h-[7px] w-full rounded-md rounded-b-none bg-primary" />
      )}
      <div
        className={cn(
          "pointer-events-none flex h-[120px] w-full items-center rounded-md bg-accent/40 px-4 py-2 opacity-100",
          mouseOver && "opacity-30",
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className="absolute bottom-0 h-[7px] w-full rounded-md rounded-t-none bg-primary" />
      )}
    </div>
  );
}
export default Designer;
