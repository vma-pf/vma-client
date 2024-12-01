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
import { Edit, Plus, Search, Trash } from "lucide-react";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { User } from "@oursrc/lib/models/account";
import { accountService } from "@oursrc/lib/services/accountService";
import AddEditUser from "./_modals/add-edit-user";
import { LuUserCheck, LuUserX } from "react-icons/lu";

const roleNameMap = [
  { role: "Veterinarian", name: "Bác sĩ thú y" },
  { role: "Farmer", name: "Chủ trang trại" },
  { role: "FarmerAssistant", name: "Nhân viên trang trại" },
  { role: "Admin", name: "Quản trị viên" },
];

const columns = [
  { uid: "email", name: "Email", sortable: true },
  { uid: "username", name: "Tên đăng nhập", sortable: true },
  { uid: "roleName", name: "Vai trò", sortable: true },
  { uid: "isActive", name: "Tình trạng", sortable: true },
  { uid: "actions", name: "Hành động", sortable: false },
];

const INITIAL_VISIBLE_COLUMNS = ["name", "email", "username", "roleName", "isActive", "actions"];

const AccountList = () => {
  const [userList, setUserList] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [page, setPage] = React.useState<number>(1);
  const [pages, setPages] = React.useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "breed",
    direction: "ascending",
  });

  const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
  const { isOpen: isOpenActivate, onOpen: onOpenActivate, onClose: onCloseActivate } = useDisclosure();
  const { isOpen: isOpenDeactivate, onOpen: onOpenDeactivate, onClose: onCloseDeactivate } = useDisclosure();
  const [selectedUser, setSelectedUser] = React.useState<User>();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers: User[] = [...userList];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => user.username.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return filteredUsers;
  }, [userList, filterValue, statusFilter]);

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as string;
      const second = b[sortDescriptor.column as keyof User] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<User> = await accountService.getAll(page, rowsPerPage);
      if (response.isSuccess) {
        setUserList(response.data.data || []);
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

  const renderCell = React.useCallback((pig: User, columnKey: React.Key) => {
    const cellValue = pig[columnKey as keyof User];

    switch (columnKey) {
      case "roleName":
        return roleNameMap.find((role) => role.role === cellValue)?.name;
      case "isActive":
        return cellValue ? (
          <Chip size="sm" color="primary">
            Hoạt động
          </Chip>
        ) : (
          <Chip size="sm" color="danger">
            Không hoạt động
          </Chip>
        );
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip content="Kích hoạt">
              <Button
                size="sm"
                variant="light"
                color="warning"
                isDisabled={pig.isActive}
                onPress={() => {
                  setSelectedUser(pig);
                  onOpenActivate();
                }}
                isIconOnly
              >
                <LuUserCheck size={20} />
              </Button>
            </Tooltip>
            <Tooltip content="Vô hiệu hóa">
              <Button
                size="sm"
                variant="light"
                color="danger"
                isIconOnly
                isDisabled={!pig.isActive}
                onPress={() => {
                  setSelectedUser(pig);
                  onOpenDeactivate();
                }}
              >
                <LuUserX size={20} />
              </Button>
            </Tooltip>
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
            placeholder="Tìm kiếm theo tên đăng nhập"
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
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
            <Button variant="solid" color="primary" onPress={onOpenCreate} endContent={<Plus />}>
              Thêm người dùng
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
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, userList.length, hasSearchFilter]);

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
        // selectedKeys={selectedKeys}
        // selectionMode="multiple"
        // onSelectionChange={setSelectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
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
      {isOpenCreate && <AddEditUser isOpen={isOpenCreate} onClose={onCloseCreate} operation="add" />}
      {isOpenActivate && selectedUser && <AddEditUser isOpen={isOpenActivate} onClose={onCloseActivate} operation="activate" user={selectedUser} />}
      {isOpenDeactivate && selectedUser && <AddEditUser isOpen={isOpenDeactivate} onClose={onCloseDeactivate} operation="deactivate" user={selectedUser} />}
    </div>
  );
};

export default AccountList;
