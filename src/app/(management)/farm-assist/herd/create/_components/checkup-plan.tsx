"use client";
import { Button, Calendar, DateValue, Input, Radio, RadioGroup, cn } from "@nextui-org/react";
import { dateArrayConverter, parseToWeekday } from "@oursrc/lib/utils";
import { today, getLocalTimeZone, CalendarDate, parseDate } from "@internationalized/date";
import React from "react";
import { useToast } from "@oursrc/hooks/use-toast";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { initialState, setHerdProgressSteps, setNextHerdProgressStep } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { checkupPlanService } from "@oursrc/lib/services/checkupPlanService";
import { HerdInfo } from "@oursrc/lib/models/herd";

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;
  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[400px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};

const PlanDetail: React.FC<{
  selectedDate: DateValue | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateValue | null>>;
  isDateUnavailable?: (date: DateValue) => boolean;
}> = ({ selectedDate, setSelectedDate, isDateUnavailable }) => {
  const herdData: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "{}") || {};
  return (
    <div>
      <div className="flex gap-10 mt-4">
        <div>
          <Calendar
            classNames={{
              //   base: cn("w-[400px]"),
              gridWrapper: cn("w-[400px]"),
            }}
            minValue={herdData.startDate ? parseDate(herdData.startDate.split("T")[0]).add({ days: 1 }) : today(getLocalTimeZone()).add({ days: 1 })}
            maxValue={herdData.expectedEndDate ? parseDate(herdData.expectedEndDate.split("T")[0]) : today(getLocalTimeZone()).add({ years: 1 })}
            value={selectedDate}
            onChange={setSelectedDate}
            isDateUnavailable={isDateUnavailable || undefined}
          />
          {selectedDate && (
            <div>
              <p className="text-lg">Ngày đã chọn</p>
              <p>{parseToWeekday(selectedDate.toString())}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckUpPlan = () => {
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState<DateValue | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isDoneAll, setIsDoneAll] = React.useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const herd: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "{}") || {};
      let data: string[] = [];
      switch (selected) {
        case "1":
          const dates: DateValue[] = [];
          let date = selectedDate;
          for (let i = parseDate(herd.startDate.split("T")[0]); i.compare(parseDate(herd.expectedEndDate.split("T")[0])) < 0; i = i.add({ days: 7 })) {
            dates.push(date as DateValue);
            date = date?.add({ days: 7 }) ?? null;
          }
          data = dateArrayConverter(dates.map((date) => date.toString()));
          break;
        case "2":
          const dates2: DateValue[] = [];
          let date2 = selectedDate;
          for (let i = parseDate(herd.startDate.split("T")[0]); i.compare(parseDate(herd.expectedEndDate.split("T")[0])) < 0; i = i.add({ days: 14 })) {
            dates2.push(date2 as DateValue);
            date2 = date2?.add({ weeks: 2 }) ?? null;
          }
          data = dateArrayConverter(dates2.map((date) => date.toString()));
          break;
        case "3":
          const dates3: DateValue[] = [];
          let date3 = selectedDate;
          for (let i = parseDate(herd.startDate.split("T")[0]); i.compare(parseDate(herd.expectedEndDate.split("T")[0])) < 0; i = i.add({ months: 1 })) {
            dates3.push(date3 as DateValue);
            date3 = date3?.add({ months: 1 }) ?? null;
          }
          data = dateArrayConverter(dates3.map((date) => date.toString()));
          break;
        case "4":
          const dates4: DateValue[] = [];
          let date4 = selectedDate;
          for (let i = parseDate(herd.startDate.split("T")[0]); i.compare(parseDate(herd.expectedEndDate.split("T")[0])) < 0; i = i.add({ months: 3 })) {
            dates4.push(date4 as DateValue);
            date4 = date4?.add({ months: 3 }) ?? null;
          }
          data = dateArrayConverter(dates4.map((date) => date.toString()));
          break;
        default:
          break;
      }
      const res: ResponseObject<any> = await checkupPlanService.createCheckUpPlan(herd.id, data);
      if (res.isSuccess) {
        setIsDoneAll(true);
        clearData();
        router.push("/farm-assist/herd");
        dispatch(setHerdProgressSteps(initialState.herdProgressSteps));
        toast({
          title: "Tạo đàn thành công",
          variant: "success",
        });
      } else {
        toast({
          title: res.errorMessage || "Có lỗi xảy ra",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: error.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setSelected("");
    setSelectedDate(null);
    localStorage.removeItem("herdData");
    localStorage.removeItem("assignedPigs");
    localStorage.removeItem("herdProgressSteps");
  };

  const getPlan = (selected: string) => {
    let now = today(getLocalTimeZone());
    let disabledRanges: CalendarDate[][] = [];
    let isDateUnavailable = (date: DateValue) => disabledRanges.some((interval) => date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0);

    switch (selected) {
      case "1":
        return (
          <div>
            <PlanDetail selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        );
      case "2":
        for (let i = 0; i < 26; i += 2) {
          const start = now.add({ weeks: i });
          const end = now.add({ weeks: i + 1 });
          disabledRanges.push([start, end]);
        }
        return (
          <div>
            <PlanDetail selectedDate={selectedDate} setSelectedDate={setSelectedDate} isDateUnavailable={isDateUnavailable} />
          </div>
        );
      case "3":
        return (
          <div>
            <PlanDetail selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        );
      case "4":
        return (
          <div>
            <PlanDetail selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </div>
        );
      default:
        break;
    }
  };

  React.useEffect(() => {
    setSelectedDate(null);
  }, [selected]);

  return (
    <div className="container mx-auto">
      <div className="mt-3 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-3xl mb-4">Tạo kế hoạch kiểm tra sức khỏe của đàn</p>
        <div className="flex justify-center gap-20">
          <RadioGroup
            onValueChange={(value: string) => {
              setSelected(value);
            }}
            label="Chọn khoảng thời gian"
            description="Chọn khoảng thời gian bạn muốn kiểm tra sức khỏe cho đàn"
            className="w-[400px]"
          >
            <CustomRadio description="Kiểm tra sức khỏe cho đàn hằng tuần" value="1">
              1 Tuần 1 lần
            </CustomRadio>
            <CustomRadio description="Kiểm tra sức khỏe cho đàn 1 tháng 2 lần" value="2">
              1 Tháng 2 lần
            </CustomRadio>
            <CustomRadio description="Kiểm tra sức khỏe cho đàn hằng tháng" value="3">
              1 Tháng 1 lần
            </CustomRadio>
            <CustomRadio description="Kiểm tra sức khỏe cho đàn 1 quý 1 lần" value="4">
              3 Tháng 1 lần
            </CustomRadio>
          </RadioGroup>
          <div className="mt-3 ml-10">{getPlan(selected)}</div>
        </div>
      </div>
      <div className="flex justify-end mt-3">
        <Button color="primary" variant="solid" isLoading={isLoading} size="lg" isDisabled={!selected || !selectedDate || isDoneAll} onPress={handleSubmit}>
          Hoàn tất
        </Button>
      </div>
    </div>
  );
};

export default CheckUpPlan;
