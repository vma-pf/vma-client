import http from "@oursrc/lib/http";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";

const endpoint = "api/herds";

export const herdService = {
    getHerd: (pageIndex: number, pageSize: number) =>
        http.get<ResponseObjectList<any>>(endpoint, {
            params: {
                pageIndex: pageIndex?.toString() || "",
                pageSize: pageSize?.toString() || "",
            },
        }),
    getHerdById: (id: string) =>
        http.get<ResponseObjectList<any>>(endpoint + `/${id}`),
    createHerd: (model: any) =>
        http.post<ResponseObjectList<any>>(endpoint, model),
    getHerdStatistics: (id: string) => http.get(endpoint + `/${id}/statistic`),
    getAvgStatistics: (id: string) => http.get(endpoint + `/${id}/statistic-avg-weight`),
    getVaccinationByHerdId: (id: string) => http.get(endpoint + `/${id}/vaccination-plans`),
    getTreatmentPlanByHerdId: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/${id}/treatment-plans`, {
        params: {
            pageIndex: pageIndex?.toString() || "",
            pageSize: pageSize?.toString() || "",
        },
    }),
    getHerdDiseaseReport: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/${id}/disease-reports`, {
        params: {
            pageIndex: pageIndex?.toString() || "",
            pageSize: pageSize?.toString() || "",
        },
    }),
    endHerd: (id: string) => http.put(endpoint + `/${id}/end-herd`, {}),
    downloadReport: (id: string) => http.get(endpoint + `/${id}/export-statistics`),
};