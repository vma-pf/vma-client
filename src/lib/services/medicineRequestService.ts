import http from "../http";

const endpoint = "api/medicineRequests";

export const medicineRequestService = {
    getMedicineRequest: (pageIndex: number, pageSize: number) => http.get(endpoint, { params: { pageIndex: pageIndex.toString() || "", pageSize: pageSize.toString() || "" } }),
    getMyMedicineRequest: (pageIndex: number, pageSize: number) => http.get(endpoint + "/my-medicine-requests", { params: { pageIndex: pageIndex.toString() || "", pageSize: pageSize.toString() || "" } }),
    updateStatusApprove: (id: string) => http.put(`${endpoint}/${id}/change-status-approve/`, {}),
    updateStatusReject: (id: string) => http.put(`${endpoint}/${id}/change-status-reject/`, {}),
};