"use client";

import { createContext, useContext, useState } from "react";

type CircuitComponent = {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "voltage-source" | "resistor";
  properties: {
    voltage?: number;
    resistance?: number;
  };
};

type CircuitContextType = {
  components: CircuitComponent[];
  selectedComponent: string | null;
  addComponent: (label: string) => void;
  updatePosition: (id: string, deltaX: number, deltaY: number) => void;
  selectComponent: (id: string | null) => void;
  deleteComponent: (id: string) => void;
  updateComponentProperties: (id: string, properties: any) => void;
};

const CircuitContext = createContext<CircuitContextType | null>(null);

export function useCircuit() {
  const ctx = useContext(CircuitContext);
  if (!ctx) throw new Error("useCircuit must be used within provider");
  return ctx;
}

export function CircuitProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const addComponent = (label: string) => {
    const id = `${label.toLowerCase().replace(" ", "-")}-${Date.now()}`;
    const type = label === "Voltage Source" ? "voltage-source" : "resistor";

    // Spawn components in a staggered pattern
    const baseX = 150 + (components.length % 3) * 150;
    const baseY = 150 + Math.floor(components.length / 3) * 100;

    const newComponent: CircuitComponent = {
      id,
      x: baseX,
      y: baseY,
      label,
      type,
      properties:
        type === "voltage-source" ? { voltage: 5 } : { resistance: 100 },
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  const updatePosition = (id: string, dx: number, dy: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x: c.x + dx, y: c.y + dy } : c))
    );
  };

  const selectComponent = (id: string | null) => {
    setSelectedComponent(id);
  };

  const deleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  };

  const updateComponentProperties = (id: string, properties: any) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, properties: { ...c.properties, ...properties } }
          : c
      )
    );
  };

  return (
    <CircuitContext.Provider
      value={{
        components,
        selectedComponent,
        addComponent,
        updatePosition,
        selectComponent,
        deleteComponent,
        updateComponentProperties,
      }}
    >
      {children}
    </CircuitContext.Provider>
  );
}
