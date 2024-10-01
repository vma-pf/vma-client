import http from "@oursrc/lib/http";

import { Cage, CreateCageRequest } from "../models/cage";
import { ResponseObjectList } from "../models/response-object";

const endpoint = "api/cages";

export const cageService = {
  getCages: (page: number, pageSize: number) =>
    http.get<ResponseObjectList<Cage>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getCageId: (id: string) => http.get(endpoint + `/${id}`),
  createCage: (model: CreateCageRequest) =>
    http.post<ResponseObjectList<any>>(endpoint, {
      code: model.code,
      capacity: model.capacity,
      description: model.description,
    }),
  updateCage: (model: CreateCageRequest, id: string) =>
    http.put<ResponseObjectList<any>>(endpoint + `/${id}`, {
      code: model.code,
      capacity: model.capacity,
      description: model.description,
    }),
  deleteCage: (id: string) => http.delete(endpoint + `/${id}`),
};
