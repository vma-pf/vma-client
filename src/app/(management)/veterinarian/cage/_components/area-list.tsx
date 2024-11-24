import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Skeleton, Tooltip, useDisclosure } from "@nextui-org/react";
import { Area } from "@oursrc/lib/models/area";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { areaService } from "@oursrc/lib/services/areaService";
import { SearchIcon } from "lucide-react";
import React from "react";

const AreaList = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [areaList, setAreaList] = React.useState<Area[]>([]);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Area> = await areaService.getAll(1, 1000);
      if (res.isSuccess) {
        setAreaList(res.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchAreas();
  }, []);
  return (
    <div>
      <div className="mb-5">
        <p className="text-2xl mb-3 font-bold ">Danh sách Khu vực trong trang trại</p>
        <Input
          label="Tìm kiếm"
          placeholder="Nhập mã khu vực"
          size="lg"
          labelPlacement="outside"
          startContent={<SearchIcon size={20} />}
          onValueChange={(e) => {
            if (e === "") {
              fetchAreas();
            } else {
              setAreaList(areaList.filter((area) => area.code.includes(e)));
            }
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-5">
        {!isLoading
          ? areaList.map((area, idx) => (
              <Card key={idx} shadow="md">
                <CardHeader>
                  <p className="text-lg m-auto font-semibold">{area.code}</p>
                </CardHeader>
                <CardBody className="p-2 mx-auto">
                  <Image className="mx-auto" width={200} alt="area" src="https://s.alicdn.com/@sc04/kf/H728f3a37513d4379be01ae6cb8628e980.jpg_300x300.jpg" />
                  <p className="text-center">{area.description}</p>
                </CardBody>
              </Card>
            ))
          : [...Array(8)].map((_, idx) => (
              <div key={idx} className="m-2 border-2 rounded-lg">
                <Skeleton className="rounded-lg">
                  <div className="h-72 w-full"></div>
                </Skeleton>
              </div>
            ))}
      </div>
    </div>
  );
};

export default AreaList;
