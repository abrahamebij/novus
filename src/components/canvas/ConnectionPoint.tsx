/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCircuitStore } from "@/store/circuitStore";
import { useCallback } from "react";
import { BiSolidMinusCircle, BiSolidPlusCircle } from "react-icons/bi";

interface ConnectionPointProps {
  componentId: string;
  terminal: string;
  position: "left" | "right";
  label: string;
}

export default function ConnectionPoint({
  componentId,
  terminal,
  position,
  label,
}: ConnectionPointProps) {
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
