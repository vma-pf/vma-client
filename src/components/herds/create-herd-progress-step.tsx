"use client";
import React from "react";
import {
  getBorderClassNameByHerdStatus,
  getClassNameByHerdStatus,
} from "./utils";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { setHerdProgressSteps } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { useHerdProgressSteps } from "@oursrc/lib/store";
type ProgressStep = {
  title: string;
  status: string;
  isCurrentTab: boolean;
};
const CreateHerdProgressStep = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = React.useState(useHerdProgressSteps());

  const convertStatus = (status: string) => {
    switch (status) {
      case "not_yet":
        return "Chưa hoàn thành";
      case "done":
        return "Hoàn thành";
    }
  };
  const handleStepClick = (index: number) => {
    if(index !== 0 && data[index-1].status === 'not_yet'){
      return
    }
    const dataUpdate = data.map((x: ProgressStep) => ({
      ...x,
      isCurrentTab: false,
    }));
    dataUpdate[index].isCurrentTab = true;
    setData(dataUpdate);
    dispatch(setHerdProgressSteps(dataUpdate));
  };
  return (
    <div>
      <ol className="grid grid-flow-row grid-cols-5 gap-5 mt-5">
        {data.map((step: ProgressStep, index: number) => (
          <li onClick={() => handleStepClick(index)}>
            <div
              className={`w-full p-4 cursor-pointer ${getClassNameByHerdStatus(
                step.status,
                step.isCurrentTab
              )}`}
              role="alert"
            >
              <div className="font-medium flex items-center">
                <div>
                  <span
                    className={`mr-2 flex items-center justify-center w-8 h-8 border ${getBorderClassNameByHerdStatus(
                      step.status,
                      step.isCurrentTab
                    )}`}
                  >
                    {index + 1}
                  </span>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col">
                    <span>{step.title}</span>
                    <small>{convertStatus(step.status)}</small>
                  </div>
                  {step.status === "done" && (
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CreateHerdProgressStep;
