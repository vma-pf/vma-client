"use client";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Button,
  CalendarDate,
  Card,
  CardBody,
  DatePicker,
  DateRangePicker,
  DateValue,
  Divider,
  Image,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeValue,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import { toast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { Pig } from "@oursrc/lib/models/pig";
import { pigService } from "@oursrc/lib/services/pigService";
import { CheckIcon, CircleCheck, CircleDashed, CircleX, Filter, Plus, Trash2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import PopOverPigList from "./popover-pig-list";
import SelectedPigsList from "./selected-pigs-list";

type Stages = {
  title: string;
  timeSpan: string;
  applyStageTime: DateValue;
  vaccinationToDos: [];
};

const FirstVaccinationStep = () => {
  //State
  const [selectedCage, setSelectedCage] = React.useState<Cage | null>(null);
  const [selectedPigNumber, setSelectedPigNumber] = React.useState<number>(0);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [openBy, setOpenBy] = React.useState<string>("");
  const [openSelectedPigsByHerdCage, setOpenSelectedPigsByHerdCage] = React.useState<boolean>(false);
  const [stages, setStages] = React.useState<Stages[]>([
    {
      title: "",
      timeSpan: "",
      applyStageTime: today(getLocalTimeZone()),
      vaccinationToDos: [],
    },
  ]);
  const [date, setDate] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)),
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

  //Use Effect

  React.useEffect(() => {
    if (selectedCage) {
      setSelectedPigNumber(selectedCage?.availableQuantity);
      fetchData();
      console.log(allSelectedPigs);
    }
  }, [selectedCage]);

  const fetchData = async () => {
    try {
      const response = await pigService.getPigsByCageId(selectedCage?.id ?? "", 1, 100);
      if (response.isSuccess) {
        setAllSelectedPigs(response.data.data);
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (e) {
      toast({
        variant: "destructive",
        title: e instanceof AggregateError ? e.message : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    }
  };

  const handleSubmitForm = async (data: any) => {
    console.log(data);
    console.log(stages);
    console.log(date);
    try {
      data.startDate = date.start.toString();
      data.expectedEndDate = date.end.toString();
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

  const onOpenSelectedPigsByHerdCage = (openBy: string = "herd") => {
    setOpenSelectedPigsByHerdCage(true);
    setOpenBy(openBy);
  };

  const onAddStage = () => {
    setStages([
      ...stages,
      {
        title: "",
        timeSpan: "",
        applyStageTime: today(getLocalTimeZone()),
        vaccinationToDos: [],
      },
    ]);
  };
  const onDeleteStage = (index: number) => {
    setStages(stages.filter((_: any, i: number) => index !== i));
  };
  return (
    <div>
      <div className="container mx-auto">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex justify-end">
            <Button color="primary" variant="solid" isDisabled={errors && Object.keys(errors).length > 0} size="lg" type="submit">
              <p className="text-white">Bước tiếp theo</p>
            </Button>
          </div>
          <Card className="p-4 mt-6">
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
              <div className="flex flex-col">
                <Textarea
                  minRows={20}
                  type="text"
                  radius="sm"
                  size="md"
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
            </div>
          </Card>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Card className="mt-2" radius="sm">
                <CardBody>
                  <div className="mb-1 flex justify-between">
                    <h3>Chọn heo theo {openBy === "cage" ? "Chuồng" : "Đàn"}</h3>
                    <Popover key="select" placement="bottom">
                      <PopoverTrigger>
                        <Button startContent={<Filter size={20} />}></Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex flex-col px-1 py-2">
                          <Button className="mb-2" color="primary" variant="solid" isDisabled={false} size="sm" onClick={() => onOpenSelectedPigsByHerdCage("herd")}>
                            <p className="text-white">Chọn theo đàn</p>
                          </Button>
                          <Button color="primary" variant="solid" isDisabled={false} size="sm" onClick={() => onOpenSelectedPigsByHerdCage("cage")}>
                            <p className="text-white">Chọn theo chuồng</p>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Divider orientation="horizontal" />
                  {openBy === "cage" ? <CageListReadOnly setSelected={setSelectedCage} /> : ""}
                </CardBody>
              </Card>
            </div>
            <div>
              <Card className="mt-2" radius="sm">
                <CardBody>
                  <SelectedPigsList pigList={allSelectedPigs} />
                </CardBody>
              </Card>
            </div>
          </div>
          <div className="flex flex-row justify-end mt-6">
            <Button color="primary" endContent={<Plus />} onClick={onAddStage}>
              Thêm giai đoạn
            </Button>
          </div>
          {stages.map((stage, index) => {
            return (
              <Card key={index} className="pt-4 px-4 mt-2">
                <div className="flex flex-row justify-between">
                  <div className="w-full grid grid-cols-4 gap-4">
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Tên giai đoạn"
                      placeholder="Nhập tên giai đoạn"
                      defaultValue={stage.title}
                      labelPlacement="outside"
                      isRequired
                      errorMessage="Tên giai đoạn không được để trống"
                      // {...register("breed", { required: true })}
                    />
                    <DatePicker
                      className="mb-5"
                      radius="sm"
                      size="lg"
                      label="Ngày tiêm"
                      defaultValue={stage.applyStageTime}
                      minValue={today(getLocalTimeZone())}
                      labelPlacement="outside"
                      isRequired
                      // {...register("date", { required: true })}
                    />
                  </div>
                  <div className="flex flex-row items-start">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      {stages.length > 1 && <Trash2Icon onClick={() => onDeleteStage(index)} />}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </form>
      </div>
    </div>
  );
};
export default FirstVaccinationStep;
