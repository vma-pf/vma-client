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
    getHerdByVaccinationPlanId: (id: string) =>
        http.get<ResponseObject<any>>(endpoint + `/${id}/vaccination-plans`),
    createHerd: (model: CreateHerdRequest) =>
        http.post<ResponseObjectList<any>>(endpoint, model),
};