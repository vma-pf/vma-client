"use client";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import { toast } from "@oursrc/hooks/use-toast";
import { title } from "process";
import React from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../../../cage/api-request";
import { setNextHerdProgressStep } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";

const CageCreate = () => {
  const [loading, setLoading] = React.useState<boolean | undefined>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      code: '',
      position: '',
      capacity: 0,
      description: ''
    }
  });

  const handleSubmitForm = async (data: any) => {
    setLoading(true);
    try {
      const res = await apiRequest.createCage(data);
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: res.data,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Đăng nhập thất bại",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="container mx-auto px-20">
        <div className="mt-12 mb-6">
          <h1 className="text-3xl">Tạo chuồng mới</h1>
        </div>
        <div className="w-100">
          <AttachMedia size="1/2" />
        </div>
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
                {...register("capacity", { required: true })}
              />
            </div>
          </div>
          <div className="grid grid-flow-row grid-cols-1 gap-4">
            <Input
              className="mb-5"
              type="text"
              radius="sm"
              size="lg"
              label="Vị trí"
              placeholder="Nhập vị trí"
              labelPlacement="outside"
              isRequired
              isInvalid={errors.position ? true : false}
              errorMessage="Vị trí không được để trống"
              {...register("position", { required: true })}
            />
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
              className="w-1/6 focus:outline-none text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-6"
              variant="solid"
              isLoading={false}
              size="lg"
              type="submit"
            >
              <p className="text-white">Bước tiếp theo</p>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CageCreate;