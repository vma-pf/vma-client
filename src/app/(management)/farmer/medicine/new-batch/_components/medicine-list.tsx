"use client";
import {
  Button,
  ChipProps,
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
import { capitalize } from "@oursrc/components/utils";
import { useToast } from "@oursrc/hooks/use-toast";
import { Medicine } from "@oursrc/lib/models/medicine";
import { EditIcon, EyeIcon, Plus, Search, Trash2Icon } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { columns, INITIAL_VISIBLE_COLUMNS, statusOptions } from "./data";
import { medicineService } from "@oursrc/lib/services/medicineService";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  sick: "warning",
  dead: "danger",
};

export default function MedicineList({
  selectedMedicine,
  setSelectedMedicine,
}: {
  selectedMedicine?: Medicine;
  setSelectedMedicine: React.Dispatch<React.SetStateAction<Medicine | undefined>>;
}) {
  const { toast } = useToast();
  //Table field
  const [filterValue, setFilterValue] = React.useState("");
  //   const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
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
  const [medicineList, setMedicineList] = React.useState<Medicine[]>([]);

  const filteredItems = React.useMemo(() => {
    let filteredMedicines: Medicine[] = [...medicineList];

    if (hasSearchFilter) {
      filteredMedicines = filteredMedicines.filter((medicine) => medicine.name.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredMedicines = filteredMedicines.filter((medicine) => Array.from(statusFilter).includes(medicine.name as string));
    }
    return filteredMedicines;
  }, [medicineList, filterValue, statusFilter]);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  //API function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response: ResponseObjectList<Medicine> = await medicineService.getMedicine(page, rowsPerPage);
      if (response.isSuccess) {
        setMedicineList(response.data.data);
        setRowsPerPage(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        throw new AggregateError([response.errorMessage]);
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

  const items = React.useMemo(() => {
    return filteredItems;
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Medicine, b: Medicine) => {
      const first = a[sortDescriptor.column as keyof Medicine] as number;
      const second = b[sortDescriptor.column as keyof Medicine] as number;
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, medicineList.length, hasSearchFilter]);

  const renderCell = React.useCallback((data: Medicine, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Medicine];

    switch (columnKey) {
      // case "mainIngredient":
      // case "name":
      // case "unit":
      // case "usage":
      //   return (
      //     <Tooltip showArrow={true} content={cellValue} color="primary" delay={1000}>
      //       <p className="truncate">{cellValue}</p>
      //     </Tooltip>
      //   );
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
  }, [items.length, page, totalPages, hasSearchFilter]);

  return (
    <div>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        layout="fixed"
        color="primary"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[400px] w-full overflow-auto",
        }}
        selectionMode="single"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        selectedKeys={selectedMedicine && selectedMedicine.id ? new Set([selectedMedicine.id]) : new Set<string>()}
        onSelectionChange={(selectedKeys: Selection) => {
          const selectedKeysArray = Array.from(selectedKeys);
          const selectedMedicines = medicineList.filter((medicine) => medicine.id && selectedKeysArray.includes(medicine.id));
          setSelectedMedicine(selectedMedicines[0]);
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
        <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={loading ? "loading" : "idle"}>
          {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
    </div>
  );
}
