"use client";
import { useEffect, useState } from "react";

const AnimatedCircuit = () => {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev: number) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <svg width="300" height="200" viewBox="0 0 300 200" className="absolute">
        {/* Circuit paths */}
        <path
          d="M50,100 L120,100"
          stroke="#3b82f6"
          strokeWidth="3"
          className="opacity-60"
        />
        <path
          d="M180,100 L250,100"
          stroke="#3b82f6"
          strokeWidth="3"
          className="opacity-60"
        />
        <path
          d="M150,70 L150,130"
          stroke="#3b82f6"
          strokeWidth="3"
          className="opacity-60"
        />

        {/* Animated current flow */}
        <circle r="4" fill="#10b981" className="animate-pulse">
          <animateMotion dur="3s" repeatCount="indefinite">
            <path d="M50,100 L120,100 L150,100 L180,100 L250,100 L250,50 L50,50 L50,100" />
          </animateMotion>
        </circle>

        {/* Circuit components */}
        <rect x="40" y="90" width="20" height="20" fill="#ef4444" rx="2" />
        <rect x="110" y="85" width="30" height="30" fill="#8b5cf6" rx="4" />
        <rect x="170" y="85" width="30" height="30" fill="#f59e0b" rx="4" />
        <rect x="240" y="90" width="20" height="20" fill="#06b6d4" rx="2" />

        {/* Connection nodes */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={50 + i * 67}
            cy="100"
            r="6"
            fill={activeNode === i ? "#10b981" : "#374151"}
            className="transition-all duration-500"
          />
        ))}
      </svg>
    </div>
  );
};

export default AnimatedCircuit;
