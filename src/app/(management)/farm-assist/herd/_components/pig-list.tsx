"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { columns, statusOptions } from "../data";
import { HiChevronDown, HiDotsVertical } from "react-icons/hi";
import { EyeIcon, Plus, Search } from "lucide-react";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { pigService } from "@oursrc/lib/services/pigService";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { Pig } from "@oursrc/lib/models/pig";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@oursrc/components/ui/drawer";
import DevelopmentLogList from "./development-log-list";

const statusColorMap: Record<string, ChipProps["color"]> = {
  normal: "success",
  sick: "warning",
  dead: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["breed", "pigCode", "cageCode", "herdId", "cageId", "vaccinationDate", "healthStatus", "actions"];

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function PigList({
  selectedHerd,
  setSelectedPig,
  onOpen,
}: {
  selectedHerd: HerdInfo;
  setSelectedPig: React.Dispatch<React.SetStateAction<Pig | undefined>>;
  onOpen: () => void;
}) {
  const [pigList, setPigList] = React.useState<Pig[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");
  // const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
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
    let filteredPigs: Pig[] = [...pigList];

    if (hasSearchFilter) {
      filteredPigs = filteredPigs.filter((pig) => pig.breed.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredPigs = filteredPigs.filter((pig) => Array.from(statusFilter).includes(pig.healthStatus as string));
    }

    return filteredPigs;
  }, [pigList, filterValue, statusFilter]);

  React.useEffect(() => {
    if (selectedHerd) {
      fetchData();
    }
  }, [selectedHerd, page, rowsPerPage]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Pig, b: Pig) => {
      const first = a[sortDescriptor.column as keyof Pig] as number;
      const second = b[sortDescriptor.column as keyof Pig] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<Pig> = await pigService.getPigsByHerdId(selectedHerd.id, page, rowsPerPage);
      console.log("response: ", response);
      if (response.isSuccess) {
        setPigList(response.data.data || []);
        setTotalRecords(response.data?.totalRecords || 0);
        setPages(response.data?.totalPages || 1);
        setRowsPerPage(response.data?.pageSize || 5);
      }
    } catch (error) {
      console.error("Error fetching pig data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // const [selectedPig, setSelectedPig] = React.useState<Pig>();
  const renderCell = React.useCallback((pig: Pig, columnKey: React.Key) => {
    const cellValue = pig[columnKey as keyof Pig];

    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[pig.healthStatus as string]} size="sm" variant="flat">
            {cellValue === "active" ? "Khỏe mạnh" : cellValue === "sick" ? "Bệnh" : "Chết"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex justify-center items-center gap-4">
            <Drawer>
              <DrawerTrigger>
                <Tooltip content="Chi tiết" color="primary" closeDelay={200}>
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    // onClick={() => {
                    //   setSelectedPig(pig);
                    //   // onOpen();
                    // }}
                  >
                    <EyeIcon
                      size={20}
                      className=" cursor-pointer"
                      onClick={() => {
                        setSelectedPig(pig);
                        // onOpen();
                      }}
                    />
                  </span>
                </Tooltip>
              </DrawerTrigger>
              <DrawerContent className="h-5/6">
                <div className="overflow-auto h-full">
                  <DrawerHeader>
                    <DrawerTitle>
                      <p className="text-2xl font-bold">Hồ sơ heo {pig.id}</p>
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pb-0">
                    <DevelopmentLogList selectedPig={pig} />
                  </div>
                  <DrawerFooter>
                    <DrawerClose>Cancel</DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        );
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
            className="w-full sm:max-w-[44%]"
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
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status: any) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
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
                    {capitalize(column.name)}
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, pigList.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span> */}
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2">
        </div> */}
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);
  return (
    <div>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        color="primary"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[750px]",
        }}
        // selectedKeys={selectedKeys}
        // selectionMode="single"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        // onSelectionChange={(keys) => {
        //   setSelectedKeys(keys);
        //   // setSelectedPigs(keys === "all" ? pigList : pigList.filter((pig) => Array.from(keys).includes(pig.id)));
        //   setSelectedPig(pigList.find((pig) => pig.id === Array.from(keys)[0]));
        // }}
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
    </div>
  );
}