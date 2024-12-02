"use client";
import { Button, Input, Skeleton } from "@nextui-org/react";
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
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";

const MonitorDevelopment = ({ setIsOpen, pigInfo }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; pigInfo: Pig }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const { toast } = useToast();
  const width = watch("width");
  const height = watch("height");
  const weight = watch("weight");
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDoneAll, setIsDoneAll] = React.useState(false);

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
    if (cage.availableQuantity !== undefined && cage.availableQuantity < cage.capacity) {
      if (cage.id !== selectedCage?.id) {
        setSelectedCage(cage);
      } else {
        setSelectedCage(undefined);
      }
    }
  };
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res: ResponseObject<any> = await monitorDevelopmentLogService.createMonitoringLog({
        pigId: pigInfo?.id ?? "",
        weight: Number(weight || ""),
        height: Number(height || ""),
        width: Number(width || ""),
        note: data.note,
        status: 0,
      });
      if (res.isSuccess) {
        setIsDoneAll(true);
        reset();
        setIsOpen(false);
      } else {
        toast({
          title: res.errorMessage || "Nhập thông tin không thành công",
          variant: "destructive",
        });
      }
      if (pigInfo?.cageId !== selectedCage?.id) {
        const response: ResponseObject<any> = await cageService.assignPigToCage(selectedCage?.id ?? "", pigInfo?.id ?? "");
        if (response.isSuccess) {
          setIsDoneAll(true);
          console.log("Chuyển chuồng thành công");
        } else {
          console.log(response.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCages = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data);
        setSelectedCage(res.data.data.find((cage) => cage.id === pigInfo?.cageId ?? "") || undefined);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
          isInvalid={errors.weight ? true : false}
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
          isInvalid={errors.height ? true : false}
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
          isInvalid={errors.width ? true : false}
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
          {isLoading
            ? [...Array(3)].map((_, idx) => (
                <div key={idx} className="m-2 border-2 rounded-lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-20"></div>
                  </Skeleton>
                </div>
              ))
            : cages.map((cage) => (
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
        <Button color="primary" type="submit" isDisabled={height && width && weight && !errors.note && selectedCage && !isDoneAll ? false : true} isLoading={loading}>
          Lưu
        </Button>
      </form>
    </div>
  );
};

export default MonitorDevelopment;
