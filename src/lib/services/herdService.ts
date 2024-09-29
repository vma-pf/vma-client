import http from "../http";
import { Herd } from "../models/herd";
import { ResponseObject } from "../models/response-object";

const endpoint = "api/herds";

export const herdService = {
  getHerds: (page: number, pageSize: number = 30) =>
    http.get<ResponseObject<Herd>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getHerdId: (id: string) => http.get(endpoint + `/${id}`),
};
