import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Accordion, AccordionItem, Button, Card, CardBody, DatePicker, DateValue, Input, Tooltip } from "@nextui-org/react";
import { CreateTreatmentStageProps } from "@oursrc/lib/models/treatment";
import { Plus, Trash } from "lucide-react";
import React from "react";
import { v4 } from "uuid";
import MedicineListInStage from "./medine-list-in-stage";

const CreateTreatmentStage = ({
  stages,
  setStages,
  date,
}: {
  stages: CreateTreatmentStageProps[];
  setStages: React.Dispatch<React.SetStateAction<CreateTreatmentStageProps[]>>;
  date: DateValue | null;
}) => {
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
  return (
    <div>
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
                        isDateUnavailable={(date: DateValue) => stages.some((x: CreateTreatmentStageProps) => x.applyStageTime === date.toString() && x.id !== stage.id)}
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
    </div>
  );
};

export default CreateTreatmentStage;
