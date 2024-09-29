import http from "@oursrc/lib/http";

import { Pig } from "../models/pig";
import { ResponseObject } from "../models/response-object";

const endpoint = "api/pigs";

export const pigService = {
  getPigsByCageId: (cageId: string, page: number, pageSize: number = 30) =>
    http.get<ResponseObject<Pig>>(endpoint+ `/cage/${cageId}`, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getPigId: (id: string) => http.get(endpoint + `/${id}`),
};
