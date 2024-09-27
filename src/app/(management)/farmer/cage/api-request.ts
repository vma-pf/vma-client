import http from "@oursrc/lib/http";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";

export const apiRequest = {
  createCage: (model: CageRequest) =>
    http.post<ResponseObjectList<any>>("api/cages", {
      code: model.code,
      capacity: model.capacity,
      description: model.description,
    }),
};
