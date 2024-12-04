import { Cage } from "./cage";

export type UpdateHerdRequest = {
    breed: string;
    totalNumber: number;
    expectedEndDate: Date;
    startDate: Date;
};

export type PigAssign = {
    id?: string;
    code?: string;
    gender: string;
    cage?: Cage;
    herdId?: string;
    weight?: number;
    height?: number;
    width?: number;
    note?: string;
};

export type HerdInfo = {
    id: string;
    code: string;
    breed: string;
    totalNumber: number;
    expectedEndDate: string;
    actualEndDate: string;
    startDate: string;
    dateOfBirth: string;
    description: string;
    averageWeight: number;
    status: string;
    isCheckUpToday: boolean;
};
