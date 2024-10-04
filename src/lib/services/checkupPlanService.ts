import http from "@oursrc/lib/http";
import { ResponseObject } from "../models/response-object";

const endpoint = "api/create-checkup-plan";

export const checkupPlanService = {
    createCheckUpPlan: (id: string, dates: string[]) =>
        http.post<ResponseObject<any>>(endpoint, {
            herdId: id,
            checkupDates: dates,
        }),
}