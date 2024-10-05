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
import { Cage, CreateCageRequest } from "@oursrc/lib/models/cage";
import PrepareCageList from "./prepare-cage-list";

const CageCreate = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState<boolean | undefined>(false);
  const [capacity, setCapacity] = React.useState<string>();
  const [newCages, setNewCages] = React.useState<Cage[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: "",
      capacity: "",
      description: "",
    },
  });

  useEffect(() => {
    setValue("capacity", capacity || "0");
  }, []);

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      const res: ResponseObjectList<any> = await cageService.createCage(data);
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: 'Tạo mới chuồng thành công',
        });
        setNewCages([])
        setNewCages([...newCages, {
          id: "",
          code: data.code,
          capacity: data.capacity,
          description: data.description,
          availableQuantity: 0
        }])
        // dispatch(setNextHerdProgressStep());
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

  const handleNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    setCapacity(numericValue);
  };
  return (
    <div>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-12 ">
            <h1 className="text-3xl mb-8">
              Chuồng có sẵn
            </h1>
            <PrepareCageList hasNewCages={newCages.length > 0} />
          </div>
          <div>
            <div className="mt-12 mb-6 flex justify-between">
              <h1 className="text-3xl">
                Tạo chuồng mới
                <span className="ml-3 text-base text-gray-400">(Optional)</span>
              </h1>
              <Button
                variant="ghost"
                color="primary"
                endContent={<HiChevronDoubleRight size={20} />}
                onPress={() => dispatch(setNextHerdProgressStep())}
              >
                Bỏ qua bước này
              </Button>
            </div>
            {/* <div className="w-100">
              <AttachMedia />
            </div> */}
            <div className="mt-12">
              <h1 className="text-xl">Thông tin chuồng</h1>
            </div>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="grid grid-flow-row grid-cols-2 gap-4 mt-10">
                <div className="flex w-full flex-wrap md:flex-nowrap">
                  <Input
                    className="mb-5"
                    type="text"
                    radius="sm"
                    size="lg"
                    label="Mã chuồng"
                    placeholder="Nhập mã chuồng"
                    labelPlacement="outside"
                    isRequired
                    isInvalid={errors.code ? true : false}
                    errorMessage="Mã chuồng không được để trống"
                    {...register("code", { required: true })}
                  />
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap">
                  <Input
                    className="mb-5"
                    type="text"
                    radius="sm"
                    size="lg"
                    label="Sức chứa"
                    placeholder="Nhập sức chứa"
                    labelPlacement="outside"
                    isRequired
                    isInvalid={errors.capacity ? true : false}
                    errorMessage="Sức chứa không được để trống"
                    value={capacity || ""}
                    onValueChange={(event) => handleNumberChange(event)}
                    {...register("capacity", {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 mb-5">
                <Textarea
                  minRows={20}
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Mô tả"
                  placeholder="Nhập mô tả"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={errors.description ? true : false}
                  errorMessage="Mô tả không được để trống"
                  {...register("description", { required: true })}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="solid"
                  color="primary"
                  isDisabled={errors && Object.keys(errors).length > 0}
                  isLoading={loading}
                  size="lg"
                  type="submit"
                >
                  <p className="text-white">Tạo mới</p>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CageCreate;
