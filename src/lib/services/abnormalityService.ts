import http from "../http";

const endpoint = 'api/abnormalities';
export const abnormalityService = {
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, {
        params: { pageIndex: pageIndex.toString() || "", pageSize: pageSize.toString() || "" }
    }),
    getByCageId: (cageId: string, pageSize: number, pageIndex: number) => http.get(`${endpoint}/cage/${cageId}`, {
        params: { pageIndex: pageIndex.toString() || "", pageSize: pageSize.toString() || "" }
    }),
    getCommonDiseaseById: (id: string) => http.get(`${endpoint}/${id}/common-diseases`),
};