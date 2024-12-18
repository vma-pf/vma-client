import http from "../http";

const endpoint = "api/diseaseReports";
export const diseaseReportService = {
    createDiseaseReport: (data: any) =>
        http.post(endpoint, data),
    getDiseaseReportPigs: (month: number, page: number, pageSize: number) =>
        http.get(`${endpoint}/disease-reports-statistic`, {
            params: {
                month: month.toString() ?? "",
                page: page.toString() ?? "",
                pageSize: pageSize.toString() ?? "",
            },
        }),
    update: (id: string, data: boolean) => http.put(`${endpoint}/${id}/update-result?isRecovered=${data}`, {}),
};