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

type Pig = {
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

type Cage = {
  id: string;
  code: string;
  description: string;
  capacity: number;
  availableQuantity: number;
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

export type { CreateHerdRequest, UpdateHerdRequest, HerdInfo, Pig, Cage };
