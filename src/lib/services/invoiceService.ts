import http from "../http";

const endpoint = "api/invoices";
export const invoiceService = {
    createInvoiceBatch: (title: string, supplierId: string, images: Blob, jsonBatches: any) => {
        const formData = new FormData();
        formData.append("Title", title);
        formData.append("SupplierId", supplierId);
        formData.append("Images", images); // Make sure this is a file/blob object
        formData.append("JsonBatches", JSON.stringify(jsonBatches)); // Convert your batch data to a string

        return http.post(endpoint + "/invoice-batch", formData);
    },
};
