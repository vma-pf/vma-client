import http from "../http";

const endpoint = "api/suppliers";
export const supplierService = {
    getAllSupplier: (pageIndex: number, pageSize: number) =>
        http.get(endpoint, {
            params: {
                pageIndex: pageIndex?.toString() || "",
                pageSize: pageSize?.toString() || "",
            },
        }),
};