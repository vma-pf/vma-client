type Cage = {
  id?: string;
  code: string;
  capacity: number;
  availableQuantity?: number;
  description: string;
  cameraId?: string;
  width?: number;
  height?: number;
  length?: number;
  areaId?: string;
  areaCode?: string;
};

type Activity = {
  id: string;
  timeStamp: string;
  stationary: string;
  moving: string;
  feeding: string;
  cageId: string;
  isDeleted: boolean;
};

type ActivityStatistic = {
  percentageOfStationary: number;
  percentageOfMoving: number;
  percentageOfFeeding: number;
};

export type { Cage, Activity, ActivityStatistic };