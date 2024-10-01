"use client";
import React, { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Cage } from "@oursrc/lib/models/cage";
import { useToast } from "@oursrc/hooks/use-toast";
import { cageService } from "@oursrc/lib/services/cageService";
import { ResponseObject } from "@oursrc/lib/models/response-object";

const AddEditForm = ({ isOpen, onClose, cage, operation }: { isOpen: boolean; onClose: () => void; cage?: Cage; operation: "add" | "edit" | "delete" }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const code = watch("code");
  const capacity = watch("capacity");
  const description = watch("description");

  const handleNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("capacity", numericValue || "0");
  };

  const handleSubmitForm = async (data: any) => {
    try {
      if (operation === "edit") {
        const res: ResponseObject<any> = await cageService.updateCage(data, cage?.id || "");
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: res.data || "Chỉnh sửa chuồng thành công",
          });
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      } else if (operation === "add") {
        const res: ResponseObject<any> = await cageService.createCage(data);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: res.data || "Thêm chuồng thành công",
          });
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    } finally {
      onClose();
    }
  };

  const handleDeleteCage = async () => {
    try {
      const res: ResponseObject<any> = await cageService.deleteCage(cage?.id || "");
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: res.data || "Xóa chuồng thành công",
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    setValue("code", cage?.code ? cage?.code : "");
    setValue("capacity", cage?.capacity ? cage?.capacity.toString() : "");
    setValue("description", cage?.description ? cage?.description : "");
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (code || capacity || description) {
          onClose();
        }
      }}
      size={operation === "delete" ? "sm" : "md"}
      hideCloseButton
    >
      {operation !== "delete" ? (
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <ModalContent>
            <ModalHeader>{cage ? "Chỉnh sửa chuồng" : "Thêm chuồng"}</ModalHeader>
            {/* <p className="text-sm text-gray-500">{cage ? "Chỉnh sửa chuồng" : "Thêm chuồng"}</p> */}
            <ModalBody>
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Mã chuồng"
                placeholder="Nhập mã chuồng"
                labelPlacement="outside"
                isRequired
                value={code || ""}
                // value={cage?.code ? cage?.code : ""}
                isInvalid={errors.code ? true : code ? false : true}
                errorMessage="Mã chuồng không được để trống"
                {...register("code", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Sức chứa"
                placeholder="Nhập sức chứa"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.capacity ? true : capacity ? false : true}
                errorMessage="Sức chứa không được để trống"
                // value={cage?.capacity ? cage?.capacity.toString() : capacity}
                value={capacity || ""}
                onValueChange={(event) => handleNumberChange(event)}
                {...register("capacity", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <Textarea
                className="my-2"
                minRows={5}
                type="text"
                radius="md"
                size="lg"
                label="Mô tả"
                placeholder="Nhập mô tả"
                labelPlacement="outside"
                isRequired
                value={description || ""}
                isInvalid={errors.description ? true : description ? false : true}
                errorMessage="Mô tả không được để trống"
                {...register("description", { required: true })}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button color="primary" type="submit" isDisabled={code && capacity && description ? false : true}>
                {cage ? "Chỉnh sửa" : "Thêm"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      ) : (
        <ModalContent>
          <ModalHeader>Xác nhận xóa chuồng</ModalHeader>
          <ModalBody>
            <p className="text-center">
              Bạn có chắc chắn muốn xóa chuồng <strong className="text-xl">{cage?.code}</strong> không?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" onPress={handleDeleteCage}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default AddEditForm;
