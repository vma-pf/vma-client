import http from "@oursrc/lib/http";
import { CreateHerdRequest } from "./models/herd";

export type ListResponse<T> = {
  isSuccess: boolean;
  data: {
    pageSize: number;
    pageIndex: number;
    totalRecords: number;
    totalPages: number;
    data: T[];
  };
  errorMessage: string | null;
};

export const apiRequest = {
  createHerd: (model: CreateHerdRequest) =>
    http.post("api/herds", {
      breed: model.breed,
      totalNumber: model.totalNumber,
      startDate: model.startDate,
      expectedEndDate: model.expectedEndDate,
    }),
  getPigs: (pageIndex: number, pageSize: number) =>
    http.get<ListResponse<any>>(`api/pigs`, {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
};
