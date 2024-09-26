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
import { Pig } from "./assign-tag";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";

const assignedPigs: Pig[] = [
  { id: 1, name: "Heo 001", cage: { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 2, name: "Heo 002", cage: { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 3, name: "Heo 003", cage: { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 4, name: "Heo 004", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 5, name: "Heo 005", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 6, name: "Heo 006", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 7, name: "Heo 007", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 8, name: "Heo 008", cage: { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 9, name: "Heo 009", cage: { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 10, name: "Heo 010", cage: { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 11, name: "Heo 011", cage: { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 12, name: "Heo 012", cage: { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 13, name: "Heo 013", cage: { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 14, name: "Heo 014", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 15, name: "Heo 015", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 16, name: "Heo 016", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 17, name: "Heo 017", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 18, name: "Heo 018", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 19, name: "Heo 019", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 20, name: "Heo 020", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 21, name: "Heo 021", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 22, name: "Heo 022", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 23, name: "Heo 023", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 24, name: "Heo 024", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 25, name: "Heo 025", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
  { id: 26, name: "Heo 026", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
];

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

  const handleSubmitForm = async (data: any) => { };
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
      </div>
      <div className="mt-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-3xl font-bold text-center mb-5">Danh sách heo</p>
        <div className="mt-2 grid grid-cols-3">
          <div className="px-3 m-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-center text-xl font-semibold">Chuồng 001</p>
            <p className="text-center text-lg">Sức chứa: {
              assignedPigs.find((pig) => pig.cage?.id === "1")?.cage?.currentQuantity
            }</p>
            <div className="grid grid-cols-3">
              {assignedPigs
                .filter((pig) => pig.cage?.id === "1")
                .map((pig: Pig, index) => (
                  <div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <p className="text-lg font-semibold">{pig.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-lg">Cân nặng: {pig.weight}</p>
                        <p className="text-lg">Chiều cao: {pig.height}</p>
                        <p className="text-lg">Chiều rộng: {pig.width}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-3 m-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-center text-xl font-semibold">Chuồng 002</p>
            <p className="text-center text-lg">Sức chứa: {
              assignedPigs.find((pig) => pig.cage?.id === "2")?.cage?.currentQuantity
            }</p>
            <div className="grid grid-cols-3">
              {assignedPigs
                .filter((pig) => pig.cage?.id === "2")
                .map((pig: Pig, index) => (
                  <div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <p className="text-lg font-semibold">{pig.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-lg">Cân nặng: {pig.weight}</p>
                        <p className="text-lg">Chiều cao: {pig.height}</p>
                        <p className="text-lg">Chiều rộng: {pig.width}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-3 m-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-center text-xl font-semibold">Chuồng 003</p>
            <p className="text-center text-lg">Sức chứa: {
              assignedPigs.find((pig) => pig.cage?.id === "3")?.cage?.currentQuantity
            }</p>
            <div className="grid grid-cols-3">
              {assignedPigs
                .filter((pig) => pig.cage?.id === "3")
                .map((pig: Pig, index) => (
                  <div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <p className="text-lg font-semibold">{pig.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-lg">Cân nặng: {pig.weight}</p>
                        <p className="text-lg">Chiều cao: {pig.height}</p>
                        <p className="text-lg">Chiều rộng: {pig.width}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-3 m-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-center text-xl font-semibold">Chuồng 004</p>
            <p className="text-center text-lg">Sức chứa: {
              assignedPigs.find((pig) => pig.cage?.id === "4")?.cage?.currentQuantity
            }</p>
            <div className="grid grid-cols-3">
              {assignedPigs
                .filter((pig) => pig.cage?.id === "4")
                .map((pig: Pig, index) => (
                  <div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <p className="text-lg font-semibold">{pig.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-lg">Cân nặng: {pig.weight}</p>
                        <p className="text-lg">Chiều cao: {pig.height}</p>
                        <p className="text-lg">Chiều rộng: {pig.width}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-3 m-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-center text-xl font-semibold">Chuồng 005</p>
            <p className="text-center text-lg">Sức chứa: {
              assignedPigs.find((pig) => pig.cage?.id === "5")?.cage?.currentQuantity
            }</p>
            <div className="grid grid-cols-3">
              {assignedPigs
                .filter((pig) => pig.cage?.id === "5")
                .map((pig: Pig, index) => (
                  <div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <p className="text-lg font-semibold">{pig.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-lg">Cân nặng: {pig.weight}</p>
                        <p className="text-lg">Chiều cao: {pig.height}</p>
                        <p className="text-lg">Chiều rộng: {pig.width}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
            </div>
          </div>
          <div className="px-3 m-2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-center text-xl font-semibold">Chuồng 006</p>
            <p className="text-center text-lg">Sức chứa: {
              assignedPigs.find((pig) => pig.cage?.id === "6")?.cage?.currentQuantity
            }</p>
            <div className="grid grid-cols-3">
              {assignedPigs
                .filter((pig) => pig.cage?.id === "6")
                .map((pig: Pig, index) => (
                  <div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                  >
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <p className="text-lg font-semibold">{pig.name}</p>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="text-lg">Cân nặng: {pig.weight}</p>
                        <p className="text-lg">Chiều cao: {pig.height}</p>
                        <p className="text-lg">Chiều rộng: {pig.width}</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewInfo;
