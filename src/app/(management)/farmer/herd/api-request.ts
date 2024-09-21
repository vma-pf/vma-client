import http from "@oursrc/lib/http";

export const apiRequest = {
  createHerd: (model: HerdRequest) =>
    http.post("api/herds", {
      breed: model.breed,
      totalNumber: model.totalNumber,
      startDate: model.startDate,
      expectedEndDate: model.expectedEndDate
    }),
};
