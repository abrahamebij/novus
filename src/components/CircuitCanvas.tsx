"use client";

import { useCircuitStore } from "@/store/circuitStore";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useEffect } from "react";
import { FaPlusCircle, FaTrash, FaPlug } from "react-icons/fa";

export default function CircuitCanvas() {
  const {
    components,
    wires,
    selectedComponent,
    isWiring,
    wireDraft,
    updatePosition,
    selectComponent,
    updateWireDraft,
    cancelWiring,
    getConnectionPoint,
  } = useCircuitStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    updatePosition(String(active.id), delta.x, delta.y);
  }

  function handleCanvasClick(e: React.MouseEvent) {
    // Cancel wiring if clicking on empty canvas
    if (isWiring) {
      cancelWiring();
      return;
    }

    // Deselect if clicking on empty canvas
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isWiring && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      updateWireDraft(e.clientX - rect.left, e.clientY - rect.top);
    }
  }

  // Render wire between two connection points
  function renderWire(wire: any, index: number) {
    const fromPoint = getConnectionPoint(
      wire.from.componentId,
      wire.from.terminal
    );
    const toPoint = getConnectionPoint(wire.to.componentId, wire.to.terminal);

    if (!fromPoint || !toPoint) return null;

    return (
      <line
        key={wire.id}
        x1={fromPoint.x}
        y1={fromPoint.y}
        x2={toPoint.x}
        y2={toPoint.y}
        stroke="#2563eb"
        strokeWidth="2"
        className="cursor-pointer hover:stroke-red-500"
        onClick={(e) => {
          e.stopPropagation();
          // Could add wire selection/deletion here
        }}
      />
    );
  }

  // Render draft wire while wiring
  function renderDraftWire() {
    if (!isWiring || !wireDraft.from) return null;

    const fromPoint = getConnectionPoint(
      wireDraft.from.componentId,
      wireDraft.from.terminal
    );
    if (!fromPoint) return null;

    return (
      <line
        x1={fromPoint.x}
        y1={fromPoint.y}
        x2={wireDraft.mouseX}
        y2={wireDraft.mouseY}
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
  }

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-screen bg-gray-50 overflow-hidden ${
        isWiring ? "cursor-crosshair" : ""
      }`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* SVG overlay for wires */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {wires.map(renderWire)}
        {renderDraftWire()}
      </svg>

      {/* Components */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {components.map((comp) => (
          <Draggable
            key={comp.id}
            id={comp.id}
            x={comp.x}
            y={comp.y}
            isSelected={selectedComponent === comp.id}
            component={comp}
          >
            <div
              className={`bg-white shadow rounded px-4 py-2 text-sm border-2 transition-colors relative ${
                selectedComponent === comp.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ minWidth: "120px", minHeight: "50px" }}
            >
              <div className="font-medium">{comp.label}</div>
              <div className="text-xs text-gray-500">
                {comp.type === "voltage-source"
                  ? `${comp.properties.voltage}V`
                  : `${comp.properties.resistance}Ω`}
              </div>

              {/* Connection points */}
              <ConnectionPoint
                componentId={comp.id}
                terminal={comp.type === "voltage-source" ? "negative" : "input"}
                position="left"
                label="-"
              />
              <ConnectionPoint
                componentId={comp.id}
                terminal={
                  comp.type === "voltage-source" ? "positive" : "output"
                }
                position="right"
                label="+"
              />
            </div>
          </Draggable>
        ))}
      </DndContext>

      {/* Wiring instructions */}
      {isWiring && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50">
          Click on a connection point to complete the wire, or click anywhere
          else to cancel
        </div>
      )}
    </div>
  );
}

function ConnectionPoint({
  componentId,
  terminal,
  position,
  label,
}: {
  componentId: string;
  terminal: string;
  position: "left" | "right";
  label: string;
}) {
  const { startWiring, completeWiring, isWiring, wireDraft } =
    useCircuitStore();

  function handleConnectionClick(e: React.MouseEvent) {
    e.stopPropagation();

    if (isWiring && wireDraft.from) {
      // Complete the wire
      completeWiring({ componentId, terminal: terminal as any });
    } else {
      // Start wiring
      startWiring({ componentId, terminal: terminal as any });
    }
  }

  const positionClasses =
    position === "left"
      ? "-left-2 top-1/2 -translate-y-1/2"
      : "-right-2 top-1/2 -translate-y-1/2";

  return (
    <button
      className={`absolute w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded-full text-xs font-bold flex items-center justify-center hover:bg-yellow-300 transition-colors z-10 ${positionClasses}`}
      onClick={handleConnectionClick}
      title={`${terminal} terminal`}
    >
      <span className="text-xs leading-none">{label}</span>
    </button>
  );
}

function Draggable({
  id,
  x,
  y,
  children,
  isSelected,
  component,
}: {
  id: string;
  x: number;
  y: number;
  children: React.ReactNode;
  isSelected: boolean;
  component: any;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const { selectComponent, deleteComponent } = useCircuitStore();

  const style = {
    transform: CSS.Translate.toString(
      transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    ),
    left: x,
    top: y,
    zIndex: 10,
  };

  function handleComponentClick(e: React.MouseEvent) {
    e.stopPropagation();
    selectComponent(id);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteComponent(id);
  }

  return (
    <div ref={setNodeRef} className="absolute group" style={style}>
      {/* Clickable area for selection */}
      <div className="cursor-pointer" onClick={handleComponentClick}>
        {children}
      </div>

      {/* Drag handle - small area for dragging */}
      <div
        className="absolute -top-2 -left-2 w-4 h-4 bg-gray-400 rounded-full cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-20"
        {...listeners}
        {...attributes}
      />

      {/* Delete button */}
      {isSelected && (
        <div className="absolute -top-8 -right-2 flex gap-1 z-30">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
}
