import {
  Button,
  DateValue,
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
} from "@nextui-org/react";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { Activity, Cage } from "@oursrc/lib/models/cage";
import { ResponseObject, ResponseObjectList, ResponseObjectNoPaging } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { dateTimeConverter, eliminateDate, eliminateTime } from "@oursrc/lib/utils";
import { Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { parseDate } from "@internationalized/date";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

// const columns = [
//   { name: "Thời gian", uid: "timeStamp" },
//   { name: "Đứng im", uid: "stationary", sortable: true },
//   { name: "Di chuyển", uid: "moving", sortable: true },
//   { name: "Đang ăn", uid: "feeding", sortable: true },
// ];

// const INITIAL_VISIBLE_COLUMNS = ["timeStamp", "stationary", "moving", "feeding"];

const ActivityLogList = ({ cage, date }: { cage?: Cage; date: DateValue }) => {
  const [chartData, setChartData] = React.useState<
    {
      time: string;
      stationary: number;
      moving: number;
      feeding: number;
    }[]
  >([]);
  // const chartConfig = {
  //   // pigs: {
  //   //   label: "Số lượng heo",
  //   // },
  //   stationary: {
  //     label: "Đứng im",
  //     color: "#059669",
  //   },
  //   moving: {
  //     label: "Di chuyển",
  //     color: "#10b981",
  //   },
  //   feeding: {
  //     label: "Đang ăn",
  //     color: "#6ee7b7",
  //   },
  // } satisfies ChartConfig;
  const chartConfig = {
    // pigs: {
    //   label: "Số lượng heo",
    // },
    stationary: {
      label: "Đứng im",
      color: "#10b981",
    },
    moving: {
      label: "Di chuyển",
      color: "#0ea5e9",
    },
    feeding: {
      label: "Đang ăn",
      color: "#eab308",
    },
  } satisfies ChartConfig;

  const fetchData = async () => {
    try {
      const res: ResponseObjectNoPaging<Activity> = await cageService.getActivityLogByDate(cage?.id || "", date.toString());
      if (res.isSuccess) {
        const sortedData = res.data.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());
        setChartData(
          sortedData.map((item) => ({
            time: eliminateDate(item.timeStamp),
            stationary: isNaN(Number(item.stationary)) ? 0 : Number(item.stationary),
            moving: isNaN(Number(item.moving)) ? 0 : Number(item.moving),
            feeding: isNaN(Number(item.feeding)) ? 0 : Number(item.feeding),
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [date]);
  return (
    <div>
      <ChartContainer config={chartConfig} className="h-[520px] w-full">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillStationary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillMoving" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillFeeding" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              return value;
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return value;
                }}
                indicator="dot"
              />
            }
          />
          <Area dataKey="stationary" type="natural" fill="url(#fillStationary)" stroke="#059669" stackId="a" />
          <Area dataKey="moving" type="natural" fill="url(#fillMoving)" stroke="#10b981" stackId="a" />
          <Area dataKey="feeding" type="natural" fill="url(#fillFeeding)" stroke="#6ee7b7" stackId="a" />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
        {/* <LineChart
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <YAxis dataKey={"stationary"} tickLine={false} axisLine={false} />
          <Line dataKey="stationary" type="monotone" stroke="var(--color-stationary)" strokeWidth={2} dot={false} />
          <Line dataKey="moving" type="monotone" stroke="var(--color-moving)" strokeWidth={2} dot={false} />
          <Line dataKey="feeding" type="monotone" stroke="var(--color-feeding)" strokeWidth={2} dot={false} />
          <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap mt-3 gap-4 text-lg [&>*]:justify-center" />
        </LineChart> */}
      </ChartContainer>
    </div>
  );

  // const [filterValue, setFilterValue] = React.useState("");
  // const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  // const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  // const [page, setPage] = React.useState(1);
  // const [totalRecords, setTotalRecords] = React.useState(0);
  // const [totalPages, setTotalPages] = React.useState(1);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
  //   column: "timeStamp",
  //   direction: "ascending",
  // });
  // const hasSearchFilter = Boolean(filterValue);
  // const [activityList, setActivityList] = React.useState<Activity[]>([]);

  // const headerColumns = React.useMemo(() => {
  //   if (visibleColumns === "all") return columns;
  //   return columns.filter((column: any) => Array.from(visibleColumns).includes(column.uid));
  // }, [visibleColumns]);

  // const filteredItems = React.useMemo(() => {
  //   let filteredActivity: Activity[] = [...activityList];

  //   if (hasSearchFilter) {
  //     filteredActivity = filteredActivity.filter((activity) => activity.timeStamp.toLowerCase().includes(filterValue.toLowerCase()));
  //   }
  //   // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
  //   //   filteredActivity = filteredActivity.filter((activity) => Array.from(statusFilter).includes(activity.name as string));
  //   // }
  //   // filteredActivity = filteredActivity.sort((a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime());

  //   return filteredActivity;
  // }, [activityList, statusFilter]);

  // const sortedItems = React.useMemo(() => {
  //   return [...filteredItems].sort((a: Activity, b: Activity) => {
  //     const first = a[sortDescriptor.column as keyof Activity];
  //     const second = b[sortDescriptor.column as keyof Activity];
  //     const cmp = first < second ? -1 : first > second ? 1 : 0;

  //     return sortDescriptor.direction === "descending" ? -cmp : cmp;
  //   });
  // }, [sortDescriptor, filteredItems]);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const response: ResponseObjectList<Activity> = await cageService.getActivityLog(cage?.id || "", page, rowsPerPage);
  //     if (response.isSuccess) {
  //       setActivityList(response.data.data);
  //       setRowsPerPage(response.data.pageSize);
  //       setTotalPages(response.data.totalPages);
  //       setTotalRecords(response.data.totalRecords);
  //     } else {
  //       console.log(response.errorMessage);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // React.useEffect(() => {
  //   fetchData();
  // }, [page, rowsPerPage]);

  // const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setRowsPerPage(Number(e.target.value));
  //   setPage(1);
  // }, []);

  // const onSearchChange = React.useCallback((value?: string) => {
  //   if (value) {
  //     setFilterValue(value);
  //     setPage(1);
  //   } else {
  //     setFilterValue("");
  //   }
  // }, []);

  // const onClear = React.useCallback(() => {
  //   setFilterValue("");
  //   setPage(1);
  // }, []);

  // const topContent = React.useMemo(() => {
  //   return (
  //     <div className="flex flex-col gap-4">
  //       <div className="flex justify-between gap-3 items-end">
  //         <Input
  //           isClearable
  //           className="w-full sm:max-w-[44%]"
  //           placeholder="Tìm kiếm theo tên thuốc..."
  //           startContent={<Search />}
  //           value={filterValue}
  //           onClear={() => onClear()}
  //           onValueChange={onSearchChange}
  //         />
  //         <div className="flex gap-3">
  //           <Dropdown>
  //             <DropdownTrigger className="hidden sm:flex">
  //               <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
  //                 Hiển thị cột
  //               </Button>
  //             </DropdownTrigger>
  //             <DropdownMenu
  //               disallowEmptySelection
  //               aria-label="Table Columns"
  //               closeOnSelect={false}
  //               selectedKeys={visibleColumns}
  //               selectionMode="multiple"
  //               onSelectionChange={setVisibleColumns}
  //             >
  //               {columns.map((column) => (
  //                 <DropdownItem key={column.uid} className="capitalize">
  //                   {column.name.toUpperCase()}
  //                 </DropdownItem>
  //               ))}
  //             </DropdownMenu>
  //           </Dropdown>
  //         </div>
  //       </div>
  //       <div className="flex justify-between items-center">
  //         <span className="text-default-400 text-small">Tổng cộng {totalRecords} kết quả</span>
  //         <label className="flex items-center text-default-400 text-small">
  //           Số hàng mỗi trang:
  //           <select className="bg-transparent outline-none text-default-400 text-small" onChange={onRowsPerPageChange}>
  //             <option value="5">5</option>
  //             <option value="10">10</option>
  //             <option value="15">15</option>
  //           </select>
  //         </label>
  //       </div>
  //     </div>
  //   );
  // }, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, activityList.length, hasSearchFilter]);

  // const renderCell = React.useCallback((data: Activity, columnKey: React.Key) => {
  //   const cellValue = data[columnKey as keyof Activity];
  //   switch (columnKey) {
  //     case "timeStamp":
  //       return dateTimeConverter(cellValue as string);
  //     default:
  //       return cellValue;
  //   }
  // }, []);

  // const bottomContent = React.useMemo(() => {
  //   return (
  //     <div className="py-2 px-2 flex justify-center items-center">
  //       {/* <span className="w-[30%] text-small text-default-400">{selectedMedicine === "all" ? "Đã chọn tất cả" : `Đã chọn ${selectedMedicine.size} kết quả`}</span> */}
  //       <Pagination isCompact showControls showShadow color="primary" page={page} total={totalPages} onChange={setPage} />
  //       {/* <div className="hidden sm:flex w-[30%] justify-end gap-2"></div> */}
  //     </div>
  //   );
  // }, [filteredItems.length, page, totalPages, hasSearchFilter]);
  // return (
  //   <Table
  //     aria-label="Example table with custom cells, pagination and sorting"
  //     layout="fixed"
  //     color="primary"
  //     isHeaderSticky
  //     bottomContent={bottomContent}
  //     bottomContentPlacement="outside"
  //     // classNames={{
  //     //   wrapper: "max-h-[400px] w-full overflow-auto",
  //     // }}
  //     selectionMode="none"
  //     sortDescriptor={sortDescriptor}
  //     topContent={topContent}
  //     topContentPlacement="outside"
  //     // selectedKeys={selectedMedicine && selectedMedicine.id ? new Set([selectedMedicine.id]) : new Set<string>()}
  //     // onSelectionChange={(selectedKeys: Selection) => {
  //     //   const selectedKeysArray = Array.from(selectedKeys);
  //     //   const selectedMedicines = medicineList.filter((medicine) => medicine.id && selectedKeysArray.includes(medicine.id));
  //     //   setSelectedMedicine(selectedMedicines[0]);
  //     // }}
  //     onSortChange={setSortDescriptor}
  //   >
  //     <TableHeader columns={headerColumns}>
  //       {(column: any) => (
  //         <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
  //           {column.name.toUpperCase()}
  //         </TableColumn>
  //       )}
  //     </TableHeader>
  //     <TableBody emptyContent={"Không có kết quả"} items={sortedItems} loadingContent={<Spinner />} loadingState={loading ? "loading" : "idle"}>
  //       {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
  //     </TableBody>
  //   </Table>
  // );
};

export default ActivityLogList;
