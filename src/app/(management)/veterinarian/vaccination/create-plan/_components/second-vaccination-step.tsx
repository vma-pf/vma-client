"use client";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { Plus, Trash2Icon } from "lucide-react";
import React from "react";
import AddMedicineToStageModal from "./_modals/add-medine-to-stage-modal";
import { MedicineEachStage, MedicineInStage, VaccinationStageProps } from "@oursrc/lib/models/vaccination";

const SecondVaccinationStep = ({ setStep, vaccinationPlan }: any) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [medicinesInStage, setMedicinesInStage] = React.useState<MedicineInStage[]>([]);
  const [selectedMedicine, setSelectedMedicine] = React.useState<any>({});
  const [currentStageIndex, setCurrentStageIndex] = React.useState<number>(0);

  React.useEffect(() => {
    if (selectedMedicine) {
      const newMedicinesInStage = medicinesInStage.map((x: any, i: number) => {
        return i === currentStageIndex
          ? {
              ...x,
              medicines: [
                ...x.medicines,
                {
                  medicineId: selectedMedicine.id,
                  medicineName: selectedMedicine.name,
                  quantity: selectedMedicine.quantity,
                  netWeight: selectedMedicine.netWeight,
                  unit: selectedMedicine.unit,
                  portionEachPig: selectedMedicine.portionEachPig,
                  type: selectedMedicine.type,
                },
              ],
            }
          : { ...x };
      });
      setMedicinesInStage([...newMedicinesInStage]);
      onClose();
    }
  }, [selectedMedicine]);

  React.useEffect(() => {
    console.log("vaccinationPlan", vaccinationPlan);
    setMedicinesInStage(
      vaccinationPlan.vaccinationStages
        .sort((a: any, b: any) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
        .map((x: any, index: number) => ({
          vaccinationStageId: x.id,
          title: `[Giai đoạn ${index + 1}] ${x.title}`,
          description: "",
          medicines: [],
        }))
    );
  }, []);

  const onOpenModal = (index: number) => {
    setCurrentStageIndex(index);
    onOpen();
  };

  const onSave = async () => {
    try {
      if (medicinesInStage.some((x: any) => x.medicines.length === 0)) {
        toast({
          variant: "destructive",
          title: "Có một số giai đoạn chưa có thuốc",
          description: "Vui lòng thêm thuốc vào giai đoạn",
        });
        return;
      }

      //prepare request
      const request = medicinesInStage.map((x: any) => {
        return {
          ...x,
          title: "Yêu cầu nhập thuốc cho giai đoạn " + x.title,
          medicines: x.medicines.map((x: any) => {
            if (x.type === "existed") {
              return {
                medicineId: x.medicineId,
                isPurchaseNeeded: false,
                newMedicineName: "",
                portionEachPig: x.portionEachPig,
              };
            } else {
              return {
                medicineId: "",
                isPurchaseNeeded: true,
                newMedicineName: x.medicineName,
                portionEachPig: x.portionEachPig,
              };
            }
          }),
        };
      });

      const response = await vaccinationService.addInventoryToVaccinationPlan(request);
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: "Thêm thuốc vào giai đoạn thành công",
          description: "Đã tạo thành công thuốc vào giai đoạn bước 2!",
        });
        setStep(3);
      } else {
        throw new AggregateError([new Error()], response.errorMessage);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi hệ thống! Vui lòng thử lại",
        description: error.message,
      });
    } finally {
    }
  };

  const columns = [
    { name: "TÊN THUỐC", uid: "medicineName" },
    { name: "TRỌNG LƯỢNG", uid: "netWeight" },
    { name: "SỐ LƯỢNG TRONG KHO", uid: "quantity" },
    { name: "ĐƠN VỊ", uid: "unit" },
    { name: "SỐ LIỀU CHO TỪNG CON", uid: "portionEachPig" },
    { name: "CÓ SẴN / MỚI TẠO", uid: "type" },
    { name: "", uid: "actions" },
  ];

  const renderCell = React.useCallback((data: MedicineEachStage, columnKey: React.Key, index: number) => {
    const cellValue = data[columnKey as keyof MedicineEachStage];
    switch (columnKey) {
      case "type":
        return cellValue === "new" ? "Mới tạo" : "Có sẵn";
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
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
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <Card>
        <CardBody>
          <div className="mb-1 flex justify-end">
            <Button color="primary" onClick={onSave}>
              Lưu
            </Button>
          </div>
          <Accordion variant="splitted" defaultExpandedKeys={[0]}>
            {medicinesInStage.map((x: MedicineInStage, index: number) => {
              return (
                <AccordionItem key={index} title={x.title}>
                  <div className="flex justify-end mb-2">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <Button color="primary" onClick={() => onOpenModal(index)}>
                        <span>Thêm thuốc</span>
                        <Plus />
                      </Button>
                    </span>
                  </div>
                  <Table>
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody emptyContent={"Chưa chọn thuốc cho giai đoạn này"} items={x.medicines}>
                      {(item) => <TableRow key={item.medicineId}>{(columnKey) => <TableCell>{renderCell(item, columnKey, index)}</TableCell>}</TableRow>}
                    </TableBody>
                  </Table>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardBody>
      </Card>
      <AddMedicineToStageModal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} setSelectedMedicine={setSelectedMedicine} />
    </div>
  );
};
export default SecondVaccinationStep;
