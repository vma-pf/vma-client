import http from "@oursrc/lib/http";
import { ResponseObject, ResponseObjectList } from "../models/response-object";
import {
  CreateVaccinationTemplate,
  VaccinationTemplate,
} from "../models/plan-template";
const endpoint = "api/vaccinationTemplates";
export const vaccinationTemplateService = {
  getVaccinationTemplate: (pageIndex: number, pageSize: number) =>
    http.get<ResponseObjectList<VaccinationTemplate>>(endpoint, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  createVaccinationTemplate: (model: CreateVaccinationTemplate) =>
    http.post<ResponseObject<any>>(endpoint, {
      titleTemplate: model.titleTemplate,
      createVaccinationPlanIncludeStageRequest:
        model.createVaccinationPlanIncludeStageRequest,
    }),
};
