"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Plus, Trash2Icon } from "lucide-react";
import React from "react";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import AddMedicineToStageModal from "@oursrc/components/medicines/modals/add-medine-to-stage-modal";
import { v4 } from "uuid";
import { MedicineTemplate, PlanTemplate, StageTemplate } from "@oursrc/lib/models/plan-template";

const MedicineListInStage = ({ stage, setPlan }: { stage: StageTemplate; setPlan: React.Dispatch<React.SetStateAction<PlanTemplate | undefined>> }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
  // const [medicineEachStage, setMedicinesEachStage] = React.useState<MedicineEachStage[]>([]);
  const [selectedMedicine, setSelectedMedicine] = React.useState<any>({});
  const [selectedMedicineId, setSelectedMedicineId] = React.useState<string>("");

  React.useEffect(() => {
    if (Object.entries(selectedMedicine).length > 0) {
      let newMedicines: MedicineTemplate[];
      if (stage.medicineTemplates.length > 0) {
        const existingMedicine = stage.medicineTemplates.find(
          (medicine) => medicine.medicineId === selectedMedicine.id || medicine.medicineName === selectedMedicine.name
        );
        if (existingMedicine) {
          const updatedMedicine = {
            ...existingMedicine,
            portionEachPig: existingMedicine.portionEachPig + selectedMedicine.portionEachPig,
          };
          newMedicines = stage.medicineTemplates.map((medicine) =>
            medicine.medicineId === selectedMedicine.id || medicine.medicineName === selectedMedicine.name ? updatedMedicine : medicine
          );
        } else {
          newMedicines = [
            ...stage.medicineTemplates,
            {
              medicineId: selectedMedicine.id,
              medicineName: selectedMedicine.name,
              stageTemplateId: stage.id ?? "",
              portionEachPig: selectedMedicine.portionEachPig,
              id: v4(),
            },
          ];
        }
      } else {
        newMedicines = [selectedMedicine];
      }
      const newMedicinesInStage = {
        ...stage,
        medicineTemplates: newMedicines,
      };

      setPlan((prevPlan) => {
        if (prevPlan) {
          const newStages = prevPlan.stageTemplates.map((x) => (x.id === stage.id ? newMedicinesInStage : x));
          return { ...prevPlan, stageTemplates: newStages };
        }
        return prevPlan;
      });

      setSelectedMedicine({});
    }
  }, [selectedMedicine]);

  const onRemove = () => {
    if (stage.medicineTemplates.length > 0) {
      const newMedicinesInStage = {
        ...stage,
        medicineTemplates: stage.medicineTemplates.filter((x) => x.medicineId !== selectedMedicineId),
      };

      setPlan((prevPlan) => {
        if (prevPlan) {
          const newStages = prevPlan.stageTemplates.map((x) => (x.id === stage.id ? newMedicinesInStage : x));
          return { ...prevPlan, stageTemplates: newStages };
        }
        return prevPlan;
      });
      onCloseConfirm();
    }
    setSelectedMedicineId("");
  };

  const columns = [
    { name: "", uid: "actions" },
    { name: "TÊN THUỐC", uid: "medicineName" },
    { name: "SỐ LIỀU CHO TỪNG CON", uid: "portionEachPig" },
  ];

  const renderCell = React.useCallback((data: MedicineTemplate, columnKey: React.Key) => {
    const cellValue = data[columnKey as keyof MedicineTemplate];
    switch (columnKey) {
      case "medicineName":
        return (
          <Tooltip showArrow={true} content={cellValue} color="primary" delay={1000}>
            <p className="truncate cursor-default">{cellValue}</p>
          </Tooltip>
        );
      case "actions":
        return (
          <div>
            {data.medicineId !== "" && (
              <Trash2Icon
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  onOpenConfirm();
                  setSelectedMedicineId(data.medicineId);
                }}
              />
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div>
      <Table classNames={{ wrapper: "max-h-400px overflow-auto" }}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
              {column.uid === "actions" && <Plus className="cursor-pointer" onClick={onOpen} />}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"Chưa chọn thuốc cho giai đoạn này"} items={stage.medicineTemplates}>
          {(item) => (
            <TableRow key={item.id ?? item.medicineId} className="h-12">
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddMedicineToStageModal isOpen={isOpen} onClose={onClose} setSelectedMedicine={setSelectedMedicine} />
      <Modal isOpen={isOpenConfirm} onClose={onCloseConfirm} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-lg">Xác nhận xóa thuốc</p>
          </ModalHeader>
          <ModalBody>
            <p>Bạn có chắc chắn muốn xóa thuốc khỏi giai đoạn?</p>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end gap-2">
              <Button color="danger" variant="solid" onClick={onCloseConfirm}>
                Hủy
              </Button>
              <Button color="primary" variant="solid" onClick={() => onRemove()}>
                Xác nhận
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default MedicineListInStage;
