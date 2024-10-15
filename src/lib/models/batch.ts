import { Medicine } from "./medicine";

export type BatchCreateProps = {
    id: string;
    medicineId: string | null;
    invoiceId: string | null;
    quantity: number | null;
    expiredAt: string | null;
    medicine?: Medicine | null;
}