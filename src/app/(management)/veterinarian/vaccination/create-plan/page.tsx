"use client";
import React from "react";
import FirstVaccinationStep from "./_components/first-vaccination-step";
import SecondVaccinationStep from "./_components/second-vaccination-step";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CreatePlan = () => {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(1);
  const [vaccinationPlanFirstStepResult, setVaccinationPlanFirstStepResult] = React.useState<any>();
  React.useEffect(() => {
    if (step === 3) {
      router.push("/veterinarian/vaccination");
    }
  }, [step]);
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      {step === 1 ? (
        <FirstVaccinationStep setStep={setStep} setVaccinationPlanFirstStepResult={setVaccinationPlanFirstStepResult} />
      ) : (
        <SecondVaccinationStep setStep={setStep} vaccinationPlan={vaccinationPlanFirstStepResult} />
      )}
    </motion.div>
  );
};
export default CreatePlan;
