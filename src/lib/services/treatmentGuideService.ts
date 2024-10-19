import http from "@oursrc/lib/http";

import { ResponseObjectList } from "../models/response-object";
import {
  CreateTreatmentGuide,
  UpdateTreatmentGuide,
} from "../models/treatment-guide";

const endpoint = "api/treatmentGuides";

export const treatmentService = {
  getByPagination: (page: number, pageSize: number = 30) =>
    http.get<ResponseObjectList<any>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getById: (id: string) => http.get(endpoint + `/${id}`),
  create: (model: CreateTreatmentGuide) =>
    http.post(endpoint, {
      diseaseTitle: model.diseaseTitle,
      diseaseDescription: model.diseaseDescription,
      diseaseSymptoms: model.diseaseSymptoms,
      treatmentTitle: model.treatmentTitle,
      treatmentDescription: model.treatmentDescription,
      diseaseType: model.diseaseType,
    }),
  update: (id: string, model: UpdateTreatmentGuide) =>
    http.put(endpoint + `/${id}`, {
      diseaseTitle: model.diseaseTitle,
      diseaseDescription: model.diseaseDescription,
      diseaseSymptoms: model.diseaseSymptoms,
      treatmentTitle: model.diseaseTitle,
      treatmentDescription: model.treatmentDescription,
      diseaseType: model.diseaseType,
    }),
  delete: (id: string) => http.delete(endpoint + `/${id}`),
};
