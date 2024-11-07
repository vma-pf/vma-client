import http from "../http";

const endpoint = "api/planTemplate";
export const planTemplateService = {
    getTreatmentPlanTemplate: (pageIndex: number, pageSize: number) => http.get(`${endpoint}/treatment-template`, {
        params: {
            pageIndex: pageIndex?.toString() || "",
            pageSize: pageSize?.toString() || "",
        },
    }),
    createPlanTemplate: (model: any) => http.post(endpoint, model),
}