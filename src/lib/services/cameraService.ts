import http from "../http";
import { Camera } from "../models/camera";

const endpoint = "api/cameras";
export const cameraService = {
    liveCamera: (cameraId: string) => http.get(`${endpoint}/${cameraId}/live`),
    stopLiveCamera: (cameraId: string) => http.post(`${endpoint}/${cameraId}/stop-live`, {}),
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, {
        params: {
            pageIndex: pageIndex.toString() ?? "",
            pageSize: pageSize.toString() ?? "",
        }
    }),
    create: (camera: Camera) => http.post(endpoint, camera),
    update: (id: string, camera: Camera) => http.put(`${endpoint}/${id}`, camera),
};