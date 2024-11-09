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
  id?: string;
  vaccinationPlanId?: string;
  title: string;
  applyStageTime: string;
  timeSpan: string;
  isDone?: boolean;
  vaccinationToDos: { description: string }[];
  inventoryRequest: MedicineInStage;
};

export type CreateVaccinationRequest = {
  title: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate: string;
  note: string;
  createVaccinationStages: CreateVaccinationStageProps[];
  isApplyToAll: boolean;
  herdId: string;
  pigIds: [];
};

export type CreateVaccinationStageProps = {
  id?: string;
  title: string;
  applyStageTime: string;
  timeSpan: string;
  note?: string;
  isDone?: boolean;
  vaccinationToDos: { description: string }[];
  inventoryRequest: MedicineInStage;
};

export type MedicineInStage = {
  id: string;
  title: string;
  description: string;
  medicines: MedicineEachStage[];
};

export type MedicineEachStage = {
  id?: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  netWeight: string;
  unit: string;
  portionEachPig?: number;
};
