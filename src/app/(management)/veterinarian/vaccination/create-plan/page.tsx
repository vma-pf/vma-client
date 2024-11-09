"use client";
import React from "react";
import FirstVaccinationStep from "./_components/create-vaccination";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CreateVaccination from "./_components/create-vaccination";

const CreatePlan = () => {
  const router = useRouter();
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      <CreateVaccination />
    </motion.div>
  );
};
export default CreatePlan;
