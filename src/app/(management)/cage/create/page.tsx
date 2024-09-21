"use client";
import { Button, DatePicker, Input, Textarea } from "@nextui-org/react";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import { title } from "process";
import React from "react";
import { useForm } from "react-hook-form";

const CageCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitForm = () => {};
  return (
    <div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep
          data={[
            {
              title: "Buoc 1",
              status: "done",
              isCurrentTab: false,
              route: "/herd/create",
            },
            {
              title: "Buoc 2",
              status: "not_yet",
              isCurrentTab: true,
              route: "/cage/create",
            },
            {
              title: "Buoc 3",
              status: "not_yet",
              isCurrentTab: false,
              route: "/pig/create",
            },
            {
              title: "Buoc 4",
              status: "not_yet",
              isCurrentTab: false,
              route: "/end",
            },
          ]}
        />
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
                label="Tên chuồng"
                placeholder="Nhập tên chuồng"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.username ? true : false}
                errorMessage="Tên chuồng không được để trống"
                {...register("cageName", { required: true })}
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
                isInvalid={errors.username ? true : false}
                errorMessage="Sức chứa không được để trống"
                {...register("cageCapacity", { required: true })}
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
              isInvalid={errors.username ? true : false}
              errorMessage="Vị trí không được để trống"
              {...register("cagrPosition", { required: true })}
            />
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4 mb-5">
            <DatePicker
              label="Ngày bắt đầu"
              radius="sm"
              size="lg"
              labelPlacement="outside"
              isRequired
            />
            <DatePicker
              label="Ngày kết thúc"
              radius="sm"
              size="lg"
              labelPlacement="outside"
              isRequired
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
              isInvalid={errors.username ? true : false}
              errorMessage="Mô tả không được để trống"
              {...register("herdType", { required: true })}
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
              <p className="text-white">Lưu chuồng</p>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CageCreate;
