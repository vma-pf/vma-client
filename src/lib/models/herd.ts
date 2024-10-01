import { Cage } from "./cage";

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
    description: string;
    averageWeight: number;
    status: number;
};

type Herd = {
  id: string;
  code: string;
  breed: string;
  totalNumber: number;
  expectedEndDate: string;
  actualEndDate: string;
  startDate: string;
  description: string;
  averageWeight: number;
  status: number;
};
type CreateHerdRequest = {
  code: string;
  breed: string;
  totalNumber: number;
  expectedEndDate: Date;
  startDate: Date;
  description: string;
};

type UpdateHerdRequest = {
  breed: string;
  totalNumber: number;
  expectedEndDate: Date;
  startDate: Date;
};

export type { CreateHerdRequest, UpdateHerdRequest, Herd };
