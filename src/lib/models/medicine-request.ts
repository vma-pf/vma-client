export type MedicineRequest = {
    id: string;
    medicineId: string | null;
    newMedicineName: string | null;
    inventoryRequestId: string;
    quantity: number;
    status: string;
    isPurchaseNeeded: boolean;
};