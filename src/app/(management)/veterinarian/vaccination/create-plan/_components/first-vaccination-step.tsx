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
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeValue,
  Textarea,
} from "@nextui-org/react";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import HerdListReadOnly from "@oursrc/components/herds/herd-list-read-only";
import { toast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { Herd } from "@oursrc/lib/models/herd";
import { Pig } from "@oursrc/lib/models/pig";
import { pigService } from "@oursrc/lib/services/pigService";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import { ChevronRight, Filter, Plus, Trash2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import SelectedPigsList from "./selected-pigs-list";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";

const FirstVaccinationStep = ({
  setStep,
  setVaccinationPlanFirstStepResult,
}: any) => {
  //State
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [openBy, setOpenBy] = React.useState<string>("");

  const [stages, setStages] = React.useState<VaccinationStageProps[]>([
    {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      title: "",
      timeSpan: "1",
      applyStageTime: "",
      vaccinationToDos: [{ description: "" }],
    },
  ]);
  const [date, setDate] = React.useState<RangeValue<CalendarDate>>({
    start: parseDate(new Date().toJSON().slice(0, 10)),
    end: parseDate(
      new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)
    ),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  //Use Effect
  React.useEffect(() => {
    if (selectedHerds.length > 0) {
      fetchPigs("herd");
    } else {
      setAllSelectedPigs([]);
    }
  }, [selectedHerds]);

  React.useEffect(() => {
    if (selectedCages.length > 0) {
      fetchPigs("cage");
    } else {
      setAllSelectedPigs([]);
    }
  }, [selectedCages]);

  const fetchPigs = async (fetchBy: string) => {
    try {
      let fetchedPigs: Pig[] = [];
      if (fetchBy === "herd") {
        const response: ResponseObjectList<Pig> =
          await pigService.getPigsByHerdId(selectedHerds[0]?.id ?? "", 1, 100);
        if (response.isSuccess) {
          fetchedPigs = [...response.data.data, ...fetchedPigs];
        }
      } else {
        for (let i = 0; i < selectedCages.length; i++) {
          const response = await pigService.getPigsByCageId(
            selectedCages[i]?.id ?? "",
            1,
            100
          );
          if (response.isSuccess) {
            fetchedPigs = [...response.data.data, ...fetchedPigs];
          } else {
            throw new AggregateError([new Error()], response.errorMessage);
          }
        }
      }
      setAllSelectedPigs(fetchedPigs);
    } catch (e) {
      console.log(e);
      setAllSelectedPigs([]);
    }
  };

  const checkStep1Completed = (): void => {
    const validateStages = stages.filter(
      (x: VaccinationStageProps) =>
        x.title === "" || x.timeSpan === "" || x.applyStageTime === ""
    );
    if (validateStages.length > 0) {
      toast({
        variant: "destructive",
        title: "Có giai đoạn chưa nhập đủ thông tin",
      });
    } else if (allSelectedPigs.length === 0) {
      toast({
        variant: "destructive",
        title: "Chưa chọn heo",
      });
    } else {
      return;
    }
  };

  const handleSubmitForm = async (data: any) => {
    try {
      data.startDate = new Date(date.start.toString()).toISOString();
      data.expectedEndDate = new Date(date.end.toString()).toISOString();

      checkStep1Completed();

      //prepare request
      const stagesRequest = stages.map((x: VaccinationStageProps) => {
        return {
          title: x.title,
          timeSpan: x.timeSpan,
          applyStageTime: x.applyStageTime,
          vaccinationToDos: x.vaccinationToDos,
        };
      });

      const request = {
        ...data,
        createVaccinationStages: stagesRequest,
        isApplyToAll: false,
        pigIds: pluck("id", allSelectedPigs),
      };

      const response = await vaccinationService.createVaccinationPlan(request);
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: "Tạo thành công bước 1",
          description:
            "Đã tạo thành công lịch tiêm phòng bước 1! Vui lòng qua bước 2 để thêm thuốc cho giai đoạn",
        });
        setStep(2);
        setVaccinationPlanFirstStepResult(response.data);
      } else {
        throw new AggregateError([new Error()], response.errorMessage);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi hệ thống! Vui lòng thử lại",
        description: error.message,
      });
    } finally {
    }
  };

  const onStageChange = (event: string, field: string, index: string) => {
    setStages(
      stages.map((stage: VaccinationStageProps) => {
        if (stage.id === index) {
          return {
            ...stage,
            [field]: event,
          };
        }
        return stage;
      })
    );
  };

  const handleVaccinationDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };

  const onOpenSelectedPigsByHerdCage = (openBy: string = "herd") => {
    setOpenBy(openBy);
  };

  const onAddStage = () => {
    const newId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setStages([
      ...stages,
      {
        id: newId.toString(),
        title: "",
        timeSpan: "1",
        applyStageTime: "",
        vaccinationToDos: [{ description: "" }],
      },
    ]);
  };
  const onDeleteStage = (stage: VaccinationStageProps) => {
    setStages([
      ...stages.filter((x: VaccinationStageProps) => x.id !== stage.id),
    ]);
  };
  return (
    <div>
      <div className="container mx-auto">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="flex justify-end">
            <Button
              color="primary"
              variant="solid"
              isDisabled={errors && Object.keys(errors).length > 0}
              type="submit"
              endContent={<ChevronRight />}
            >
              Tiếp theo
            </Button>
          </div>
          <Card className="p-4 mt-4">
            <p className="text-2xl mb-2 font-semibold">
              Thông tin kế hoạch tiêm phòng
            </p>
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
                    handleVaccinationDateChange(event);
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
          <Card className="my-4">
            <CardBody>
              <div className="mb-2 flex flex-row justify-between">
                <p className="text-2xl font-semibold">Giai đoạn tiêm phòng</p>
                <Button
                  color="primary"
                  endContent={<Plus />}
                  onClick={onAddStage}
                >
                  Thêm giai đoạn
                </Button>
              </div>
              {stages.map((stage) => {
                return (
                  <div key={stage.id} className="flex flex-row justify-between">
                    <div className="w-full grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <div className="w-full grid grid-cols-3 gap-4">
                          <Input
                            className="mb-5"
                            type="text"
                            radius="sm"
                            size="lg"
                            label="Tên giai đoạn"
                            placeholder="Nhập tên giai đoạn"
                            labelPlacement="outside"
                            isRequired
                            value={stage.title}
                            isInvalid={stage.title ? false : true}
                            errorMessage="Tên giai đoạn không được để trống"
                            onValueChange={(event) =>
                              onStageChange(event, "title", stage.id || "")
                            }
                          />
                          <DatePicker
                            className="mb-5"
                            radius="sm"
                            size="lg"
                            label="Ngày tiêm"
                            value={
                              stage.applyStageTime
                                ? parseDate(stage.applyStageTime)
                                : undefined
                            }
                            isDateUnavailable={(date: DateValue) =>
                              stages.some(
                                (x: VaccinationStageProps) =>
                                  x.applyStageTime === date.toString() &&
                                  x.id !== stage.id
                              )
                            }
                            minValue={date.start}
                            maxValue={date.end}
                            labelPlacement="outside"
                            isRequired
                            isInvalid={stage.applyStageTime ? false : true}
                            errorMessage="Ngày tiêm không được để trống"
                            onChange={(event) =>
                              onStageChange(
                                event.toString(),
                                "applyStageTime",
                                stage.id || ""
                              )
                            }
                          />
                          <Input
                            className="mb-5"
                            type="number"
                            min={1}
                            max={50}
                            radius="sm"
                            size="lg"
                            label="Số ngày thực hiện (dự kiến)"
                            placeholder="Nhập số ngày thực hiện (dự kiến)"
                            labelPlacement="outside"
                            isRequired
                            onKeyDown={(e) => e.preventDefault()}
                            value={stage.timeSpan}
                            isInvalid={stage.timeSpan ? false : true}
                            errorMessage="Số ngày thực hiện không được để trống"
                            onValueChange={(event) =>
                              onStageChange(event, "timeSpan", stage.id || "")
                            }
                          />
                        </div>
                      </div>
                      {/* todo */}
                      <div className="">
                        <label className="mb-2">
                          <span>Các bước cần thực hiện</span>
                        </label>
                        {stage.vaccinationToDos?.map(
                          (
                            vacinationTodo: { description: string },
                            index: number
                          ) => {
                            return (
                              <div className="grid grid-cols-5 gap-2">
                                <Input
                                  className="mb-5 col-span-4"
                                  type="text"
                                  radius="sm"
                                  size="lg"
                                  label={`Bước ${index + 1}`}
                                  labelPlacement="inside"
                                  onKeyDown={(e) => e.preventDefault()}
                                  value={vacinationTodo.description}
                                />

                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row items-start">
                      <span className="text-lg text-danger cursor-pointer active:opacity-50">
                        {stages.length > 1 && (
                          <Trash2Icon onClick={() => onDeleteStage(stage)} />
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-2xl font-semibold">
                Chọn heo cho kế hoạch tiêm phòng
              </p>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <Card className="mt-2" radius="sm">
                    <CardBody>
                      <div className="mb-1 flex justify-between">
                        <p className="text-lg">
                          Chọn heo theo {openBy === "cage" ? "Chuồng" : "Đàn"}
                        </p>
                        <Popover key="select" placement="bottom">
                          <PopoverTrigger>
                            <Button isIconOnly color="primary" size="sm">
                              <Filter size={15} color="#ffffff" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="flex flex-col px-1 py-2">
                              <Button
                                className="mb-2"
                                color="primary"
                                variant="solid"
                                isDisabled={false}
                                size="sm"
                                onClick={() =>
                                  onOpenSelectedPigsByHerdCage("herd")
                                }
                              >
                                <p className="text-white">Chọn theo đàn</p>
                              </Button>
                              <Button
                                color="primary"
                                variant="solid"
                                isDisabled={false}
                                size="sm"
                                onClick={() =>
                                  onOpenSelectedPigsByHerdCage("cage")
                                }
                              >
                                <p className="text-white">Chọn theo chuồng</p>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Divider orientation="horizontal" className="my-2 b-2" />
                      {openBy === "cage" ? (
                        <CageListReadOnly setSelected={setSelectedCages} />
                      ) : (
                        <HerdListReadOnly setSelected={setSelectedHerds} />
                      )}
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
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
};
export default FirstVaccinationStep;
