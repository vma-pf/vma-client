type CreateHerdRequest = {
  breed: string;
  totalNumber: number;
  expectedEndDate: Date;
  startDate: Date;
};

type UpdateHerdRequest = {
  breed: string;
  totalNumber: number;
  expectedEndDate: Date;
  startDate: Date;
};

export type { CreateHerdRequest, UpdateHerdRequest }
