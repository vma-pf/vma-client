import http from "../http";
import { ResponseObjectList } from "../models/response-object";

export const vaccinationStageService = {
    getPigsInStage: (stageId: string, pageIndex: number, pageSize: number) =>
        http.get<ResponseObjectList<any>>(`vaccination-stages/${stageId}/pig-vaccination-stages`, {
            params: {
                pageIndex: pageIndex?.toString() || "",
                pageSize: pageSize?.toString() || "",
            },
        }),
    updateVaccinationStageStatus: (stageId: string, pigs: string[]) =>
        http.put<ResponseObjectList<any>>(`update-pig-vaccination-stage`, {
            vaccinationStageId: stageId,
            pigIds: pigs,
        }),
};
