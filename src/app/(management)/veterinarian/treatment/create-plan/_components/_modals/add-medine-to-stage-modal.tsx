"use client";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import MedicinesListReadOnly from "@oursrc/components/medicines/medicines-list-read-only";
import { toast } from "@oursrc/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const AddMedicineToStageModal = ({ isOpen, onOpenChange, setSelectedMedicine }: any) => {
  const [currentTab, setCurrentTab] = React.useState<React.Key>("existed");
  const [selectedMed, setSelectedMed] = React.useState<{}>({});
  const [portionEachPig, setPortionEachPig] = React.useState<number>(1);

  const handlePortionChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 100000) {
      numericValue = "100000";
    }
    setPortionEachPig(Number(numericValue));
  };

  const onSubmitNewMedicine = () => {
    if (selectedMed === null || !selectedMed) {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn thuốc và thử lại",
      });
      return;
    }
    switch (currentTab) {
      case "existed":
        setSelectedMedicine({
          ...selectedMed,
          portionEachPig: portionEachPig,
          type: "existed",
        });
        return;
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Chọn thuốc cho giai đoạn</ModalHeader>
          <ModalBody>
            <Tabs onSelectionChange={(e) => setCurrentTab(e)}>
              <Tab key="existed" title="Thuốc trong kho">
                <Input
                  type="text"
                  label="Số lượng liều mỗi con"
                  className="pb-2"
                  value={portionEachPig.toString()}
                  onValueChange={(event) => handlePortionChange(event)}
                />
                <MedicinesListReadOnly setSelected={setSelectedMed} />
              </Tab>
              <Tab key="new" title="Thêm mới">
                <Input
                  type="text"
                  label="Số lượng liều mỗi con"
                  className="pb-2"
                  value={portionEachPig.toString()}
                  onValueChange={(event) => handlePortionChange(event)}
                />
                <Input type="text" label="Tên thuốc" placeholder="Nhập tên thuốc" labelPlacement="outside" size="lg" className="pb-2" />
                <Input type="text" label="Đơn vị" placeholder="Nhập đơn vị" labelPlacement="outside" size="lg" className="pb-2" />
                <Input type="text" label="Giá" placeholder="Nhập giá" labelPlacement="outside" size="lg" className="pb-2" />
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end">
              <Button variant="solid" color="primary" size="lg" type="submit" onClick={onSubmitNewMedicine}>
                <p className="text-white">Xác nhận</p>
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default AddMedicineToStageModal;
