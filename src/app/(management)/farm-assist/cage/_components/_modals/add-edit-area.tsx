import React, { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useToast } from "@oursrc/hooks/use-toast";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { Area } from "@oursrc/lib/models/area";
import { areaService } from "@oursrc/lib/services/areaService";

const AddEditArea = ({ isOpen, onClose, area, operation }: { isOpen: boolean; onClose: () => void; area?: Area; operation: "add" | "edit" | "delete" }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const code = watch("code");
  const description = watch("description");

  const handleSubmitForm = async (data: any) => {
    try {
      if (operation === "edit") {
        const res: ResponseObject<Area> = await areaService.update(area?.id ?? "", data);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Chỉnh sửa khu vực thành công",
          });
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      } else if (operation === "add") {
        const res: ResponseObject<Area> = await areaService.create(data);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Thêm khu vực thành công",
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

  const handleDeleteArea = async () => {
    try {
      const res: ResponseObject<any> = await areaService.delete(area?.id || "");
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
    setValue("code", area?.code ? area?.code : "");
    setValue("description", area?.description ? area?.description : "");
  }, [area, setValue]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={operation === "delete" ? "sm" : "md"} hideCloseButton isDismissable={false}>
      {operation !== "delete" ? (
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <ModalContent>
            <ModalHeader>{area ? "Chỉnh sửa khu vực" : "Thêm khu vực"}</ModalHeader>
            <ModalBody>
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Mã khu vực"
                placeholder="Nhập mã khu vực"
                labelPlacement="outside"
                isRequired
                value={code || ""}
                // value={cage?.code ? cage?.code : ""}
                isInvalid={errors.code ? true : false}
                errorMessage="Mã khu vực không được để trống"
                {...register("code", { required: true })}
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
                isInvalid={errors.description ? true : false}
                errorMessage="Mô tả không được để trống"
                {...register("description", { required: true })}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button color="primary" type="submit" isDisabled={Object.keys(errors).length > 0 ? true : false}>
                {area ? "Chỉnh sửa" : "Thêm"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      ) : (
        <ModalContent>
          <ModalHeader>Xác nhận xóa khu vực</ModalHeader>
          <ModalBody>
            <p className="text-center">
              Bạn có chắc chắn muốn xóa khu vực <strong className="text-xl">{area?.code}</strong> không?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" onPress={handleDeleteArea}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default AddEditArea;
