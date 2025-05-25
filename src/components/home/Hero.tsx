"use client";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { RxPlay } from "react-icons/rx";
import AnimatedCircuit from "./AnimatedCircuit";
import Link from "next/link";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div
        className={`transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Hero Animation */}
        <div className="mb-8">
          <AnimatedCircuit />
        </div>

        <h1 className="text-5xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
          Design. Simulate.
          <br />
          <span className="text-white">Innovate.</span>
        </h1>

        <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed">
          The most intuitive circuit simulator for students, educators, and
          engineers. Build complex circuits with drag-and-drop simplicity and
          real-time analysis.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href={"/circuit"}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-2"
          >
            <span>Start Building Circuits</span>
            <BsArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="group border-2 border-white/20 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
            <RxPlay className="w-5 h-5" />
            <span>Watch Demo</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          <div className="group">
            <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
              50K+
            </div>
            <div className="text-gray-400">Circuits Built</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
              10K+
            </div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold text-pink-400 mb-2 group-hover:scale-110 transition-transform">
              99%
            </div>
            <div className="text-gray-400">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
