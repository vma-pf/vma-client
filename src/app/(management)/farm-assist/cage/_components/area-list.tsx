import { Button, Card, CardBody, CardFooter, CardHeader, Image, Input, Skeleton, Tooltip, useDisclosure } from "@nextui-org/react";
import { Area } from "@oursrc/lib/models/area";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { areaService } from "@oursrc/lib/services/areaService";
import { SearchIcon } from "lucide-react";
import React from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import AddEditArea from "./_modals/add-edit-area";

const AreaList = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [areaList, setAreaList] = React.useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = React.useState<Area | null>(null);

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
    if (!isOpenAdd && !isOpenEdit && !isOpenDelete) fetchAreas();
  }, [isOpenAdd, isOpenEdit, isOpenDelete]);
  return (
    <div>
      <div className="mb-3 flex justify-between items-end">
        <div className="w-3/4">
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
        <Button color="primary" variant="solid" endContent={<IoAddOutline />} onPress={onOpenAdd}>
          Thêm khu vực
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-5">
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
                <CardFooter className="flex justify-center gap-2">
                  <Tooltip content="Chỉnh sửa" closeDelay={200}>
                    <Button
                      color="warning"
                      isIconOnly
                      variant="solid"
                      onPress={() => {
                        setSelectedArea(area);
                        onOpenEdit();
                      }}
                    >
                      <FaRegEdit />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Xóa" closeDelay={200}>
                    <Button
                      color="danger"
                      isIconOnly
                      variant="solid"
                      onPress={() => {
                        onOpenDelete();
                        setSelectedArea(area);
                      }}
                    >
                      <FaRegTrashAlt />
                    </Button>
                  </Tooltip>
                </CardFooter>
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
      {isOpenEdit && <AddEditArea key={1} operation="edit" isOpen={isOpenEdit} onClose={onCloseEdit} area={selectedArea || undefined} />}
      {isOpenAdd && <AddEditArea key={2} operation="add" isOpen={isOpenAdd} onClose={onCloseAdd} />}
      {isOpenDelete && <AddEditArea key={3} operation="delete" isOpen={isOpenDelete} onClose={onCloseDelete} area={selectedArea || undefined} />}
    </div>
  );
};

export default AreaList;
