import { useCircuitStore } from "@/store/circuitStore";
import { useMemo } from "react";

export function useCircuitValidation() {
  const { components, wires } = useCircuitStore();

  return useMemo(() => {
    const errors: string[] = [];

    if (components.length === 0) {
      errors.push("No components in circuit");
    }

    const voltageSources = components.filter(
      (c) => c.type === "voltage-source"
    );
    if (voltageSources.length === 0) {
      errors.push("Circuit requires at least one voltage source");
    }

    if (wires.length === 0) {
      errors.push("No connections in circuit");
    }

    // Check for isolated components
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

    // Validate component properties
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
  }, [components, wires]);
}
