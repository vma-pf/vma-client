"use client";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import { toast } from "@oursrc/hooks/use-toast";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { setNextHerdProgressStep } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { HiChevronDoubleRight } from "react-icons/hi2";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { Cage } from "@oursrc/lib/models/cage";
import PrepareCageList from "./prepare-cage-list";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";
import { HiOutlineLightBulb } from "react-icons/hi";
import { Area } from "@oursrc/lib/models/area";
import { areaService } from "@oursrc/lib/services/areaService";

const CageCreate = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState<boolean | undefined>(false);
  const [newCages, setNewCages] = React.useState<Cage[]>([]);
  const [isCageEmpty, setIsCageEmpty] = React.useState<boolean>(false);
  const [areaList, setAreaList] = React.useState<Area[]>([]);
  const [selectedArea, setSelectedArea] = React.useState<Area | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const capacity = watch("capacity");
  const width = watch("width");
  const height = watch("height");
  const length = watch("length");

  const fetchAreas = async () => {
    try {
      const res: ResponseObjectList<Area> = await areaService.getAll(1, 1000);
      if (res.isSuccess) {
        setAreaList(res.data.data);
      }
    } catch (error) {
      console.log(error);
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

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        areaId: selectedArea?.id,
      };
      const res: ResponseObjectList<any> = await cageService.createCage(payload);
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: "Tạo mới chuồng thành công",
        });
        setNewCages([
          ...newCages,
          {
            id: "",
            code: data.code,
            capacity: data.capacity,
            description: data.description,
            availableQuantity: 0,
          },
        ]);
        dispatch(setNextHerdProgressStep());
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("capacity", capacity);
    setValue("width", width);
    setValue("height", height);
    setValue("length", length);
  }, [setValue]);

  useEffect(() => {
    if (width && length) {
      const area = ((width as number) * length) as number;
      const capacity = Math.ceil(area / 1.2).toString();
      setValue("capacity", capacity);
    }
  }, [width, length]);

  useEffect(() => {
    fetchAreas();
  }, []);
  return (
    <div>
      <div className="container mx-auto">
        <div className="mt-12">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-3xl">Chuồng có sẵn</p>
            <Button
              variant="ghost"
              color="primary"
              endContent={<HiChevronDoubleRight size={20} />}
              isDisabled={isCageEmpty}
              onPress={() => dispatch(setNextHerdProgressStep())}
            >
              Bỏ qua bước này
            </Button>
          </div>
          <PrepareCageList hasNewCages={newCages.length > 0} setIsCageEmpty={setIsCageEmpty} />
        </div>
        <div>
          <p className="text-3xl">
            Tạo chuồng mới
            <span className="ml-3 text-base text-gray-400">(Tùy chọn)</span>
          </p>
          {/* <div className="w-100">
              <AttachMedia />
            </div> */}
          <div className="mt-6">
            <h1 className="text-xl font-semibold">Thông tin chuồng</h1>
          </div>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Input
              type="text"
              radius="md"
              size="lg"
              label="Mã chuồng"
              placeholder="Nhập mã chuồng"
              labelPlacement="outside"
              isRequired
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
              isInvalid={errors.description ? true : false}
              errorMessage="Mô tả không được để trống"
              {...register("description", { required: true })}
            />
            <div className="flex gap-3 items-end mt-4">
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
              label={`Sức chứa tối đa cho diện tích ${isNaN(Math.ceil((width as number) * (length as number))) ? 0 : Math.ceil((width as number) * (length as number))} m2 (đề xuất)`}
              placeholder="Nhập sức chứa"
              endContent="con"
              labelPlacement="outside"
              isRequired
              isInvalid={errors.capacity ? true : false}
              errorMessage="Sức chứa không được để trống"
              // value={cage?.capacity ? cage?.capacity.toString() : capacity}
              value={capacity || ""}
              onValueChange={(event) => handleCapacityChange(event)}
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
            <div className="flex justify-end">
              <Button variant="solid" color="primary" isDisabled={errors && Object.keys(errors).length > 0} isLoading={loading} size="lg" type="submit">
                <p className="text-white">Tạo mới</p>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CageCreate;
