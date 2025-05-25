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

type ComponentProperties = {
  voltage?: number;
  resistance?: number;
};

type CircuitStore = {
  components: CircuitComponent[];
  wires: Wire[];
  selectedComponent: string | null;
  selectedWire: string | null;
  isWiring: boolean;
  wireDraft: {
    from: ConnectionPoint | null;
    mouseX: number;
    mouseY: number;
  };

  // Component dimensions for consistent positioning
  componentDimensions: {
    width: number;
    height: number;
  };

  // Actions
  addComponent: (label: string) => void;
  updatePosition: (id: string, deltaX: number, deltaY: number) => void;
  selectComponent: (id: string | null) => void;
  selectWire: (id: string | null) => void;
  deleteComponent: (id: string) => void;
  updateComponentProperties: (
    id: string,
    properties: ComponentProperties
  ) => void;

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

  // Circuit validation
  validateCircuit: () => {
    isValid: boolean;
    errors: string[];
  };
};

export const useCircuitStore = create<CircuitStore>((set, get) => ({
  components: [],
  wires: [],
  selectedComponent: null,
  selectedWire: null,
  isWiring: false,
  wireDraft: {
    from: null,
    mouseX: 0,
    mouseY: 0,
  },

  // Consistent component dimensions
  componentDimensions: {
    width: 120,
    height: 50,
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
    set({ selectedComponent: id, selectedWire: null });
  },

  selectWire: (id: string | null) => {
    set({ selectedWire: id, selectedComponent: null });
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

  updateComponentProperties: (id: string, properties: ComponentProperties) => {
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
      selectedComponent: null,
      selectedWire: null,
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

    // Check if wire already exists (bidirectional check)
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
      selectedWire: state.selectedWire === wireId ? null : state.selectedWire,
    }));
  },

  getConnectionPoint: (componentId: string, terminal: string) => {
    const { components, componentDimensions } = get();
    const component = components.find((c) => c.id === componentId);

    if (!component) return null;

    const { width, height } = componentDimensions;
    const centerX = component.x + width / 2;
    const centerY = component.y + height / 2;

    // Return connection points based on terminal type
    switch (terminal) {
      case "positive":
      case "output":
        return { x: component.x + width, y: centerY };
      case "negative":
      case "input":
        return { x: component.x, y: centerY };
      default:
        return { x: centerX, y: centerY };
    }
  },

  validateCircuit: () => {
    const { components, wires } = get();
    const errors: string[] = [];

    // Check if we have components
    if (components.length === 0) {
      errors.push("No components in circuit");
    }

    // Check if we have at least one voltage source
    const voltageSources = components.filter(
      (c) => c.type === "voltage-source"
    );
    if (voltageSources.length === 0) {
      errors.push("Circuit requires at least one voltage source");
    }

    // Check if we have wires
    if (wires.length === 0) {
      errors.push("No connections in circuit");
    }

    // Check for isolated components (components with no connections)
    const connectedComponents = new Set<string>();
    wires.forEach((wire) => {
      connectedComponents.add(wire.from.componentId);
      connectedComponents.add(wire.to.componentId);
    });

    const isolatedComponents = components.filter(
      (c) => !connectedComponents.has(c.id)
    );
    if (isolatedComponents.length > 0) {
      errors.push(`${isolatedComponents.length} component(s) not connected`);
    }

    // Check for invalid property values
    components.forEach((component) => {
      if (
        component.type === "voltage-source" &&
        (!component.properties.voltage || component.properties.voltage <= 0)
      ) {
        errors.push(`${component.label} has invalid voltage value`);
      }
      if (
        component.type === "resistor" &&
        (!component.properties.resistance ||
          component.properties.resistance <= 0)
      ) {
        errors.push(`${component.label} has invalid resistance value`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
}));
