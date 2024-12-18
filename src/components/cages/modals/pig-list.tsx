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
} from "@nextui-org/react";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { Cage } from "@oursrc/lib/models/cage";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { pigService } from "@oursrc/lib/services/pigService";
import { EyeIcon, Search } from "lucide-react";
import React from "react";
import { HiChevronDown, HiDotsVertical } from "react-icons/hi";

const columns = [
  { name: "Mã heo", uid: "pigCode", sortable: true },
  { name: "Mã chuồng", uid: "cageCode", sortable: true },
  { name: "Giống", uid: "breed", sortable: true },
  { name: "Đàn", uid: "herdId", sortable: true },
  { name: "Mã Đàn", uid: "herdCode", sortable: true },
  { name: "Chuồng", uid: "cageId", sortable: true },
  { name: "Cân nặng", uid: "weight", sortable: true },
  { name: "Chiều cao", uid: "height", sortable: true },
  { name: "Chiều rộng", uid: "width", sortable: true },
  { name: "Tình trạng", uid: "healthStatus", sortable: true },
  { name: "Cập nhật lần cuối", uid: "lastUpdatedAt", sortable: true },
];

const statusOptions = [
  { name: "Bình thường", uid: "Bình thường" },
  { name: "Bệnh", uid: "Bệnh" },
  { name: "Chết", uid: "Chết" },
];

const statusColorMap = [
  { healthStatus: "Bình thường", color: "primary" },
  { healthStatus: "Bệnh", color: "warning" },
  { healthStatus: "Chết", color: "danger" },
];

const INITIAL_VISIBLE_COLUMNS = ["herdCode", "breed", "pigCode", "weight", "height", "width", "healthStatus"];

const PigList = ({ isOpen, onClose, cage }: { isOpen: boolean; onClose: () => void; cage?: Cage }) => {
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [pigList, setPigList] = React.useState<Pig[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "breed",
    direction: "ascending",
  });

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
    fetchData();
  }, [page, rowsPerPage]);

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
      setLoading(true);
      const response: ResponseObjectList<Pig> = await pigService.getPigsByCageId(cage?.id || "", page, rowsPerPage);
      if (response.isSuccess) {
        setPigList(response.data.data || []);
        setTotalRecords(response.data?.totalRecords || 0);
        setPages(response.data?.totalPages || 1);
        setRowsPerPage(response.data?.pageSize || 5);
      }
    } catch (error) {
      console.error("Error fetching pig data:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderCell = React.useCallback((pig: Pig, columnKey: React.Key) => {
    const cellValue = pig[columnKey as keyof Pig];

    switch (columnKey) {
      case "healthStatus":
        return <p className={`text-${statusColorMap.find((status) => status.healthStatus === cellValue)?.color}`}>{cellValue}</p>;
      case "vaccinationDate":
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
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <p className="text-xl">Danh sách heo đang nuôi trong chuồng {cage?.code}</p>
        </ModalHeader>
        <ModalBody>
          <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            color="primary"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[550px]",
            }}
            // selectedKeys={selectedKeys}
            selectionMode="none"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            // onSelectionChange={(keys) => {
            //   const selectedKeysArray = Array.from(keys);
            //   setSelectedPig(pigList.find((pig) => selectedKeysArray.includes(pig.id)));
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
            <TableBody emptyContent={"Không có kết quả"} loadingState={loading ? "loading" : "idle"} loadingContent={<Spinner />} items={sortedItems}>
              {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
            </TableBody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PigList;
