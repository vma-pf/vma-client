"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  SortDescriptor,
  Selection,
  Pagination,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { VaccinationData } from "../../lib/models/vaccination";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { HiChevronDown } from "react-icons/hi";
import { Search } from "lucide-react";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang thực hiện", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

const columns = [
  { name: "Tên lịch", uid: "title", sortable: true },
  { name: "Ngày bắt đầu", uid: "startDate", sortable: true },
  { name: "Ngày kết thúc (dự kiến)", uid: "expectedEndDate", sortable: true },
  { name: "Tình trạng", uid: "status", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["title", "startDate", "expectedEndDate", "status"];

const VaccinationList = ({
  selectedVaccination,
  setSelectedVaccination,
  type,
}: {
  selectedVaccination: Set<string>;
  setSelectedVaccination: any;
  type: "all" | "my";
}) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [vaccinationList, setVaccinationList] = React.useState<VaccinationData[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set([]));
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredVaccination: VaccinationData[] = [...vaccinationList];

    if (hasSearchFilter) {
      filteredVaccination = filteredVaccination.filter((vaccination) => vaccination.title.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== 0) {
      filteredVaccination = filteredVaccination.filter((vaccination) => Array.from(statusFilter).includes(vaccination.status as unknown as string));
    }

    return filteredVaccination;
  }, [vaccinationList, filterValue, statusFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: VaccinationData, b: VaccinationData) => {
      const first = a[sortDescriptor.column as keyof VaccinationData] as unknown as number;
      const second = b[sortDescriptor.column as keyof VaccinationData] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<VaccinationData> =
        type === "all" ? await vaccinationService.getAllVaccinationPlan(page, rowsPerPage) : await vaccinationService.getMyVaccinationPlan(page, rowsPerPage);
      if (res && res.isSuccess) {
        setVaccinationList(res.data.data || []);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalRecords);
      } else {
        console.log("Error: ", res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(selectedKeys);

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

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
            placeholder="Tìm kiếm theo tiêu đề..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
                  Tình trạng
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status: any) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name.toUpperCase()}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
                  Cột
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, vaccinationList.length, hasSearchFilter]);

  const renderCell = React.useCallback((data: VaccinationData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof VaccinationData];

    switch (columnKey) {
      case "status":
        return <p className={`${statusColorMap.find((status) => status.status === String(data.status))?.color} text-center`}>{cellValue.toString()}</p>;
      case "startDate":
      case "expectedEndDate":
        return dateConverter(cellValue.toString());
      default:
        return cellValue?.toString();
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span> */}
        <Pagination isCompact showControls showShadow color="primary" page={page} total={totalPages} onChange={setPage} />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
        </div> */}
      </div>
    );
  }, [filteredItems.length, page, totalPages, hasSearchFilter]);
  return (
    <Table
      color="primary"
      classNames={{
        wrapper: "max-h-[250px] overflow-auto",
      }}
      selectionMode="single"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      //   align="center"
      selectedKeys={selectedVaccination}
      onSelectionChange={setSelectedVaccination}
      aria-label="Example static collection table"
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
    >
      <TableHeader columns={headerColumns}>
        {(column: any) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
            {column.name.toUpperCase()}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Không có kết quả"} loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={sortedItems}>
        {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  );
};

export default VaccinationList;
