import http from "../http";
import { Area } from "../models/area";

const endpoint = "api/areas";
export const areaService = {
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, {
        params: {
            pageIndex: pageIndex.toString() || "1",
            pageSize: pageSize.toString() || "10"
        }
    }),
    getById: (id: string) => http.get(`${endpoint}/${id}`),
    getPigsByAreaId: (id: string) => http.get(`${endpoint}/${id}/pigs`),
    create: (data: any) => http.post(endpoint, data),
    update: (id: string, data: any) => http.put(`${endpoint}/${id}`, data),
    delete: (id: string) => http.delete(`${endpoint}/${id}`, {})
};