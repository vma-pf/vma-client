"use client";
import React from "react";
import FirstVaccinationStep from "./_components/first-vaccination-step";
import SecondVaccinationStep from "./_components/second-vaccination-step";

const CreatePlan = () => {
  const [step, setStep] = React.useState<number>(1);
  const [vaccinationPlanFirstStepResult, setVaccinationPlanFirstStepResult] = React.useState<any>()
  return (
    <div>
      {step === 1 ? (
        <FirstVaccinationStep setStep={setStep} setVaccinationPlanFirstStepResult={setVaccinationPlanFirstStepResult} />
      ) : (
        <SecondVaccinationStep setStep={setStep} vaccinationPlan={vaccinationPlanFirstStepResult} />
      )}
    </div>
  );
};
export default CreatePlan;
