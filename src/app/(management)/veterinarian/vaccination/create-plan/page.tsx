"use client";
import React from "react";
import FirstVaccinationStep from "./_components/first-vaccination-step";
import SecondVaccinationStep from "./_components/second-vaccination-step";

const CreatePlan = () => {
  const [step, setStep] = React.useState<number>(1);
  return (
    <div>
      {step === 1 ? (
        <FirstVaccinationStep setStep={setStep} />
      ) : (
        <SecondVaccinationStep setStep={setStep} />
      )}
    </div>
  );
};
export default CreatePlan;
