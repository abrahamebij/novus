"use client";
import { ReactNode, useState } from "react";
import { useCircuitStore } from "@/store/circuitStore";
import {
  TbBolt,
  TbCircuitCapacitorPolarized,
  TbCircuitResistor,
  TbTopologyRing,
  TbTrash,
  TbWifi,
} from "react-icons/tb";

export default function Sidebar() {
  const { 
    selectedComponent, 
    components, 
    wires,
    isWiring,
    updateComponentProperties,
    cancelWiring,
    deleteWire
  } = useCircuitStore();
  
  const selectedComp = components.find((c) => c.id === selectedComponent);

  return (
    <aside className="w-64 h-full fixed left-0 border-r px-4 py-6 space-y-6 bg-white overflow-y-auto">
      <section>
        <h2 className="text-xl font-bold mb-3">Circuit Elements</h2>
        <div className="space-y-2">
          <Btn name="Voltage Source" icon={<TbBolt />} />
          <Btn name="Resistor" icon={<TbCircuitResistor />} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Circuit Configuration</h2>
        <div className="space-y-2">
          <CircuitTypeBtn
            name="Series"
            icon={<TbCircuitCapacitorPolarized />}
          />
          <CircuitTypeBtn name="Parallel" icon={<TbTopologyRing />} />
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
              Click on yellow connection points to create wires
            </div>
          )}
          
          {wires.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold mb-2">Connections ({wires.length})</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {wires.map((wire) => {
                  const fromComp = components.find(c => c.id === wire.from.componentId);
                  const toComp = components.find(c => c.id === wire.to.componentId);
                  
                  return (
                    <div
                      key={wire.id}
                      className="flex items-center justify-between bg-blue-50 p-2 rounded text-xs"
                    >
                      <div className="flex-1 truncate">
                        <div className="font-medium">
                          {fromComp?.label.split(' ')[0]} → {toComp?.label.split(' ')[0]}
                        </div>
                        <div className="text-gray-500">
                          {wire.from.terminal} to {wire.to.terminal}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteWire(wire.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
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
                  className="w-full px-2 py-1 text-sm border rounded"
                  step="0.1"
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
                  className="w-full px-2 py-1 text-sm border rounded"
                  step="1"
                />
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-3">Simulation</h2>
        <div className="space-y-2">
          <button 
            className="w-full flex items-center gap-2 justify-center py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            disabled={components.length === 0 || wires.length === 0}
          >
            Run Simulation
          </button>
          {(components.length === 0 || wires.length === 0) && (
            <p className="text-xs text-gray-500 text-center">
              Add components and wires to run simulation
            </p>
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
      className="w-full flex items-center gap-2 py-2 px-2 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <div className="bg-gray-200 p-2 text-xl rounded">{icon}</div>
      <p className="text-left">{name}</p>
    </button>
  );
}

function CircuitTypeBtn({ name, icon }: BtnType) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      onClick={() => setIsActive(!isActive)}
      className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg transition-colors ${
        isActive ? "bg-blue-100 border-blue-300 border" : "hover:bg-gray-200"
      }`}
    >
      <div
        className={`p-2 text-xl rounded ${
          isActive ? "bg-blue-200" : "bg-gray-200"
        }`}
      >
        {icon}
      </div>
      <p className="text-left">{name}</p>
    </button>
  );
}