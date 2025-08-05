import React from "react";
import { motion } from "framer-motion";
import "./ToolCard.css";

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
    className="ai-tool-card"
    onClick={() => user && navigate(tool.path)}
  >
    <div className="ai-tool-card-hover-overlay" />
    <div className="ai-tool-card-border-effect" />

    {/* Floating particles */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        className="ai-tool-card-particle"
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

    <div className="ai-tool-card-content">
      <div className="ai-tool-icon-container">
        <div
          className="ai-tool-icon-background"
          style={{ background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})` }}
        >
          <motion.div className="ai-tool-icon-shine-effect" />
          <tool.Icon className="ai-tool-icon" />
        </div>
        <div
          className="ai-tool-icon-glow-effect"
          style={{ background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})` }}
        />
      </div>

      <motion.h3 className="ai-tool-title" whileHover={{ x: 2 }}>
        {tool.title}
      </motion.h3>

      <p className="ai-tool-description">
        {tool.description}
      </p>

      <motion.div 
        className="ai-tool-cta-button" 
        initial={{ x: -10 }} 
        whileHover={{ x: 0 }}
      >
        <span>Get Started</span>
        <motion.svg
          className="ai-tool-cta-arrow"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </motion.div>
    </div>
  </motion.div>
);

export default ToolCard;