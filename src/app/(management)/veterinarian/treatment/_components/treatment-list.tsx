"use client";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, SortDescriptor, Selection } from "@nextui-org/react";
import React, { useMemo } from "react";
import { VaccinationData } from "../../../../../lib/models/vaccination";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { TreatmentData } from "@oursrc/lib/models/treatment";

const statusMapColor = [
  { name: "red", value: 0 },
  { name: "blue", value: 1 },
  { name: "green", value: 2 },
  { name: "red", value: 3 },
];
const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang thực hiện", value: 1 },
  { name: "Đã hoàn thành", value: 2 },
  { name: "Đã hủy", value: 3 },
];

const treatmentData: TreatmentData[] = [
  {
    id: "1",
    title: "Lịch 1",
    description: "Mô tả 1",
    herdId: "1",
    startDate: "2022-10-10",
    expectedEndDate: "2022-10-20",
    actualEndDate: "2022-10-20",
    note: "Ghi chú 1",
    status: 0,
    treatmentStages: [
      {
        title: "Bước 1",
        applyStageTime: "2022-10-10",
        timeSpan: "10",
        isDone: false,
        treatmentToDos: [{ description: "Mô tả 1" }],
        inventoryRequest: {
          id: "1",
          medicines: [
            {
              medicineId: "1",
              medicineName: "Thuốc 1",
              quantity: 10,
              netWeight: "10",
              portionEachPig: 10,
              unit: "kg",
            },
          ],
          description: "Mô tả 1",
          title: "Yêu cầu 1",
        },
      },
    ],
  },
  {
    id: "2",
    title: "Lịch 2",
    description: "Mô tả 2",
    herdId: "2",
    startDate: "2022-10-10",
    expectedEndDate: "2022-10-20",
    actualEndDate: "2022-10-20",
    note: "Ghi chú 2",
    status: 1,
    treatmentStages: [
      {
        title: "Bước 2",
        applyStageTime: "2022-10-10",
        timeSpan: "10",
        isDone: false,
        treatmentToDos: [{ description: "Mô tả 2" }],
        inventoryRequest: {
          id: "2",
          medicines: [
            {
              medicineId: "1",
              medicineName: "Thuốc 1",
              quantity: 10,
              netWeight: "10",
              portionEachPig: 10,
              unit: "kg",
            },
          ],
          description: "Mô tả 2",
          title: "Yêu cầu 2",
        },
      },
    ],
  },
];

const TreatmentList = ({ setSelectedTreatment }: { setSelectedTreatment: any }) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [treatmentList, setTreatmentList] = React.useState<TreatmentData[]>(treatmentData);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set([]));
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const hasSearchFilter = filterValue.length > 0;

  const filteredItems = React.useMemo(() => {
    let filteredVaccination: TreatmentData[] = [...treatmentList];

    if (hasSearchFilter) {
      filteredVaccination = filteredVaccination.filter((vaccination) => vaccination.title.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusMap.length) {
      filteredVaccination = filteredVaccination.filter((vaccination) => Array.from(statusFilter).includes(vaccination.status as number));
    }

    return filteredVaccination;
  }, [treatmentList, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: TreatmentData, b: TreatmentData) => {
      const first = a[sortDescriptor.column as keyof TreatmentData] as unknown as number;
      const second = b[sortDescriptor.column as keyof TreatmentData] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const getAllVaccinationPlan = async () => {
    try {
      //   setIsLoading(true);
      //   const res: ResponseObjectList<TreatmentData> = await vaccinationService.getAllVaccinationPlan(1, 500);
      //   console.log("res: ", res);
      //   if (res && res.isSuccess) {
      //     setTreatmentList(res.data.data || []);
      //   } else {
      //     console.log("Error: ", res.errorMessage);
      //   }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(selectedKeys);

  React.useEffect(() => {
    getAllVaccinationPlan();
  }, []);
  return (
    <Table
      color="primary"
      classNames={{
        wrapper: "max-h-[250px] overflow-auto",
      }}
      selectionMode="single"
      isHeaderSticky
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      //   align="center"
      // selectedKeys={selectedKeys}
      onSelectionChange={setSelectedTreatment}
      aria-label="Example static collection table"
    >
      <TableHeader>
        <TableColumn allowsSorting className="text-lg">
          Tên lịch
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Đàn
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Ngày bắt đầu
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Ngày kết thúc (dự kiến)
        </TableColumn>
        <TableColumn allowsSorting className="text-lg">
          Tình trạng
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"Không có kết quả"} loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={sortedItems}>
        {treatmentList.map((data: TreatmentData) => (
          <TableRow key={data.id}>
            <TableCell>{data.title}</TableCell>
            <TableCell>{data.herdId}</TableCell>
            <TableCell>{dateTimeConverter(data.startDate)}</TableCell>
            <TableCell>{dateTimeConverter(data.expectedEndDate)}</TableCell>
            <TableCell>
              <p className={`text-${statusMapColor.find((status) => status.value === data.status)?.name}-500 text-center`}>
                {statusMap.find((status) => status.value === data.status)?.name}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TreatmentList;
