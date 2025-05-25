"use client";
import { ReactNode, useState, useCallback } from "react";
import { useCircuitStore } from "@/store/circuitStore";
import {
  TbBolt,
  TbCircuitResistor,
  TbTrash,
  TbAlertTriangle,
} from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";

export default function Sidebar() {
  const {
    selectedComponent,
    selectedWire,
    components,
    wires,
    isWiring,
    updateComponentProperties,
    cancelWiring,
    deleteWire,
    validateCircuit,
  } = useCircuitStore();

  type SimulationResults = {
    voltage: number;
    current: string;
    totalResistance: number;
    power: string;
    circuitType: string;
    nodeAnalysis?: {
      [key: string]: {
        voltage: number;
        current: number;
      };
    };
  };

  const [simulationResults, setSimulationResults] =
    useState<SimulationResults | null>(null);

  const selectedComp = components.find((c) => c.id === selectedComponent);
  const selectedWireObj = wires.find((w) => w.id === selectedWire);
  const circuitValidation = validateCircuit();

  // Enhanced circuit analysis with proper circuit topology detection
  const analyzeCircuit = useCallback(() => {
    const voltageSource = components.find((c) => c.type === "voltage-source");
    const resistors = components.filter((c) => c.type === "resistor");

    if (!voltageSource || resistors.length === 0) {
      return null;
    }

    // Build adjacency graph from wires
    const graph: { [key: string]: string[] } = {};
    components.forEach((comp) => {
      graph[comp.id] = [];
    });

    wires.forEach((wire) => {
      graph[wire.from.componentId].push(wire.to.componentId);
      graph[wire.to.componentId].push(wire.from.componentId);
    });

    // Simple circuit topology detection
    const isSeriesCircuit = () => {
      // In a series circuit, each component (except voltage source) should have exactly 2 connections
      const componentConnections = components.map((comp) => ({
        id: comp.id,
        connections: graph[comp.id].length,
      }));

      // Voltage source should have 2 connections, resistors should have 2 connections
      return componentConnections.every((comp) => comp.connections === 2);
    };

    const calculateSeriesResistance = () => {
      return resistors.reduce(
        (sum, r) => sum + (r.properties.resistance || 0),
        0
      );
    };

    const calculateParallelResistance = () => {
      const resistances = resistors.map((r) => r.properties.resistance || 0);
      if (resistances.length === 0) return 0;
      if (resistances.length === 1) return resistances[0];

      // 1/Rtotal = 1/R1 + 1/R2 + ... + 1/Rn
      const reciprocalSum = resistances.reduce((sum, r) => sum + 1 / r, 0);
      return 1 / reciprocalSum;
    };

    const voltage = voltageSource.properties.voltage || 0;
    let totalResistance: number;
    let circuitType: string;

    if (isSeriesCircuit()) {
      totalResistance = calculateSeriesResistance();
      circuitType = "Series";
    } else {
      // For complex circuits, we'll use a simplified parallel calculation
      // In a real implementation, you'd use nodal analysis
      totalResistance = calculateParallelResistance();
      circuitType = "Parallel/Complex";
    }

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

  // Enhanced simulation with better circuit analysis
  const runSimulation = useCallback(() => {
    if (!circuitValidation.isValid) {
      setSimulationResults(null);
      return;
    }

    const results = analyzeCircuit();
    if (results) {
      setSimulationResults(results);
    } else {
      setSimulationResults(null);
    }
  }, [circuitValidation.isValid, analyzeCircuit]);

  return (
    <aside className="w-72 h-full fixed left-0 border-r px-4 py-6 space-y-6 bg-white overflow-y-auto">
      <section>
        <h2 className="text-xl font-bold mb-3">Circuit Elements</h2>
        <div className="space-y-2 flex items-start">
          <Btn name="Voltage Source" icon={<TbBolt />} />
          <Btn name="Resistor" icon={<TbCircuitResistor />} />
        </div>
      </section>

      {/* Wiring Section */}
      <section>
        <h2 className="text-xl font-bold mb-3">Wiring</h2>
        <div className="space-y-2">
          {isWiring ? (
            <button
              onClick={cancelWiring}
              className="w-full flex items-center gap-2 justify-center py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Cancel Wiring
            </button>
          ) : (
            <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
              Click on orange connection points to create wires
            </div>
          )}

          {wires.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold mb-2">
                Connections ({wires.length})
              </h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {wires.map((wire) => {
                  const fromComp = components.find(
                    (c) => c.id === wire.from.componentId
                  );
                  const toComp = components.find(
                    (c) => c.id === wire.to.componentId
                  );
                  const isSelected = selectedWire === wire.id;

                  return (
                    <div
                      key={wire.id}
                      className={`flex items-center justify-between p-2 rounded text-xs transition-colors ${
                        isSelected
                          ? "bg-red-100 border border-red-300"
                          : "bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex-1 truncate">
                        <div className="font-medium">
                          {fromComp?.label.split(" ")[0]} →{" "}
                          {toComp?.label.split(" ")[0]}
                        </div>
                        <div className="text-gray-500">
                          {wire.from.terminal} to {wire.to.terminal}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteWire(wire.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Delete wire"
                      >
                        <TbTrash size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Properties Section */}
      {selectedComp && (
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
      )}

      {/* Wire Properties Section */}
      {selectedWireObj && (
        <section>
          <h2 className="text-xl font-bold mb-3">Wire Properties</h2>
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1 text-red-800">
                Selected Wire
              </label>
            </div>
            <div className="text-sm text-red-700">
              <div>
                From:{" "}
                {
                  components.find(
                    (c) => c.id === selectedWireObj.from.componentId
                  )?.label
                }
              </div>
              <div>Terminal: {selectedWireObj.from.terminal}</div>
              <div>
                To:{" "}
                {
                  components.find(
                    (c) => c.id === selectedWireObj.to.componentId
                  )?.label
                }
              </div>
              <div>Terminal: {selectedWireObj.to.terminal}</div>
            </div>
            <button
              onClick={() => deleteWire(selectedWireObj.id)}
              className="mt-2 w-full bg-red-600 text-white py-1 px-2 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete Wire
            </button>
          </div>
        </section>
      )}

      {/* Simulation Section */}
      <section>
        <div className="flex items-center gap-x-2 mb-3">
          <h2 className="text-xl font-bold">Simulation</h2>
          <div className="relative group">
            <BiInfoCircle className="text-md cursor-help" />
            <div className="absolute bottom-6 -left-4 w-44 rounded-lg bg-gray-800 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Circuit analysis using Ohm&apos;s law and basic circuit topology
              detection
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={runSimulation}
            className={`w-full flex items-center gap-2 justify-center py-2 font-semibold rounded-lg transition-colors ${
              circuitValidation.isValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!circuitValidation.isValid}
            title={
              circuitValidation.isValid
                ? "Run circuit simulation"
                : "Fix circuit issues first"
            }
          >
            <FaPlay size={16} />
            Run Simulation
          </button>

          {simulationResults && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Results:</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div className="font-medium text-blue-800">
                  Circuit Type: {simulationResults.circuitType}
                </div>
                <div>Source Voltage: {simulationResults.voltage}V</div>
                <div>Total Current: {simulationResults.current}A</div>
                <div>
                  Total Resistance: {simulationResults.totalResistance}Ω
                </div>
                <div>Total Power: {simulationResults.power}W</div>
              </div>
            </div>
          )}

          {!circuitValidation.isValid && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              <div className="flex items-center gap-1 mb-1">
                <TbAlertTriangle size={12} />
                <span className="font-medium">Cannot simulate:</span>
              </div>
              <div>Check the error panel on the canvas for details</div>
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}

interface BtnType {
  name: string;
  icon: ReactNode;
}

function Btn({ name, icon }: BtnType) {
  const { addComponent } = useCircuitStore();

  return (
    <button
      onClick={() => addComponent(name)}
      className="w-fit flex items-center gap-2 py-2 px-2 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <div className="bg-gray-200 p-2 text-xl rounded">{icon}</div>
    </button>
  );
}
