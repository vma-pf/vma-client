import http from "../http";
import { CreateMonitorDevelopment } from "../models/monitor-development";

const endpoint = "api/monitoring-logs";
export const monitorDevelopmentLogService = {
    getMonitoringLogsByPigId: (pigId: string, pageIndex: number, pageSize: number) =>
        http.get(`pigs/${pigId}/monitoring-logs`, {
            params: {
                pageIndex: pageIndex.toString() || "",
                pageSize: pageSize.toString() || "",
            }
        }),

    createMonitoringLog: (data: CreateMonitorDevelopment) => http.post(endpoint, data),
}