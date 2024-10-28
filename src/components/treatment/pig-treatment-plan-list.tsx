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
  Input,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import React, { useMemo } from "react";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { TreatmentData } from "@oursrc/lib/models/treatment";
import { treatmentGuideService } from "@oursrc/lib/services/treatmentGuideService";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { Search } from "lucide-react";
import { HiChevronDown } from "react-icons/hi2";
import { pigService } from "@oursrc/lib/services/pigService";

const columns = [
  { name: "tên", uid: "title", sortable: true },
  { name: "mô tả", uid: "description", sortable: true },
  { name: "ghi chú", uid: "note", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["title", "description", "note"];

const statusMapColor = [
  { name: "red", value: 0 },
  { name: "blue", value: 1 },
  { name: "green", value: 2 },
  { name: "red", value: 3 },
];
const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang thực hiện", value: 1 },
  { name: "Đã hoàn thành", value: 2 },
  { name: "Đã hủy", value: 3 },
];

const PigTreatmentPlanList = ({ pigId, setSelectedTreatment }: { pigId: string, setSelectedTreatment: any }) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [treatmentList, setTreatmentList] = React.useState<TreatmentData[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const hasSearchFilter = filterValue.length > 0;

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredVaccination: TreatmentData[] = [...treatmentList];

    if (hasSearchFilter) {
      filteredVaccination = filteredVaccination.filter((vaccination) => vaccination.title.toLowerCase().includes(filterValue.toLowerCase()));
    }
    return filteredVaccination;
  }, [treatmentList, filterValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: TreatmentData, b: TreatmentData) => {
      const first = a[sortDescriptor.column as keyof TreatmentData] as unknown as number;
      const second = b[sortDescriptor.column as keyof TreatmentData] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const getAllVaccinationPlan = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<TreatmentData> = await pigService.getTreatmentPlanByPigId(pigId, page, rowsPerPage);
      if (res && res.isSuccess) {
        setTreatmentList(res.data.data || []);
        setPage(res.data.pageIndex);
        setRowsPerPage(res.data.pageSize);
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
    getAllVaccinationPlan();
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
            placeholder="Tìm kiếm theo tên..."
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
              <DropdownMenu disallowEmptySelection closeOnSelect={false} selectedKeys={visibleColumns} selectionMode="multiple" onSelectionChange={setVisibleColumns}>
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
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, treatmentList.length, hasSearchFilter]);
  const renderCell = React.useCallback((data: TreatmentData, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof TreatmentData];

    switch (columnKey) {
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
  }, [items.length, page, totalPages, hasSearchFilter]);
  return (
    <Table
      color="primary"
      classNames={{
        wrapper: "max-h-[400px] overflow-auto",
      }}
      selectionMode="single"
      isHeaderSticky
      topContent={topContent}
      bottomContent={bottomContent}
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      //   align="center"
      // selectedKeys={selectedKeys}
      onSelectionChange={setSelectedTreatment}
      aria-label="Example static collection table"
    >
      <TableHeader columns={headerColumns}>
        {(column: any) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
            {column.name.toUpperCase()}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={isLoading ? "loading" : "idle"}>
        {(item) => (
          <TableRow key={item.id} className="h-12">
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PigTreatmentPlanList;
