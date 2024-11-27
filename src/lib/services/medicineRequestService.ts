import http from "../http";

const endpoint = "api/medicineRequests";

export const medicineRequestService = {
    getMedicineRequest: (pageIndex: number, pageSize: number) => http.get(endpoint, { params: { pageIndex: pageIndex.toString() || "", pageSize: pageSize.toString() || "" } }),
    getMyMedicineRequest: (pageIndex: number, pageSize: number) => http.get(endpoint + "/my-medicine-requests", { params: { pageIndex: pageIndex.toString() || "", pageSize: pageSize.toString() || "" } }),
    updateStatusApprove: (id: string) => http.put(`${endpoint}/${id}/change-status-approve`, {}),
    updateStatusReject: (id: string) => http.put(`${endpoint}/${id}/change-status-reject`, {}),
    changeStatusRequest: (ids: string[]) => http.put(`${endpoint}/change-status-requested`, ids),
    changeStatusRequestEach: (id: string) => http.put(`${endpoint}/${id}/change-status-requested`, {}),
    markPurchaseMedicine: (id: string, medicineId: string) => http.put(`${endpoint}/${id}/medicines/${medicineId}/mark-purchased-medicine`, {}),
};