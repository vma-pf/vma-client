import http from "@oursrc/lib/http";

import { CreatePlanTemplate } from "../models/plan-template";
import { ResponseObjectList } from "../models/response-object";

const endpoint = "api/planTemplate";

export const planTemplateService = {
  getVaccinationTemplateByPagination: (page: number, pageSize: number = 30) =>
    http.get<ResponseObjectList<any>>(endpoint + "/vaccination-template", {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  create: (model: CreatePlanTemplate) =>
    http.post(endpoint, {
      treatmentGuideId: model.treatmentGuideId,
      name: model.name,
      stageTemplates: model.stageTemplates,
    }),
};
