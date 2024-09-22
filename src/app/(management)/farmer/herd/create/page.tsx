"use client";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import React, { useEffect } from "react";
import HerdCreate from "./components/herd-create";
import { useHerdProgressSteps } from "@oursrc/lib/store";
import CageCreate from "./components/cage-create";

const CreateHerdProgress = () => {
  const storedHerdProgressSteps = useHerdProgressSteps();
  const [herdProgressSteps, setHerdProgressSteps] = React.useState(useHerdProgressSteps());

  useEffect(() => {
    setHerdProgressSteps(storedHerdProgressSteps)
  }, [storedHerdProgressSteps])

  const getComponent = () => {
    switch(herdProgressSteps.find((x:any) => x.isCurrentTab).id){
      case 1: return <CageCreate />
      case 2: return <HerdCreate />
    }
  }
  return (
    <div>
      <div>
      </div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep steps={herdProgressSteps} />
        {getComponent()}
      </div>
    </div>
  );
};

export default CreateHerdProgress;