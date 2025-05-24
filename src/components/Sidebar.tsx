// /components/Sidebar.tsx
"use client";
import { ReactNode } from "react";
import { useCircuit } from "@/context/CircuitContext";
import {
  TbBolt,
  TbCircuitCapacitorPolarized,
  TbCircuitResistor,
  TbTopologyRing,
} from "react-icons/tb";

// components/SidePanel.tsx
export default function Sidebar() {
  return (
    <aside className="w-64 h-full fixed left-0 border-r px-4 py-6 space-y-8">
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

      <section>
        <h2 className="text-xl font-bold mb-3">Simulation</h2>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 justify-center py-2 bg-primary text-white font-semibold rounded-lg">
            Run Simulation
          </button>
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
  const { addComponent } = useCircuit();

  return (
    <button
      onClick={() => addComponent(name)}
      className="w-full flex items-center gap-2 py-2 hover:bg-gray-200 rounded-lg"
    >
      <div className="bg-gray-200 p-2 text-xl">{icon}</div>
      <p>{name}</p>
    </button>
  );
}

function CircuitTypeBtn({ name, icon }: BtnType) {
  return (
    <button className="w-full flex items-center gap-2 py-2 hover:bg-gray-200 rounded-lg">
      <div className="bg-gray-200 p-2 text-xl">{icon}</div>
      <p>{name}</p>
    </button>
  );
}
