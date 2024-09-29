type Medicine = {
  id: string,
  unit: string,
  name: string,
  mainIngredient: string,
  quantity: number,
  registerNumber: number,
  netWeight: string,
  usage: string,
};

type CreateMedicineRequest = {
  unit: string,
  name: string,
  mainIngredient: string,
  registerNumber: number,
  netWeight: string,
  usage: string
};

type UpdateMedicineRequest = {
  unit: string,
  name: string,
  mainIngredient: string,
  registerNumber: number,
  netWeight: string,
  usage: string
};

type MedicineResponse = {
  isSuccess: boolean,
  data: any,
  errorMessage: string
}

export type { CreateMedicineRequest, UpdateMedicineRequest, MedicineResponse, Medicine }