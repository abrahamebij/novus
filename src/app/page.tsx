"use client";
import { useState, useMemo } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

function calculateSeries(resistors: number[], voltage: number) {
  const totalResistance = resistors.reduce((a, b) => a + b, 0);
  const current = voltage / totalResistance || 0;
  const voltageDrops = resistors.map((r) => current * r);
  return { totalResistance, current, voltageDrops };
}

function calculateParallel(resistors: number[], voltage: number) {
  const totalResistance =
    1 / resistors.reduce((acc, r) => acc + (r === 0 ? 0 : 1 / r), 0) || 0;
  const current = voltage / totalResistance || 0;
  const currents = resistors.map((r) => voltage / r);
  return { totalResistance, current, currents };
}

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-8">
      <h1 className="text-3xl font-extrabold text-center text-orange-600 drop-shadow-md">
        Novus Circuit Builder
      </h1>

      {/* Circuit Type Selector */}
      <div className="flex justify-center space-x-6">
        {["series", "parallel"].map((type) => (
          <button
            key={type}
            onClick={() => setCircuitType(type as "series" | "parallel")}
            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${
              circuitType === type
                ? "bg-orange-500 text-white shadow-lg shadow-orange-300"
                : "bg-gray-200 text-gray-700 hover:bg-orange-100"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Resistors List */}
      <div className="space-y-3">
        <label className="block font-semibold text-gray-800">
          Resistors (Ω):
        </label>
        {resistors.map((r, i) => (
          <div
            key={i}
            className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 shadow-sm"
          >
            <input
              type="number"
              min={0}
              value={r}
              onChange={(e) => updateResistor(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              aria-label={`Resistor ${i + 1} value`}
            />
            <button
              onClick={() => removeResistor(i)}
              className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
              title="Remove resistor"
              aria-label={`Remove resistor ${i + 1}`}
            >
              <FiMinus size={22} />
            </button>
          </div>
        ))}

        <button
          onClick={addResistor}
          className="inline-flex items-center space-x-2 text-orange-600 font-semibold hover:text-orange-800 transition-colors duration-200"
          aria-label="Add resistor"
        >
          <FiPlus size={20} />
          <span>Add Resistor</span>
        </button>
      </div>

      {/* Voltage Input */}
      <div>
        <label className="block font-semibold text-gray-800 mb-2">
          Total Voltage (V):
        </label>
        <input
          type="number"
          min={0}
          value={voltage}
          onChange={(e) => setVoltage(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter total voltage"
          aria-label="Total voltage input"
        />
      </div>

      {/* Results */}
      {results && (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-300 mt-6 space-y-3">
          <h2 className="text-xl font-bold text-orange-700">Results:</h2>
          <p>
            <strong>Total Resistance:</strong>{" "}
            {results.totalResistance.toFixed(2)} Ω
          </p>
          <p>
            <strong>Total Current:</strong> {results.current.toFixed(2)} A
          </p>

          {circuitType === "series" && "voltageDrops" in results && (
            <>
              <p className="font-semibold">Voltage drop per resistor:</p>
              <ul className="list-disc list-inside">
                {results.voltageDrops.map((v, i) => (
                  <li key={i}>
                    Resistor {i + 1}: {v.toFixed(2)} V
                  </li>
                ))}
              </ul>
            </>
          )}

          {circuitType === "parallel" && "currents" in results && (
            <>
              <p className="font-semibold">Current through each resistor:</p>
              <ul className="list-disc list-inside">
                {results.currents.map((c, i) => (
                  <li key={i}>
                    Resistor {i + 1}: {c.toFixed(2)} A
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
