import http from "../http";

const endpoint = 'api/users';
export const accountService = {
    getAll: (pageIndex: number, pageSize: number) => http.get(endpoint, {
        params: {
            pageIndex: pageIndex.toString() || "",
            pageSize: pageSize.toString() || "",
        }
    }),
};