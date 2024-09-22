"use client"
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import React from "react";
import HerdCreate from "./components/herd-create";

const CreateHerdProgress = () => {
  return (
    <div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep />
        <HerdCreate />
      </div>
    </div>
  );
};

export default CreateHerdProgress;