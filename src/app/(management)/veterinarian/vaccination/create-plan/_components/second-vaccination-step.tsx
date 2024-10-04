"use client";
import {
  Accordion,
  AccordionItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import React from "react";
import AddMedicineToStageModal from "../_modals/add-medine-to-stage-modal";
import {
  MedicineEachStage,
  MedicineInStage,
} from "../_models/medicine-in-stage";

const SecondVaccinationStep = ({ setStep, vaccinationPlan }: any) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [medicinesInStage, setMedicinesInStage] = React.useState<
    MedicineInStage[]
  >([]);
  const [selectedMedicine, setSelectedMedicine] = React.useState<{}>({});
  const data = {
    vaccinationPlanId: "b6ebd3c6-192d-4d26-8f06-e40b22a54b15",
    vaccinationPlanTitle: "qwe",
    vaccinationStages: [
      {
        id: "57435374-e5be-4a38-98e9-4c8633ad0da5",
        title: "1 10/05/2024 00:00:00",
        timeSpan: "1",
        applyStageTime: "2024-10-05T00:00:00+00:00",
        isDone: false,
      },
      {
        id: "57435374-e5be-4a38-98e9-4c8633ad0da5",
        title: "1 10/06/2024 00:00:00",
        timeSpan: "1",
        applyStageTime: "2024-10-05T00:00:00+00:00",
        isDone: false,
      },
    ],
  };

  React.useEffect(() => {
    console.log(selectedMedicine);
    if (selectedMedicine) {
      const newMedicinInStage = medicinesInStage
      onClose();
    }
  }, [selectedMedicine]);

  React.useEffect(() => {
    setMedicinesInStage(
      data.vaccinationStages.map((x: any, index: number) => ({
        vaccinationStageId: x.id,
        title: x.title,
        description: "",
        medicines: [
          {
            medicineId: "",
            newMedicineName: "",
            isPurchaseNeeded: false,
            portionEachPig: 0,
          },
        ],
      }))
    );
  }, []);

  const onAddMedicine = () => {};

  const columns = [
    { name: "TÊN THUỐC", uid: "medicineName" },
    { name: "TRỌNG LƯỢNG", uid: "netWeight" },
    { name: "SỐ LƯỢNG TRONG KHO", uid: "quantity" },
    { name: "", uid: "actions" },
  ];

  const renderCell = React.useCallback(
    (data: MedicineEachStage, columnKey: React.Key) => {
      const cellValue = data[columnKey as keyof MedicineEachStage];

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Tooltip content="Thêm thuốc">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <PlusCircleIcon onClick={onOpen} />
                </span>
              </Tooltip>
              {data.medicineId !== "" && (
                <Tooltip color="danger" content="Xóa thuốc">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <Trash2Icon />
                  </span>
                </Tooltip>
              )}
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div className="container mx-auto mt-8">
      <Accordion variant="splitted">
        {medicinesInStage.map((x: MedicineInStage, index: number) => {
          return (
            <AccordionItem key={index} title={x.title}>
              <Table>
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.uid}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={x.medicines}>
                  {(item) => (
                    <TableRow key={item.medicineId}>
                      {(columnKey) => (
                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionItem>
          );
        })}
      </Accordion>
      <AddMedicineToStageModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        setSelectedMedicine={setSelectedMedicine}
      />
    </div>
  );
};
export default SecondVaccinationStep;
