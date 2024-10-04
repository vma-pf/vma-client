"use client";
import { Chip, Input, Pagination, Selection, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { Pig } from "@oursrc/lib/models/pig";
import React from "react";
import { columns, INITIAL_VISIBLE_COLUMNS, statusOptions } from "../_models/pig-model-data";
import { CircleAlert, CircleCheck, CircleDashed, Search } from "lucide-react";

const SelectedPigsList = ({ pigList = [] }: any) => {
  //Table Field
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(30);
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

  const [loading, setLoading] = React.useState(false);
  const loadingState = loading || pigList?.length === 0 ? "loading" : "idle";

  const filteredItems = React.useMemo(() => {
    let cloneFilteredItems: Pig[] = [...pigList];

    if (hasSearchFilter) {
      cloneFilteredItems = cloneFilteredItems.filter((item) => item.pigCode.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      cloneFilteredItems = cloneFilteredItems.filter((item) => Array.from(statusFilter).includes(item.pigCode as string));
    }
    return cloneFilteredItems;
  }, [pigList, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    return filteredItems;
  }, [filteredItems]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Pig, b: Pig) => {
      const first = a[sortDescriptor.column as keyof Pig] as number;
      const second = b[sortDescriptor.column as keyof Pig] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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
        <div className="flex justify-between gap-3 items-start">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Tìm kiếm theo mã..."
            startContent={<Search />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex flex-col items-end">
            {pigList.length > 0 ? (
              <Tooltip color="success" content="Đã chọn">
                <CircleCheck size={30} color="#29aa18" />
              </Tooltip>
            ) : (
              <Tooltip color="danger" content="Chưa chọn">
                <CircleAlert size={30} color="#da1010" />
              </Tooltip>
            )}
            <span className="mt-1 text-default-400 text-small">
              Tổng số <strong>{pigList.length}</strong> con được chọn để tiêm phòng
            </span>
          </div>
        </div>
      </div>
    );
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, pigList.length, hasSearchFilter]);
  const renderCell = React.useCallback((data: Pig, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof Pig];

    switch (columnKey) {
      case "breed":
      case "pigCode":
      case "cageCode":
      case "healthStatus":
        return (
          <Tooltip showArrow={true} content={cellValue} color="primary" delay={1000}>
            <p className="truncate">{cellValue}</p>
          </Tooltip>
        );
      // case "actions":
      //   return (
      //     <div className="flex justify-end items-center gap-2">
      //       <Tooltip content="Chi tiết">
      //         <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //           <EyeIcon />
      //         </span>
      //       </Tooltip>
      //       <Tooltip content="Chỉnh sửa">
      //         <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
      //           <EditIcon onClick={() => onEdit(data)} />
      //         </span>
      //       </Tooltip>
      //       <Tooltip color="danger" content="Xóa">
      //         <span className="text-lg text-danger cursor-pointer active:opacity-50">
      //           <Trash2Icon onClick={() => onDelete(data)} />
      //         </span>
      //       </Tooltip>
      //     </div>
      //   );
      default:
        return cellValue;
    }
  }, []);
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">{selectedKeys === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedKeys.size} kết quả`}</span>
        {/* <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        /> */}
        <div className="hidden sm:flex w-[30%] justify-end gap-2"></div>
      </div>
    );
  }, [selectedKeys, items.length, page, totalPages, hasSearchFilter]);
  return (
    <div>
      <Table
        color="success"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "min-h-[550px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="single"
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
        <TableBody
          emptyContent={"Không có kết quả"}
          items={sortedItems}
          // loadingContent={<Spinner />}
          // loadingState={loadingState}
        >
          {(item) => (
            <TableRow key={item.id} className="h-12">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default SelectedPigsList;
