type Pig = {
  id: string;
  breed: string;
  herdId: string;
  cageId: string;
  weight: number;
  height: number;
  width: number;
  healthStatus: string;
  lastUpdatedAt: string;
  vaccinationDate: string;
  pigCode: string;
  cageCode: string;
};

type CreatePigRequest = {
  breed?: string;
  herdId?: string;
  cageId?: string;
  weight?: number;
  height?: number;
  width?: number;
  healthStatus?: string;
  vaccinationDate?: string;
  pigCode?: string;
  cageCode?: string;
};

type UpdatePigRequest = {
  breed?: string;
  herdId?: string;
  cageId?: string;
  weight?: number;
  height?: number;
  width?: number;
  healthStatus?: string;
  vaccinationDate?: string;
  pigCode?: string;
  cageCode?: string;
};

export type { Pig, CreatePigRequest, UpdatePigRequest };
