import http from "@oursrc/lib/http";
import { CreateMedicineRequest } from "./models/medicine";
import { ListResponse } from "../herd/api-request";

const endpoint = "api/medicines";

export const apiRequest = {
  createMedicine: (model: CreateMedicineRequest) =>
    http.post(endpoint, {
      unit: model.unit,
      name: model.name,
      mainIngredient: model.mainIngredient,
      registerNumber: model.registerNumber,
      netWeight: model.netWeight,
      usage: model.usage,
    }),
  getMedicine: (page: number, pageSize: number = 30) =>
    http.get<ListResponse<any>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
};
