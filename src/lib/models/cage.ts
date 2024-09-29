type Cage = {
  id: string,
  code: string,
  capacity: number,
  availableQuantity: number,
  desciption: string
};

type CreateCageRequest = {
  code: string,
  capacity: number,
  availableQuantity: number,
  desciption: string
};

type UpdateCageRequest = {
  code: string,
  capacity: number,
  availableQuantity: number,
  desciption: string
};

export type { Cage, CreateCageRequest, UpdateCageRequest }