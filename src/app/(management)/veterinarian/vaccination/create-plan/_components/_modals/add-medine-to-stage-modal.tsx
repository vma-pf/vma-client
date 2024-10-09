"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import MedicinesListReadOnly from "@oursrc/components/medicines/medicines-list-read-only";
import { toast } from "@oursrc/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const AddMedicineToStageModal = ({
  isOpen,
  onOpenChange,
  setSelectedMedicine,
}: any) => {
  const [currentTab, setCurrentTab] = React.useState<React.Key>("existed");
  const [selectedMed, setSelectedMed] = React.useState<{}>({});
  const [portionEachPig, setPortionEachPig] = React.useState<number>(1);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

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

  const onSubmitNewMedicine = (data: any) => {
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
          portionEachPig: data.portionEachPig,
          type: "existed",
        });
        return;
      case "new":
        setSelectedMedicine({
          id: uuidv4(),
          unit: "",
          name: data.newMedicineName,
          mainIngredient: "",
          quantity: 0,
          registerNumber: 0,
          netWeight: "",
          usage: "",
          batches: [],
          portionEachPig: data.portionEachPig,
          type: "new",
        });
        return;
    }
    reset({
      newMedicineName: "",
      portionEachPig: 0,
    });
  };

  React.useEffect(() => {
    setValue("portionEachPig", portionEachPig);
  }, [portionEachPig]);
  return (
    <div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        size="5xl"
        placement="top"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {isOpen && (
            <>
              <form onSubmit={handleSubmit(onSubmitNewMedicine)}>
                <ModalHeader className="flex flex-col gap-1">
                  Chọn thuốc cho giai đoạn
                </ModalHeader>
                <ModalBody>
                  <Tabs onSelectionChange={(e) => setCurrentTab(e)}>
                    <Tab key="existed" title="Thuốc trong kho">
                      <Input
                        type="text"
                        label="Số lượng liều mỗi con"
                        value={portionEachPig.toString()}
                        onValueChange={(event) => handlePortionChange(event)}
                        errorMessage="Số lượng liều mỗi con không được để trống"
                        {...register("portionEachPig")}
                      />
                      <MedicinesListReadOnly setSelected={setSelectedMed} />
                    </Tab>
                    <Tab key="new" title="Tạo mới">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          label="Tên thuốc mới"
                          isInvalid={errors.newMedicineName ? true : false}
                          errorMessage="Tên thuốc mới không được để trống"
                          {...register("newMedicineName")}
                        />
                        {/* <Switch
                          defaultSelected
                          size="md"
                          {...register("isPurchaseNeeded")}
                        >
                          Yêu cầu mua mới
                        </Switch> */}
                        <Input
                          type="text"
                          label="Số lượng liều mỗi con"
                          value={portionEachPig.toString()}
                          onValueChange={(event) => handlePortionChange(event)}
                          isInvalid={errors.portionEachPig ? true : false}
                          errorMessage="Số lượng liều mỗi con không được để trống"
                          {...register("portionEachPig")}
                        />
                      </div>
                    </Tab>
                  </Tabs>
                </ModalBody>
                <ModalFooter>
                  <div className="flex justify-end">
                    <Button
                      variant="solid"
                      color="primary"
                      size="lg"
                      type="submit"
                    >
                      <p className="text-white">Xác nhận</p>
                    </Button>
                  </div>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default AddMedicineToStageModal;
