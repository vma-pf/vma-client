import http from "@oursrc/lib/http";

import { ListResponse } from "../models/common-response";
import { Pig } from "../models/pig";

const endpoint = "api/pigs";

export const pigService = {
  getPigsByCageId: (cageId: string, page: number, pageSize: number = 30) =>
    http.get<ListResponse<Pig>>(endpoint+ `/cage/${cageId}`, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getPigId: (id: string) => http.get(endpoint + `/${id}`),
};
