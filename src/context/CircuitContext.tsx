// /context/CircuitContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type CircuitComponent = {
  id: string;
  x: number;
  y: number;
  label: string;
};

type CircuitContextType = {
  components: CircuitComponent[];
  addComponent: (label: string) => void;
  updatePosition: (id: string, deltaX: number, deltaY: number) => void;
};

const CircuitContext = createContext<CircuitContextType | null>(null);

export function useCircuit() {
  const ctx = useContext(CircuitContext);
  if (!ctx) throw new Error("useCircuit must be used within provider");
  return ctx;
}

export function CircuitProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<CircuitComponent[]>([]);

  const addComponent = (label: string) => {
    const id = `${label.toLowerCase()}-${Date.now()}`;
    const newComponent = {
      id,
      x: 100,
      y: 100,
      label,
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  const updatePosition = (id: string, dx: number, dy: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x: c.x + dx, y: c.y + dy } : c))
    );
  };

  return (
    <CircuitContext.Provider
      value={{ components, addComponent, updatePosition }}
    >
      {children}
    </CircuitContext.Provider>
  );
}
