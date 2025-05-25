/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCircuitStore } from "@/store/circuitStore";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import ConnectionPoint from "./ConnectionPoint";

interface DraggableComponentProps {
  component: any;
  isSelected: boolean;
  dimensions: { width: number; height: number };
}

export function DraggableComponent({
  component,
  isSelected,
  dimensions,
}: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: component.id,
  });
  const { selectComponent, deleteComponent } = useCircuitStore();

  const style = {
    transform: CSS.Translate.toString(
      transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    ),
    left: component.x,
    top: component.y,
    zIndex: isSelected ? 20 : 10,
  };

  const handleComponentClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectComponent(component.id);
    },
    [selectComponent, component.id]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteComponent(component.id);
    },
    [deleteComponent, component.id]
  );

  return (
    <div ref={setNodeRef} className="absolute group" style={style}>
      {/* Clickable area for selection */}
      <div className="cursor-pointer" onClick={handleComponentClick}>
        <div
          className={`bg-white shadow rounded px-4 py-2 text-sm border-2 transition-all duration-200 relative ${
            isSelected
              ? "border-blue-500 bg-blue-50 shadow-lg"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
          style={{
            minWidth: `${dimensions.width}px`,
            minHeight: `${dimensions.height}px`,
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="font-medium text-xs text-center">
            {component.label}
          </div>
          <div className="text-xxs text-gray-500 text-center">
            {component.type === "voltage-source"
              ? `${component.properties.voltage}V`
              : `${component.properties.resistance}Ω`}
          </div>

          {/* Connection points */}
          <ConnectionPoint
            componentId={component.id}
            terminal={
              component.type === "voltage-source" ? "negative" : "input"
            }
            position="left"
            label="-"
          />
          <ConnectionPoint
            componentId={component.id}
            terminal={
              component.type === "voltage-source" ? "positive" : "output"
            }
            position="right"
            label="+"
          />
        </div>
      </div>

      {/* Drag handle - positioned better */}
      <div
        className="absolute -top-3 -left-3 w-6 h-6 bg-gray-400 rounded-full cursor-move opacity-0 group-hover:opacity-80 transition-opacity z-30 flex items-center justify-center hover:bg-gray-500"
        {...listeners}
        {...attributes}
        title="Drag to move"
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>

      {/* Delete button - only when selected */}
      {isSelected && (
        <div className="absolute -top-[10%] -right-[10%] flex gap-1 z-30">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-1.5 rounded text-xs hover:bg-red-600 transition-colors shadow-lg"
            title="Delete component"
          >
            <FaTrash size={10} />
          </button>
        </div>
      )}
    </div>
  );
}
