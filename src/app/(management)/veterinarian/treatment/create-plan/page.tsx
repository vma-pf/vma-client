"use client";
import React from "react";
import { motion } from "framer-motion";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import CreateTreatmentProgressStep from "@oursrc/components/treatment/create-treatment-progress-step";
import DiseaseReport from "./_components/disease-report";
import { useTreatmentProgressSteps } from "@oursrc/lib/store";
import {
  Button,
  Card,
  CardBody,
  DatePicker,
  DateValue,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  useDisclosure,
  Accordion,
  AccordionItem,
  Tooltip,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { CreateTreatmentStageProps } from "@oursrc/lib/models/treatment";
import { v4 } from "uuid";
import CreateTreatmentStage from "./_components/create-treatment-stages";
import { Filter, Plus, Trash } from "lucide-react";
import { useToast } from "@oursrc/hooks/use-toast";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import HerdListReadOnly from "@oursrc/components/herds/herd-list-read-only";
import SelectedPigsList from "../../vaccination/create-plan/_components/selected-pigs-list";
import { Cage } from "@oursrc/lib/models/cage";
import { Herd } from "@oursrc/lib/models/herd";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Pig } from "@oursrc/lib/models/pig";
import { pigService } from "@oursrc/lib/services/pigService";
import MedicineListInStage from "./_components/medine-list-in-stage";

export type TreatmentPlanStep = {
  id: number;
  title: string;
  status: string;
  isCurrentTab: boolean;
};

const CreatePLan = () => {
  const { toast } = useToast();
  const storedTreatmentProgressSteps = useTreatmentProgressSteps();
  const [treatmentProgressSteps, setTreatmentProgressSteps] = React.useState(useTreatmentProgressSteps());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openBy, setOpenBy] = React.useState<string>("herd");
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Form State
  const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
  const [stages, setStages] = React.useState<CreateTreatmentStageProps[]>([
    {
      id: v4(),
      title: "",
      timeSpan: "",
      applyStageTime: "",
      treatmentToDos: [{ description: "" }],
      inventoryRequest: {
        id: v4(),
        title: "",
        description: "",
        medicines: [],
      },
    },
  ]);

  const openByValue = React.useMemo(() => openBy !== "all" && Array.from(openBy).join(", ").replaceAll("_", " "), [openBy]);

  const fetchPigs = async (fetchBy: string) => {
    try {
      if (fetchBy === "herd") {
        const response: ResponseObjectList<Pig> = await pigService.getPigsByHerdId(selectedHerds[0]?.id ?? "", 1, 500);
        if (response.isSuccess) {
          setAllSelectedPigs(response.data.data || []);
        } else {
          console.log(response.errorMessage);
        }
      } else {
        for (let i = 0; i < selectedCages.length; i++) {
          const response: ResponseObjectList<Pig> = await pigService.getPigsByCageId(selectedCages[i]?.id ?? "", 1, 500);
          if (response.isSuccess) {
            setAllSelectedPigs(response.data.data || []);
          } else {
            console.log(response.errorMessage);
          }
        }
      }
    } catch (e) {
      console.log(e);
      setAllSelectedPigs([]);
    }
  };

  const isFormFilled = () => {
    return (
      stages.length > 0 &&
      stages.every((stage) => stage.title && stage.timeSpan && stage.applyStageTime && stage.treatmentToDos.every((todo) => todo.description)) &&
      date &&
      Object.keys(errors).length === 0
    );
  };

  const onSubmit = async (data: any) => {
    try {
      console.log(data);
      console.log(stages);
      console.log(allSelectedPigs);
      if (!isFormFilled()) {
        toast({
          title: "Vui lòng điền đầy đủ thông tin kế hoạch",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const onStageChange = (event: string, field: string, index: string) => {
    setStages(
      stages.map((stage: CreateTreatmentStageProps) => {
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

  const onAddStage = () => {
    const newId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setStages([
      ...stages,
      {
        id: newId.toString(),
        title: "",
        timeSpan: "1",
        applyStageTime: "",
        treatmentToDos: [{ description: "" }],
        inventoryRequest: {
          id: v4(),
          title: "",
          description: "",
          medicines: [],
        },
      },
    ]);
  };
  const onDeleteStage = (stage: CreateTreatmentStageProps) => {
    setStages([...stages.filter((x: CreateTreatmentStageProps) => x.id !== stage.id)]);
  };
  const onAddTodoInStage = (stageIndex: number) => {
    const newStages = stages.map((stage: CreateTreatmentStageProps, index: number) => {
      if (index === stageIndex) {
        return {
          ...stage,
          treatmentToDos: [...stage.treatmentToDos, { description: "" }],
        };
      }
      return stage; // No need for a shallow copy if not updating
    });

    setStages(newStages);
  };

  const onDeleteTodoInStage = (stageIndex: number, todoIndex: number) => {
    const newStages = stages.map((stage: CreateTreatmentStageProps, index: number) => {
      if (index === stageIndex) {
        return {
          ...stage,
          treatmentTodos: stage.treatmentToDos.filter((_, i) => i !== todoIndex),
        };
      }
      return stage;
    });

    setStages(newStages);
  };

  const handleToDoChange = (e: React.ChangeEvent<HTMLInputElement>, stageIndex: number, todoIndex: number) => {
    const newStages = stages.map((stage, sIndex) => {
      if (sIndex === stageIndex) {
        return {
          ...stage,
          treatmentToDos: stage.treatmentToDos.map((todo, tIndex) => {
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
        const existingMedicineIndex = updatedMedicines.findIndex((medicine) => medicine.medicineId === newMedicine.medicineId);
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

  // const getComponent = () => {
  //   switch (treatmentProgressSteps.find((x: any) => x.isCurrentTab).id) {
  //     case 1:
  //       return <DiseaseReport />;
  //     case 2:
  //       return <CreateTreatmentPlan />;
  //   }
  // };

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

  React.useEffect(() => {
    const storedStep = localStorage.getItem("treatmentProgressSteps");
    if (storedStep) {
      setTreatmentProgressSteps(JSON.parse(storedStep));
    } else {
      setTreatmentProgressSteps(storedTreatmentProgressSteps);
    }
  }, [storedTreatmentProgressSteps]);

  // React.useEffect(() => {
  //   onOpen();
  // }, []);
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      {/* <CreateTreatmentProgressStep steps={treatmentProgressSteps} />
      {getComponent()} */}
      {isOpen && <DiseaseReport isOpen={isOpen} onOpen={onOpen} onClose={onClose} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end">
          <Button color="primary" onClick={onOpen}>
            Tạo báo cáo bệnh
          </Button>
          <Button color="primary" type="submit" className="ml-3" isDisabled={!isFormFilled()}>
            Lưu kế hoạch
          </Button>
        </div>
        <Card>
          <CardBody>
            <p className="text-2xl mb-2 font-semibold">Thông tin kế hoạch điều trị</p>
            <div className="grid grid-cols-2 gap-4 mt-3">
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
              <DatePicker
                label="Ngày kết thúc (dự kiến)"
                radius="md"
                size="lg"
                labelPlacement="outside"
                isRequired
                validationBehavior="native"
                minValue={today(getLocalTimeZone())}
                isInvalid={date ? false : true}
                errorMessage="Ngày kết thúc không được để trống"
                value={date ? date : null}
                onChange={(event) => setDate(event)}
              />
              <Textarea
                radius="md"
                size="lg"
                label="Mô tả"
                placeholder="Nhập mô tả"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.description ? true : false}
                errorMessage="Mô tả không được để trống"
                {...register("description", { required: true })}
              />
              <Textarea
                radius="md"
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
          </CardBody>
        </Card>
      </form>
      <Card className="my-4">
        <CardBody>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-2xl font-semibold">Giai đoạn tiêm phòng</p>
            <Button color="primary" endContent={<Plus />} onClick={onAddStage}>
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
                            <Button isIconOnly color="danger" size="sm" onClick={() => onDeleteStage(stage)}>
                              <Trash size={20} color="#ffffff" />
                            </Button>
                          </Tooltip>
                        )}
                      </span>
                    </div>
                  }
                >
                  <div key={stage.id} className="flex flex-row justify-between">
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
                          onValueChange={(event) => onStageChange(event, "title", stage.id || "")}
                        />
                        <DatePicker
                          className="mb-5"
                          radius="sm"
                          size="lg"
                          label="Ngày tiêm"
                          value={stage.applyStageTime ? parseDate(stage.applyStageTime) : undefined}
                          isDateUnavailable={(date: DateValue) =>
                            stages.some((x: CreateTreatmentStageProps) => x.applyStageTime === date.toString() && x.id !== stage.id)
                          }
                          minValue={date ? date : today(getLocalTimeZone())}
                          // maxValue={date.end}
                          labelPlacement="outside"
                          isRequired
                          isInvalid={stage.applyStageTime ? false : true}
                          errorMessage="Ngày tiêm không được để trống"
                          onChange={(event) => onStageChange(event.toString(), "applyStageTime", stage.id || "")}
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
                          onValueChange={(event) => onStageChange(event, "timeSpan", stage.id || "")}
                        />
                      </div>
                      {/* todo */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <MedicineListInStage medicineInStageProp={stage.inventoryRequest} updateMedicines={(e: any) => updateMedicine(e, stageIndex)} />
                        </div>
                        <div>
                          <Tooltip color="primary" content={`Các bước cần thực hiện trong giai đoạn ${stageIndex + 1}`}>
                            <Card className="" radius="sm">
                              <CardBody>
                                {stage.treatmentToDos?.map(
                                  (
                                    treatmentToDo: {
                                      description: string;
                                    },
                                    index: number
                                  ) => {
                                    return (
                                      <div key={index} className="mb-2">
                                        <div className="p-0 grid grid-cols-11 gap-2">
                                          <Input
                                            className="mb-5 col-span-9 w-full"
                                            type="text"
                                            radius="sm"
                                            size="sm"
                                            label={`Bước ${index + 1}`}
                                            labelPlacement="inside"
                                            value={treatmentToDo.description}
                                            onChange={(e) => handleToDoChange(e, stageIndex, index)}
                                          />
                                          <div className="flex gap-2">
                                            {stage?.treatmentToDos && stage.treatmentToDos?.length > 1 && (
                                              <Button isIconOnly color="danger" size="sm" onClick={() => onDeleteTodoInStage(stageIndex, index)}>
                                                <Trash size={20} color="#ffffff" />
                                              </Button>
                                            )}
                                            {index === stage.treatmentToDos.length - 1 && (
                                              <Button isIconOnly color="primary" size="sm" onClick={() => onAddTodoInStage(stageIndex)}>
                                                <Plus size={20} color="#ffffff" />
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
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardBody>
      </Card>
      <Card className="mt-3">
        <CardBody>
          <div>
            <p className="text-2xl font-semibold">Chọn heo cho kế hoạch điều trị</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <Card className="mt-2" radius="sm">
                  <CardBody>
                    <div className="mb-1 flex justify-between">
                      <p className="text-lg">Chọn heo theo {openByValue === "cage" ? "chuồng" : "đàn"}</p>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly color="primary" size="sm">
                            <Filter size={15} />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          disallowEmptySelection
                          selectionMode="single"
                          selectedKeys={openBy}
                          onSelectionChange={(selectedKeys: Selection) => {
                            const selectedKeysArray = Array.from(selectedKeys);
                            setOpenBy(selectedKeysArray[0].toString());
                          }}
                        >
                          <DropdownItem color="primary" key="herd">
                            Chọn theo đàn
                          </DropdownItem>
                          <DropdownItem color="primary" key="cage">
                            Chọn theo chuồng
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <Divider orientation="horizontal" className="my-2 b-2" />
                    {openBy === "cage" ? <CageListReadOnly setSelected={setSelectedCages} /> : <HerdListReadOnly setSelected={setSelectedHerds} />}
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
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default CreatePLan;
