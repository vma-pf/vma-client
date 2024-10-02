import http from "@oursrc/lib/http";
import { ResponseObject } from "../models/response-object";

export const vaccinationService = {
    getAllVaccinationPlan: (page: number, pageSize: number) =>
        http.get<ResponseObject<any>>("get-all-vaccination-plans", {
            params: {
                pageIndex: page?.toString() || "",
                pageSize: pageSize?.toString() || "",
            },
        }),
    getVaccinationPlan: (id: string) =>
        http.get<ResponseObject<any>>(`get-vaccination-plan/${id}`),
    getMedicineInStage: (id: string) =>
        http.get<ResponseObject<any>>(`vaccination-stages/${id}/medicines`),
};