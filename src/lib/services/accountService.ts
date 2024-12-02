import http from "../http";

const endpoint = 'api/users';
export const accountService = {
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        }
    }),
    getUsersInFarm: () => http.get(`${endpoint}/vet-assist`),
    create: (request: any) => http.post(endpoint, request),
    activate: (id: string) => http.put(`${endpoint}/${id}/activate`, {}),
    deactivate: (id: string) => http.put(`${endpoint}/${id}/deactivate`, {}),
};