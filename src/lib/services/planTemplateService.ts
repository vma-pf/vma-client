import http from "../http";

const endpoint = "api/planTemplate";
export const planTemplateService = {
    getTreatmentPlanTemplate: (pageIndex: number, pageSize: number) => http.get(`${endpoint}/treatment-template`, {
        params: {
            pageIndex: pageIndex?.toString() || "",
            pageSize: pageSize?.toString() || "",
        },
    }),
    getTemplateByTreatmentGuideId: (treatmentGuideId: string, pageIndex: number, pageSize: number) => http.get(`${endpoint}/treatmentGuide/${treatmentGuideId}`, {
        params: {
            pageIndex: pageIndex?.toString() || "",
            pageSize: pageSize?.toString() || "",
        },
    }),
    getVaccinationPlanTemplate: (pageIndex: number, pageSize: number) => http.get(`${endpoint}/vaccination-template`, {
        params: {
            pageIndex: pageIndex?.toString() || "",
            pageSize: pageSize?.toString() || "",
        },
    }),
    createPlanTemplate: (model: any) => http.post(endpoint, model),
    updatePlanTemplate: (id: string, model: any) => http.put(`${endpoint}/${id}`, model),
}