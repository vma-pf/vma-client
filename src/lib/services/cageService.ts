import http from "@oursrc/lib/http";

const endpoint = "api/cages";
export const cageService = {
  getCages: (page: number, pageSize: number) =>
    http.get(endpoint, {
      params: {
        pageIndex: page?.toString() || "",
        pageSize: pageSize?.toString() || "",
      },
    }),
  getCageId: (id: string) => http.get(endpoint + `/${id}`),
  getActivityLog: (id: string, page: number, pageSize: number) => http.get(endpoint + `/${id}/activity-logs`, {
    params: {
      pageIndex: page?.toString() || "",
      pageSize: pageSize?.toString() || "",
    },
  }),
  getActivityLogPercent: (id: string, date: string) => http.get(endpoint + `/${id}/activity-logs/${date}/statistics`),
  getActivityLogByDate: (id: string, date: string) => http.get(endpoint + `/${id}/activity-logs/${date}`),
  createCage: (model: any) =>
    http.post(endpoint, model),
  updateCage: (model: any, id: string) =>
    http.put(endpoint + `/${id}`, model),
  deleteCage: (id: string) => http.delete(endpoint + `/${id}`, {}),
  assignPigToCage: (cageId: string, pigId: string) => http.post(endpoint + `/pig-to-cage`, {
    cageId: cageId || "",
    pigId: pigId || "",
  }),
};
