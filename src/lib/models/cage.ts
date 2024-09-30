type Cage = {
  id: string;
  code: string;
  capacity: number;
  availableQuantity: number;
  description: string;
};

type CreateCageRequest = {
  code: string;
  capacity: number;
  description: string;
};

type UpdateCageRequest = {
  code: string;
  capacity: number;
  availableQuantity: number;
  description: string;
};

export type { Cage, CreateCageRequest, UpdateCageRequest }