import http from "../http";

const endpoint = "api/diseaseReports";
export const diseaseReportService = {
    createDiseaseReport: (data: any) =>
        http.post(endpoint, data)
};