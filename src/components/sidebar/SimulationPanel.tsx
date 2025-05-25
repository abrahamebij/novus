"use client";
import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { BiInfoCircle } from "react-icons/bi";
import { TbAlertTriangle } from "react-icons/tb";
import { useCircuitValidation } from "@/hooks/useCircuitValidation";
import { useCircuitSimulation } from "@/hooks/useCircuitSimulation";
import { SimulationResults } from "@/types/circuit";

export default function SimulationPanel() {
  const [simulationResults, setSimulationResults] =
    useState<SimulationResults | null>(null);
  const circuitValidation = useCircuitValidation();
  const { analyzeCircuit } = useCircuitSimulation();

  const runSimulation = () => {
    if (!circuitValidation.isValid) {
      setSimulationResults(null);
      return;
    }

    const results = analyzeCircuit();
    setSimulationResults(results);
  };

  return (
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
              <div>Total Resistance: {simulationResults.totalResistance}Ω</div>
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
  );
}
