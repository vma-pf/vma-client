"use client";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import React from "react";
import HerdCreate from "./components/herd-create";
import { useHerdProgressSteps } from "@oursrc/lib/store";
import CageCreate from "./components/cage-create";

const CreateHerdProgress = () => {
  const currentHerdProgressStep = useHerdProgressSteps().find((x:any) => x.isCurrentTab)
  const getComponent = () => {
    switch(currentHerdProgressStep.id){
      case 1: return <HerdCreate />
      case 2: return <CageCreate />
    }
  }
  return (
    <div>
      <div>
      </div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep />
        {getComponent()}
      </div>
    </div>
  );
};

export default CreateHerdProgress;