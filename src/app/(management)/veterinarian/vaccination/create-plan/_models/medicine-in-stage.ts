export type MedicineInStage = {
  vaccinationStageId: string;
  title: string;
  description: string;
  medicines: MedicineEachStage[];
};

export type MedicineEachStage = {
  medicineId: string;
  medicineName: string;
  quantity: number;
  netWeight: string,
  unit: string,
  portionEachPig: number;
};
