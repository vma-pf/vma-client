import http from "../http";
import { ResponseObject } from "../models/response-object";

export const notificationService = {
    getNotification: () =>
        http.get<ResponseObject<any>>(`notifications`),
    sendWariningAI: (model: {cageId?: string; content: string; image: Blob}) => {
        const formData = new FormData();
        formData.append("cageId", model.cageId ?? "");
        formData.append("content", model.content);
        formData.append("image", model.image);

        return http.post("api/notification/warning-AI", formData);
    }
}