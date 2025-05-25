import Link from "next/link";
import { BsTwitterX } from "react-icons/bs";
import { DiGithub } from "react-icons/di";
import { FiZap } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FiZap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Novus</span>
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <Link
            href="//github.com/abrahamebij"
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            <DiGithub />
          </Link>
          <Link
            href="//x.com/abrahamebij"
            className="text-gray-400 hover:text-white text-xl transition-colors"
          >
            <BsTwitterX />
          </Link>
        </div>

        <p className="text-gray-400">
          © 2024 Novus. Empowering the next generation of circuit designers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
