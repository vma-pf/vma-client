import http from "../http";

const endpoint = "api/treatmentStages";
export const treatmentStageService = {
    getMedicineInStage: (id: string) => http.get(endpoint + `/${id}/medicines`),
}