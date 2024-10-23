"use client";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from "@nextui-org/react";
import { MedicineEachStage, MedicineInStage } from "@oursrc/lib/models/vaccination";
import { Plus, Trash2Icon } from "lucide-react";
import React from "react";
// import AddMedicineToStageModal from "./_modals/add-medine-to-stage-modal";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import AddMedicineToStageModal from "./_modals/add-medine-to-stage-modal";
const MedicineListInStage = ({ medicineInStageProp, updateMedicines }: { medicineInStageProp: MedicineInStage; updateMedicines: any }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [medicinesInStage, setMedicinesInStage] = React.useState<MedicineInStage>(medicineInStageProp);
  const [selectedMedicine, setSelectedMedicine] = React.useState<any>({});

  React.useEffect(() => {
    if (Object.entries(selectedMedicine).length > 0) {
      let newMedicines: MedicineEachStage[];
      if (pluck("medicineId", medicinesInStage.medicines).includes(selectedMedicine.id)) {
        newMedicines = medicinesInStage.medicines.map((x: MedicineEachStage) =>
          x.medicineId === selectedMedicine.id
            ? {
                ...x,
                portionEachPig: x.portionEachPig + Number(selectedMedicine.portionEachPig),
              }
            : { ...x }
        );
      } else {
        newMedicines = [
          {
            medicineId: selectedMedicine.id,
            medicineName: selectedMedicine.name,
            quantity: selectedMedicine.quantity,
            netWeight: selectedMedicine.netWeight,
            unit: selectedMedicine.unit,
            portionEachPig: selectedMedicine.portionEachPig,
          },
        ];
      }
      const newMedicinesInStage = {
        ...medicinesInStage,
        medicines: newMedicines,
      };
      setMedicinesInStage(newMedicinesInStage);
      updateMedicines(newMedicinesInStage);
      onClose();
    }
  }, [selectedMedicine]);
  const onRemove = (medicineId: string) => {
    const newMedicines = medicinesInStage.medicines.filter((medicine) => medicine.medicineId !== medicineId);

    const newMedicinesInStage = {
      ...medicinesInStage,
      medicines: newMedicines,
    };

    setMedicinesInStage(newMedicinesInStage);
    updateMedicines(newMedicinesInStage);
  };

  const columns = [
    { name: "", uid: "actions" },
    { name: "TÊN THUỐC", uid: "medicineName" },
    { name: "SỐ LIỀU CHO TỪNG CON", uid: "portionEachPig" },
    { name: "SỐ LƯỢNG TRONG KHO", uid: "quantity" },
    { name: "TRỌNG LƯỢNG", uid: "netWeight" },
    { name: "ĐƠN VỊ", uid: "unit" },
  ];

  const renderCell = React.useCallback((data: MedicineEachStage, columnKey: React.Key, index: number) => {
    const cellValue = data[columnKey as keyof MedicineEachStage];
    switch (columnKey) {
      case "medicineName":
      case "netWeight":
      case "unit":
        return (
          <Tooltip showArrow={true} content={cellValue} color="primary" delay={1000}>
            <p className="truncate cursor-default">{cellValue}</p>
          </Tooltip>
        );
      case "type":
        return cellValue === "new" ? "Mới tạo" : "Có sẵn";
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            {data.medicineId !== "" && (
              <Tooltip color="danger" content="Xóa thuốc">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash2Icon onClick={() => onRemove(data.medicineId)} />
                </span>
              </Tooltip>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div>
      <Table>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
              {column.uid === "actions" && <Plus className="cursor-pointer" onClick={onOpen} />}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Chưa chọn thuốc cho giai đoạn này"}>
          {medicinesInStage.medicines.map((item: MedicineEachStage, index: number) => (
            <TableRow key={item?.medicineId ?? 0}>{(columnKey) => <TableCell>{renderCell(item, columnKey, index)}</TableCell>}</TableRow>
          ))}
        </TableBody>
      </Table>
      <AddMedicineToStageModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} setSelectedMedicine={setSelectedMedicine} />
    </div>
  );
};
export default MedicineListInStage;
