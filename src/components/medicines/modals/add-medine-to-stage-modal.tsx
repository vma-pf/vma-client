"use client";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import MedicinesListReadOnly from "@oursrc/components/medicines/medicines-list-read-only";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const AddMedicineToStageModal = ({
  isOpen,
  onClose,
  setSelectedMedicine,
}: {
  isOpen: boolean;
  onClose: () => void;
  setSelectedMedicine: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [currentTab, setCurrentTab] = React.useState<React.Key>("existed");
  const [selectedMed, setSelectedMed] = React.useState<any>();
  const [portionEachPig, setPortionEachPig] = React.useState<number>(1);
  const [newMedicineName, setNewMedicineName] = React.useState<string>("");

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

  const isSubmitted = () => {
    switch (currentTab) {
      case "existed":
        return selectedMed ? true : false;
      case "new":
        return newMedicineName ? true : false;
      default:
        return false;
    }
  };

  const onSubmitNewMedicine = () => {
    switch (currentTab) {
      case "existed":
        setSelectedMedicine({
          ...selectedMed,
          portionEachPig: portionEachPig,
          type: "existed",
        });
        onClose();
        break;
      case "new":
        setSelectedMedicine({
          ...selectedMed,
          name: newMedicineName,
          portionEachPig: portionEachPig,
          id: uuidv4(),
          type: "new",
        });
        onClose();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      setPortionEachPig(1);
      setNewMedicineName("");
    }
  }, [isOpen]);

  return (
    <div>
      <Modal isOpen={isOpen} size="4xl" onClose={onClose} isDismissable={false} scrollBehavior="inside">
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
                <Input
                  type="text"
                  label="Tên thuốc"
                  placeholder="Nhập tên thuốc"
                  labelPlacement="outside"
                  size="lg"
                  className="pb-2"
                  value={newMedicineName}
                  onValueChange={(event) => setNewMedicineName(event)}
                />
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end">
              <Button variant="solid" color="primary" onClick={onSubmitNewMedicine} isDisabled={!isSubmitted()}>
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
