"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  SortDescriptor,
  Table,
  Tooltip,
  Selection,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { Batch } from "@oursrc/lib/models/batch";
import { Medicine } from "@oursrc/lib/models/medicine";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { batchService } from "@oursrc/lib/services/batchService";
import { dateTimeConverter } from "@oursrc/lib/utils";
import { EyeIcon, Plus, Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi2";

const columns = [
  { name: "TÊN THUỐC", uid: "medicineId", sortable: true },
  {
    name: "HÓA ĐƠN",
    uid: "invoiceId",
    sortable: true,
  },
  { name: "SỐ LƯỢNG", uid: "quantity", sortable: true },
  { name: "CÒN LẠI", uid: "remainingQuantity", sortable: true },
  { name: "NGÀY NHẬP", uid: "importedDate", sortable: true },
  { name: "NGÀY HẾT HẠN", uid: "expiredAt", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["invoiceId", "quantity", "remainingQuantity", "importedDate", "expiredAt"];

const BatchList = ({ isOpen, onClose, medicine }: { isOpen: boolean; onClose: () => void; medicine: Medicine | undefined }) => {
  //Table field
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  //   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastUpdatedAt",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);
  const [batchList, setBatchList] = React.useState<Batch[]>([]);

  const filteredItems = React.useMemo(() => {
    let filteredBatches: Batch[] = [...batchList];

    if (hasSearchFilter) {
      filteredBatches = filteredBatches.filter((batch) => batch.importedDate.toLowerCase().includes(filterValue.toLowerCase()));
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredMedicines = filteredMedicines.filter((medicine) => Array.from(statusFilter).includes(medicine.name as string));
    // }
    return filteredBatches;
  }, [batchList, filterValue]);

  const [loading, setLoading] = React.useState(false);

  // Use Effect
  React.useEffect(() => {
    // onClose();
    fetchData();
  }, [page, rowsPerPage]);

  // API function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: ResponseObjectList<Batch> = await batchService.getBatchByMedicineId(medicine?.id || "", page, rowsPerPage);
      if (response.isSuccess) {
        setBatchList(response.data.data);
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

  React.useEffect(() => {
    // fetchData();
  }, [page, rowsPerPage]);

  const items = React.useMemo(() => {
    return filteredItems;
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Batch, b: Batch) => {
      const first = a[sortDescriptor.column as keyof Batch] as number;
      const second = b[sortDescriptor.column as keyof Batch] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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
            placeholder="Tìm kiếm theo tên thuốc..."
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
                    {column.name.toUpperCase()}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, batchList.length, hasSearchFilter]);

  const renderCell = React.useCallback((data: Batch, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Batch];

    switch (columnKey) {
      case "medicineId":
      case "invoiceId":
        return (
          <Tooltip showArrow={true} content={String(cellValue)} color="primary" closeDelay={300}>
            <p className="truncate">{String(cellValue)}</p>
          </Tooltip>
        );
      case "importedDate":
      case "expiredAt":
        return dateTimeConverter(cellValue as string);
      default:
        return cellValue?.toString();
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span> */}
        <Pagination isCompact showControls showShadow color="primary" page={page} total={totalPages} onChange={setPage} />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2"></div> */}
      </div>
    );
  }, [selectedKeys, items.length, page, totalPages, hasSearchFilter]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <ModalHeader>
          <p className="text-2xl font-bold">Danh sách các lô của thuốc {medicine?.name || ""}</p>
        </ModalHeader>
        <ModalBody>
          <Table
            color="primary"
            layout="fixed"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[750px] w-fit overflow-auto",
            }}
            selectedKeys={selectedKeys}
            // selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column: any) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
                  {column.name.toUpperCase()}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={loading ? "loading" : "idle"}>
              {(item) => (
                <TableRow key={item.invoiceId} className="h-12">
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BatchList;
