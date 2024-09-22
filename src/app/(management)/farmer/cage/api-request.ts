import http from "@oursrc/lib/http";

export const apiRequest = {
  createCage: (model: CageRequest) =>
    http.post("api/cages", {
      code: model.code,
      capacity: model.capacity,
      description: model.description,
    }),
};
