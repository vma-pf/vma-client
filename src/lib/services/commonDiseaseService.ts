import http from "@oursrc/lib/http";

import { ResponseObjectList } from "../models/response-object";
import { CreateCommonDisease, UpdateCommonDisease } from "../models/common-disease";

const endpoint = "api/commonDiseases";

export const commonDiseasesService = {
  getByPagination: (page: number, pageSize: number = 30) =>
    http.get<ResponseObjectList<any>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getById: (id: string) => http.get(endpoint + `/${id}`),
  create: (model: CreateCommonDisease) =>
    http.post(endpoint, {
      title: model.title,
      description: model.description,
      symptom: model.symptom,
      diseaseType: model.diseaseType,
      treatment: model.treatment,
    }),
  update: (id: string, model: UpdateCommonDisease) =>
    http.put(endpoint + `/${id}`, {
      title: model.title,
      description: model.description,
      symptom: model.symptom,
      diseaseType: model.diseaseType,
      treatment: model.treatment,
    }),
  delete: (id: string) => http.delete(endpoint + `/${id}`),
};
