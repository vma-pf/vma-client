import http from "@oursrc/lib/http";

import { Pig } from "../models/pig";
import {
  ResponseObject,
  ResponseObjectList,
  ResponseObjectNoPaging,
} from "../models/response-object";
import { VaccinationData } from "../models/vaccination";
import { DiseaseReport, TreatmentData } from "../models/treatment";

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
  getPigsBySearch: (pageIndex: number, pageSize: number, filter: string, sort: string) =>
    http.get<ResponseObjectList<Pig>>(endpoint + '/search', {
      params: {
        pageIndex: pageIndex?.toString() || "",
        pageSize: pageSize?.toString() || "",
        filter: filter || "",
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
  getVaccinationPlanByPigId: (pigId: string) =>
    http.get<ResponseObjectNoPaging<VaccinationData>>(
      endpoint + `/pigs/${pigId}/vaccination-plans`
    ),
  getTreatmentPlanByPigId: (
    pigId: string,
    pageIndex: number,
    pageSize: number
  ) =>
    http.get<ResponseObjectList<TreatmentData>>(
      endpoint + `/${pigId}/treatment-plans`,
      {
        params: {
          pageIndex: pageIndex?.toString() || "",
          pageSize: pageSize?.toString() || "",
        },
      }
    ),
  getDiseaseReportByPigId: (
    pigId: string,
    pageIndex: number,
    pageSize: number
  ) =>
    http.get<ResponseObjectList<DiseaseReport>>(
      endpoint + `/${pigId}/disease-reports`,
      {
        params: {
          pageIndex: pageIndex?.toString() || "",
          pageSize: pageSize?.toString() || "",
        },
      }
    ),
  destroyPig: (pigIds: string[]) => http.delete(endpoint + `/destroy-pigs`, { pigIds: pigIds }),
};
