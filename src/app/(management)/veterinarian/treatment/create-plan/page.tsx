"use client";
import React from "react";
import { motion } from "framer-motion";

const CreateTreatmentPLan = () => {
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      CreateTreatmentPLan
    </motion.div>
  );
};

export default CreateTreatmentPLan;
