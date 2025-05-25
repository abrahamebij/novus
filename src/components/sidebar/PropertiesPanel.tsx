"use client";
import { useCircuitStore } from "@/store/circuitStore";

export default function PropertiesPanel() {
  const { selectedComponent, components, updateComponentProperties } =
    useCircuitStore();

  const selectedComp = components.find((c) => c.id === selectedComponent);

  if (!selectedComp) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-3">Properties</h2>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">
            Component: {selectedComp.label}
          </label>
        </div>

        {selectedComp.type === "voltage-source" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Voltage (V)
            </label>
            <input
              type="number"
              value={selectedComp.properties.voltage || 0}
              onChange={(e) =>
                updateComponentProperties(selectedComp.id, {
                  voltage: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
              min="0"
            />
          </div>
        )}

        {selectedComp.type === "resistor" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Resistance (Ω)
            </label>
            <input
              type="number"
              value={selectedComp.properties.resistance || 0}
              onChange={(e) =>
                updateComponentProperties(selectedComp.id, {
                  resistance: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="1"
              min="0"
            />
          </div>
        )}
      </div>
    </section>
  );
}
