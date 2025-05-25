"use client";

interface WiringInstructionsProps {
  isWiring: boolean;
  selectedWire: string | null;
}

export function WiringInstructions({
  isWiring,
  selectedWire,
}: WiringInstructionsProps) {
  return (
    <>
      {/* Wiring instructions */}
      {isWiring && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Click on a connection point to complete the wire, or click anywhere
          else to cancel
        </div>
      )}

      {/* Wire selection feedback */}
      {selectedWire && (
        <div className="absolute top-20 right-4 bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg z-50">
          Wire selected - click the × to delete, or click elsewhere to deselect
        </div>
      )}
    </>
  );
}
