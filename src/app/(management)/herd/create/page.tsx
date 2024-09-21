"use client";
import {
  Button,
  DatePicker,
  DateValue,
  Input,
  Textarea,
} from "@nextui-org/react";
import CreateHerdProgressStep from "@oursrc/components/herds/create-herd-progress-step";
import { title } from "process";
import React, { SetStateAction } from "react";
import { useForm } from "react-hook-form";

const HeadCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [date, setDate] = React.useState<DateValue>();

  const handleSubmitForm = () => {};
  return (
    <div>
      <div className="container mx-auto px-20">
        <CreateHerdProgressStep
          data={[
            { title: "Buoc 1", status: "done", isCurrentTab: true },
            { title: "Buoc 2", status: "not_yet", isCurrentTab: false },
            { title: "Buoc 4", status: "not_yet", isCurrentTab: false },
            { title: "Buoc 2", status: "not_yet", isCurrentTab: false },
          ]}
        />
        <div className="mt-12">
          <h1 className="text-3xl">Tạo đàn mới</h1>
        </div>
        <div>upload file section</div>
        <div className="mt-12">
          <h1 className="text-xl">Thông tin đàn</h1>
        </div>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="grid grid-flow-row grid-cols-2 gap-4 mt-10">
            <div className="flex w-full flex-wrap md:flex-nowrap">
              <Input
                className="mb-5"
                type="text"
                label="Kí hiệu đàn"
                placeholder="Nhập kí hiệu đàn"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.username ? true : false}
                errorMessage="Kí hiệu đàn không được để trống"
                {...register("herdName", { required: true })}
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap">
              <Input
                className="mb-5"
                type="text"
                label="Giống heo"
                placeholder="Nhập Giống heo"
                labelPlacement="outside"
                description="ví dụ: giống A, giống B,..."
                isRequired
                isInvalid={errors.username ? true : false}
                errorMessage="Giống heo không được để trống"
                {...register("herdType", { required: true })}
              />
            </div>
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-4 mb-5">
            <DatePicker
              label="Ngày bắt đầu"
              labelPlacement="outside"
              isRequired
              value={date}
              onChange={(date) => setDate(date)}
            />
            <DatePicker
              label="Ngày kết thúc"
              labelPlacement="outside"
              isRequired
            />
          </div>
          <div className="grid grid-cols-1 mb-5">
            <Textarea
              minRows={20}
              type="text"
              label="Mô tả"
              placeholder="Nhập mô tả"
              labelPlacement="outside"
              isRequired
              isInvalid={errors.username ? true : false}
              errorMessage="Mô tả không được để trống"
              {...register("herdType", { required: true })}
            />
          </div>
          <div className="grid grid-flow-row grid-cols-6 gap-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <Button
              // className="focus:outline-none text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-full mt-6"
              color="primary"
              variant="solid"
              type="submit"
            >
              Xác nhận
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeadCreate;
