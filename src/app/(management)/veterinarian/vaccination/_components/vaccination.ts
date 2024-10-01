export type VaccinationData = {
  id: string;
  title: string;
  description: string;
  type: "Cá thể" | "Nhiều cá thể";
  startDate: string;
  expectedEndDate: string;
  actualEndDate: string;
  note: string;
};

export type VaccinationStageProps = {
  id: string;
  title: string;
  applyStageTime: Date;
  timeSpan: string;
  isDone: boolean;
};
