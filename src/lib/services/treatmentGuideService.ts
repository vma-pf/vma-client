import http from "@oursrc/lib/http";

import { ResponseObjectList } from "../models/response-object";
import {
  CreateTreatmentGuide,
} from "../models/treatment-guide";

const endpoint = "api/treatmentGuides";

export const treatmentGuideService = {
  getByPagination: (page: number, pageSize: number = 30) =>
    http.get<ResponseObjectList<any>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getById: (id: string) => http.get(endpoint + `/${id}`),
  create: (model: CreateTreatmentGuide) =>
    http.post(endpoint, model),
  update: (id: string, model: CreateTreatmentGuide) =>
    http.put(endpoint + `/${id}`, model),
  delete: (id: string) => http.delete(endpoint + `/${id}`),
};
