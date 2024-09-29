import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  Button,
  DateRangePicker,
  Input,
  RangeValue,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";
import { apiRequest } from "../../api-request";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { useToast } from "@oursrc/hooks/use-toast";
import { Cage, HerdInfo, Pig } from "../../models/herd";
import { useRouter } from "next/navigation";
import { setHerdProgressSteps } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { GiPig } from "react-icons/gi";

// const assignedPigs: Pig[] = [
//   { id: 1, name: "Heo 001", cage: { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 2, name: "Heo 002", cage: { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 3, name: "Heo 003", cage: { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 4, name: "Heo 004", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 5, name: "Heo 005", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 6, name: "Heo 006", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 7, name: "Heo 007", cage: { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 8, name: "Heo 008", cage: { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 9, name: "Heo 009", cage: { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 10, name: "Heo 010", cage: { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 11, name: "Heo 011", cage: { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 12, name: "Heo 012", cage: { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 13, name: "Heo 013", cage: { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 14, name: "Heo 014", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 15, name: "Heo 015", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 16, name: "Heo 016", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 17, name: "Heo 017", cage: { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 18, name: "Heo 018", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 19, name: "Heo 019", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 20, name: "Heo 020", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 21, name: "Heo 021", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 22, name: "Heo 022", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 23, name: "Heo 023", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 24, name: "Heo 024", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 25, name: "Heo 025", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
//   { id: 26, name: "Heo 026", cage: { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 }, weight: 100, height: 100, width: 100 },
// ];

const PreviewInfo = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [assignedPigs, setAssignedPigs] = React.useState<Pig[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  // const [totalNumber, setTotalNumber] = React.useState<string | undefined>();
  const code = watch("code");
  const breed = watch("breed");
  const description = watch("description");
  const [date, setDate] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(
      new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)
    ),
  });

  useEffect(() => {
    // setValue("totalNumber", totalNumber || "0");
    setValue("startDate", date.start.toString() || "");
    setValue("expectedEndDate", date.end.toString() || "");
  }, [date]);

  const handleTotalNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    // setTotalNumber(numericValue);
  };

  const handleDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };

  const getCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await apiRequest.getCages(1, 500);
      if (res && res.isSuccess) {
        setCages(res.data.data);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const storedData: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "null");
    const storedPigs: Pig[] = JSON.parse(localStorage.getItem("assignedPigs") || "[]");
    if (storedData !== null && storedPigs.length > 0) {
      setAssignedPigs(storedPigs);
      // setTotalNumber(storedData.totalNumber.toString());
      setDate({
        start: parseDate(storedData.startDate.slice(0, 10)),
        end: parseDate(storedData.expectedEndDate.slice(0, 10)),
      });
      setValue("code", storedData.code);
      setValue("breed", storedData.breed);
      setValue("description", storedData.description);
    }
    getCages();
  }, []);

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      data.startDate = new Date(data.startDate).toISOString();
      data.expectedEndDate = new Date(data.expectedEndDate).toISOString();
      delete data.date;
      // const res: ResponseObject<any> = await apiRequest.createHerd(data);
      // if (res && res.isSuccess) {
      //   toast({
      //     variant: "success",
      //     title: res.data.toString(),
      //   });
      //   dispatch(setNextHerdProgressStep());
      // } else {
      //   toast({
      //     variant: "destructive",
      //     title: res.errorMessage || "Có lỗi xảy ra",
      //   });
      // }
      const fliterAssignedPigs = assignedPigs.map((pig) => {
        return {
          code: pig.code,
          herdId: pig.herdId,
          weight: pig.weight,
          height: pig.height,
          width: pig.width,
          cageId: pig.cage?.id,
        };
      }
      );
      console.log(data, fliterAssignedPigs);
      localStorage.removeItem("herdData");
      localStorage.removeItem("assignedPigs");
      localStorage.removeItem("herdProgressSteps");
      router.push("/management/farmer/herd");
      dispatch(setHerdProgressSteps([]));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto mt-12 mb-8">
      <h1 className="text-3xl">Preview thông tin</h1>
      <form className="p-4" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
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
              value={code || ""}
              isInvalid={errors.code ? true : false}
              errorMessage="Kí hiệu đàn không được để trống"
              {...register("code", { required: true })}
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
              value={breed || ""}
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
            {/* <Input
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
            /> */}
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
            value={description || ""}
            isInvalid={errors.description ? true : false}
            errorMessage="Mô tả không được để trống"
            {...register("description", { required: true })}
          />
        </div>
        <div className="mt-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <p className="text-3xl font-bold text-center mb-5">Danh sách heo</p>
          <div className="mt-2 grid grid-cols-3">
          </div>
          <div className="m-3 grid grid-cols-3">
            {assignedPigs.length > 0 ? cages.map((cage, idx) => (
              <div key={idx} className="m-2 col-span-1 border-2 rounded-lg">
                <p className="text-center text-xl font-semibold">Chuồng: {cage.code}</p>
                <div className="flex justify-center items-center">
                  <p className="text-center mr-2 text-lg">Sức chứa: {cage.availableQuantity} / {cage.capacity}</p>
                  <GiPig size={30} className="text-primary" />
                </div>
                <div className="">
                  {assignedPigs
                    .filter((pig) => pig.cage?.id === cage.id)
                    .map((pig: Pig, index) => (
                      <div
                        className="mx-2 my-3 p-2 border-2 rounded-xl shadow-md cursor-pointer"
                        key={index}
                      >
                        <HoverCard openDelay={100} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <div className="">
                              <p className="overflow-auto break-all">Mã: {pig.code}</p>
                              <p className="text-lg font-semibold overflow-auto">Giới tính: {pig.gender === "Male" ? "Đực" : "Cái"}</p>
                            </div>
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
            )) : <div className="col-span-3 text-center text-lg">Chưa có heo nào được xếp</div>}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            color="primary"
            variant="solid"
            isLoading={loading}
            isDisabled={
              code === "" || breed === "" || description === "" || date.end <= date.start
              || assignedPigs.length === 0}
            type="submit"
            size="lg"
          >
            Hoàn tất
          </Button>
        </div>
      </form>
    </div >
  );
};

export default PreviewInfo;
