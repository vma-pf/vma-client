import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
  Selection,
  Snippet,
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
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { EyeIcon, Search } from "lucide-react";
import ReplyRequest from "./_modals/reply-request";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@oursrc/hooks/use-toast";
import { MedicineRequest } from "@oursrc/lib/models/medicine-request";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import { HiChevronDown } from "react-icons/hi2";
import { IoMdCheckmark, IoMdClose, IoMdCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa6";
import { Medicine } from "@oursrc/lib/models/medicine";
import { medicineService } from "@oursrc/lib/services/medicineService";
import { CustomSnippet } from "@oursrc/components/ui/custom-snippet";

const columns = [
  { uid: "medicineId", name: "Mã thuốc", sortable: true },
  { uid: "newMedicineName", name: "Tên thuốc", sortable: true },
  { uid: "quantity", name: "Số lượng", sortable: true },
  { uid: "status", name: "Trạng thái", sortable: true },
  { uid: "isPurchaseNeeded", name: "Cần mua" },
  { uid: "actions", name: "Hành động" },
];

const INITIAL_VISIBLE_COLUMNS = ["medicineId", "newMedicineName", "quantity", "status", "isPurchaseNeeded", "actions"];

const statusOptions = ["Đã duyệt", "Chờ xử lý", "Từ chối"];

const RequestMedicineList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const [answer, setAnswer] = useState<"accept" | "reject">();

  //Table field
  const [filterValue, setFilterValue] = React.useState("");
  // const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set(statusOptions));
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastUpdatedAt",
    direction: "ascending",
  });
  const [selectedMedicine, setSelectedMedicine] = React.useState<MedicineRequest | null>(null);
  const [remainQuantity, setRemainQuantity] = React.useState(0);
  const [medicineQuantityCheck, setMedicineQuantityCheck] = React.useState(0);

  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);
  const [medicineList, setMedicineList] = React.useState<MedicineRequest[]>([]);

  const filteredItems = React.useMemo(() => {
    let filteredMedicines: MedicineRequest[] = [...medicineList];

    if (hasSearchFilter) {
      filteredMedicines = filteredMedicines.filter((medicine) => medicine.id.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredMedicines = filteredMedicines.filter((medicine) => Array.from(statusFilter).includes(medicine.status));
    }
    return filteredMedicines;
  }, [medicineList, filterValue, statusFilter]);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      fetchData();
    }
  }, [page, rowsPerPage, isOpen]);

  //API function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: ResponseObjectList<MedicineRequest> = await medicineRequestService.getMedicineRequest(page, rowsPerPage);
      if (response.isSuccess) {
        setMedicineList(response.data.data);
        setRowsPerPage(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
        setLoading(false);
      } else {
        console.log(response.errorMessage);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalQuantity = async (medicineId: string) => {
    try {
      const response: ResponseObjectList<MedicineRequest> = await medicineRequestService.getMedicineRequest(1, 500);
      if (response.isSuccess) {
        const totalQuantity = response.data.data.filter((medicine) => medicine.medicineId === medicineId).reduce((total, medicine) => total + medicine.quantity, 0);
        setRemainQuantity(totalQuantity);
      } else {
        console.log(response.errorMessage);
        return 0;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkMedicineQuantity = async (medicineId: string) => {
    try {
      const response: ResponseObject<MedicineRequest> = await medicineService.getMedicineById(medicineId);
      if (response.isSuccess) {
        setMedicineQuantityCheck(response.data.quantity);
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: MedicineRequest, b: MedicineRequest) => {
      const first = a[sortDescriptor.column as keyof MedicineRequest] ?? "";
      const second = b[sortDescriptor.column as keyof MedicineRequest] ?? "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
                  Trạng thái
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection selectedKeys={statusFilter} selectionMode="multiple" closeOnSelect={false} onSelectionChange={setStatusFilter}>
                {statusOptions.map((status) => (
                  <DropdownItem key={status} className="capitalize">
                    {status}
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

  const renderCell = React.useCallback((data: MedicineRequest, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof MedicineRequest];

    switch (columnKey) {
      case "medicineId":
        return (
          <Tooltip showArrow={true} content={cellValue} color="primary" closeDelay={200}>
            <p className="truncate">{cellValue}</p>
          </Tooltip>
        );
      case "newMedicineName":
        return data.newMedicineName ? (
          <CustomSnippet
            variant="solid"
            color="white"
            hideSymbol
            tooltipProps={{
              showArrow: true,
              content: "Copy",
              color: "primary",
              delay: 200,
              closeDelay: 200,
            }}
            onCopy={(value) => {
              localStorage.setItem("newMedicineName", value.toString());
            }}
          >
            <span className="truncate">{cellValue}</span>
          </CustomSnippet>
        ) : (
          <p className="truncate">{cellValue}</p>
        );
      case "isPurchaseNeeded":
        return cellValue ? <IoMdCheckmark size={20} className="text-primary" /> : <IoMdClose size={20} className="text-danger-500" />;
      case "status":
        return <p className={`${cellValue === "Đã duyệt" ? "text-primary" : cellValue === "Chờ xử lý" ? "text-warning" : "text-danger-500"}`}>{cellValue}</p>;
      case "actions":
        return (
          <div className="flex justify-center items-center gap-4">
            <Tooltip content="Chấp nhận" color="primary" closeDelay={200}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaRegThumbsUp
                  size={20}
                  className="text-primary cursor-pointer"
                  onClick={async () => {
                    setSelectedMedicine(data);
                    if (data.medicineId && medicineQuantityCheck < data.quantity) {
                      await calculateTotalQuantity(data.medicineId);
                      onOpenAlert();
                    } else {
                      setAnswer("accept");
                      onOpen();
                    }
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip content="Từ chối" color="danger" closeDelay={200}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaRegThumbsDown
                  size={20}
                  className="text-danger-500 cursor-pointer"
                  onClick={async () => {
                    // const medicineQuantity = (await checkMedicineQuantity(data.medicineId || "")) || 0;
                    if (data.medicineId && medicineQuantityCheck < data.quantity) {
                      return;
                    }
                    setAnswer("reject");
                    setSelectedMedicine(data);
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
            {data.medicineId && (
              <Popover placement="bottom" showArrow>
                <Tooltip content="Kiểm tra số lượng" closeDelay={200}>
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <PopoverTrigger onClick={() => checkMedicineQuantity(data.medicineId || "")}>
                      <EyeIcon size={20} className="cursor-pointer" />
                    </PopoverTrigger>
                  </span>
                </Tooltip>
                <PopoverContent>
                  <p className="text-md cursor-pointer">
                    Số lượng còn lại: <strong>{medicineQuantityCheck}</strong>
                  </p>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      default:
        return cellValue;
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
  }, [filteredItems.length, page, totalPages, hasSearchFilter]);

  return (
    <div>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        layout="fixed"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[750px]",
        }}
        // selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        // onSelectionChange={setSelectedKeys}
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
          {(item) => (
            <TableRow key={item.id} className="h-12">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isOpen && selectedMedicine && answer === "accept" && <ReplyRequest isOpen={isOpen} onClose={onClose} selectedMedicine={selectedMedicine} answer={answer} />}
      {isOpen && selectedMedicine && answer === "reject" && <ReplyRequest isOpen={isOpen} onClose={onClose} selectedMedicine={selectedMedicine} answer={answer} />}
      {isOpenAlert && (
        <Modal isOpen={isOpenAlert} onClose={onCloseAlert} size="sm">
          <ModalContent>
            <ModalHeader>
              <p className="text-xl font-bold">Thông báo</p>
            </ModalHeader>
            <ModalBody>
              <p className="text-lg">Số lượng thuốc {selectedMedicine?.newMedicineName || selectedMedicine?.medicineId} không đủ để chấp nhận yêu cầu.</p>
              <p className="text-lg">
                Tổng số lượng thuốc cần nhập cho thuốc {selectedMedicine?.newMedicineName || selectedMedicine?.medicineId} là{" "}
                <strong className="text-2xl">{remainQuantity}</strong>.
              </p>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default RequestMedicineList;
