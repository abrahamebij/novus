import { FiZap } from "react-icons/fi";
import FeatureCard from "./FeatureCard";
import { FaBookOpen, FaUsers } from "react-icons/fa";

const Features = () => {
  return (
    <section id="features" className="relative z-10 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Novus
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the perfect blend of simplicity and power in circuit
            simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FiZap />}
            title="Intuitive Design"
            description="Drag, drop, and connect components with ease. No complex menus or confusing interfaces."
            delay={"0"}
          />
          <FeatureCard
            icon={<FaUsers />}
            title="Real-time Collaboration"
            description="Work together on circuit designs with live synchronization and shared workspaces."
            delay={"200"}
          />
          <FeatureCard
            icon={<FaBookOpen />}
            title="Educational Focus"
            description="Perfect for students and educators with built-in tutorials and step-by-step guides."
            delay={"400"}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
