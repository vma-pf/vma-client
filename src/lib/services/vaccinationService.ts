import http from "@oursrc/lib/http";
import { ResponseObject } from "@oursrc/lib/models/response-object";

export const vaccinationService = {
    getVaccinationPlan: (id: string) =>
        http.get<ResponseObject<any>>(`get-vaccination-plan/${id}`),
    getMedicineInStage: (id: string) =>
        http.get<ResponseObject<any>>(`vaccination-stages/${id}/medicines`),
};