"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { getBorderClassNameByHerdStatus, getClassNameByHerdStatus } from "./utils";
type ProgressStep = {
  title: string;
  status: string;
  isCurrentTab: boolean;
};
const CreateHerdProgressStep = ({ data }: { data: ProgressStep[] }) => {
  const convertStatus = (status: string) => {
    switch (status) {
      case "not_yet":
        return "Chưa hoàn thành";
      case "done":
        return "Hoàn thành";
    }
  };
  const handleStepClick = () => {
    data = [{title: 'ascs', isCurrentTab: true, status: 'not_yet'}]
  };
  return (
    <div>
      <ol className="grid grid-flow-row grid-cols-5 gap-5 mt-5">
        {data.map((step: ProgressStep, index) => (
          <li onClick={() => handleStepClick()}>
            <div
              className={`w-full p-4 cursor-pointer ${getClassNameByHerdStatus(
                step.status,
                step.isCurrentTab
              )}`}
              role="alert"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium flex">
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
                  <div className="flex flex-col">
                    <span>{step.title}</span>
                    <small>{convertStatus(step.status)}</small>
                  </div>
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
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CreateHerdProgressStep;
