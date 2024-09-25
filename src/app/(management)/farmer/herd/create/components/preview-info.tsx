import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  DateRangePicker,
  Input,
  RangeValue,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const PreviewInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [capacity, setCapacity] = React.useState<string>();
  const [totalNumber, setTotalNumber] = React.useState<string | undefined>();
  const [date, setDate] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(
      new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)
    ),
  });

  useEffect(() => {
    setValue("capacity", capacity || "0");
    setValue("totalNumber", totalNumber || "0");
    setValue("startDate", date.start.toString() || "");
    setValue("expectedEndDate", date.end.toString() || "");
  }, []);

  const handleCapacityChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    setCapacity(numericValue);
  };

  const handleTotalNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    setTotalNumber(numericValue);
  };

  const handleDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };

  const handleSubmitForm = async (data: any) => {};
  return (
    <div className="container mx-auto mt-12 mb-8">
      <h1 className="text-3xl">Preview thông tin</h1>
      <div className="mt-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Accordion selectionMode="multiple" defaultExpandedKeys={["1", "2"]}>
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title="Thông tin chuồng"
            >
              <div className="flex">
                <Input
                  className="w-1/2 mb-5 mr-1"
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
                <Input
                  className="w-1/2 mb-5 ml-1"
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
                  onValueChange={(event) => handleCapacityChange(event)}
                  {...register("capacity", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <Textarea
                minRows={20}
                type="text"
                radius="sm"
                size="lg"
                label="Mô tả"
                placeholder="Nhập mô tả"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.cageDescription ? true : false}
                errorMessage="Mô tả không được để trống"
                {...register("cageDescription", { required: true })}
              />
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Accordion 2"
              title="Thông tin đàn"
            >
              <div className="flex">
                <Input
                  className="mb-5 w-1/2 mr-1"
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
                <Input
                  className="mb-5 w-1/2 ml-1"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Giống heo"
                  placeholder="Nhập giống heo"
                  labelPlacement="outside"
                  description="ví dụ: giống A, giống B,..."
                  isRequired
                  isInvalid={errors.breed ? true : false}
                  errorMessage="Giống heo không được để trống"
                  {...register("breed", { required: true })}
                />
              </div>
              <div className="flex">
                <DateRangePicker
                  className="mb-5 w-1/2 mr-1"
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
                <Input
                  className="mb-5 w-1/2 ml-1"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Số lượng heo"
                  placeholder="Nhập số lượng heo"
                  labelPlacement="outside"
                  isRequired
                  isInvalid={errors.totalNumber ? true : false}
                  errorMessage="Số lượng heo không được để trống"
                  value={totalNumber || ""}
                  onValueChange={(event) => handleTotalNumberChange(event)}
                  {...register("totalNumber", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <Textarea
                minRows={20}
                type="text"
                radius="sm"
                size="lg"
                label="Mô tả"
                placeholder="Nhập mô tả"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.herdDescription ? true : false}
                errorMessage="Mô tả không được để trống"
                {...register("herdDescription", { required: true })}
              />
            </AccordionItem>
          </Accordion>
        </form>
        <p className="text-center mb-5">Danh sách heo</p>
      </div>
    </div>
  );
};

export default PreviewInfo;
