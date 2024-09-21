"use client"
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import React from "react";
import HerdCreate from "./components/herd-create";

const CreateHerdProgress = () => {
  const [progressStep, setProgressStep] = React.useState([
    {
      title: "Buoc 1",
      status: "done",
      isCurrentTab: true,
    },
    {
      title: "Buoc 2",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      title: "Buoc 3",
      status: "not_yet",
      isCurrentTab: false,
    },
    {
      title: "Buoc 4",
      status: "not_yet",
      isCurrentTab: false,
    },
  ]);
  return (
    <div>
      <div>{progressStep.map(x => x.title + ' ' + x.isCurrentTab)}</div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep
          data={progressStep}
        />
        <HerdCreate />
      </div>
    </div>
  );
};

export default CreateHerdProgress;