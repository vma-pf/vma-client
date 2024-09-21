"use client";
import { parseDate } from "@internationalized/date";
import { Button, DatePicker, DateValue, Input, Textarea } from "@nextui-org/react";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import React from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../api-request";

const HerdCreate = () => {
  const [loading, setLoading] = React.useState<boolean|undefined>(false);
  const [startDate, setStartDate] = React.useState(parseDate(new Date().toJSON().slice(0, 10)));
  const [expectedEndDate, setExpectedEndDate] = React.useState<DateValue|null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:{
      herdName: '',
      breed: '',
      startDate: '',
      expectedEndDate: '',
      description: ''
    }

  });

  const handleSubmitForm = async (data: any) => {
    setLoading(true)
    try{
      data.startDate = startDate
      data.expectedEndDate = expectedEndDate
      console.log(data)
      const res = await apiRequest.createHerd(data);
    }catch(error){

    }finally{
      setLoading(false)
    }
  };
  return (
    <div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep
          data={[
            {
              title: "Buoc 1",
              status: "done",
              isCurrentTab: true,
              route: "/herd/create",
            },
            {
              title: "Buoc 2",
              status: "not_yet",
              isCurrentTab: false,
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
        <div className="mt-12 mb-8">
          <h1 className="text-3xl">Tạo đàn mới</h1>
        </div>
        <div className="w-100">
          <AttachMedia size="1/2" />
        </div>
        <div className="mt-12">
          <h1 className="text-xl">Thông tin đàn</h1>
        </div>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="grid grid-flow-row grid-cols-2 gap-4 mt-10">
            <div className="flex w-full flex-wrap md:flex-nowrap">
              <Input
                className="mb-5"
                type="text"
                radius="sm"
                size="lg"
                label="Kí hiệu đàn"
                placeholder="Nhập kí hiệu đàn"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.herdName ? true : false}
                errorMessage="Kí hiệu đàn không được để trống"
                {...register("herdName", { required: true })}
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap">
              <Input
                className="mb-5"
                type="text"
                radius="sm"
                size="lg"
                label="Giống heo"
                placeholder="Nhập Giống heo"
                labelPlacement="outside"
                description="ví dụ: giống A, giống B,..."
                isRequired
                isInvalid={errors.breed ? true : false}
                errorMessage="Giống heo không được để trống"
                {...register("breed", { required: true })}
              />
            </div>
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4 mb-5">
            <DatePicker
              label="Ngày bắt đầu"
              radius="sm"
              size="lg"
                labelPlacement="outside"
              isRequired
              isInvalid={errors.startDate ? true : false}
              errorMessage="Vui lòng nhập đúng ngày bắt đầu"
              value={startDate}
              onChange={setStartDate}
              
            />
            <DatePicker
              label="Ngày kết thúc"
              radius="sm"
              size="lg"
              labelPlacement="outside"
              isRequired
              isInvalid={errors.expectedEndDate ? true : false}
              errorMessage="Vui lòng nhập đúng ngày kết thúc"
              value={expectedEndDate}
              onChange={setExpectedEndDate}
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
              isLoading={loading}
              size="lg"
              type="submit"
            >
              <p className="text-white">Lưu đàn</p>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HerdCreate;
