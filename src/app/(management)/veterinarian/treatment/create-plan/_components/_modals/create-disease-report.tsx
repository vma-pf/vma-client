"use client";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
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
              label="Tên tên báo cáo"
              placeholder="Nhập tên báo cáo"
              labelPlacement="outside"
              size="lg"
              isInvalid={errors.diagnosisDiseaseName ? true : false}
              errorMessage="Tên báo cáo không được để trống"
              {...register("diagnosisDiseaseName", { required: true })}
            />
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
              label="Nguyên nhân"
              placeholder="Nhập nguyên nhân"
              labelPlacement="outside"
              size="lg"
              isInvalid={errors.cause ? true : false}
              {...register("cause")}
            />
            <Select
              className="pb-3"
              label="Mức độ"
              placeholder="Chọn mức độ bệnh"
              labelPlacement="outside" 
              size="lg"
              isRequired
              {...register("severityType", { required: true })}
            >
              <SelectItem key="0" value="0">
                Bệnh nhẹ
              </SelectItem>
              <SelectItem key="1" value="1">
                Bệnh bình thường  
              </SelectItem>
              <SelectItem key="2" value="2">
                Bệnh nguy hiểm
              </SelectItem>
            </Select>
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
