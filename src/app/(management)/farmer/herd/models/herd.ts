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

type HerdInfo = {
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

export type { CreateHerdRequest, UpdateHerdRequest, HerdInfo };
