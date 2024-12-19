export type HerdStatistic = {
    numberOfPigsAlive: number;
    numberOfPigsDead: number;
    totalNumberOfHerd: number;
    numberOfPigsHealthNormal: number;
    numberOfPigsHealthSick: number;
};

export type EndHerdStatistic = {
    numberOfPigsAlive: number;
    numberOfPigsDead: number;
    totalNumberOfHerd: number;
    numberOfPigsHealthNormal: number;
    numberOfPigsHealthSick: number;
    avgWeightInStart: number;
    avgHeightInStart: number;
    avgWidthInStart: number;
    avgWeightInEnd: number;
    avgHeightInEnd: number;
    avgWidthInEnd: number;
};