import http from "@oursrc/lib/http";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { CreateVaccinationRequest } from "../models/vaccination";
import { MedicineInStage } from "@oursrc/app/(management)/veterinarian/vaccination/create-plan/_models/medicine-in-stage";

export const vaccinationService = {
  getVaccinationPlan: (id: string) =>
    http.get<ResponseObject<any>>(`get-vaccination-plan/${id}`),
  getMedicineInStage: (id: string) =>
    http.get<ResponseObject<any>>(`vaccination-stages/${id}/medicines`),
  createVaccinationPlan: (model: CreateVaccinationRequest) =>
    http.post<ResponseObject<any>>("make-vaccination-plan", {
      title: model.title,
      startDate: model.startDate,
      expectedEndDate: model.expectedEndDate,
      actualEndDate: model.actualEndDate,
      note: model.note,
      createVaccinationStages: model.createVaccinationStages,
      isApplyToAll: model.isApplyToAll,
      herdId: model.herdId,
      pigIds: model.pigIds,
    }),
  addInventoryToVaccinationPlan: (data: MedicineInStage[]) =>
    http.post<ResponseObject<any>>("add-inventory-to-vaccination-stage", data),
};
