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
    avgWeightInEnd: number;
};