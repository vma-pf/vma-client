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
  Tooltip,
} from "@nextui-org/react";
import { HiChevronDown, HiDotsVertical } from "react-icons/hi";
import { Edit, Plus, Search, Trash, Trash2 } from "lucide-react";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Camera } from "@oursrc/lib/models/camera";
import { cameraService } from "@oursrc/lib/services/cameraService";
import AddEditCamera from "./_modals/add-edit-camera";

const columns = [
  { uid: "protocol", name: "Giao thức", sortable: true },
  { uid: "domain", name: "Tên miền", sortable: true },
  { uid: "path", name: "Đường dẫn", sortable: true },
  { uid: "parameters", name: "Tham số", sortable: true },
  { uid: "port", name: "Cổng", sortable: true },
  { uid: "actions", name: "Hành động" },
];

const INITIAL_VISIBLE_COLUMNS = ["protocol", "domain", "path", "parameters", "port", "actions"];

const CameraList = () => {
  const [cameraList, setCameraList] = React.useState<Camera[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [pages, setPages] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "domain",
    direction: "ascending",
  });
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
  const [selectedCamera, setSelectedCamera] = React.useState<Camera>();

  const [page, setPage] = React.useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPigs: Camera[] = [...cameraList];

    if (hasSearchFilter) {
      filteredPigs = filteredPigs.filter((pig) => pig.domain.toLowerCase().includes(filterValue.toLowerCase()));
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
    //   filteredPigs = filteredPigs.filter((pig) => Array.from(statusFilter).includes(pig.healthStatus as string));
    // }

    return filteredPigs;
  }, [cameraList, filterValue, statusFilter]);

  React.useEffect(() => {
    if (!isOpenAdd && !isOpenEdit && !isOpenDelete) {
      fetchData();
    }
  }, [page, rowsPerPage, isOpenAdd, isOpenEdit, isOpenDelete]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: Camera, b: Camera) => {
      const first = a[sortDescriptor.column as keyof Camera] as string;
      const second = b[sortDescriptor.column as keyof Camera] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<Camera> = await cameraService.getAll(page, rowsPerPage);
      if (response.isSuccess) {
        setCameraList(response.data.data || []);
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

  const renderCell = React.useCallback((pig: Camera, columnKey: React.Key) => {
    const cellValue = pig[columnKey as keyof Camera];

    switch (columnKey) {
      // case "status":
      //   return (
      //     <Chip className="capitalize" color={statusColorMap[pig.healthStatus as string]} size="sm" variant="flat">
      //       {cellValue === "active" ? "Khỏe mạnh" : cellValue === "sick" ? "Bệnh" : "Chết"}
      //     </Chip>
      //   );
      // case "vaccinationDate":
      //   return new Date(cellValue as string).toLocaleDateString("vi-VN");
      case "actions":
        return (
          <div className="relative flex justify-center items-center gap-3">
            <Tooltip content="Chỉnh sửa" closeDelay={200}>
              <Edit
                className={`text-warning active:text-default-400`}
                size={25}
                onClick={() => {
                  setSelectedCamera(pig);
                  onOpenEdit();
                }}
              />
            </Tooltip>
            <Tooltip content="Xóa" closeDelay={200}>
              <Trash2
                className={`text-danger active:text-default-400`}
                size={25}
                onClick={() => {
                  setSelectedCamera(pig);
                  onOpenDelete();
                }}
              />
            </Tooltip>
            {/* <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <HiDotsVertical className="text-default-300" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setSelectedCamera(pig);
                    onOpen();
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
          </div>
        );
      default:
        return cellValue;
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
            placeholder="Tìm kiếm theo tên miền..."
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
            <Button color="primary" variant="solid" onPress={onOpenAdd} startContent={<Plus />}>
              Thêm camera
            </Button>
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, cameraList.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        {/* <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span> */}
        <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        {/* <div className="hidden sm:flex w-[30%] justify-end gap-2"></div> */}
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
        selectionMode="none"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
              {column.name.toUpperCase()}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Không có kết quả"} loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={sortedItems}>
          {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
        </TableBody>
      </Table>
      {isOpenAdd && <AddEditCamera isOpen={isOpenAdd} onClose={onCloseAdd} operation="add" />}
      {isOpenEdit && selectedCamera && <AddEditCamera isOpen={isOpenEdit} onClose={onCloseEdit} operation="edit" camera={selectedCamera} />}
      {isOpenDelete && selectedCamera && <AddEditCamera isOpen={isOpenDelete} onClose={onCloseDelete} operation="delete" camera={selectedCamera} />}
    </div>
  );
};

export default CameraList;
