import http from "../http";
import { ResponseObject } from "../models/response-object";

export const notificationService = {
    getNotification: () =>
        http.get<ResponseObject<any>>(`notifications`),
}