import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { Activity, Cage } from "@oursrc/lib/models/cage";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { dateTimeConverter } from "@oursrc/lib/utils";
import { Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";

const columns = [
  { name: "Thời gian", uid: "timeStamp", sortable: true },
  { name: "Đứng im", uid: "stationary", sortable: true },
  { name: "Di chuyển", uid: "moving", sortable: true },
  { name: "Đang ăn", uid: "feeding", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["timeStamp", "stationary", "moving", "feeding"];

const ActivityLogList = ({ cage }: { cage?: Cage }) => {
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [page, setPage] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "timeStamp",
    direction: "ascending",
  });
  const hasSearchFilter = Boolean(filterValue);
  const [activityList, setActivityList] = React.useState<Activity[]>([]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredActivity: Activity[] = [...activityList];

    if (hasSearchFilter) {
      filteredActivity = filteredActivity.filter((activity) => activity.timeStamp.toLowerCase().includes(filterValue.toLowerCase()));
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredActivity = filteredActivity.filter((activity) => Array.from(statusFilter).includes(activity.name as string));
    // }
    // filteredActivity = filteredActivity.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

    return filteredActivity;
  }, [activityList, statusFilter]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Activity, b: Activity) => {
      const first = a[sortDescriptor.column as keyof Activity];
      const second = b[sortDescriptor.column as keyof Activity];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: ResponseObjectList<Activity> = await cageService.getActivityLog(cage?.id || "", page, rowsPerPage);
      if (response.isSuccess) {
        setActivityList(response.data.data);
        setRowsPerPage(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        console.log(response.errorMessage);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, activityList.length, hasSearchFilter]);

  const renderCell = React.useCallback((data: Activity, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Activity];
    switch (columnKey) {
      case "timeStamp":
        return dateTimeConverter(cellValue as string);
      default:
        return cellValue;
    }
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">{selectedMedicine === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedMedicine.size} kết quả`}</span> */}
        <Pagination isCompact showControls showShadow color="primary" page={page} total={totalPages} onChange={setPage} />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2"></div> */}
      </div>
    );
  }, [filteredItems.length, page, totalPages, hasSearchFilter]);
  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      layout="fixed"
      color="primary"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      // classNames={{
      //   wrapper: "max-h-[400px] w-full overflow-auto",
      // }}
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      // selectedKeys={selectedMedicine && selectedMedicine.id ? new Set([selectedMedicine.id]) : new Set<string>()}
      // onSelectionChange={(selectedKeys: Selection) => {
      //   const selectedKeysArray = Array.from(selectedKeys);
      //   const selectedMedicines = medicineList.filter((medicine) => medicine.id && selectedKeysArray.includes(medicine.id));
      //   setSelectedMedicine(selectedMedicines[0]);
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
      <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={loading ? "loading" : "idle"}>
        {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  );
};

export default ActivityLogList;
