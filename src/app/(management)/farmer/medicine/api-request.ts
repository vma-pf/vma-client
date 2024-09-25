import http from "@oursrc/lib/http";
import { CreateMedicineRequest } from "./models/medicine";

const endpoint = "api/medicines"

export const apiRequest = {
  createMedicine: (model: CreateMedicineRequest) =>
    http.post(endpoint, {
      unit: model.unit,
      name: model.name,
      mainIngredient: model.mainIngredient,
      registerNumber: model.registerNumber,
      netWeight: model.netWeight,
      usage: model.usage
    }),
  getMedicine: (page: number = 1, perPage: number = 30, search: string = '') => 
    http.get(endpoint+`?pageIndex=${page}&pageSize=${perPage}`)
};
