import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import "./hero.css";

const Hero = () => {
  const navigate = useNavigate();

  const servicesSequence = [
    "Create Stunning AI Images",
    1000,
    "Write Professional Blog Content",
    1000,
    "Remove Photo Backgrounds Instantly",
    1000,
    "Clean Up Your Photos Perfectly",
    1000,
    "Craft Compelling Headlines",
    1000,
    "Build Career-Ready Resumes",
    1000,
    "Manage All Your Content",
    1000,
    "Connect with Fellow Creators",
    1000,
  ];

  return (
    <div className="hero-container">
      {/* Background elements */}
      <div className="hero-bg-pattern"></div>
      <div className="hero-orb-top"></div>
      <div className="hero-orb-bottom"></div>

      {/* Main content */}
      <div className="hero-content">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Transform Content Creation{" "}
          <span className="block sm:inline">
            with <span className="hero-title-gradient">AI Magic</span>
          </span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hero-typing-container"
        >
          <div className="hero-typing-box">
            <div className="hero-typing-glow"></div>
            <div className="hero-typing-secondary-glow"></div>
            <TypeAnimation
              sequence={servicesSequence}
              speed={50}
              repeat={Infinity}
              cursor={true}
              style={{
                display: "inline-block",
                fontWeight: 600,
                fontSize: "clamp(1rem, 4vw, 1.5rem)",
                color: "#5044E5",
                letterSpacing: "-0.025em",
              }}
            />
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="hero-subtitle hidden md:block"
        >
          Enterprise-grade AI solutions for modern content creators
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="hero-features-container"
        >
          {["⚡ Fast", "🎨 Creative", "🔒 Secure", "📈 Scalable"].map(
            (feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="hero-feature-pill"
              >
                {feature}
              </motion.div>
            )
          )}
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="hero-cta-container"
      >
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/ai")}
          className="hero-primary-cta"
        >
          <div className="hero-shine-effect"></div>
          <span className="relative z-8">
            Start Creating Now
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="hero-arrow-animation"
            >
              →
            </motion.span>
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="hero-secondary-cta"
        >
          <div className="hero-play-icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Watch Demo
        </motion.button>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="hero-trust-container"
      >
        <p className="hero-trust-text">Trusted by 50,000+ creators worldwide</p>

        <div className="hero-stats-container">
          <div className="hero-stat-item">
            <span className="hero-stat-number">2M+</span>
            <span className="hero-stat-label">Content Generated</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">99.9%</span>
            <span className="hero-stat-label">Uptime</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">4.9/5</span>
            <span className="hero-stat-label">User Rating</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
