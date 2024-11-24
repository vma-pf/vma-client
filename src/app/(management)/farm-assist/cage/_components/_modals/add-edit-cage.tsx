"use client";
import React, { useEffect } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { Cage } from "@oursrc/lib/models/cage";
import { useToast } from "@oursrc/hooks/use-toast";
import { cageService } from "@oursrc/lib/services/cageService";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { areaService } from "@oursrc/lib/services/areaService";
import { Area } from "@oursrc/lib/models/area";
import { FaLightbulb } from "react-icons/fa6";
import { HiOutlineLightBulb } from "react-icons/hi";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";
import LoadingStateContext from "@oursrc/components/context/loading-state-context";

const AddEditCage = ({ isOpen, onClose, cage, operation }: { isOpen: boolean; onClose: () => void; cage?: Cage; operation: "add" | "edit" | "delete" }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDoneAll, setIsDoneAll] = React.useState(false);
  const [areaList, setAreaList] = React.useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = React.useState<Area | null>(null);
  const code = watch("code");
  const capacity = watch("capacity");
  const description = watch("description");
  const width = watch("width");
  const height = watch("height");
  const length = watch("length");

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Area> = await areaService.getAll(1, 1000);
      if (res.isSuccess) {
        setAreaList(res.data.data);
        setSelectedArea(res.data.data.find((area) => area.id === cage?.areaId) || null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapacityChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    // setValue("capacity", numericValue || "0");
  };

  const handleWidthChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("width", numericValue || "0");
  };

  const handleHeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("height", numericValue || "0");
  };

  const handleLengthChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("length", numericValue || "0");
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        areaId: selectedArea?.id || "",
      };
      console.log(payload);
      if (operation === "edit") {
        const res: ResponseObject<Cage> = await cageService.updateCage(payload, cage?.id || "");
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Chỉnh sửa chuồng thành công",
          });
          setIsDoneAll(true);
          onClose();
        } else {
          toast({
            variant: "destructive",
            title: res.errorMessage || "Có lỗi xảy ra",
          });
        }
      } else if (operation === "add") {
        const res: ResponseObject<Cage> = await cageService.createCage(payload);
        if (res && res.isSuccess) {
          toast({
            variant: "success",
            title: "Thêm chuồng thành công",
          });
          setIsDoneAll(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCage = async () => {
    try {
      setLoading(true);
      const res: ResponseObject<any> = await cageService.deleteCage(cage?.id || "");
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: res.data || "Xóa chuồng thành công",
        });
        setIsDoneAll(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("code", cage?.code ? cage?.code : "");
    setValue("capacity", cage?.capacity ? cage?.capacity.toString() : "");
    setValue("description", cage?.description ? cage?.description : "");
    setValue("width", cage?.width ? cage?.width.toString() : "");
    setValue("height", cage?.height ? cage?.height.toString() : "");
    setValue("length", cage?.length ? cage?.length.toString() : "");
  }, [cage, setValue]);

  useEffect(() => {
    if (isOpen) {
      fetchAreas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (width && length) {
      const area = ((width as number) * length) as number;
      const capacity = Math.ceil(area / 1.2).toString();
      setValue("capacity", capacity);
    }
  }, [width, length]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={operation === "delete" ? "sm" : "3xl"} hideCloseButton scrollBehavior="inside" isDismissable={false}>
      {operation !== "delete" ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <ModalContent>
            <ModalHeader>{cage ? "Chỉnh sửa chuồng" : "Thêm chuồng"}</ModalHeader>
            {/* <p className="text-sm text-gray-500">{cage ? "Chỉnh sửa chuồng" : "Thêm chuồng"}</p> */}
            <ModalBody>
              <Input
                type="text"
                radius="md"
                size="lg"
                label="Mã chuồng"
                placeholder="Nhập mã chuồng"
                labelPlacement="outside"
                isRequired
                value={code || ""}
                // value={cage?.code ? cage?.code : ""}
                isInvalid={errors.code ? true : false}
                errorMessage="Mã chuồng không được để trống"
                {...register("code", { required: true })}
              />
              <Textarea
                minRows={3}
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
              <div className="flex gap-3 items-end">
                <p className="text-xl font-semibold">Kích thước chuồng</p>
                <HoverCard>
                  <HoverCardTrigger>
                    <HiOutlineLightBulb size={30} className="text-yellow-500" />
                  </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-96">
                    <div className="">
                      <p className="font-semibold">Kích thước tham khảo</p>
                      <p className="">
                        Khi nuôi heo trong chuồng, cần đảm bảo diện tích cho mỗi con tối thiểu từ <strong>1 - 1.2 m2</strong>.
                        <br /> Ví dụ: Muốn nuôi 10 con heo, cần chuồng có diện tích tối thiểu từ <strong>10 - 12 m2</strong>.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                type="text"
                radius="md"
                size="lg"
                label="Chiều cao"
                placeholder="Nhập chiều cao"
                labelPlacement="outside"
                isRequired
                endContent="m"
                isInvalid={errors.height ? true : false}
                errorMessage="Chiều cao không được để trống"
                value={height || ""}
                onValueChange={(event) => handleHeightChange(event)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  radius="md"
                  size="lg"
                  label="Chiều dài"
                  placeholder="Nhập chiều dài"
                  labelPlacement="outside"
                  isRequired
                  endContent="m"
                  isInvalid={errors.length ? true : false}
                  errorMessage="Chiều dài không được để trống"
                  value={length || ""}
                  onValueChange={(event) => handleLengthChange(event)}
                />
                <Input
                  type="text"
                  radius="md"
                  size="lg"
                  label="Chiều rộng"
                  placeholder="Nhập chiều rộng"
                  labelPlacement="outside"
                  isRequired
                  endContent="m"
                  isInvalid={errors.width ? true : false}
                  errorMessage="Chiều rộng không được để trống"
                  value={width || ""}
                  onValueChange={(event) => handleWidthChange(event)}
                />
              </div>
              <Input
                className="mb-2"
                type="text"
                radius="md"
                size="lg"
                label={`Sức chứa tối đa cho diện tích ${Math.ceil((width as number) * (length as number))} m2 (đề xuất)`}
                placeholder="Nhập sức chứa"
                endContent="con"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.capacity ? true : false}
                errorMessage="Sức chứa không được để trống"
                // value={cage?.capacity ? cage?.capacity.toString() : capacity}
                value={capacity || ""}
                onValueChange={(event) => handleCapacityChange(event)}
                {...register("capacity", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <p className="text-xl font-semibold">Danh sách Khu vực trong trang trại</p>
              <div className="grid grid-cols-2">
                {areaList.map((area) => (
                  <div
                    className={`m-2 border-2 rounded-lg p-2 ${selectedArea?.id === area.id ? "bg-emerald-200" : ""}`}
                    key={area.id}
                    onClick={() => {
                      if (selectedArea?.id === area.id) {
                        setSelectedArea(null);
                        return;
                      }
                      setSelectedArea(area);
                    }}
                  >
                    <p className="text-lg">Khu vực: {area.code}</p>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="primary"
                type="submit"
                isDisabled={Object.keys(errors).length > 0 || !height || !width || !length || !selectedArea || isDoneAll ? true : false}
                isLoading={loading}
              >
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

export default AddEditCage;
