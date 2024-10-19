import { MedicineInStage } from "./vaccination";

export type TreatmentData = {
    id: string;
    title: string;
    description: string;
    herdId: string;
    startDate: string;
    expectedEndDate: string;
    actualEndDate: string;
    note: string;
    status: number;
    treatmentStages: TreatmentStageProps[];
};

export type TreatmentStageProps = {
    id?: string;
    treatmentPlanId?: string;
    title: string;
    applyStageTime: string;
    timeSpan: string;
    isDone?: boolean;
    treatmentToDos: { description: string }[];
    inventoryRequest: MedicineInStage;
};

export type CreateTreatmentRequest = {
    title: string;
    startDate: string;
    expectedEndDate: string;
    actualEndDate: string;
    note: string;
    createTreatmentStages: [
        {
            title: string;
            timeSpan: string;
            applyStageTime: string;
            isDone: boolean;
            treatmentToDos: [
                {
                    description: string;
                }
            ];
        }
    ];
    isApplyToAll: boolean;
    herdId: string;
    pigIds: [];
};

export type DiseaseReport = {
    id: string;
    description: string;
    treatmentResult: string;
    totalTreatmentTime: string;
    isDone: boolean;
}
