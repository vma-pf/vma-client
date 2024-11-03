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
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  SharedSelection,
} from "@nextui-org/react";
import { HiChevronDown, HiDotsVertical } from "react-icons/hi";
import { Plus, Search } from "lucide-react";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { pigService } from "@oursrc/lib/services/pigService";
import { Pig, VaccinationPig } from "@oursrc/lib/models/pig";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { Cage } from "@oursrc/lib/models/cage";
import { cageService } from "@oursrc/lib/services/cageService";
import { vaccinationStageService } from "@oursrc/lib/services/vaccinationStageService";
import { set } from "date-fns";
import { CreateTreatmentStageProps, TreatmentLog } from "@oursrc/lib/models/treatment";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { treatmentLogService } from "@oursrc/lib/services/treatmentLogService";

const columns = [
  { name: "pigCode", uid: "pigCode", sortable: true },
  { name: "descriptionDiseaseReport", uid: "descriptionDiseaseReport", sortable: true },
  { name: "treatmentStageTitle", uid: "treatmentStageTitle", sortable: true },
  { name: "isRecovered", uid: "isRecovered" },
];

const statusOptions = [
  { name: "Khỏe mạnh", uid: "Alive" },
  { name: "Bệnh", uid: "sick" },
  { name: "Chết", uid: "dead" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
  Alive: "success",
  sick: "warning",
  Dead: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["pigCode", "descriptionDiseaseReport", "treatmentStageTitle"];

const PigTreatmentStage = ({
  treatmentStage,
  //   selectedPigs,
  setSelectedPigs,
  cages,
  setCages,
}: {
  treatmentStage: CreateTreatmentStageProps;
  //   selectedPigs: Pig[];
  setSelectedPigs: (pigs: TreatmentLog[]) => void;
  cages: Cage[];
  setCages: React.Dispatch<React.SetStateAction<Cage[]>>;
}) => {
  const [pigList, setPigList] = React.useState<TreatmentLog[]>([]);
  // const [cages, setCages] = React.useState<Cage[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [selectedCage, setSelectedCage] = React.useState<Selection>(new Set(["all"]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [pages, setPages] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "breed",
    direction: "ascending",
  });
  const selectedValue = React.useMemo(() => selectedCage !== "all" && Array.from(selectedCage).join(", ").replaceAll("_", " "), [selectedCage]);

  const [page, setPage] = React.useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPigs: TreatmentLog[] = [...pigList];

    if (hasSearchFilter) {
      filteredPigs = filteredPigs.filter((pig) => pig.treatmentStageTitle.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (selectedValue && selectedValue !== "all") {
      filteredPigs = filteredPigs.filter((pig) => selectedValue === pig.pigCode);
    }

    return filteredPigs;
  }, [pigList, filterValue, selectedValue]);

  React.useEffect(() => {
    if (treatmentStage) {
      fetchData();
    }
  }, [treatmentStage, page, rowsPerPage]);

  React.useEffect(() => {
    setSelectedPigs(
      pigList.filter((pig) => {
        return selectedKeys !== "all" ? selectedKeys.has(pig.id) : true;
      })
    );
  }, [selectedKeys]);

  // React.useEffect(() => {
  //   if (selectedValue) {
  //     console.log(selectedValue);
  //     console.log(pigList.filter((pig) => selectedValue === pig.cageCode));
  //     setPigList(pigList.filter((pig) => selectedValue === pig.cageCode));
  //   }
  // }, [selectedValue]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: TreatmentLog, b: TreatmentLog) => {
      const first = a[sortDescriptor.column as keyof TreatmentLog];
      const second = b[sortDescriptor.column as keyof TreatmentLog];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<TreatmentLog> = await treatmentLogService.getTreatmentLogs(treatmentStage.id ?? "", 1, 500);
      if (response.isSuccess) {
        const pigs = response.data.data || [];
        setPigList(pigs.filter((pig: TreatmentLog) => pig.isRecovered === false).map((pig: TreatmentLog) => pig));
        setTotalRecords(response.data.totalRecords || 0);
        setPages(response.data?.totalPages || 1);
        setRowsPerPage(response.data?.pageSize || 5);
      }
    } catch (error) {
      console.error("Error fetching pig data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = React.useCallback((pig: TreatmentLog, columnKey: React.Key) => {
    const cellValue = pig[columnKey as keyof TreatmentLog];

    switch (columnKey) {
      case "status":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
          </Chip>
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
                  {/* Chọn chuồng */}
                  {selectedValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Table Columns" selectedKeys={selectedCage} selectionMode="single" onSelectionChange={setSelectedCage} items={cages}>
                {/* {cages.map((cage: Cage) => (
                  <DropdownItem key={cage.id} className="capitalize">
                    <p>{cage.code}</p>
                  </DropdownItem>
                ))} */}
                {(item) => (
                  <DropdownItem key={item.code} className="capitalize">
                    <p>{item.code}</p>
                  </DropdownItem>
                )}
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
  }, [filterValue, visibleColumns, selectedCage, onSearchChange, onRowsPerPageChange, pigList.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span>
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);
  return (
    <div>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[750px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
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
        <TableBody emptyContent={"Không có kết quả"} loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={sortedItems}>
          {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
    </div>
  );
};

export default PigTreatmentStage;
