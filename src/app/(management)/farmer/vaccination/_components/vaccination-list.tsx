"use client";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, SortDescriptor, Selection } from "@nextui-org/react";
import React, { useMemo } from "react";
import { VaccinationData } from "../../../../../lib/models/vaccination";

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
const VaccinationList = ({ data, setSelectedVaccination }: { data: VaccinationData[]; setSelectedVaccination: any }) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "title",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    return [...data].sort((a: VaccinationData, b: VaccinationData) => {
      const first = a[sortDescriptor.column as keyof VaccinationData] as unknown as number;
      const second = b[sortDescriptor.column as keyof VaccinationData] as unknown as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [data, sortDescriptor]);
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
        {data.map((data: VaccinationData) => (
          <TableRow key={data.id}>
            <TableCell>{data.title}</TableCell>
            <TableCell>{data.herdId}</TableCell>
            <TableCell>{data.startDate}</TableCell>
            <TableCell>{data.expectedEndDate}</TableCell>
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
