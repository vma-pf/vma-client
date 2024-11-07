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
  createVaccinationStages: [
    {
      title: string;
      timeSpan: string;
      applyStageTime: string;
      isDone: boolean;
      vaccinationToDos: [
        {
          description: string;
        }
      ];
    }
  ];
  isApplyToAll: boolean;
  herdId: string;
  pigIds: [];
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
  portionEachPig: number;
};
