export type VaccinationData = {
  id: string;
  title: string;
  description: string;
  herdId: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate: string;
  note: string;
  status: "Đã hoàn thành" | "Chưa hoàn thành";
};

export type VaccinationStageProps = {
  id: string;
  title: string;
  applyStageTime: Date;
  timeSpan: string;
  isDone: boolean;
};
