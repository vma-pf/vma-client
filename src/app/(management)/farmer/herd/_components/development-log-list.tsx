import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
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
import { MonitorDevelopment } from "@oursrc/lib/models/monitor-development";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { monitorDevelopmentLogService } from "@oursrc/lib/services/monitorDevelopmentLogService";
import { EyeIcon, Plus, Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { HiMiniPencilSquare } from "react-icons/hi2";
import DevelopmentLineChart from "./development-line-chart";

const statusOptions = [
  { name: "Bình thường", uid: "normal" },
  { name: "Bệnh", uid: "sick" },
  { name: "Chết", uid: "dead" },
];

const statusColorMap = {
  normal: "primary",
  sick: "danger",
  dead: "warning",
};

const columns = [
  { name: "Tiêu đề", uid: "title", sortable: true },
  { name: "Cân nặng", uid: "weight", sortable: true },
  { name: "Chiều cao", uid: "height", sortable: true },
  { name: "Chiều rộng", uid: "width", sortable: true },
  { name: "Tình trạng", uid: "healthStatus", sortable: true },
  { name: "Ngày kiểm tra", uid: "checkupAt", sortable: true },
  // { name: "Hành động", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = ["title", "weight", "height", "width", "healthStatus", "checkupAt"];

const data: MonitorDevelopment[] = [
  {
    id: "1",
    title: "Đánh giá sức khỏe",
    weight: "100",
    height: "100",
    width: "100",
    healthStatus: "normal",
    checkupAt: "2024-09-30T01:57:49.49+00:00",
  },
  {
    id: "2",
    title: "Đánh giá sức khỏe",
    weight: "100",
    height: "100",
    width: "100",
    healthStatus: "sick",
    checkupAt: "2024-09-30T01:57:49.49+00:00",
  },
  {
    id: "3",
    title: "Đánh giá sức khỏe",
    weight: "100",
    height: "100",
    width: "100",
    healthStatus: "dead",
    checkupAt: "2024-09-30T01:57:49.49+00:00",
  },
];

const DevelopmentLogList = ({ selectedPig }: { selectedPig: Pig }) => {
  const [developmentLogList, setDevelopmentLogList] = React.useState<MonitorDevelopment[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "breed",
    direction: "ascending",
  });
  const [selectedLog, setSelectedLog] = React.useState<MonitorDevelopment>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredLogs: MonitorDevelopment[] = [...developmentLogList];

    if (hasSearchFilter) {
      filteredLogs = filteredLogs.filter((log) => log.title.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredLogs = filteredLogs.filter((log) => Array.from(statusFilter).includes(log.healthStatus as string));
    }

    return filteredLogs;
  }, [developmentLogList, filterValue, statusFilter]);

  React.useEffect(() => {
    if (selectedPig) {
      fetchMonitorLogData();
    }
  }, [selectedPig, page, rowsPerPage]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: MonitorDevelopment, b: MonitorDevelopment) => {
      const first = a[sortDescriptor.column as keyof MonitorDevelopment];
      const second = b[sortDescriptor.column as keyof MonitorDevelopment];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const fetchMonitorLogData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<MonitorDevelopment> = await monitorDevelopmentLogService.getMonitoringLogsByPigId(selectedPig?.id ?? "", page, rowsPerPage);
      console.log(response);
      if (response.isSuccess) {
        setDevelopmentLogList(response.data.data || []);
        setTotalRecords(response.data.totalRecords);
        setPage(response.data?.pageIndex);
        setPages(response.data?.totalPages);
        setRowsPerPage(response.data?.pageSize);
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = React.useCallback((log: MonitorDevelopment, columnKey: React.Key) => {
    const cellValue = log[columnKey as keyof MonitorDevelopment];

    switch (columnKey) {
      // case "title":
      //   return (
      //     <Tooltip showArrow={true} content={cellValue} color="primary" closeDelay={200}>
      //       <p className="truncate">{cellValue}</p>
      //     </Tooltip>
      //   );
      // case "status":
      //   return (
      //     <Chip
      //       className="capitalize"
      //       color={statusColorMap[log.healthStatus as keyof typeof statusColorMap] as "primary" | "danger" | "warning" | "default" | "secondary" | "success" | undefined}
      //       size="lg"
      //       variant="flat"
      //     >
      //       {cellValue === "active" ? "Khỏe mạnh" : cellValue === "sick" ? "Bệnh" : "Chết"}
      //     </Chip>
      //   );
      // case "actions":
      //   return (
      //     <div className="flex justify-canter items-center gap-2">
      //       <Tooltip content="Chi tiết" color="primary">
      //         <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //           <HiMiniPencilSquare
      //             size={25}
      //             onClick={() => {
      //               onOpen();
      //               setSelectedLog(log);
      //             }}
      //           />
      //         </span>
      //       </Tooltip>
      //     </div>
      //   );
      default:
        return <p className="truncate">{cellValue?.toString()}</p>;
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, developmentLogList.length, hasSearchFilter]);

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
    <div className="flex gap-x-2">
      <div className="p-5 w-1/2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-2xl font-bold mb-3">Lịch sử quá trình phát triển</p>
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          color="primary"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[500px]",
          }}
          // selectedKeys={selectedKeys}
          // selectionMode="single"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          // onSelectionChange={(keys) => {
          //   setSelectedKeys(keys);
          //   // setSelectedPig(pigList.find((pig) => pig.id === Array.from(keys)[0]));
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
            {(item) => <TableRow key={item.title}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
          </TableBody>
        </Table>
        {isOpen && selectedLog && (
          <Modal isOpen={isOpen} onClose={onClose} size="3xl">
            <ModalContent>
              <ModalHeader>
                <p className="text-2xl font-bold">Chi tiết</p>
              </ModalHeader>
              <ModalBody>
                <div className="p-4">
                  <p>{selectedLog.title}</p>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </div>
      <div className="p-5 w-1/2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-2xl font-bold mb-3">Biểu đồ phát triển</p>
        <DevelopmentLineChart />
      </div>
    </div>
  );
};

export default DevelopmentLogList;
