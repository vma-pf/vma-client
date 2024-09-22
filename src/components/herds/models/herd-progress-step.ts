type ProgressStepsType = {
  title: string;
  status: string;
  isCurrentTab: boolean;
  steps: {
    title: string;
    status: string;
    isCurrentTab: boolean;
  }[]
};

type ProgressSteps = {
  title: string;
  status: string;
  isCurrentTab: boolean;
};

export type {ProgressStepsType, ProgressSteps}