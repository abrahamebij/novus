import Link from "next/link";
import React from "react";
import { BsArrowRight } from "react-icons/bs";

const CTASection = () => {
  return (
    <section className="relative z-10 py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
          Ready to Start Building?
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of students, educators, and engineers who trust Novus
          for their circuit simulation needs.
        </p>

        <Link
          href={"/circuit"}
          className="group bg-gradient-to-r from-green-500 to-blue-600 text-white px-16 py-6 rounded-full text-xl font-bold hover:from-green-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-green-500/25 flex items-center space-x-3 mx-auto"
        >
          <span>Launch Novus Now</span>
          <BsArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
