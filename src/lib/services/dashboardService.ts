import http from "../http";

const endpoint = "api/dashboards";
export const dashboardService = {
    getDashboard: () => http.get(`${endpoint}/overview-farm`),
}