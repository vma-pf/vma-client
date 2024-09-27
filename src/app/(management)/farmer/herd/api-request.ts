import http from "@oursrc/lib/http";
import { CreateHerdRequest } from "./models/herd";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";

export const apiRequest = {
  getHerd: (pageIndex: number, pageSize: number) =>
    http.get<ResponseObjectList<any>>(`api/herds`, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getHerdById: (id: string) =>
    http.get<ResponseObjectList<any>>(`api/herds/${id}`),
  createHerd: (model: CreateHerdRequest) =>
    http.post<ResponseObjectList<any>>("api/herds", model),
  getPigs: (pageIndex: number, pageSize: number) =>
    http.get<ResponseObjectList<any>>(`api/pigs`, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getCages: (pageIndex: number, pageSize: number) =>
    http.get<ResponseObjectList<any>>(`api/cages`, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
};
