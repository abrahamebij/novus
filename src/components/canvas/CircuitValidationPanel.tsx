"use client";

import { TbAlertTriangle } from "react-icons/tb";

interface CircuitValidationPanelProps {
  validation: {
    isValid: boolean;
    errors: string[];
  };
}

export function CircuitValidationPanel({
  validation,
}: CircuitValidationPanelProps) {
  if (validation.isValid) return null;

  return (
    <div className="absolute top-4 right-4 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <TbAlertTriangle size={16} className="text-red-600" />
        <span className="font-medium">Circuit Issues</span>
      </div>
      <div className="text-sm space-y-1">
        {validation.errors.map((error, index) => (
          <div key={index} className="flex items-start gap-1">
            <span className="text-red-500">•</span>
            <span>{error}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
