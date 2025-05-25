import { useCircuitStore } from "@/store/circuitStore";
import { useCallback } from "react";
import { SimulationResults } from "@/types/circuit";

export function useCircuitSimulation() {
  const { components, wires } = useCircuitStore();

  const analyzeCircuit = useCallback((): SimulationResults | null => {
    const voltageSource = components.find((c) => c.type === "voltage-source");
    const resistors = components.filter((c) => c.type === "resistor");

    if (!voltageSource || resistors.length === 0) {
      return null;
    }

    // Build adjacency graph
    const graph: { [key: string]: string[] } = {};
    components.forEach((comp) => {
      graph[comp.id] = [];
    });

    wires.forEach((wire) => {
      graph[wire.from.componentId].push(wire.to.componentId);
      graph[wire.to.componentId].push(wire.from.componentId);
    });

    // Detect circuit topology
    const isSeriesCircuit = () => {
      const componentConnections = components.map((comp) => ({
        id: comp.id,
        connections: graph[comp.id].length,
      }));
      return componentConnections.every((comp) => comp.connections === 2);
    };

    const calculateTotalResistance = () => {
      if (isSeriesCircuit()) {
        return resistors.reduce(
          (sum, r) => sum + (r.properties.resistance || 0),
          0
        );
      } else {
        // Parallel calculation
        const resistances = resistors.map((r) => r.properties.resistance || 0);
        if (resistances.length === 0) return 0;
        if (resistances.length === 1) return resistances[0];

        const reciprocalSum = resistances.reduce((sum, r) => sum + 1 / r, 0);
        return 1 / reciprocalSum;
      }
    };

    const voltage = voltageSource.properties.voltage || 0;
    const totalResistance = calculateTotalResistance();
    const circuitType = isSeriesCircuit() ? "Series" : "Parallel/Complex";
    const current = totalResistance > 0 ? voltage / totalResistance : 0;
    const power = voltage * current;

    return {
      voltage,
      current: current.toFixed(4),
      totalResistance: Number(totalResistance.toFixed(2)),
      power: power.toFixed(4),
      circuitType,
    };
  }, [components, wires]);

  return { analyzeCircuit };
}
