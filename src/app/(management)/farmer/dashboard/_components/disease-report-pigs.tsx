import { Button, Spinner } from "@nextui-org/react";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { diseaseReportService } from "@oursrc/lib/services/diseaseReportService";
import React from "react";

type DiseaseReportPigs = {
  diseaseReportId: string;
  numberOfPigs: number;
  diseaseName: string | null;
};

const DiseaseReportPigs = () => {
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [loadMore, setLoadMore] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [diseaseReportPigs, setDiseaseReportPigs] = React.useState<DiseaseReportPigs[]>([]);
  const fetchData = async () => {
    try {
      setLoadMore(true);
      const res: ResponseObjectList<DiseaseReportPigs> = await diseaseReportService.getDiseaseReportPigs(1, 1, 10);
      if (res.isSuccess) {
        setDiseaseReportPigs(res.data.data);
        setTotalPages(res.data.totalPages);
        setRowsPerPage(res.data.pageSize);
        if (res.data.totalPages === 1) {
          setHasMore(false);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoadMore(false);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, [rowsPerPage]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-xl font-bold">Danh sách bệnh thường gặp ở heo</p>
      </div>
      {diseaseReportPigs.length <= 0 ? (
        <div className="text-center">Không có bệnh</div>
      ) : (
        <div>
          {diseaseReportPigs.map((item, index) => (
            <div key={index} className="mx-2 my-3 hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
              <p className="text-lg font-semibold">{item.diseaseName ?? "Tên bệnh"}</p>
              <p className="text-sm">
                Số heo bị bệnh: <span>{item.numberOfPigs ?? 0} con</span>
              </p>
            </div>
          ))}
          {hasMore && (
            <div className="flex justify-center">
              {loadMore ? (
                <Spinner color="primary" />
              ) : (
                <Button className="w-full" variant="light" size="sm" color="default" onPress={() => setRowsPerPage(rowsPerPage + 5)}>
                  Xem thêm
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseReportPigs;
