export type VaccinationData = {
  id: string;
  title: string;
  description: string;
  herdId: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate: string;
  note: string;
  status: number;
  vaccinationStages: VaccinationStageProps[];
};

export type VaccinationStageProps = {
  id: string;
  vaccinationPlanId: string;
  title: string;
  applyStageTime: string;
  timeSpan: string;
  isDone: boolean;
  vaccinationToDos: [
    { description: string; }
  ]
};
