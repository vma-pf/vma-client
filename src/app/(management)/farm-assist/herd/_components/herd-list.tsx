import {
  Button,
  Chip,
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
  useDisclosure,
} from "@nextui-org/react";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { herdService } from "@oursrc/lib/services/herdService";
import { Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi2";

const columns = [
  { name: "Mã đàn", uid: "code", sortable: true },
  { name: "Giống", uid: "breed", sortable: true },
  // { name: "Mô tả", uid: "description", sortable: true },
  { name: "Cân nặng trung bình", uid: "averageWeight", sortable: true },
  { name: "Tổng số lượng", uid: "totalNumber", sortable: true },
  { name: "Ngày bắt đầu", uid: "startDate", sortable: true },
  { name: "Ngày kết thúc (dự kiến)", uid: "expectedEndDate", sortable: true },
  { name: "Ngày kết thúc (thực tế)", uid: "actualEndDate", sortable: true },
  { name: "Tình trạng", uid: "status" },
];

const statusOptions = [
  { name: "Chưa bắt đầu", uid: "0" },
  { name: "Đang diễn ra", uid: "1" },
  { name: "Đã kết thúc", uid: "2" },
];

const statusColorMap = {
  0: "warning",
  1: "success",
  2: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["code", "breed", "averageWeight", "totalNumber", "startDate", "expectedEndDate", "status"];

const HerdList = ({
  selectedHerd,
  setSelectedHerd,
  isEndHerd,
}: {
  selectedHerd: HerdInfo | undefined;
  setSelectedHerd: React.Dispatch<React.SetStateAction<HerdInfo | undefined>>;
  isEndHerd: boolean;
}) => {
  const [herdList, setHerdList] = React.useState<HerdInfo[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");
  //   const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>();
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "breed",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredHerds: HerdInfo[] = [...herdList];

    if (hasSearchFilter) {
      filteredHerds = filteredHerds.filter((herd) => herd.breed.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter) {
      filteredHerds = filteredHerds.filter((herd) => Array.from(statusFilter).includes(herd.status?.toString() || ""));
    }
    return filteredHerds;
  }, [herdList, filterValue, statusFilter]);

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    if (isEndHerd) {
      fetchData();
    }
  }, [isEndHerd]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: HerdInfo, b: HerdInfo) => {
      const first = a[sortDescriptor.column as keyof HerdInfo] as number;
      const second = b[sortDescriptor.column as keyof HerdInfo] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<HerdInfo> = await herdService.getHerd(page, rowsPerPage);
      if (response.isSuccess) {
        setHerdList(response.data.data || []);
        setTotalRecords(response.data.totalRecords);
        setPage(response.data?.pageIndex);
        setPages(response.data?.totalPages);
        setRowsPerPage(response.data?.pageSize);
      }
    } catch (error) {
      console.error("Error fetching pig data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chưa Kết Thúc":
        return "default";
      case "Đang Diễn Ra":
        return "warning";
      case "Đã Kết Thúc":
        return "success";
      default:
        return "default";
    }
  };

  const renderCell = React.useCallback((pig: HerdInfo, columnKey: React.Key) => {
    const cellValue = pig[columnKey as keyof HerdInfo];

    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" color={getStatusColor(cellValue as string)} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "startDate":
      case "expectedEndDate":
      case "actualEndDate":
        return new Date(cellValue as string).toLocaleDateString("vi-VN");
      default:
        return cellValue?.toString();
    }
  }, []);

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
            placeholder="Tìm kiếm theo giống heo..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
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
                selectionMode="single"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status: any) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name.toUpperCase()}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, herdList.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span> */}
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2"></div> */}
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);
  return (
    <Table
      color="primary"
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[500px] overflow-auto",
      }}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      selectedKeys={selectedHerd ? new Set([selectedHerd.id]) : new Set([])}
      onSelectionChange={(selectedKeys: Selection) => {
        const selectedKeysArray = Array.from(selectedKeys);
        const selectedHerds = herdList.filter((herd) => herd.id && selectedKeysArray.includes(herd.id));
        setSelectedHerd(selectedHerds[0]);
      }}
      onSortChange={setSortDescriptor}
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

export default HerdList;
