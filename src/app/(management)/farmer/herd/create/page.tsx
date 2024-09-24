"use client";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import React, { useEffect } from "react";
import HerdCreate from "./components/herd-create";
import { useHerdProgressSteps } from "@oursrc/lib/store";
import CageCreate from "./components/cage-create";
import AssignTag from "./components/assign-tag";
import PreviewInfo from "./components/preview-info";
import { motion } from "framer-motion";

const CreateHerdProgress = () => {
  const storedHerdProgressSteps = useHerdProgressSteps();
  const [herdProgressSteps, setHerdProgressSteps] = React.useState(
    useHerdProgressSteps()
  );

  useEffect(() => {
    setHerdProgressSteps(storedHerdProgressSteps);
  }, [storedHerdProgressSteps]);

  const getComponent = () => {
    switch (herdProgressSteps.find((x: any) => x.isCurrentTab).id) {
      case 1:
        return <CageCreate />;
      case 2:
        return <HerdCreate />;
      case 3:
        return <AssignTag />;
      case 4:
        return <PreviewInfo />;
    }
  };
  return (
    <motion.div
      // make a slide from right to left
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4 }}
    >
      <div className="container px-4">
        <CreateHerdProgressStep steps={herdProgressSteps} />
        {getComponent()}
      </div>
    </motion.div>
  );
};

export default CreateHerdProgress;
