import http from "../http";

export const scheduleService = {
    getAllSchedules: () => http.get("api/all-schedules"),
    getMySchedules: () => http.get("api/my-schedule"),
}