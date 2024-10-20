import http from "../http";

const endpoint = "api/batches";
export const batchService = {
    getBatchByMedicineId: (medicineId: string, pageIndex: number, pageSize: number) =>
        http.get(endpoint + "/medicine/" + medicineId, {
            params: {
                pageIndex: pageIndex?.toString() || "",
                pageSize: pageSize?.toString() || "",
            },
        }
        ),
};