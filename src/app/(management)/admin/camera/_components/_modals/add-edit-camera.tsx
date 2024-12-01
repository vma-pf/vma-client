"use client";
import React, { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { useToast } from "@oursrc/hooks/use-toast";
import { cageService } from "@oursrc/lib/services/cageService";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Camera } from "@oursrc/lib/models/camera";
import { Cage } from "@oursrc/lib/models/cage";
import { cameraService } from "@oursrc/lib/services/cameraService";

const AddEditCamera = ({ isOpen, onClose, camera, operation }: { isOpen: boolean; onClose: () => void; camera?: Camera; operation: "add" | "edit" | "delete" }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const username = watch("username");
  const password = watch("password");
  const protocol = watch("protocol");
  const domain = watch("domain");
  const path = watch("path");
  const parameters = watch("parameters");
  const port = watch("port");

  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);

  const handleNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    // if (parseInt(numericValue) > 10000) {
    //   numericValue = "10000";
    // }
    setValue("port", numericValue || "0");
  };

  const handleSubmitForm = async (data: any) => {
    try {
      const payload: Camera = {
        ...data,
        cageIds: selectedCages.map((cage) => cage.id),
      };
      if (operation === "edit") {
        const res: ResponseObject<Camera> = await cameraService.update(camera?.id ?? "", payload);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Chỉnh sửa camera thành công",
          });
          onClose();
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      } else if (operation === "add") {
        const res: ResponseObject<Camera> = await cameraService.create(payload);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Thêm camera thành công",
          });
          onClose();
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
    }
  };

  const handleDeleteCage = async () => {
    try {
      const res: ResponseObject<any> = await cageService.deleteCage(camera?.id || "");
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: res.data || "Xóa camera thành công",
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

  const handleSelectCage = (cage: Cage) => {
    if (selectedCages.find((selectedCage) => selectedCage.id === cage.id)) {
      setSelectedCages(selectedCages.filter((selectedCage) => selectedCage.id !== cage.id));
    } else {
      setSelectedCages([...selectedCages, cage]);
    }
  };

  const fetchCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data);
        setSelectedCages(
          res.data.data.filter((cage) => {
            if (camera?.cageIds) {
              camera?.cageIds.map((cameraCage) => {
                if (cage.id === cameraCage) {
                  return cage;
                }
              });
            }
          }) || []
        );
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValue("username", camera?.username || "");
    setValue("password", camera?.password || "");
    setValue("protocol", camera?.protocol || "");
    setValue("domain", camera?.domain || "");
    setValue("path", camera?.path || "");
    setValue("parameters", camera?.parameters || "");
    setValue("port", camera?.port || 0);
  }, [camera, setValue]);

  useEffect(() => {
    fetchCages();
  }, []);
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (username || password || protocol || domain || path || parameters || port) {
          onClose();
        }
      }}
      size={operation === "delete" ? "sm" : "xl"}
      hideCloseButton
      scrollBehavior="inside"
    >
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
            <ModalHeader>{camera ? "Chỉnh sửa camera" : "Thêm camera"}</ModalHeader>
            {/* <p className="text-sm text-gray-500">{cage ? "Chỉnh sửa chuồng" : "Thêm chuồng"}</p> */}
            <ModalBody>
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Tên đăng nhập"
                placeholder="Nhập tên đăng nhập"
                labelPlacement="outside"
                isRequired
                value={username || ""}
                isInvalid={errors.username ? true : false}
                errorMessage="Tên đăng nhập không được để trống"
                {...register("username", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                labelPlacement="outside"
                isRequired
                value={password || ""}
                isInvalid={errors.password ? true : false}
                errorMessage="Mật khẩu không được để trống"
                {...register("password", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Protocol"
                placeholder="Nhập protocol"
                labelPlacement="outside"
                isRequired
                value={protocol || ""}
                isInvalid={errors.protocol ? true : false}
                errorMessage="Protocol không được để trống"
                {...register("protocol", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Domain"
                placeholder="Nhập domain"
                labelPlacement="outside"
                isRequired
                value={domain || ""}
                isInvalid={errors.domain ? true : false}
                errorMessage="Domain không được để trống"
                {...register("domain", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Path"
                placeholder="Nhập path"
                labelPlacement="outside"
                isRequired
                value={path || ""}
                isInvalid={errors.path ? true : false}
                errorMessage="Path không được để trống"
                {...register("path", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Parameters"
                placeholder="Nhập parameters"
                labelPlacement="outside"
                isRequired
                value={parameters || ""}
                isInvalid={errors.parameters ? true : false}
                errorMessage="Parameters không được để trống"
                {...register("parameters", { required: true })}
              />
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label="Cổng"
                placeholder="Nhập cổng"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.port ? true : false}
                errorMessage="Cổng không được để trống"
                value={port || ""}
                onValueChange={(event) => handleNumberChange(event)}
                {...register("port", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <p className="text-xl font-semibold">Danh sách chuồng</p>
              <div className="grid grid-cols-2">
                {cages.map((cage) => (
                  <div
                    className={`m-2 border-2 rounded-lg p-2 ${cage.cameraId ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"} ${
                      selectedCages.find((selectedCage) => selectedCage.id === cage.id) ? "bg-emerald-200" : ""
                    }`}
                    key={cage.id}
                    onClick={() => {
                      if (cage.cameraId) return;
                      handleSelectCage(cage);
                    }}
                  >
                    <p className="text-lg text-center">Chuồng: {cage.code}</p>
                    {cage.cameraId && <p className="text-center text-red-500">*Đã có camera</p>}
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button color="primary" type="submit" isDisabled={Object.keys(errors).length > 0 || selectedCages.length === 0 ? true : false}>
                Lưu
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      ) : (
        <ModalContent>
          <ModalHeader>Xác nhận xóa camera</ModalHeader>
          <ModalBody>
            <p className="text-center">
              Bạn có chắc chắn muốn xóa camera <strong className="text-xl">{camera?.id}</strong> không?
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

export default AddEditCamera;
