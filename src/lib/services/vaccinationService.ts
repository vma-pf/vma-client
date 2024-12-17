import http from "@oursrc/lib/http";
import { ResponseObject } from "../models/response-object";
import { CreateVaccinationRequest, MedicineInStage } from "../models/vaccination";
const endpoint = 'api/vaccination'
export const vaccinationService = {
  getAllVaccinationPlan: (page: number, pageSize: number) =>
    http.get<ResponseObject<any>>("get-all-vaccination-plans", {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getMyVaccinationPlan: (page: number, pageSize: number) =>
    http.get<ResponseObject<any>>("api/my-vaccination-plans", {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getVaccinationPlan: (id: string) =>
    http.get<ResponseObject<any>>(`get-vaccination-plan/${id}`),
  getMedicineRequest: (id: string, page: number, pageSize: number) =>
    http.get<ResponseObject<any>>(`api/vaccination-plans/${id}/medicine-requests`, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getMedicineInStage: (id: string) =>
    http.get<ResponseObject<any>>(`vaccination-stages/${id}/medicines`),
  getHerdByVaccinationPlanId: (id: string) =>
    http.get<ResponseObject<any>>(`api/vaccination-plans/${id}/herds`),
  createVaccinationPlan: (model: CreateVaccinationRequest) =>
    http.post<ResponseObject<any>>(endpoint + "/create-vaccination-plan-and-stage", {
      title: model.title,
      startDate: model.startDate,
      expectedEndDate: model.expectedEndDate,
      actualEndDate: model.actualEndDate,
      note: model.note,
      createVaccinationStages: model.createVaccinationStages,
      herdId: model.herdId,
      pigIds: model.pigIds,
    }),
  changeVaccinationPlan: (model: CreateVaccinationRequest) =>
    http.post<ResponseObject<any>>(`api/vaccination-plans/change-vaccination-plan`, {
      title: model.title,
      startDate: model.startDate,
      expectedEndDate: model.expectedEndDate,
      actualEndDate: model.actualEndDate,
      note: model.note,
      createVaccinationStages: model.createVaccinationStages,
      herdId: model.herdId,
      pigIds: model.pigIds,
    }),
  addInventoryToVaccinationPlan: (data: MedicineInStage[]) =>
    http.post<ResponseObject<any>>("add-inventory-to-vaccination-stage", data),
};
