// /page.tsx
import Sidebar from "@/components/Sidebar";
import CircuitCanvas from "@/components/CircuitCanvas";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 h-screen bg-gray-50">
        <CircuitCanvas />
      </main>
    </div>
  );
}
