import ComponentPalette from "./sidebar/ComponentPalette";
import PropertiesPanel from "./sidebar/PropertiesPanel";
import SimulationPanel from "./sidebar/SimulationPanel";

export default function Sidebar() {
  return (
    <aside className="w-72 h-full fixed left-0 border-r px-4 py-6 space-y-6 bg-white overflow-y-auto">
      <ComponentPalette />
      <PropertiesPanel />
      <SimulationPanel />
    </aside>
  );
}
