import { Invoice } from "./invoice";
import { Medicine } from "./medicine";

export type BatchCreateProps = {
    id: string;
    medicineId: string | null;
    invoiceId: string | null;
    quantity: number | null;
    expiredAt: string | null;
    medicine?: Medicine | null;
}

export type Batch = {
    medicineId: string;
    invoiceId: string;
    importedDate: string;
    expiredAt: string;
    quantity: number;
    remainingQuantity: number;
    medicine: Medicine | null;
    invoice: Invoice | null;
}