/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

type ConnectionPoint = {
  componentId: string;
  terminal: "positive" | "negative" | "input" | "output";
};

type Wire = {
  id: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
};

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

type CircuitStore = {
  components: CircuitComponent[];
  wires: Wire[];
  selectedComponent: string | null;
  isWiring: boolean;
  wireDraft: {
    from: ConnectionPoint | null;
    mouseX: number;
    mouseY: number;
  };

  // Actions
  addComponent: (label: string) => void;
  updatePosition: (id: string, deltaX: number, deltaY: number) => void;
  selectComponent: (id: string | null) => void;
  deleteComponent: (id: string) => void;
  updateComponentProperties: (id: string, properties: any) => void;

  // Wiring actions
  startWiring: (from: ConnectionPoint) => void;
  updateWireDraft: (mouseX: number, mouseY: number) => void;
  completeWiring: (to: ConnectionPoint) => void;
  cancelWiring: () => void;
  deleteWire: (wireId: string) => void;
  getConnectionPoint: (
    componentId: string,
    terminal: string
  ) => { x: number; y: number } | null;
};

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  components: [],
  wires: [],
  selectedComponent: null,
  isWiring: false,
  wireDraft: {
    from: null,
    mouseX: 0,
    mouseY: 0,
  },

  addComponent: (label: string) => {
    const { components } = get();
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

    set((state) => ({
      components: [...state.components, newComponent],
    }));
  },

  updatePosition: (id: string, deltaX: number, deltaY: number) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, x: c.x + deltaX, y: c.y + deltaY } : c
      ),
    }));
  },

  selectComponent: (id: string | null) => {
    set({ selectedComponent: id });
  },

  deleteComponent: (id: string) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      wires: state.wires.filter(
        (w) => w.from.componentId !== id && w.to.componentId !== id
      ),
      selectedComponent:
        state.selectedComponent === id ? null : state.selectedComponent,
    }));
  },

  updateComponentProperties: (id: string, properties: any) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id
          ? { ...c, properties: { ...c.properties, ...properties } }
          : c
      ),
    }));
  },

  // Wiring methods
  startWiring: (from: ConnectionPoint) => {
    set({
      isWiring: true,
      wireDraft: { from, mouseX: 0, mouseY: 0 },
    });
  },

  updateWireDraft: (mouseX: number, mouseY: number) => {
    set((state) => ({
      wireDraft: { ...state.wireDraft, mouseX, mouseY },
    }));
  },

  completeWiring: (to: ConnectionPoint) => {
    const { wireDraft, wires } = get();

    if (!wireDraft.from) return;

    // Prevent connecting to same component
    if (wireDraft.from.componentId === to.componentId) {
      set({ isWiring: false, wireDraft: { from: null, mouseX: 0, mouseY: 0 } });
      return;
    }

    // Check if wire already exists
    const wireExists = wires.some(
      (w) =>
        (w.from.componentId === wireDraft.from!.componentId &&
          w.from.terminal === wireDraft.from!.terminal &&
          w.to.componentId === to.componentId &&
          w.to.terminal === to.terminal) ||
        (w.from.componentId === to.componentId &&
          w.from.terminal === to.terminal &&
          w.to.componentId === wireDraft.from!.componentId &&
          w.to.terminal === wireDraft.from!.terminal)
    );

    if (wireExists) {
      set({ isWiring: false, wireDraft: { from: null, mouseX: 0, mouseY: 0 } });
      return;
    }

    const newWire: Wire = {
      id: `wire-${Date.now()}`,
      from: wireDraft.from,
      to,
    };

    set((state) => ({
      wires: [...state.wires, newWire],
      isWiring: false,
      wireDraft: { from: null, mouseX: 0, mouseY: 0 },
    }));
  },

  cancelWiring: () => {
    set({
      isWiring: false,
      wireDraft: { from: null, mouseX: 0, mouseY: 0 },
    });
  },

  deleteWire: (wireId: string) => {
    set((state) => ({
      wires: state.wires.filter((w) => w.id !== wireId),
    }));
  },

  getConnectionPoint: (componentId: string, terminal: string) => {
    const { components } = get();
    const component = components.find((c) => c.id === componentId);

    if (!component) return null;

    // Component dimensions (should match your component styling)
    const componentWidth = 120; // Approximate width of component
    const componentHeight = 50; // Approximate height of component

    const centerX = component.x + componentWidth / 2;
    const centerY = component.y + componentHeight / 2;

    // Return connection points based on terminal type
    switch (terminal) {
      case "positive":
      case "output":
        return { x: component.x + componentWidth, y: centerY };
      case "negative":
      case "input":
        return { x: component.x, y: centerY };
      default:
        return { x: centerX, y: centerY };
    }
  },
}));
