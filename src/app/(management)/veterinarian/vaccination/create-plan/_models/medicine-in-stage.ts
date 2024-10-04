export type MedicineInStage = {
  vaccinationStageId: string;
  title: string;
  description: string;
  medicines: MedicineEachStage[];
};

export type MedicineEachStage = {
  medicineId: string;
  isPurchaseNeeded: boolean;
  newMedicineName: string;
  portionEachPig: number;
};
