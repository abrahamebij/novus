/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useMemo } from "react";

interface WireOverlayProps {
  wires: any[];
  selectedWire: string | null;
  isWiring: boolean;
  wireDraft: any;
  getConnectionPoint: (componentId: string, terminal: string) => any;
  selectWire: (wireId: string | null) => void;
  deleteWire: (wireId: string) => void;
}

export function WireOverlay({
  wires,
  selectedWire,
  isWiring,
  wireDraft,
  getConnectionPoint,
  selectWire,
  deleteWire,
}: WireOverlayProps) {
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
  );
}
