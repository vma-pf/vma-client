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
import { HiDotsVertical } from "react-icons/hi";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";

const columns = [
  { uid: "medicineName", name: "Tên thuốc", sortable: true },
  { uid: "quantity", name: "Số lượng", sortable: true },
  { uid: "isPurchaseNeeded", name: "Phân loại", sortable: true },
  { uid: "status", name: "Trạng thái", sortable: true },
  { uid: "actions", name: "Hành động" },
];

const INITIAL_VISIBLE_COLUMNS = ["medicineName", "quantity", "status", "isPurchaseNeeded", "actions"];

const statusOptions = ["Đã duyệt", "Đã yêu cầu", "Chờ xử lý", "Đã hủy"];
const statusColorMap = [
  { status: "Đã duyệt", color: "text-primary" },
  { status: "Đã yêu cầu", color: "text-sky-500" },
  { status: "Chờ xử lý", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];
const isPurchaseNeededOptions = ["Thuốc mới", "Đã tồn tại trong kho"];

const RequestMedicineList = () => {
  const { toast } = useToast();
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
  const [medicineList, setMedicineList] = React.useState<MedicineRequest[]>([]);
  const [allMedicineList, setAllMedicineList] = React.useState<MedicineRequest[]>([]);
  const [selectedMedicine, setSelectedMedicine] = React.useState<MedicineRequest | null>(null);
  const [remainQuantity, setRemainQuantity] = React.useState(0);
  const [medicineQuantityCheck, setMedicineQuantityCheck] = React.useState(0);

  const [page, setPage] = React.useState(1);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

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
    getAllMedicineRequest();
  }, [page, rowsPerPage, isOpen]);
  React.useEffect(() => {
    getAllMedicineRequest();
  }, []);

  const filterNewMedicine = () => {
    return medicineList
      .filter((medicine) => !medicine.medicineId)
      .map((medicine) => {
        return {
          newMedicineName: medicine.newMedicineName,
          requestId: medicine.id,
        };
      });
  };

  const filterMedicinesInManyRequests = () => {
    // find each unique medicineId and then calculate total quantity of each medicineId
    const uniqueMedicineIds = Array.from(new Set(allMedicineList.map((medicine) => medicine.medicineId)));
    const medicineInManyRequests = uniqueMedicineIds.map((medicineId) => {
      return {
        medicineName: allMedicineList.find((medicine) => medicine.medicineId === medicineId)?.medicineName,
        quantity: allMedicineList
          .filter((medicine) => medicine.medicineId === medicineId && medicine.medicineId !== null && medicine.status === "Đã yêu cầu")
          .reduce((total, medicine) => total + medicine.quantity, 0),
      };
    });
    return medicineInManyRequests.filter((medicine) => medicine.quantity > 1);
  };

  const getAllMedicineRequest = async () => {
    try {
      const response: ResponseObjectList<MedicineRequest> = await medicineRequestService.getMedicineRequest(1, 500);
      if (response.isSuccess) {
        setAllMedicineList(response.data.data);
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        return response.data.quantity;
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkRequestAuthor = async (medicineRequest: MedicineRequest, requestType: string) => {
    try {
      setSelectedMedicine(medicineRequest);
      const medicineCheck = (await checkMedicineQuantity(medicineRequest.medicineId || "")) ?? 0;
      console.log(medicineCheck);
      console.log(medicineRequest);
      switch (requestType) {
        case "accept":
        case "reject":
          if (medicineRequest.medicineId && medicineCheck < medicineRequest.quantity) {
            await calculateTotalQuantity(medicineRequest.medicineId);
            onOpenAlert();
          } else if (medicineRequest.newMedicineName && !medicineRequest.medicineName) {
            onOpenAlert();
          } else {
            setAnswer(requestType);
            onOpen();
          }
          break;
        default:
          break;
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
      case "medicineName":
        return data.medicineId && data.medicineName ? (
          <div>
            {/* <Tooltip showArrow={true} content={cellValue} color="primary" closeDelay={200}>
              <p className="truncate">{cellValue}</p>
            </Tooltip> */}
            <p className="">{data.medicineName}</p>
          </div>
        ) : (
          <CustomSnippet
            variant="solid"
            color="white"
            className="text-wrap p-0 m-0"
            hideSymbol
            tooltipProps={{
              showArrow: true,
              content: "Copy",
              color: "primary",
              delay: 200,
              closeDelay: 200,
            }}
            onCopy={(value) => {
              localStorage.setItem("newMedicine", JSON.stringify({ requestId: data.id, newMedicineName: data.newMedicineName }));
            }}
          >
            <span className="truncate">{data.newMedicineName}</span>
          </CustomSnippet>
        );
      case "isPurchaseNeeded":
        return <p className={`${data.isPurchaseNeeded ? "text-warning-500" : "text-primary"}`}>{isPurchaseNeededOptions[data.isPurchaseNeeded ? 0 : 1]}</p>;
      case "status":
        return <p className={`${statusColorMap.find((status) => status.status === cellValue)?.color || "text-default-400"}`}>{cellValue}</p>;
      case "actions":
        return data.status === "Đã duyệt" || data.status === "Đã hủy" ? (
          <div className="flex justify-center items-center gap-4">
            {data.status === "Đã duyệt" ? (
              <FaCheckCircle size={20} className="text-primary cursor-pointer" />
            ) : (
              <IoMdCloseCircle size={20} className="text-danger-500 cursor-pointer" />
            )}
          </div>
        ) : data.status === "Đã yêu cầu" ? (
          <div className="flex justify-center items-center gap-4">
            <Tooltip content="Chấp nhận" color="primary" closeDelay={200}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaRegThumbsUp size={20} className="text-primary cursor-pointer" onClick={() => checkRequestAuthor(data, "accept")} />
              </span>
            </Tooltip>
            <Tooltip content="Từ chối" color="danger" closeDelay={200}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <FaRegThumbsDown size={20} className="text-danger-500 cursor-pointer" onClick={() => checkRequestAuthor(data, "reject")} />
              </span>
            </Tooltip>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4 cursor-not-allowed text-default-400">
            <FaRegThumbsUp size={20} />
            <FaRegThumbsDown size={20} />
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
      <div className="mb-3 flex justify-between items-center gap-x-10">
        <div className="w-1/2">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-xl mb-2 font-semibold">Thuốc mới</p>
            {filterNewMedicine().length <= 0 ? (
              <p>Không có thuốc mới</p>
            ) : (
              <ul className="list-disc pl-5">
                {filterNewMedicine().map((medicine, index) => (
                  <li key={index}>
                    <CustomSnippet
                      variant="solid"
                      color="white"
                      className="text-wrap p-0 m-0"
                      hideSymbol
                      tooltipProps={{
                        showArrow: true,
                        content: "Copy",
                        color: "primary",
                        delay: 200,
                        closeDelay: 200,
                      }}
                      onCopy={(value) => {
                        localStorage.setItem("newMedicine", JSON.stringify({ requestId: medicine.requestId, newMedicineName: medicine.newMedicineName }));
                      }}
                    >
                      <span>{medicine.newMedicineName}</span>
                    </CustomSnippet>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="w-1/2">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-xl mb-2 font-semibold">Thuốc có nhiều yêu cầu</p>
            {filterMedicinesInManyRequests().length <= 0 ? (
              <p>Không có thuốc nào có nhiều yêu cầu</p>
            ) : (
              <ul className="list-disc pl-5">
                {filterMedicinesInManyRequests().map((medicine, index) => (
                  <li key={index}>
                    <p>
                      {medicine.medicineName} - Tổng số lượng: <strong>{medicine.quantity}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-2xl font-bold mb-3">Danh sách yêu cầu xuất thuốc</p>
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
                {selectedMedicine?.medicineName && (
                  <p className="text-lg">
                    Số lượng thuốc {selectedMedicine?.medicineName} hiện tại là {selectedMedicine?.quantity}, trong kho còn lại {medicineQuantityCheck}. <br />
                    Hãy bổ sung thêm số lượng thuốc vào kho trước khi tiếp tục.
                  </p>
                )}
                {selectedMedicine?.newMedicineName && !selectedMedicine?.medicineName && (
                  <p className="text-lg">
                    Thuốc này vẫn chưa có trong kho. <br />
                    Hãy tạo lô thuốc mới rồi tiếp tục.
                  </p>
                )}
                {/* {selectedMedicine?.medicineName && (
                  <p className="text-lg">
                    Tổng số lượng thuốc cần nhập cho thuốc {selectedMedicine?.newMedicineName || selectedMedicine?.medicineName} là{" "}
                    <strong className="text-2xl">{remainQuantity}</strong>.
                  </p>
                )} */}
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default RequestMedicineList;
