import React from "react";
type ProgressStep = {
  title: string;
  status: string;
  isCurrentTab: boolean;
};
const CreateHerdProgressStep = ({ data }: { data: ProgressStep[] }) => {
    const convertStatus = (status: string) => {
        switch(status){
            case 'not_yet': return 'Chua hoan thanh'
            case 'done': return 'Hoan thanh'
        }
    }
  return (
    <div>
      <ol className="grid grid-flow-row grid-cols-5 gap-5 mt-5">
        {data.map((step: ProgressStep, index) => (
          <li>
            <div
              className={`w-full p-4 ${ step.status ==="done" ? "text-green-700 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:border-green-800 dark:text-green-400": ""}`}
              role="alert"
            >
              <div className="flex items-center justify-between">
                <span className="sr-only">User info</span>
                <h3 className="font-medium">{index+1} {step.title} </h3> <small>{convertStatus(step.status)}</small>
                {step.status === 'done' && <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default CreateHerdProgressStep;
