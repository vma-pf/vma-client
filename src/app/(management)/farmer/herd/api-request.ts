import http from "@oursrc/lib/http";
import { CreateHerdRequest, Pig } from "./models/herd";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";

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
  assignPigToCage: (pig: any) =>
    http.post<ResponseObject<any>>("api/pigs", pig),
  createCheckUpPlan: (model: string[]) =>
    http.post<ResponseObject<any>>("api/checkup-plans", model),
};
