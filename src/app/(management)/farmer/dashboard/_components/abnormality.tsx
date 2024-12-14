import { Button, Divider, Spinner } from "@nextui-org/react";
import { Abnormality } from "@oursrc/lib/models/abnormality";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { abnormalityService } from "@oursrc/lib/services/abnormalityService";
import React from "react";
import { GoDotFill } from "react-icons/go";
import { IoIosAlert } from "react-icons/io";

const Abnormal = () => {
  const [abnormalities, setAbnormalities] = React.useState<Abnormality[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loadMore, setLoadMore] = React.useState(false);
  const abnormalityValue = React.useMemo(() => {
    const items: Abnormality[] = [...abnormalities];
    return items;
  }, [abnormalities]);

  const fetchAbnormalities = async () => {
    try {
      setLoadMore(true);
      const res: ResponseObjectList<Abnormality> = await abnormalityService.getAll(page, 4);
      if (res.isSuccess) {
        setAbnormalities((prev) => [...prev, ...res.data.data]);
        setPage(res.data.pageIndex);
        setTotalPages(res.data.totalPages);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoadMore(false);
    }
  };

  const checkTime = (msg: Abnormality) => {
    const utcOffset = 7 * 60 * 60 * 1000;
    const diffTime = new Date().getTime() + utcOffset - new Date(msg.createdAt).getTime();
    const minutes = Math.floor(diffTime / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const timeAgo =
      minutes < 60
        ? `${minutes} phút trước`
        : hours < 24
        ? `${hours} giờ trước`
        : days < 7
        ? `${days} ngày trước`
        : days < 30
        ? `${days} tuần trước`
        : `${days} tháng trước`;

    return timeAgo;
  };
  React.useEffect(() => {
    fetchAbnormalities();
  }, [page]);
  return (
    <div className="my-2 overflow-auto">
      {abnormalityValue.length > 0 ? (
        abnormalityValue.map((abnormality) => (
          <div key={abnormality.id}>
            <div className="mx-2 my-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
              <div className="flex justify-start items-center">
                <IoIosAlert className="mr-3 text-danger-500" size={30} />
                <div className="text-start">
                  <p className="">
                    Chuồng <strong>{abnormality.cageCode}</strong>
                  </p>
                  <p className="mt-2">{abnormality.title}</p>
                  <small className="font-bold">{abnormality.description}</small>
                  <p className="text-zinc-400 text-sm">{checkTime(abnormality).toString()}</p>
                </div>
              </div>
              {(checkTime(abnormality).toString().includes("phút") || checkTime(abnormality).toString().includes("giờ")) && <GoDotFill className="text-blue-500" />}
            </div>
            <Divider className="my-2" orientation="horizontal" />
          </div>
        ))
      ) : (
        <p className="text-center">Không có dấu hiệu bất thường</p>
      )}
      {page < totalPages &&
        (loadMore ? (
          <div className="flex w-full justify-center">
            <Spinner color="primary" />
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <Button variant="light" size="sm" color="default" onPress={() => setPage(page + 1)}>
              Xem thêm
            </Button>
          </div>
        ))}
    </div>
  );
};

export default Abnormal;
