"use client";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
  Button,
  CalendarDate,
  Card,
  CardBody,
  CardHeader,
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
  Tooltip,
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
import {
  Check,
  ChevronRight,
  Filter,
  Plus,
  PlusSquare,
  SaveAll,
  SquarePlus,
  Trash,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import SelectedPigsList from "./selected-pigs-list";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import MedicineListInStage from "./medine-list-in-stage";
import { v4 } from "uuid";

const FirstVaccinationStep = ({
  setStep,
  setVaccinationPlanFirstStepResult,
}: any) => {
  //State
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [openBy, setOpenBy] = React.useState<string>("");
  const [templateName, setTemplateName] = React.useState("");

  const [stages, setStages] = React.useState<VaccinationStageProps[]>([
    {
      id:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      title: "",
      timeSpan: "1",
      applyStageTime: "",
      vaccinationToDos: [{ description: "" }],
      inventoryRequest: {
        id: v4(),
        title: "",
        description: "",
        medicines: [],
      },
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

  const handleCreateTemplate = () => {
    console.log(templateName);
    console.log(stages);
    console.log(allSelectedPigs);
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
          vaccinationToDosDto: x.vaccinationToDos,
          inventoryRequestDto: x.inventoryRequest,
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
        inventoryRequest: {
          id: v4(),
          title: "",
          description: "",
          medicines: [],
        },
      },
    ]);
  };
  const onDeleteStage = (stage: VaccinationStageProps) => {
    setStages([
      ...stages.filter((x: VaccinationStageProps) => x.id !== stage.id),
    ]);
  };
  const onAddTodoInStage = (stageIndex: number) => {
    const newStages = stages.map(
      (stage: VaccinationStageProps, index: number) => {
        if (index === stageIndex) {
          return {
            ...stage,
            vaccinationToDos: [...stage.vaccinationToDos, { description: "" }],
          };
        }
        return stage; // No need for a shallow copy if not updating
      }
    );

    setStages(newStages);
  };

  const onDeleteTodoInStage = (stageIndex: number, todoIndex: number) => {
    const newStages = stages.map(
      (stage: VaccinationStageProps, index: number) => {
        if (index === stageIndex) {
          return {
            ...stage,
            vaccinationToDos: stage.vaccinationToDos.filter(
              (_, i) => i !== todoIndex
            ),
          };
        }
        return stage;
      }
    );

    setStages(newStages);
  };

  const handleToDoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    stageIndex: number,
    todoIndex: number
  ) => {
    const newStages = stages.map((stage, sIndex) => {
      if (sIndex === stageIndex) {
        return {
          ...stage,
          vaccinationToDos: stage.vaccinationToDos.map((todo, tIndex) => {
            if (tIndex === todoIndex) {
              return { ...todo, description: e.target.value };
            }
            return todo;
          }),
        };
      }
      return stage;
    });

    setStages(newStages);
  };

  const updateMedicine = (e: any, stageIndex: number) => {
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      const selectedStage = updatedStages[stageIndex];

      if (!selectedStage) {
        console.error(`Stage at index ${stageIndex} not found`);
        return prevStages;
      }

      const currentMedicines = selectedStage.inventoryRequest.medicines;
      const updatedMedicines = [...currentMedicines]; // Start with a copy of current medicines

      e.medicines.forEach((newMedicine: any) => {
        const existingMedicineIndex = updatedMedicines.findIndex(
          (medicine) => medicine.medicineId === newMedicine.medicineId
        );
        if (existingMedicineIndex !== -1) {
          updatedMedicines[existingMedicineIndex] = newMedicine;
        } else {
          updatedMedicines.push(newMedicine);
        }
      });

      selectedStage.inventoryRequest = {
        ...selectedStage.inventoryRequest,
        medicines: updatedMedicines,
      };
      updatedStages[stageIndex] = selectedStage;
      return updatedStages;
    });
  };

  return (
    <div>
      <div className="container mx-auto">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Card className="w-full">
            <CardBody>
              <div className="flex justify-end">
                <div className="mr-2">
                  <Popover placement="bottom">
                    <PopoverTrigger>
                      <Button color="default" variant="solid" isIconOnly>
                        <Tooltip
                          placement="bottom"
                          content="Lưu lịch tiêm phòng thành mẫu"
                        >
                          <SaveAll size={20} />
                        </Tooltip>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-row items-center gap-2">
                        <Input
                          className="my-2"
                          type="text"
                          radius="sm"
                          size="sm"
                          label="Tên mẫu"
                          labelPlacement="inside"
                          isRequired
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                        <Button color="primary" type="submit" isIconOnly onClick={handleCreateTemplate}>
                          <Check />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  color="primary"
                  variant="solid"
                  isDisabled={errors && Object.keys(errors).length > 0}
                  type="submit"
                >
                  Xác nhận lịch tiêm phòng
                </Button>
              </div>
            </CardBody>
          </Card>
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
              <Accordion defaultExpandedKeys={["0"]} variant="splitted">
                {stages.map((stage, stageIndex: number) => {
                  return (
                    <AccordionItem
                      key={stageIndex}
                      title={`Giai đoạn ${stageIndex + 1}`}
                      startContent={
                        <div className="flex flex-row items-start mr-2">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            {stages.length > 1 && (
                              <Tooltip color="danger" content="Xóa giai đoạn">
                                <Button
                                  isIconOnly
                                  color="danger"
                                  size="sm"
                                  onClick={() => onDeleteStage(stage)}
                                >
                                  <Trash size={20} color="#ffffff" />
                                </Button>
                              </Tooltip>
                            )}
                          </span>
                        </div>
                      }
                    >
                      <Card className="mb-2" radius="sm">
                        <CardBody>
                          <div
                            key={stage.id}
                            className="flex flex-row justify-between"
                          >
                            <div className="w-full">
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
                                    onStageChange(
                                      event,
                                      "title",
                                      stage.id || ""
                                    )
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
                                  isInvalid={
                                    stage.applyStageTime ? false : true
                                  }
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
                                    onStageChange(
                                      event,
                                      "timeSpan",
                                      stage.id || ""
                                    )
                                  }
                                />
                              </div>
                              {/* todo */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                  <MedicineListInStage
                                    medicineInStageProp={stage.inventoryRequest}
                                    updateMedicines={(e: any) =>
                                      updateMedicine(e, stageIndex)
                                    }
                                  />
                                </div>
                                <div>
                                  <Tooltip
                                    color="primary"
                                    content={`Các bước cần thực hiện trong giai đoạn ${
                                      stageIndex + 1
                                    }`}
                                  >
                                    <Card className="" radius="sm">
                                      <CardBody>
                                        {stage.vaccinationToDos?.map(
                                          (
                                            vacinationTodo: {
                                              description: string;
                                            },
                                            index: number
                                          ) => {
                                            return (
                                              <div className="mb-2">
                                                <div className="p-0 grid grid-cols-11 gap-2">
                                                  <Input
                                                    className="mb-5 col-span-9 w-full"
                                                    type="text"
                                                    radius="sm"
                                                    size="sm"
                                                    label={`Bước ${index + 1}`}
                                                    labelPlacement="inside"
                                                    value={
                                                      vacinationTodo.description
                                                    }
                                                    onChange={(e) =>
                                                      handleToDoChange(
                                                        e,
                                                        stageIndex,
                                                        index
                                                      )
                                                    }
                                                  />
                                                  <div className="flex gap-2">
                                                    {stage?.vaccinationToDos &&
                                                      stage.vaccinationToDos
                                                        ?.length > 1 && (
                                                        <Button
                                                          isIconOnly
                                                          color="danger"
                                                          size="sm"
                                                          onClick={() =>
                                                            onDeleteTodoInStage(
                                                              stageIndex,
                                                              index
                                                            )
                                                          }
                                                        >
                                                          <Trash
                                                            size={20}
                                                            color="#ffffff"
                                                          />
                                                        </Button>
                                                      )}
                                                    {index ===
                                                      stage.vaccinationToDos
                                                        .length -
                                                        1 && (
                                                      <Button
                                                        isIconOnly
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() =>
                                                          onAddTodoInStage(
                                                            stageIndex
                                                          )
                                                        }
                                                      >
                                                        <Plus
                                                          size={20}
                                                          color="#ffffff"
                                                        />
                                                      </Button>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </CardBody>
                                    </Card>
                                  </Tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </AccordionItem>
                  );
                })}
              </Accordion>
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
