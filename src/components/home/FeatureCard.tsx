import { ReactNode } from "react";

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  delay: string;
}) => (
  <div
    className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:rotate-1"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
  </div>
);

export default FeatureCard;
