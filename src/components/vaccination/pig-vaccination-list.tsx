"use client";
import { Selection, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { ResponseObject, ResponseObjectList, ResponseObjectNoPaging } from "@oursrc/lib/models/response-object";
import { VaccinationData } from "@oursrc/lib/models/vaccination";
import { pigService } from "@oursrc/lib/services/pigService";
import { dateTimeConverter } from "@oursrc/lib/utils";
import React, { useMemo } from "react";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang thực hiện", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

const PigVaccinationList = ({ pigId, setCurrentStages }: { pigId: string; setCurrentStages: any }) => {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
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
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusMap.length) {
    //   filteredVaccination = filteredVaccination.filter((vaccination) => Array.from(statusFilter).includes(vaccination.status as number));
    // }

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

  const getAllVaccinationPlanById = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectNoPaging<VaccinationData> = await pigService.getVaccinationPlanByPigId(pigId);
      if (res && res.isSuccess) {
        setVaccinationList(res.data || []);
      } else {
        console.log("Error: ", res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getAllVaccinationPlanById();
  }, [pigId]);

  React.useEffect(() => {
    const selectedVaccinationId = Array.from(selectedKeys)[0];
    const currentVaccinationPlan = vaccinationList.find((x: VaccinationData) => x.id === selectedVaccinationId);
    setCurrentStages(currentVaccinationPlan?.vaccinationStages ?? []);
  }, [selectedKeys]);
  return (
    <Table
      color="primary"
      classNames={{
        wrapper: "max-h-[500px] overflow-auto",
      }}
      selectionMode="single"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      //   align="center"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      aria-label="Example static collection table"
    >
      <TableHeader>
        <TableColumn allowsSorting className="text-md">
          Tên lịch
        </TableColumn>
        <TableColumn allowsSorting className="text-md">
          Ngày bắt đầu
        </TableColumn>
        <TableColumn allowsSorting className="text-md">
          Ngày kết thúc (dự kiến)
        </TableColumn>
        <TableColumn allowsSorting className="text-md">
          Tình trạng
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={"Không có kết quả"} loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={sortedItems}>
        {vaccinationList.map((data: VaccinationData) => (
          <TableRow key={data.id}>
            <TableCell>{data.title}</TableCell>
            <TableCell>{dateTimeConverter(data.startDate)}</TableCell>
            <TableCell>{dateTimeConverter(data.expectedEndDate)}</TableCell>
            <TableCell>
              <p className={`text-center ${statusColorMap.find((status) => status.status === String(data.status))?.color}`}>{data.status}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PigVaccinationList;
