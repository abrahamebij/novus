// /components/CircuitCanvas.tsx
"use client";

import { useCircuit } from "@/context/CircuitContext";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRef } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function CircuitCanvas() {
  const { components, updatePosition } = useCircuit();
  const canvasRef = useRef<HTMLDivElement>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    updatePosition(String(active.id), delta.x, delta.y);
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-screen bg-gray-50 overflow-hidden"
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {components.map((comp) => (
          <Draggable key={comp.id} id={comp.id} x={comp.x} y={comp.y}>
            <div className="bg-white shadow rounded px-4 py-2 text-sm border">
              {comp.label}
            </div>
          </Draggable>
        ))}
      </DndContext>
    </div>
  );
}

function Draggable({
  id,
  x,
  y,
  children,
}: {
  id: string;
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(
      transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    ),
    left: x,
    top: y,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute cursor-move group"
      style={style}
    >
      {children}
      <button className="absolute -right-2 text-primary top-1/4 bottom-1/4 hidden group-hover:block">
        <FaPlusCircle />
      </button>
    </div>
  );
}
