import { type Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement";
import { type ElementsType, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";
interface Current {
  isDesignerBtnElement: boolean;
  type: ElementsType;
  isDesignerElement: boolean;
  elementId?: string;
}

function DragOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  const { elements } = useDesigner();
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel(_event) {
      setDraggedItem(null);
    },
    onDragEnd(_event) {
      setDraggedItem(null);
    },
  });
  if (!draggedItem) return null;
  if (draggedItem.data.current == undefined) return null;
  let node;
  const isDesignerBtnElement = (draggedItem?.data?.current as Current)
    .isDesignerBtnElement;
  if (isDesignerBtnElement) {
    const type = draggedItem?.data?.current.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }

  const isDesignerElement = (draggedItem?.data?.current as Current)
    .isDesignerElement;
  if (isDesignerElement) {
    const elementId = draggedItem?.data?.current.elementId as string;
    const element = elements.find((element) => element.id === elementId);
    if (!element) node = <div className="">elemento não encontrado</div>;
    else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;

      node = (
        <div className="pointer pointer-events-none flex h-[120px] w-full rounded-md border bg-accent px-4 py-2 opacity-80">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}

export default DragOverlayWrapper;
