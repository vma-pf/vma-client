"use client";
import { Accordion, AccordionItem, Button, Card, CardBody, Input, Tooltip, useDisclosure } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { CommonDisease } from "@oursrc/lib/models/common-disease";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { commonDiseasesService } from "@oursrc/lib/services/commonDiseaseService";
import { dateTimeConverter } from "@oursrc/lib/utils";
import { ChevronDown, ChevronUp, Edit, Plus, Search, Trash } from "lucide-react";
import React from "react";
import ModalCommonDisease from "./_modals/modal-common-disease";

const CommonDiseaseGridList = ({ gridColumns = 1 }: { gridColumns: number }) => {
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();

  const [dataList, setDataList] = React.useState<CommonDisease[]>([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<CommonDisease | null>(null);
  const [context, setContext] = React.useState<"create" | "edit" | "detail">("create");
  const [updateId, setUpdateId] = React.useState<string>("");

  React.useEffect(() => {
    if (!isOpenAdd) {
      fetchData();
    }
  }, [page, rowsPerPage, isOpenAdd]);

  //API function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: ResponseObjectList<CommonDisease> = await commonDiseasesService.getByPagination(page, rowsPerPage);
      if (response.isSuccess) {
        setDataList(response.data.data);
        setRowsPerPage(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: e instanceof AggregateError ? e.message : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    } finally {
      setLoading(false);
    }
  };
  const onEdit = async (data: CommonDisease) => {
    setContext("edit");
    setUpdateId(data.id);
    setSelectedData(data);
    onOpenEdit();
  };
  const onDelete = async (data: CommonDisease) => {
    try {
      const response = await commonDiseasesService.delete(data.id);
      if (response.isSuccess) {
        fetchData();
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (e) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: e instanceof AggregateError ? e.message : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    }
  };
  const onSearchChange = (e: string) => {
    if (e === "") {
      fetchData();
    } else {
      const filterData = dataList.filter((x: CommonDisease) => x.title.includes(e) || x.symptom.includes(e) || x.description.includes(e));
      setDataList(filterData);
    }
  };
  return (
    <div>
      <Card className="mx-2 mb-2">
        <CardBody className="flex flex-row justify-between">
          <div className="w-1/2">
            <Input isClearable className="w-full" placeholder="Tìm kiếm theo tên ..." startContent={<Search />} onValueChange={(e) => onSearchChange(e)} />
          </div>
          <Button color="primary" endContent={<Plus />} onPress={onOpenAdd}>
            Tạo mới
          </Button>
        </CardBody>
      </Card>
      {dataList.length > 0 ? (
        <Accordion showDivider={false} className={`p-2 grid grid-cols-${gridColumns} gap-4 w-full`} variant="splitted">
          {dataList.map((x: CommonDisease, index: number) => (
            <AccordionItem
              key={x.id}
              title={
                <div className="flex">
                  <span>{x.title}</span>
                </div>
              }
              subtitle={
                <strong className="text-primary">
                  <span className="text-danger">Triệu chứng: </span>
                  {x.symptom}
                </strong>
              }
            >
              <div className="flex justify-between">
                <div>
                  <strong>Tên bệnh: </strong>
                  <span>{x.title}</span>
                </div>
                <div className="flex flex-row">
                  <Tooltip content="Chỉnh sửa" color="primary">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Edit
                        onClick={() => {
                          onEdit(x);
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Tooltip content="Xóa" color="danger">
                    <span className="ml-1 text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Trash
                        color="#ff0000"
                        onClick={() => {
                          onDelete(x);
                        }}
                      />
                    </span>
                  </Tooltip>
                </div>
              </div>
              <div>
                <strong>Mức độ: </strong>
                <span>{x.diseaseType}</span>
              </div>
              <div>
                <strong>Tạo lúc: </strong>
                <span>{dateTimeConverter(x.createdAt)}</span>
              </div>
              <div>
                <strong>Lần cuối cập nhật: </strong>
                <span>{dateTimeConverter(x.lastUpdatedAt)}</span>
              </div>
              <div>
                <strong>Mô tả bệnh: </strong>
                <span>{x.description}</span>
              </div>
              <div>
                <strong>Hướng dẫn chữa bệnh: </strong>
                <p className="whitespace-pre-line">{x.treatment}</p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center">Không có dữ liệu</div>
      )}
      {isOpenAdd && <ModalCommonDisease isOpen={isOpenAdd} onClose={onCloseAdd} context="create" />}
      {isOpenEdit && <ModalCommonDisease isOpen={isOpenEdit} onClose={onCloseEdit} context="edit" data={selectedData || undefined} />}
      {isOpenDelete && <ModalCommonDisease isOpen={isOpenDelete} onClose={onCloseDelete} context="delete" data={selectedData || undefined} />}
    </div>
  );
};
export default CommonDiseaseGridList;
