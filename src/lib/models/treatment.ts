import { MedicineInStage } from "./vaccination";

export type TreatmentData = {
    id?: string;
    title: string;
    description: string;
    herdId: string;
    startDate: string;
    expectedEndDate: string;
    actualEndDate: string;
    note: string;
    status: string;
    treatmentStages: CreateTreatmentStageProps[];
};

export type CreateTreatmentStageProps = {
    id?: string;
    treatmentPlanId?: string;
    title: string;
    applyStageTime: string;
    timeSpan: string;
    note?: string;
    isDone?: boolean;
    treatmentToDos: { description: string }[];
    inventoryRequest: MedicineInStage;
};

export type CreateTreatmentRequest = {
    treatmentGuideId?: string;
    title: string;
    expectedTimePeriod: string;
    description: string;
    note: string;
    treatmentStages?: [
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
};

export type DiseaseReport = {
    id: string;
    description: string;
    treatmentResult: string;
    cause: string;
    diagnosisDiseaseName: string;
    severityType: string;
    isDone: boolean;
};

export type TreatmentLog = {
    id: string;
    diseaseReportId: string;
    pigId: string;
    treatmentStageId: string;
    implementerId: string;
    isRecovered: boolean;
    descriptionDiseaseReport: string;
    treatmentStageTitle: string;
    pigCode: string;
}
