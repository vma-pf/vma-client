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
  createCage: (model: any) =>
    http.post(endpoint, model),
  updateCage: (model: any, id: string) =>
    http.put(endpoint + `/${id}`, model),
  deleteCage: (id: string) => http.delete(endpoint + `/${id}`),
};
