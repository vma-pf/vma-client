"use client";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, SortDescriptor, Selection } from "@nextui-org/react";
import React, { useMemo } from "react";
import { VaccinationData } from "../../../../../lib/models/vaccination";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";

const statusMapColor = [
  { name: "red", value: 0 },
  { name: "green", value: 1 },
  { name: "blue", value: 2 },
  { name: "red", value: 3 },
];
const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang thực hiện", value: 1 },
  { name: "Chưa thực hiện", value: 2 },
  { name: "Đã hủy", value: 3 },
];

const VaccinationList = ({ setSelectedVaccination }: { setSelectedVaccination: any }) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [vaccinationList, setVaccinationList] = React.useState<VaccinationData[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set([]));
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const hasSearchFilter = filterValue.length > 0;

  const filteredItems = React.useMemo(() => {
    let filteredVaccination: VaccinationData[] = [...vaccinationList];

    if (hasSearchFilter) {
      filteredVaccination = filteredVaccination.filter((vaccination) => vaccination.title.toLowerCase().includes(filterValue.toLowerCase()));
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusMap.length) {
      filteredVaccination = filteredVaccination.filter((vaccination) => Array.from(statusFilter).includes(vaccination.status as number));
    }

    return filteredVaccination;
  }, [vaccinationList, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: VaccinationData, b: VaccinationData) => {
      const first = a[sortDescriptor.column as keyof VaccinationData] as unknown as number;
      const second = b[sortDescriptor.column as keyof VaccinationData] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const getAllVaccinationPlan = async () => {
    try {
      const res: ResponseObjectList<VaccinationData> = await vaccinationService.getAllVaccinationPlan(1, 500);
      console.log("res: ", res);
      if (res && res.isSuccess) {
        setVaccinationList(res.data.data);
      } else {
        console.log("Error: ", res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

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
      onSelectionChange={setSelectedVaccination}
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
      <TableBody loadingContent={<Spinner label="Loading..." />} items={sortedItems}>
        {vaccinationList.map((data: VaccinationData) => (
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

export default VaccinationList;
