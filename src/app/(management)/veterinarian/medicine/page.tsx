"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
} from "@nextui-org/react";
import { MedicineRequest } from "@oursrc/lib/models/medicine-request";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import React from "react";
import { HiChevronDown } from "react-icons/hi2";
import { MdOutlineWarehouse } from "react-icons/md";
import { TbPackageExport } from "react-icons/tb";
import MedicineList from "./_components/medicine-list";

const statusColorMap = {
  "Chờ xử lý": "warning",
  "Đã yêu cầu": "sky",
  "Đã duyệt": "success",
  "Đã hủy": "danger",
};

const columns = [
  { name: "TÊN", uid: "medicineName", sortable: true },
  { name: "SỐ LƯỢNG", uid: "quantity", sortable: true },
  { name: "TRẠNG THÁI", uid: "status" },
];

const INITIAL_VISIBLE_COLUMNS = ["medicineName", "quantity", "status"];

const Medicine = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [requestMedicineList, setRequestMedicineList] = React.useState<MedicineRequest[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "lastUpdatedAt",
    direction: "ascending",
  });
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") return "Tất cả";
    else if (filterStatus === "Chờ xử lý") return "Chờ xử lý";
    else if (filterStatus === "Đã yêu cầu") return "Đã yêu cầu";
    else if (filterStatus === "Đã duyệt") return "Đã duyệt";
    else if (filterStatus === "Đã hủy") return "Đã hủy";
  }, [filterStatus]);

  // const filterMedicineRequest = (status: string) => {
  //   const data = requestMedicineList || [];
  //   if (status === "all") return data;
  //   else if (status === "Chờ xử lý") return data.filter((item) => item.status === "Chờ xử lý");
  //   else if (status === "Đã yêu cầu") return data.filter((item) => item.status === "Đã yêu cầu");
  //   else if (status === "Đã duyệt") return data.filter((item) => item.status === "Đã duyệt");
  //   else if (status === "Từ chối") return data.filter((item) => item.status === "Từ chối");
  //   else return data;
  // };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<MedicineRequest> = await medicineRequestService.getMyMedicineRequest(page, rowsPerPage);
      if (response.isSuccess) {
        setRequestMedicineList(response.data.data);
        setTotalRecords(response.data.totalRecords);
        setTotalPages(response.data.totalPages);
        setPage(response.data.pageIndex);
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const items = React.useMemo(() => {
    let filterMedicineRequest: MedicineRequest[] = [...requestMedicineList];
    if (filterStatus !== "all") {
      filterMedicineRequest = filterMedicineRequest.filter((item) => item.status === filterStatus);
    }
    return filterMedicineRequest;
  }, [requestMedicineList, filterStatus]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: MedicineRequest, b: MedicineRequest) => {
      const first = a[sortDescriptor.column as keyof MedicineRequest] as string;
      const second = b[sortDescriptor.column as keyof MedicineRequest] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-3">
          <p className="text-2xl font-bold">Danh sách yêu cầu xuất thuốc của bạn</p>
          <div className="flex space-x-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button color="primary" endContent={<HiChevronDown className="text-small" />} variant="ghost">
                  {filterValue}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={filterStatus ? [filterStatus] : []}
                onSelectionChange={(keys: any) => {
                  setFilterStatus(keys.values().next().value);
                  // setRequestMedicineList(filterMedicineRequest(keys === "all" ? "all" : keys.values().next().value));
                }}
              >
                <DropdownItem key="all">Tất cả</DropdownItem>
                <DropdownItem key="Chờ xử lý">Chờ xử lý</DropdownItem>
                <DropdownItem key="Đã yêu cầu">Đã yêu cầu</DropdownItem>
                <DropdownItem key="Đã duyệt">Đã duyệt</DropdownItem>
                <DropdownItem key="Đã hủy">Đã hủy</DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
  }, [filterValue, visibleColumns, onRowsPerPageChange, requestMedicineList.length]);

  const renderCell = React.useCallback((data: MedicineRequest, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof MedicineRequest];

    switch (columnKey) {
      case "status":
        return (
          <div className="flex items-center">
            <span className={`text-${statusColorMap[cellValue as keyof typeof statusColorMap]}-500`}>{cellValue}</span>
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
  }, [sortedItems.length, page, totalPages]);
  return (
    <div className="mt-3">
      <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="1">
        <Tab
          key="1"
          title={
            <div className="flex items-center">
              <TbPackageExport size={20} />
              <span className="ml-2">Yêu cầu xuất thuốc</span>
            </div>
          }
        >
          <Table
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            // selectedKeys={selectedKeys}
            // selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            // onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
                  {column.name.toUpperCase()}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={isLoading ? "loading" : "idle"}>
              {(item) => (
                <TableRow key={item.id} className="h-12">
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center">
              <MdOutlineWarehouse size={20} />
              <span className="ml-2">Kho thuốc</span>
            </div>
          }
        >
          <MedicineList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Medicine;
