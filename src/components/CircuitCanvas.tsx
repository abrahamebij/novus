"use client";

import { useCircuitStore } from "@/store/circuitStore";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { useRef, useCallback } from "react";
import { WireOverlay } from "./canvas/WireOverlay";
import { DraggableComponent } from "./canvas/DraggableComponent";
import { CircuitValidationPanel } from "./canvas/CircuitValidationPanel";
import { WiringInstructions } from "./canvas/WiringInstructions";

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

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-screen bg-gray-50 overflow-hidden ${
        isWiring ? "cursor-crosshair" : ""
      }`}
      onClick={handleCanvasClick}
      onMouseMove={handleMouseMove}
    >
      {/* Wire Overlay */}
      <WireOverlay
        wires={wires}
        selectedWire={selectedWire}
        isWiring={isWiring}
        wireDraft={wireDraft}
        getConnectionPoint={getConnectionPoint}
        selectWire={selectWire}
        deleteWire={deleteWire}
      />

      {/* Components */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {components.map((comp) => (
          <DraggableComponent
            key={comp.id}
            component={comp}
            isSelected={selectedComponent === comp.id}
            dimensions={componentDimensions}
          />
        ))}
      </DndContext>

      {/* Circuit Validation Panel */}
      <CircuitValidationPanel validation={circuitValidation} />

      {/* Wiring Instructions */}
      <WiringInstructions isWiring={isWiring} selectedWire={selectedWire} />
    </div>
  );
}
