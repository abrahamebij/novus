/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCircuitStore } from "@/store/circuitStore";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRef, useEffect, useCallback, useMemo } from "react";
import {
  BiPlusCircle,
  BiSolidMinusCircle,
  BiSolidPlusCircle,
} from "react-icons/bi";
import { FaPlusCircle, FaTrash, FaPlug } from "react-icons/fa";
import { TbAlertTriangle } from "react-icons/tb";

export default function CircuitCanvas() {
  const {
    components,
    wires,
    selectedComponent,
    selectedWire,
    isWiring,
    wireDraft,
    componentDimensions,
    updatePosition,
    selectComponent,
    selectWire,
    updateWireDraft,
    cancelWiring,
    getConnectionPoint,
    deleteWire,
    validateCircuit,
  } = useCircuitStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  const circuitValidation = validateCircuit();

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      updatePosition(String(active.id), delta.x, delta.y);
    },
    [updatePosition]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Cancel wiring if clicking on empty canvas
      if (isWiring) {
        cancelWiring();
        return;
      }

      // Deselect if clicking on empty canvas
      if (e.target === e.currentTarget) {
        selectComponent(null);
        selectWire(null);
      }
    },
    [isWiring, cancelWiring, selectComponent, selectWire]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isWiring && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        updateWireDraft(e.clientX - rect.left, e.clientY - rect.top);
      }
    },
    [isWiring, updateWireDraft]
  );

  // Memoized wire click handler
  const handleWireClick = useCallback(
    (wireId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      selectWire(wireId);
    },
    [selectWire]
  );

  // Memoized wire delete handler
  const handleWireDelete = useCallback(
    (wireId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      deleteWire(wireId);
    },
    [deleteWire]
  );

  // Memoized wire rendering function
  const renderWire = useCallback(
    (wire: any) => {
      const fromPoint = getConnectionPoint(
        wire.from.componentId,
        wire.from.terminal
      );
      const toPoint = getConnectionPoint(wire.to.componentId, wire.to.terminal);

      if (!fromPoint || !toPoint) return null;

      const isSelected = selectedWire === wire.id;

      return (
        <g key={wire.id}>
          <line
            x1={fromPoint.x}
            y1={fromPoint.y}
            x2={toPoint.x}
            y2={toPoint.y}
            stroke={isSelected ? "#ef4444" : "#2563eb"}
            strokeWidth={isSelected ? "4" : "3"}
            className="cursor-pointer hover:stroke-red-500"
            onClick={(e) => handleWireClick(wire.id, e)}
          />
          {/* Wire selection indicator */}
          {isSelected && (
            <>
              <circle
                cx={(fromPoint.x + toPoint.x) / 2}
                cy={(fromPoint.y + toPoint.y) / 2}
                r="8"
                fill="#ef4444"
                className="cursor-pointer"
                onClick={(e) => handleWireDelete(wire.id, e)}
              />
              <text
                x={(fromPoint.x + toPoint.x) / 2}
                y={(fromPoint.y + toPoint.y) / 2 + 1}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                className="pointer-events-none select-none"
              >
                ×
              </text>
            </>
          )}
        </g>
      );
    },
    [getConnectionPoint, selectedWire, handleWireClick, handleWireDelete]
  );

  // Memoized draft wire rendering
  const renderDraftWire = useMemo(() => {
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
  }, [isWiring, wireDraft, getConnectionPoint]);

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
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Enable pointer events only for wires */}
        <g style={{ pointerEvents: "auto" }}>{wires.map(renderWire)}</g>

        {renderDraftWire}
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
            dimensions={componentDimensions}
          >
            <div
              className={`bg-white shadow rounded px-4 py-2 text-sm border-2 transition-all duration-200 relative ${
                selectedComponent === comp.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
              style={{
                minWidth: `${componentDimensions.width}px`,
                minHeight: `${componentDimensions.height}px`,
                width: `${componentDimensions.width}px`,
                height: `${componentDimensions.height}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div className="font-medium text-xs text-center">
                {comp.label}
              </div>
              <div className="text-xxs text-gray-500 text-center">
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

      {/* Circuit Validation Errors - Top Right */}
      {!circuitValidation.isValid && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <TbAlertTriangle size={16} className="text-red-600" />
            <span className="font-medium">Circuit Issues</span>
          </div>
          <div className="text-sm space-y-1">
            {circuitValidation.errors.map((error, index) => (
              <div key={index} className="flex items-start gap-1">
                <span className="text-red-500">•</span>
                <span>{error}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions and feedback */}
      {isWiring && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Click on a connection point to complete the wire, or click anywhere
          else to cancel
        </div>
      )}

      {selectedWire && (
        <div className="absolute top-20 right-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50">
          Wire selected - click the × to delete, or click elsewhere to deselect
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

  const handleConnectionClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isWiring && wireDraft.from) {
        // Complete the wire
        completeWiring({ componentId, terminal: terminal as any });
      } else {
        // Start wiring
        startWiring({ componentId, terminal: terminal as any });
      }
    },
    [
      isWiring,
      wireDraft.from,
      completeWiring,
      startWiring,
      componentId,
      terminal,
    ]
  );

  const positionClasses =
    position === "left"
      ? "-left-2 top-1/2 -translate-y-1/2"
      : "-right-2 top-1/2 -translate-y-1/2";

  // Highlight valid connection points during wiring
  const isValidTarget =
    isWiring && wireDraft.from && wireDraft.from.componentId !== componentId;

  return (
    <button
      className={`absolute text-xl w-4 h-4 rounded-full font-bold flex items-center justify-center transition-all duration-200 z-10 ${positionClasses} ${
        isValidTarget
          ? "text-green-600 border-green-600 hover:text-green-500 animate-bounce"
          : "text-orange-600  hover:text-orange-500"
      }`}
      onClick={handleConnectionClick}
      title={`${terminal} terminal`}
    >
      {label === "+" ? <BiSolidPlusCircle /> : <BiSolidMinusCircle />}
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
  dimensions,
}: {
  id: string;
  x: number;
  y: number;
  children: React.ReactNode;
  isSelected: boolean;
  component: any;
  dimensions: { width: number; height: number };
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const { selectComponent, deleteComponent } = useCircuitStore();

  const style = {
    transform: CSS.Translate.toString(
      transform ?? { x: 0, y: 0, scaleX: 1, scaleY: 1 }
    ),
    left: x,
    top: y,
    zIndex: isSelected ? 20 : 10,
  };

  const handleComponentClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectComponent(id);
    },
    [selectComponent, id]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteComponent(id);
    },
    [deleteComponent, id]
  );

  return (
    <div ref={setNodeRef} className="absolute group" style={style}>
      {/* Clickable area for selection */}
      <div className="cursor-pointer" onClick={handleComponentClick}>
        {children}
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
