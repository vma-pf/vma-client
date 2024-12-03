import http from "@oursrc/lib/http";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { CreateHerdRequest } from "@oursrc/lib/models/herd";

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
    createHerd: (model: CreateHerdRequest) =>
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
};