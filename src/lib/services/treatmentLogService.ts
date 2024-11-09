import http from "../http";

const endpoint = "api/treatmentLogs";

export const treatmentLogService = {
    getTreatmentLogs: (id: string, pageIndex: number, pageSize: number) => http.get(endpoint + `/treatment-stage/${id}`, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        }
    }),
    checkLogCovered: (stageId: string, pigs: string[]) => http.put(endpoint + `/check-list-covered`, {
        treatmentStageId: stageId,
        pigIds: pigs,
    }),
};