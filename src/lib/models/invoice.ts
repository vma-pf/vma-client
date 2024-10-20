import { Batch } from "./batch";

export type Invoice = {
    id: string;
    title: string;
    supplierId: string;
    arrivedAt: string;
    batches?: Batch[];
    invoiceImages: [
        {
            invoiceId: string;
            imageUrl: string;
            id: string;
        }
    ]
    supplier?: {
        name: string;
        address: string;
        id: string;
    }
}