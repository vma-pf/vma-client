import http from "@oursrc/lib/http";

import { Cage } from "../models/cage";
import { ListResponse } from "../models/common-response";

const endpoint = "api/cages";

export const cageService = {
  getCages: (page: number, pageSize: number = 30) =>
    http.get<ListResponse<Cage>>(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getCageId: (id: string) => http.get(endpoint + `/${id}`),
};
