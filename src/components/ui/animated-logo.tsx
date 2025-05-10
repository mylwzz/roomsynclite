"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center justify-center mb-6 relative">
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <div className="bg-white p-6 rounded-full shadow-md relative overflow-hidden">
          {/* Ripple effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                zIndex: 0,
              }}
            />
          )}
          
          {/* Pulsing effect animation */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-40"
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(59, 130, 246, 0.1)",
                "0 0 0 20px rgba(59, 130, 246, 0)",
              ],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          />
          
          <svg
            className="w-36 h-36 text-primary relative z-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
} 