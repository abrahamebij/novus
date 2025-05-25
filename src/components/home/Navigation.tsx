import Link from "next/link";
import React from "react";
import { FiZap } from "react-icons/fi";

const Navigation = () => {
  return (
    <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <FiZap className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">Novus</span>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <a
          href="#features"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Features
        </a>
        <a
          href="#about"
          className="text-gray-300 hover:text-white transition-colors"
        >
          About
        </a>
        <Link
          href={"/circuit"}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
        >
          Launch App
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
