"use client";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { setNextTreatmentProgressStep } from "@oursrc/lib/features/treatment-progress-step/treatment-progress-step-slice";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { DiseaseReport } from "@oursrc/lib/models/treatment";
import { diseaseReportService } from "@oursrc/lib/services/diseaseReportService";
import React from "react";
import { useForm } from "react-hook-form";

const CreateDiseaseReport = ({
  isOpen,
  onOpen,
  onClose,
  setDiseaseReport,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setDiseaseReport: React.Dispatch<React.SetStateAction<DiseaseReport | undefined>>;
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    try {
      const res: ResponseObject<DiseaseReport> = await diseaseReportService.createDiseaseReport(data);
      if (res.isSuccess) {
        setDiseaseReport(res.data);
        onClose();
        toast({
          title: "Tạo báo cáo bệnh thành công",
          variant: "success",
        });
      } else {
        toast({
          title: res.errorMessage || "Tạo báo cáo bệnh thất bại",
          variant: "destructive",
        });
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isDismissable={false} size="3xl" hideCloseButton>
      <ModalContent>
        <ModalHeader>
          <p className="text-3xl">Tạo báo cáo bệnh</p>
        </ModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Input
              className="pb-3"
              label="Tên bệnh"
              placeholder="Nhập tên bệnh"
              labelPlacement="outside"
              size="lg"
              isInvalid={errors.description ? true : false}
              errorMessage="Tên bệnh không được để trống"
              {...register("description", { required: true })}
            />
            <Input
              className="pb-3"
              label="Tổng thời gian điều trị"
              placeholder="Nhập tổng thời gian điều trị"
              labelPlacement="outside"
              size="lg"
              isInvalid={errors.totalTreatmentTime ? true : false}
              errorMessage="Thời gian điều trị không được để trống"
              {...register("totalTreatmentTime", { required: true })}
            />
          </ModalBody>
          <ModalFooter>
            <Button className="mt-4" color="danger" onClick={onClose}>
              Hủy
            </Button>
            <Button className="mt-4" type="submit" color="primary" isDisabled={Object.keys(errors).length > 0}>
              Tạo báo cáo
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateDiseaseReport;
