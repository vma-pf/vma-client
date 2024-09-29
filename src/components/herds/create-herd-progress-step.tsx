"use client";
import React, { useEffect } from "react";
import {
  getBorderClassNameByHerdStatus,
  getClassNameByHerdStatus,
} from "./utils";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { setHerdProgressSteps } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";

const CreateHerdProgressStep = ({ steps }: any) => {
  const dispatch = useAppDispatch();
  const [data, setData] = React.useState(steps);

  useEffect(() => {
    setData(steps);
  });

  const convertStatus = (status: string) => {
    switch (status) {
      case "not_yet":
        return "Chưa hoàn thành";
      case "done":
        return "Hoàn thành";
    }
  };
  const handleStepClick = (index: number) => {
    if (index !== 0 && data[index - 1].status === "not_yet") {
      return;
    }
    const dataUpdate = data.map((x: any) => ({
      ...x,
      isCurrentTab: false,
    }));
    dataUpdate[index].isCurrentTab = true;
    setData(dataUpdate);
    dispatch(setHerdProgressSteps(dataUpdate));
    // save to local storage
    localStorage.setItem("herdProgressSteps", JSON.stringify(dataUpdate));
  };
  return (
    <div>
      <ol className="grid grid-flow-row grid-cols-4 gap-5 mt-5">
        {data.map((step: any, index: number) => (
          <li key={index} onClick={() => handleStepClick(index)}>
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
                    {step.status === "done" && !step.isCurrentTab && (
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
                    {step.isCurrentTab && (
                      <svg
                        className="rtl:rotate-180 w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    )}
                    {!step.isCurrentTab && step.status !== "done" && (
                      <span>{index + 1}</span>
                    )}
                  </span>
                </div>
                <div className="w-full">
                  <div className="flex flex-col">
                    <span>{step.title}</span>
                    <small>{convertStatus(step.status)}</small>
                  </div>
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
