export type ResponseObjectList<T> = {
    isSuccess: boolean;
    data: {
        pageSize: number;
        pageIndex: number;
        totalRecords: number;
        totalPages: number;
        data: T[];
    };
    errorMessage: string | null;
};
export type ResponseObject<T> = {
    isSuccess: boolean;
    data: T;
    errorMessage: string | null;
};
export type ResponseObjectNoPaging<T> = {
    isSuccess: boolean;
    data: T[];
    errorMessage: string | null;
};