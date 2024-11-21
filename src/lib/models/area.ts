import { Cage } from "./cage";

export type Area = {
    id?: string;
    code: string;
    description: string;
    createdAt?: string;
    lastUpdatedAt?: string;
    cages?: Cage[];
};