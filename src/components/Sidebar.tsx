import {
  TbBolt,
  TbCircuitCapacitorPolarized,
  TbCircuitResistor,
  TbTopologyRing,
  TbAB,
} from "react-icons/tb";

// components/SidePanel.tsx
export default function Sidebar() {
  return (
    <aside className="w-64 h-full fixed left-0 border-r px-4 py-6 space-y-8">
      <section>
        <h2 className="text-xl font-bold mb-3">Circuit Elements</h2>
        <div className="gap-y-2">
          <button className="w-full flex items-center gap-2 py-2 ">
            <TbBolt className="bg-gray-200 p-2 text-3xl" /> Voltage Source
          </button>
          <button className="w-full flex items-center gap-2 py-2 ">
            <TbCircuitResistor className="bg-gray-200 p-2 text-3xl" /> Resistor
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3">Circuit Configuration</h2>
        <div className="gap-y-2">
          <button className="w-full flex items-center gap-2 py-2 ">
            <TbCircuitCapacitorPolarized className="bg-gray-200 p-2 text-3xl" />{" "}
            Series
          </button>
          <button className="w-full flex items-center gap-2 py-2 ">
            <TbTopologyRing className="bg-gray-200 p-2 text-3xl" /> Parallel
          </button>
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
