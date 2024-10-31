import { TreatmentPlanStep } from "@oursrc/app/(management)/veterinarian/treatment/create-plan/page";
import http from "../http";

const endpoint = "api/treatmentPlans";

export const treatmentPlanService = {
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, { params: { pageIndex: pageIndex?.toString() || "", pageSize: pageSize?.toString() || "" } }),
    createTreatmentPlan: (data: any) => http.post(`${endpoint}/create-all-flow`, data),
    getTreatmentPlan: (id: string) => http.get(`${endpoint}/${id}`),
    getDiseaseReport: (id: string) => http.get(endpoint + `/${id}/disease-reports`),
    getPigList: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/${id}/pigs`, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        }
    }),
};