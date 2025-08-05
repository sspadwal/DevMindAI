import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const AiTools = () => {
  const navigate = useNavigate();
  const user = useUser();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Split tools into two rows of 3
  const firstRow = AiToolsData.slice(0, 3);
  const secondRow = AiToolsData.slice(3, 6);

  return (
    <div className="px-4 sm:px-20 xl:px-32 my-24">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-slate-800 text-4xl sm:text-5xl font-bold mb-4">
          Powerful{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            AI Tools
          </span>
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto text-lg">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </motion.div>

      {/* First Row - 3 Cards */}
      <motion.div
        className="flex flex-wrap justify-center mt-16 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {firstRow.map((tool, index) => (
          <ToolCard key={index} tool={tool} user={user} navigate={navigate} />
        ))}
      </motion.div>

      {/* Second Row - 3 Cards */}
      <motion.div
        className="flex flex-wrap justify-center mt-8 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {secondRow.map((tool, index) => (
          <ToolCard
            key={index + 3}
            tool={tool}
            user={user}
            navigate={navigate}
          />
        ))}
      </motion.div>
    </div>
  );
};

// Extracted Card Component for reusability
const ToolCard = ({ tool, user, navigate }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0 },
    }}
    whileHover={{
      y: -10,
      scale: 1.03,
      boxShadow: `0 20px 25px -5px ${tool.bg.from}20, 0 10px 10px -5px ${tool.bg.from}10`,
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className="relative p-8 w-full sm:w-80 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100/50 cursor-pointer overflow-hidden group "
    onClick={() => user && navigate(tool.path)}
  >
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Animated border */}
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-200/50 transition-all duration-500" />

    {/* Floating particles */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-indigo-400/30 pointer-events-none"
        style={{
          left: `${20 + i * 20}%`,
          top: `${10 + i * 15}%`,
        }}
        animate={{
          y: [0, -15, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.5,
        }}
      />
    ))}

    {/* Card content */}
    <div className="relative z-10">
      {/* Icon with gradient and shine */}
      <div className="relative mb-6">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
          }}
        >
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
          <tool.Icon className="w-8 h-8 text-white relative z-10" />
        </div>
        <div
          className="absolute inset-0 w-16 h-16 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`,
          }}
        />
      </div>

      {/* Title */}
      <motion.h3
        className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors duration-300"
        whileHover={{ x: 2 }}
      >
        {tool.title}
      </motion.h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300 mb-6">
        {tool.description}
      </p>

      {/* Animated button */}
      <motion.div
        className="flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        <span>Get Started</span>
        <motion.svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </motion.svg>
      </motion.div>
    </div>
  </motion.div>
);

export default AiTools;
