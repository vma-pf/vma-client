"use client";
import {
  Autocomplete,
  AutocompleteItem,
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
  Textarea,
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
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { CiViewList } from "react-icons/ci";
import { FaRegListAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Supplier } from "@oursrc/lib/models/supplier";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  sick: "warning",
  dead: "danger",
};

export default function MedicineList({
  selectedMedicine,
  setSelectedMedicine,
  batchMedicineList,
}: {
  selectedMedicine?: Medicine;
  setSelectedMedicine: React.Dispatch<React.SetStateAction<Medicine | undefined>>;
  batchMedicineList: Medicine[];
}) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const unit = watch("unit");
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

  const storedMedicine = localStorage.getItem("newMedicine") ? JSON.parse(localStorage.getItem("newMedicine") || "") : "";

  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);
  const [medicineList, setMedicineList] = React.useState<Medicine[]>([]);

  const unitOptions = [
    { label: "g", value: "g" },
    { label: "mg", value: "mg" },
    { label: "l", value: "l" },
    { label: "ml", value: "ml" },
  ];

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

  const createNewMedicine = async (data: any) => {
    try {
      const res: ResponseObject<Medicine> = await medicineService.createMedicine(data);
      if (res.isSuccess) {
        toast({
          variant: "success",
          title: "Thêm thuốc mới thành công",
        });
        setSelectedMedicine(res.data);
        // Call api to mark purchase medicine
        const response: ResponseObject<any> = await medicineRequestService.markPurchaseMedicine(storedMedicine.requestId, res.data.id ?? "");
        console.log(response);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Tạo mới thuốc thất bại",
        });
      }
    } catch (error) {
      console.log(error);
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
      <Tabs size="lg" color="primary">
        <Tab
          title={
            <div className="flex items-center">
              <FaRegListAlt size={20} />
              <span className="ml-2">Danh sách thuốc</span>
            </div>
          }
        >
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
            disabledKeys={batchMedicineList.length > 0 ? new Set(batchMedicineList.map((medicine) => medicine?.id ?? "")) : new Set<string>()}
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
        </Tab>
        <Tab
          title={
            <div className="flex items-center">
              <Plus />
              <span className="ml-2">Thêm mới</span>
            </div>
          }
        >
          <form
            onSubmit={handleSubmit(createNewMedicine)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          >
            <p className="text-xl font-semibold mb-3">Nhập thông tin thuốc mới</p>
            <div className="grid grid-cols-2 gap-2">
              <Input
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Tên thuốc"
                placeholder="Nhập tên thuốc"
                labelPlacement="outside"
                isRequired
                defaultValue={storedMedicine.newMedicineName}
                isInvalid={errors.name ? true : false}
                errorMessage="Tên thuốc không được để trống"
                {...register("name", { required: true })}
              />
              <Autocomplete
                className="mb-5"
                radius="sm"
                size="lg"
                label="Đơn vị"
                placeholder="Nhập đơn vị"
                labelPlacement="outside"
                isInvalid={errors.unit ? true : false}
                defaultItems={unitOptions}
                selectedKey={unit || ""}
                onSelectionChange={(item) => {
                  setValue("unit", item?.toString() || "");
                }}
                errorMessage="Đơn vị không được để trống"
                // {...register("breed", {
                //   required: true,
                // })}
              >
                {(item) => (
                  <AutocompleteItem color="primary" key={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            <Input
              className="mb-5"
              type="text"
              radius="md"
              size="lg"
              label="Trọng lượng"
              placeholder="Nhập trọng lượng"
              labelPlacement="outside"
              isRequired
              // value={netWeight || ""}
              // onValueChange={(event) => handleNetWeightChange(event)}
              isInvalid={errors.netWeight && true}
              errorMessage="Trọng lượng không được để trống"
              {...register("netWeight", { required: true })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Textarea
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Thành phần chính"
                placeholder="Nhập thành phần chính"
                labelPlacement="outside"
                isRequired
                // value={mainIngredient || ""}
                isInvalid={errors.mainIngredient && true}
                errorMessage="Thành phần chính không được để trống"
                {...register("mainIngredient", { required: true })}
              />
              <Textarea
                className="mb-5"
                type="text"
                radius="md"
                size="lg"
                label="Cách sử dụng"
                placeholder="Nhập cách sử dụng"
                labelPlacement="outside"
                isRequired
                // value={usage || ""}
                isInvalid={errors.usage && true}
                errorMessage="Cách sử dụng không được để trống"
                {...register("usage", { required: true })}
              />
            </div>
            <Button type="submit" color="primary" variant="solid" size="md" isDisabled={Object.keys(errors).length > 0}>
              Thêm mới
            </Button>
          </form>
        </Tab>
      </Tabs>
    </div>
  );
}
