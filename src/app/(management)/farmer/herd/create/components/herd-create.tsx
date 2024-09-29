"use client";
import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import {
  Button,
  DateRangePicker,
  Input,
  RangeValue,
  Textarea,
} from "@nextui-org/react";
import AttachMedia from "@oursrc/components/ui/attach-media/attach-media";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../../api-request";
import { useToast } from "@oursrc/hooks/use-toast";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { setNextHerdProgressStep } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { HerdInfo } from "../../models/herd";

const HerdCreate = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState<boolean | undefined>(false);
  const [date, setDate] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(
      new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)
    ),
  });
  const code = watch("code");
  const breed = watch("breed");
  const description = watch("description");

  useEffect(() => {
    setValue("startDate", date.start.toString() || "");
    setValue("expectedEndDate", date.end.toString() || "");
  }, []);

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      data.startDate = new Date(data.startDate).toISOString();
      data.expectedEndDate = new Date(data.expectedEndDate).toISOString();
      delete data.date;
      const res: ResponseObject<any> = await apiRequest.createHerd(data);
      if (res && res.isSuccess) {
        toast({
          variant: "success",
          title: "Tạo đàn thành công",
        });
        localStorage.setItem("herdData", JSON.stringify({
          ...data,
          id: res.data
        }));
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

  const handleDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };

  React.useEffect(() => {
    const storedData: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "null");
    if (storedData) {
      setDate({
        start: parseDate(storedData.startDate.slice(0, 10)),
        end: parseDate(storedData.expectedEndDate.slice(0, 10)),
      });
      setValue("code", storedData.code);
      setValue("breed", storedData.breed);
      setValue("description", storedData.description);
    }
  }, []);
  return (
    <div>
      <div className="container mx-auto">
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
                value={code || ""}
                isInvalid={errors.code ? true : false}
                errorMessage="Kí hiệu đàn không được để trống"
                {...register("code", { required: true })}
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap">
              <Input
                className="mb-5"
                type="text"
                radius="sm"
                size="lg"
                label="Giống heo"
                placeholder="Nhập giống heo"
                labelPlacement="outside"
                description="ví dụ: giống A, giống B,..."
                isRequired
                value={breed || ""}
                isInvalid={errors.breed ? true : false}
                errorMessage="Giống heo không được để trống"
                {...register("breed", { required: true })}
              />
            </div>
          </div>
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
              value={description || ""}
              isInvalid={errors.description ? true : false}
              errorMessage="Mô tả không được để trống"
              {...register("description", { required: true })}
            />
          </div>
          <div className="flex justify-end">
            <Button
              // className="w-1/6 focus:outline-none text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-6"
              color="primary"
              variant="solid"
              isDisabled={errors && Object.keys(errors).length > 0}
              isLoading={loading}
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

export default HerdCreate;
