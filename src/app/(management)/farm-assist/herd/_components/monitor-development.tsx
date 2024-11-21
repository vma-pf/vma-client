"use client";
import { Button, Input } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { monitorDevelopmentLogService } from "@oursrc/lib/services/monitorDevelopmentLogService";
import React from "react";
import { useForm } from "react-hook-form";
import { IoMdPricetags } from "react-icons/io";
import { motion } from "framer-motion";

const MonitorDevelopment = ({ setIsOpen, pigInfo }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; pigInfo: Pig }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();
  const width = watch("width");
  const height = watch("height");
  const weight = watch("weight");
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | undefined>();

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
  const handleWeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("weight", numericValue || "0");
  };
  const handleSelectCage = (cage: Cage) => {
    if (cage.availableQuantity && cage.availableQuantity < cage.capacity) {
      if (cage.id !== selectedCage?.id) {
        setSelectedCage(cage);
      } else {
        setSelectedCage(undefined);
      }
    }
  };
  const onSubmit = async (data: any) => {
    try {
      const res: ResponseObject<any> = await monitorDevelopmentLogService.createMonitoringLog({
        pigId: pigInfo?.id ?? "",
        cageId: selectedCage?.id ?? pigInfo?.cageId ?? "",
        weight: Number(weight || ""),
        height: Number(height || ""),
        width: Number(width || ""),
        note: data.note,
        status: 0,
      });
      if (res.isSuccess) {
        reset();
        setIsOpen(false);
      } else {
        toast({
          title: res.errorMessage || "Nhập thông tin không thành công",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data);
        setSelectedCage(res.data.data.find((cage) => cage.id === pigInfo?.cageId ?? "") || undefined);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
  }, [height, width, weight]);
  React.useEffect(() => {
    fetchCages();
  }, []);
  return (
    <div className="p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <p className="text-lg font-semibold mb-4">Giống: {pigInfo?.breed}</p>
        <Input
          className="mb-3"
          type="text"
          radius="sm"
          size="lg"
          label="Cân nặng"
          placeholder="Nhập cân nặng"
          labelPlacement="outside"
          isRequired
          endContent="kg"
          isInvalid={weight ? false : true}
          errorMessage="Cân nặng không được để trống"
          value={weight || ""}
          onValueChange={(e) => handleWeightChange(e)}
        />
        <Input
          className="mb-3"
          type="text"
          radius="sm"
          size="lg"
          label="Chiều cao"
          placeholder="Nhập chiều cao"
          labelPlacement="outside"
          isRequired
          endContent="cm"
          isInvalid={height ? false : true}
          errorMessage="Chiều cao không được để trống"
          value={height || ""}
          onValueChange={(e) => handleHeightChange(e)}
        />
        <Input
          className="mb-3"
          type="text"
          radius="sm"
          size="lg"
          label="Chiều rộng"
          placeholder="Nhập chiều rộng"
          labelPlacement="outside"
          isRequired
          endContent="cm"
          isInvalid={width ? false : true}
          errorMessage="Chiều rộng không được để trống"
          value={width || ""}
          onValueChange={(e) => handleWidthChange(e)}
        />
        <Input
          type="text"
          radius="sm"
          size="lg"
          label="Ghi chú"
          placeholder="Nhập ghi chú"
          labelPlacement="outside"
          isRequired
          isInvalid={errors.note ? true : false}
          errorMessage="Ghi chú không được để trống"
          {...register("note", { required: true })}
        />
        <p className="text-xl mt-2 font-semibold">Danh sách chuồng</p>
        <div className="my-2 grid grid-cols-3">
          {cages.map((cage) => (
            <div
              className={`m-2 border-2 rounded-lg p-2 ${
                cage.availableQuantity && cage.availableQuantity >= cage.capacity ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
              } ${selectedCage?.id === cage.id ? "bg-emerald-200" : ""}`}
              key={cage.id}
              onClick={() => handleSelectCage(cage)}
            >
              <p className="text-lg">Chuồng: {cage.code}</p>
              <p className="text-lg">
                Sức chứa: {cage.availableQuantity}/{cage.capacity}
              </p>
            </div>
          ))}
        </div>
        <Button color="primary" type="submit" isDisabled={height && width && weight && !errors.note && selectedCage ? false : true}>
          Lưu
        </Button>
      </form>
    </div>
  );
};

export default MonitorDevelopment;
