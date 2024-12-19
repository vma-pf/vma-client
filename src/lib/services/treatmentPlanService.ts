import http from "../http";

const endpoint = "api/treatmentPlans";

export const treatmentPlanService = {
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, { params: { pageIndex: pageIndex?.toString() || "", pageSize: pageSize?.toString() || "" } }),
    getMyTreatmentPlans: (pageIndex: number, pageSize: number) => http.get("api/my-treatment-plans", { params: { pageIndex: pageIndex?.toString() || "", pageSize: pageSize?.toString() || "" } }),
    createTreatmentPlan: (data: any) => http.post(`${endpoint}/create-all-flow`, data),
    getTreatmentPlan: (id: string) => http.get(`${endpoint}/${id}`),
    getDiseaseReport: (id: string) => http.get(endpoint + `/${id}/disease-reports`),
    getMedicineRequest: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/${id}/medicine-requests`, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        }
    }),
    getMedicineRequestNoCache: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/${id}/medicine-requests`, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        },
        allowCaching: false,
    }),
    getPigList: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/${id}/pigs`, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        }
    }),
};