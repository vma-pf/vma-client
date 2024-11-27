"use client";
import { Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { dateTimeConverter } from "@oursrc/lib/utils";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import React, { useMemo } from "react";

const statusMapColor = [
  { name: "red", value: 0 },
  { name: "green", value: 1 },
];
const PigVaccinationStageList = ({ stages }: { stages: VaccinationStageProps[] | [] }) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [vaccinationStageList, setVaccinationStageList] = React.useState<VaccinationStageProps[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Selection>(new Set([]));
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const hasSearchFilter = filterValue.length > 0;

  React.useEffect(() => {
    setVaccinationStageList(stages);
  }, [stages]);

  const filteredItems = React.useMemo(() => {
    let filteredVaccination: VaccinationStageProps[] = [...vaccinationStageList];

    if (hasSearchFilter) {
      filteredVaccination = filteredVaccination.filter((vaccination) => vaccination.title.toLowerCase().includes(filterValue.toLowerCase()));
    }
    // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusMap.length) {
    //   filteredVaccination = filteredVaccination//.filter((vaccination) => Array.from(statusFilter).includes(vaccination.applyStageTime as number));
    // }

    return filteredVaccination;
  }, [vaccinationStageList, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [filteredItems]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: VaccinationStageProps, b: VaccinationStageProps) => {
      const first = a[sortDescriptor.column as keyof VaccinationStageProps] as unknown as number;
      const second = b[sortDescriptor.column as keyof VaccinationStageProps] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  return (
    <div>
      <Table
        color="primary"
        classNames={{
          wrapper: "max-h-[600px] overflow-auto",
        }}
      >
        <TableHeader>
          <TableColumn allowsSorting className="text-md">
            Tên giai đoạn
          </TableColumn>
          <TableColumn allowsSorting className="text-md">
            Ngày bắt đầu
          </TableColumn>
          <TableColumn allowsSorting className="text-md">
            Số ngày dự kiến
          </TableColumn>
          <TableColumn allowsSorting className="text-md">
            Các bước cần thực hiện
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Không có kết quả"} items={sortedItems}>
          {vaccinationStageList.map((data: VaccinationStageProps) => (
            <TableRow key={data.id}>
              <TableCell>{data.title}</TableCell>
              <TableCell>{dateTimeConverter(data.applyStageTime)}</TableCell>
              <TableCell>{data.timeSpan}</TableCell>
              <TableCell>{pluck("description", data.vaccinationToDos).join("</br>")}</TableCell>
              {/* <TableCell>
                <p
                  className={`text-${
                    statusMap.find(
                      (status) => status.value === data.isDone
                    )?.name
                  }-500 text-center`}
                >
                  {
                    statusMap.find((status) => status.value === data.status)
                      ?.name
                  }
                </p>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default PigVaccinationStageList;
