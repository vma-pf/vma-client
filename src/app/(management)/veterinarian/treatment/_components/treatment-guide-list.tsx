"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { TreatmentGuide } from "@oursrc/lib/models/treatment-guide";
import React from "react";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { treatmentGuideService } from "@oursrc/lib/services/treatmentGuideService";
import { Edit, EyeIcon, Pen, Plus, Search, Trash } from "lucide-react";
import { HiChevronDown } from "react-icons/hi2";
import { capitalize } from "@oursrc/components/utils";
import ModalTreamentGuide from "./_modals/treatment-guide-modal";

const columns = [
  { name: "TÊN BỆNH", uid: "diseaseTitle", sortable: true },
  { name: "MÔ TẢ BỆNH", uid: "diseaseDescription", sortable: true },
  { name: "TRIỆU CHỨNG", uid: "diseaseSymptoms", sortable: true },
  { name: "TIÊU ĐỀ", uid: "treatmentTitle", sortable: true },
  { name: "MÔ TẢ", uid: "treatmentDescription", sortable: true },
  { name: "HƯỚNG DẪN CHỮA BỆNH", uid: "cure", sortable: true },
  { name: "MỨC ĐỘ", uid: "diseaseType", sortable: true },
  { name: "TẠO BỞI", uid: "authorName", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];
const INITIAL_VISIBLE_COLUMNS = [
  "diseaseTitle",
  "diseaseDescription",
  "diseaseSymptoms",
  "treatmentTitle",
  "treatmentDescription",
  "cure",
  "diseaseType",
  "authorName",
  "actions",
];
const statusOptions = [{ name: "", uid: "" }];

const TreatmentGuideList = ({
  selectedGuideId,
  setSelectedGuideId,
}: {
  selectedGuideId: string | undefined;
  setSelectedGuideId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { toast } = useToast();

  //Modal field
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const [updateId, setUpdateId] = React.useState<string>("");
  const [selectedData, setSelectedData] = React.useState<TreatmentGuide | null>(null);
  const [context, setContext] = React.useState<"create" | "edit" | "detail">("create");
  const [submitDone, setSubmitDone] = React.useState<boolean>(false);

  //Table field
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);
  const [dataList, setDataList] = React.useState<TreatmentGuide[]>([]);

  const filteredItems = React.useMemo(() => {
    let filteredData: TreatmentGuide[] = [...dataList];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((data) => data.diseaseTitle.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredData = filteredData.filter((data) => Array.from(statusFilter).includes(data.diseaseTitle as string));
    }
    return filteredData;
  }, [dataList, filterValue, statusFilter]);

  const [loading, setLoading] = React.useState(false);

  //Use Effect
  // React.useEffect(() => {
  //   if (submitDone) {
  //     onClose();
  //     fetchData();
  //     setSubmitDone(false);
  //   }
  // }, [submitDone]);

  React.useEffect(() => {
    if (!isOpenAdd) {
      fetchData();
    }
  }, [page, rowsPerPage, isOpenAdd]);

  //API function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: ResponseObjectList<TreatmentGuide> = await treatmentGuideService.getByPagination(page, rowsPerPage);
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

  const onEdit = async (data: TreatmentGuide) => {
    setContext("edit");
    setUpdateId(data.id);
    setSelectedData(data);
    onOpenEdit();
  };

  const onDelete = async (data: TreatmentGuide) => {
    try {
      const response = await treatmentGuideService.delete(data.id);
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

  const items = React.useMemo(() => {
    return filteredItems;
  }, [filteredItems]);

  // const sortedItems = React.useMemo(() => {
  //   return [...items].sort((a: TreatmentGuide, b: TreatmentGuide) => {
  //     const first = a[sortDescriptor.column as keyof TreatmentGuide] as number;
  //     const second = b[sortDescriptor.column as keyof TreatmentGuide] as number;
  //     const cmp = first < second ? -1 : first > second ? 1 : 0;

  //     return sortDescriptor.direction === "descending" ? -cmp : cmp;
  //   });
  // }, [sortDescriptor, items]);

  //call api
  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);
  //call api
  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Tìm kiếm theo tên ..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
                  Hiển thị cột
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<Plus />} onPress={onOpenAdd}>
              Tạo mới
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Tổng cộng {totalRecords} kết quả</span>
          <label className="flex items-center text-default-400 text-small">
            Số hàng mỗi trang:
            <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, dataList.length, hasSearchFilter]);

  const renderCell = React.useCallback((data: TreatmentGuide, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof TreatmentGuide];

    switch (columnKey) {
      case "diseaseTitle":
      case "diseaseDescription":
      case "diseaseSymptoms":
      case "treatmentTitle":
      case "treatmentDescription":
      case "diseaseType":
      case "authorName":
        return (
          <Tooltip showArrow={true} content={cellValue} color="primary" closeDelay={300}>
            <p className="truncate">{cellValue}</p>
          </Tooltip>
        );
      case "cure":
        return <p className="whitespace-pre-line">{cellValue}</p>;
      case "actions":
        return (
          <div className="flex justify-end items-center gap-2">
            {/* <Tooltip content="Chi tiết" color="primary">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon
                    onClick={() => {
                      onOpenDetail();
                      setSelectedData(data);
                    }}
                  />
                </span>
              </Tooltip> */}
            <Tooltip content="Chỉnh sửa" color="primary">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Edit
                  onClick={() => {
                    onEdit(data);
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip content="Xóa" color="danger">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Trash
                  color="#ff0000"
                  onClick={() => {
                    onDelete(data);
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={totalPages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [selectedKeys, items.length, page, totalPages, hasSearchFilter]);

  return (
    <div>
      <Table
        color="primary"
        layout="fixed"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[750px]",
        }}
        selectionMode="single"
        selectedKeys={selectedGuideId ? new Set([selectedGuideId]) : new Set<string>()}
        onSelectionChange={(keys) => {
          const selectedKeysArray = Array.from(keys);
          const selectedTreatmentGuide = dataList.filter((data) => data.id && selectedKeysArray.includes(data.id));
          setSelectedGuideId(selectedTreatmentGuide[0].id);
          localStorage.setItem("treatmentGuideId", selectedTreatmentGuide[0].id || "");
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column: any) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
              {column.name.toUpperCase()}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Không có kết quả"} items={filteredItems} loadingContent={<Spinner />} loadingState={loading ? "loading" : "idle"}>
          {(item) => (
            <TableRow key={item.id} className="h-12">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isOpenAdd && <ModalTreamentGuide isOpen={isOpenAdd} onClose={onCloseAdd} context="create" />}
      {isOpenEdit && <ModalTreamentGuide isOpen={isOpenEdit} onClose={onCloseEdit} context="edit" data={selectedData || undefined} />}
      {isOpenDelete && <ModalTreamentGuide isOpen={isOpenDelete} onClose={onCloseDelete} context="delete" data={selectedData || undefined} />}
    </div>
  );
};
export default TreatmentGuideList;
