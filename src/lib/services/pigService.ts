import http from "@oursrc/lib/http";

import { Pig } from "../models/pig";
import { ResponseObject, ResponseObjectList } from "../models/response-object";

const endpoint = "api/pigs";

export const pigService = {
  getPigsByCageId: (cageId: string, page: number, pageSize: number) =>
    http.get<ResponseObjectList<Pig>>(endpoint + `/cage/${cageId}`, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getPigs: (pageIndex: number, pageSize: number) =>
    http.get<ResponseObjectList<Pig>>(endpoint, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getPigsByHerdId: (herdId: string, pageIndex: number, pageSize: number) =>
    http.get<ResponseObjectList<Pig>>(endpoint + `/herd/${herdId}`, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  assignPigToCage: (pig: any) => http.post<ResponseObject<any>>(endpoint, pig),
  getPigId: (id: string) => http.get(endpoint + `/${id}`),
};
