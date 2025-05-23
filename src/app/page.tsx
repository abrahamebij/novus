"use client";
import Sidebar from "@/components/Sidebar";
import calculateParallel from "@/utils/calculateParallel";
import calculateSeries from "@/utils/calculateSeries";
import { useState, useMemo } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function CircuitBuilder() {
  const [circuitType, setCircuitType] = useState<"series" | "parallel">(
    "series"
  );
  const [resistors, setResistors] = useState<number[]>([10]);
  const [voltage, setVoltage] = useState<string>("");

  const addResistor = () => setResistors([...resistors, 0]);
  const removeResistor = (i: number) => {
    if (resistors.length === 1) return;
    setResistors(resistors.filter((_, idx) => idx !== i));
  };
  const updateResistor = (i: number, val: string) => {
    const newVals = [...resistors];
    newVals[i] = Number(val) || 0;
    setResistors(newVals);
  };

  const voltageNum = Number(voltage);
  const results = useMemo(() => {
    if (!voltageNum || resistors.some((r) => r <= 0)) return null;
    if (circuitType === "series") {
      return calculateSeries(resistors, voltageNum);
    } else {
      return calculateParallel(resistors, voltageNum);
    }
  }, [circuitType, resistors, voltageNum]);

  return (
    <main className="flex justify-between ml-64">
      <Sidebar />
      <div>Main Content</div>
      <div>Circuit Diagram</div>
    </main>
  );
}
