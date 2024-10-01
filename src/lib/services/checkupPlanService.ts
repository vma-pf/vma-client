import http from "@oursrc/lib/http";
import { ResponseObject } from "../models/response-object";

const endpoint = "api/checkup-plans";

export const checkupPlanService = {
    createCheckUpPlan: (model: string[]) =>
        http.post<ResponseObject<any>>(endpoint, model),
}