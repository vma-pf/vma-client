"use client";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Button,
  CalendarDate,
  Card,
  DateRangePicker,
  Input,
  RangeValue,
  Textarea,
} from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";

const FirstVaccinationStep = () => {
  const [date, setDate] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(
      new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)
    ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      expectedEndDate: "",
      note: "",
    },
  });

  const handleSubmitForm = async (data: any) => {
    try {
      delete data.date;
      // const res = await apiRequest.createHerd(data);
      // if (res && res.isSuccess) {
      //   toast({
      //     variant: "success",
      //     title: res.data,
      //   });
      //   dispatch(setNextHerdProgressStep());
      // }
      console.log(data);
      // dispatch(setNextHerdProgressStep());
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    } finally {
    }
  };

  const handleDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };
  return (
    <div>
      <div className="container mx-auto">
        <Card className="p-4 mt-6">
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <div className="grid grid-flow-row grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap">
                <Input
                  className="mb-5"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Tiêu đề"
                  placeholder="Nhập tiêu đề"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={errors.title ? true : false}
                  errorMessage="Tiêu đề không được để trống"
                  {...register("title", { required: true })}
                />
                <DateRangePicker
                  label="Ngày bắt đầu - Ngày kết thúc (dự kiến)"
                  radius="sm"
                  size="lg"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={date.end <= date.start ? true : false}
                  errorMessage="Vui lòng nhập đúng ngày bắt đầu - ngày kết thúc"
                  minValue={today(getLocalTimeZone())}
                  validationBehavior="native"
                  value={date || ""}
                  onChange={(event) => {
                    handleDateChange(event);
                  }}
                />
                <Textarea
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
              </div>
              <Textarea
                minRows={30}
                type="text"
                radius="sm"
                size="lg"
                label="Mô tả"
                placeholder="Nhập mô tả"
                labelPlacement="outside"
                cacheMeasurements
                isRequired
                isInvalid={errors.description ? true : false}
                errorMessage="Mô tả không được để trống"
                {...register("description", { required: true })}
              />
            </div>
            {/* <div className="flex justify-end">
              <Button
                // className="w-1/6 focus:outline-none text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-6"
                color="primary"
                variant="solid"
                isDisabled={errors && Object.keys(errors).length > 0}
                size="lg"
                type="submit"
              >
                <p className="text-white">Bước tiếp theo</p>
              </Button>
            </div> */}
          </form>
        </Card>
        <Card className="p-4 mt-6">
          Giai đoạn
        </Card>
      </div>
    </div>
  );
};
export default FirstVaccinationStep;
