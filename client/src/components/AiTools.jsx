import React from "react";
import { AiToolsData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import "./AiTools.css";
import ToolCard from "./ToolCard";

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

  return (
    <div className="ai-tools-section">
      <motion.div
        className="ai-tools-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="ai-tools-main-title">
          Powerful{" "}
          <span className="ai-tools-title-highlight">AI Tools</span>
        </h2>
        <p className="ai-tools-subheading">
          Everything you need to create, enhance, and optimize your content with
          cutting-edge AI technology.
        </p>
      </motion.div>

      {/* Single container for all cards with responsive layout */}
      <motion.div
        className="ai-tools-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {AiToolsData.map((tool, index) => (
          <ToolCard key={`tool-${index}`} tool={tool} user={user} navigate={navigate} />
        ))}
      </motion.div>
    </div>
  );
};

export default AiTools;