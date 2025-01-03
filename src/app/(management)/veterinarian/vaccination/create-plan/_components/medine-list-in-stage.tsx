"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { CreateVaccinationStageProps, MedicineEachStage, MedicineInStage } from "@oursrc/lib/models/vaccination";
import { Plus, Trash2Icon } from "lucide-react";
import React from "react";
// import AddMedicineToStageModal from "./_modals/add-medine-to-stage-modal";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import AddMedicineToStageModal from "@oursrc/components/medicines/modals/add-medine-to-stage-modal";
const MedicineListInStage = ({
  stage,
  setStages,
}: {
  stage: CreateVaccinationStageProps;
  setStages: React.Dispatch<React.SetStateAction<CreateVaccinationStageProps[]>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
  const [selectedMedicine, setSelectedMedicine] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedMedicineId, setSelectedMedicineId] = React.useState<string>("");

  React.useEffect(() => {
    setLoading(true);
    if (Object.entries(selectedMedicine).length > 0) {
      let newMedicines: MedicineEachStage[];
      if (stage.inventoryRequest.medicines.length > 0) {
        const existingMedicine = stage.inventoryRequest.medicines.find(
          (medicine) => medicine.medicineId === selectedMedicine.id || medicine.medicineName === selectedMedicine.name
        );
        if (existingMedicine) {
          const updatedMedicine = {
            ...existingMedicine,
            portionEachPig: existingMedicine.portionEachPig + selectedMedicine.portionEachPig,
          };
          newMedicines = stage.inventoryRequest.medicines.map((medicine) =>
            medicine.medicineId === selectedMedicine.id || medicine.medicineName === selectedMedicine.name ? updatedMedicine : medicine
          );
        } else {
          newMedicines = [...stage.inventoryRequest.medicines, selectedMedicine];
        }
      } else {
        newMedicines = [selectedMedicine];
      }
      // newMedicines.map((x) => delete x.id);
      const newMedicinesInStage = {
        ...stage.inventoryRequest,
        medicines: newMedicines.map((x: any) => ({ ...x, medicineId: x.id, medicineName: x.name })),
      };
      setStages((prevStages) => {
        const newStages = prevStages.map((x) => (x.id === stage.id ? { ...x, inventoryRequest: newMedicinesInStage } : x));
        return newStages;
      });
      setSelectedMedicine({});
    }
    setLoading(false);
  }, [selectedMedicine]);
  const onRemove = () => {
    if (stage.inventoryRequest.medicines.length > 0) {
      const newMedicinesInStage = {
        ...stage.inventoryRequest,
        medicines: stage.inventoryRequest.medicines.filter((medicine) => medicine.medicineId !== selectedMedicineId),
      };

      setStages((prevStages) => {
        const newStages = prevStages.map((x) => (x.id === stage.id ? { ...x, inventoryRequest: newMedicinesInStage } : x));
        return newStages;
      });
      onCloseConfirm();
    }
    setSelectedMedicineId("");
  };

  const columns = [
    { name: "", uid: "actions" },
    { name: "TÊN THUỐC", uid: "medicineName" },
    { name: "PHÂN LOẠI", uid: "type" },
    { name: "SỐ LIỀU CHO TỪNG CON", uid: "portionEachPig" },
    // { name: "TRỌNG LƯỢNG", uid: "netWeight" },
    // { name: "ĐƠN VỊ", uid: "unit" },
  ];

  const renderCell = React.useCallback((data: MedicineEachStage, columnKey: React.Key) => {
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
              <Tooltip color="danger" content="Xóa thuốc" closeDelay={200}>
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash2Icon
                    onClick={() => {
                      setSelectedMedicineId(data.medicineId);
                      onOpenConfirm();
                    }}
                  />
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
        <TableBody
          isLoading={loading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={"Chưa chọn thuốc cho giai đoạn này"}
          items={stage.inventoryRequest.medicines}
        >
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
              <Button color="primary" variant="solid" onClick={onRemove}>
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
