"use client";
import React from "react";
import { motion } from "framer-motion";

const Camera = () => {
  return (
    <motion.div
      // make a slide from right to left
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-3xl">Camera</p>
    </motion.div>
  );
};

export default Camera;
