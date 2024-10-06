import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { MedicineInStage } from "@oursrc/lib/models/vaccination";
import { DeleteIcon, EditIcon, EyeIcon } from "lucide-react";
import React from "react";

const AddMedicineToStage = ({ stageIndex, setMedicinesInStage }: any, medicinesInStage: MedicineInStage[]) => {
  const columns = [
    { name: "TÊN THUỐC", uid: "medicineName" },
    { name: "TRỌNG LƯỢNG", uid: "netWeight" },
    { name: "SỐ LƯỢNG TRONG KHO", uid: "quantity" },
    { name: "", uid: "actions" },
  ];

  const renderCell = React.useCallback((data: any, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof any];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <Table>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={medicinesInStage}>
        {(item) => <TableRow key={item.vaccinationStageId}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  );
};
export default AddMedicineToStage;
