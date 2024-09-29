export type ListResponse<T> = {
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