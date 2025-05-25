"use client";
import { ReactNode } from "react";
import { useCircuitStore } from "@/store/circuitStore";
import { TbBolt, TbCircuitResistor } from "react-icons/tb";

interface ComponentButtonProps {
  name: string;
  icon: ReactNode;
}

function ComponentButton({ name, icon }: ComponentButtonProps) {
  const { addComponent } = useCircuitStore();

  return (
    <button
      onClick={() => addComponent(name)}
      className="w-fit flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded-lg transition-colors"
      title={`Add ${name}`}
    >
      <div className="bg-gray-200 p-2 text-xl rounded">{icon}</div>
    </button>
  );
}

export default function ComponentPalette() {
  return (
    <section>
      <h2 className="text-xl font-bold mb-3 uppercase">Novus</h2>

      <h2 className="text-lg font-semibold mb-1">Circuit Elements</h2>
      <div className="space-y-2 flex items-start">
        <ComponentButton name="Voltage Source" icon={<TbBolt />} />
        <ComponentButton name="Resistor" icon={<TbCircuitResistor />} />
      </div>
    </section>
  );
}
