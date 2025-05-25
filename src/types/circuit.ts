export interface ConnectionPoint {
  componentId: string;
  terminal: "positive" | "negative" | "input" | "output";
}

export interface Wire {
  id: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
}

export interface CircuitComponent {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "voltage-source" | "resistor";
  properties: {
    voltage?: number;
    resistance?: number;
  };
}

export interface SimulationResults {
  voltage: number;
  current: string;
  totalResistance: number;
  power: string;
  circuitType: string;
}
