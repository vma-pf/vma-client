"use client";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Selection,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { PlanTemplate, StageTemplate } from "@oursrc/lib/models/plan-template";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { planTemplateService } from "@oursrc/lib/services/planTemplateService";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import MedicineListInStage from "./medicine-in-stage";
import { v4 } from "uuid";
import { FaRegSave } from "react-icons/fa";
import { useToast } from "@oursrc/hooks/use-toast";

const CommonPlanTemplate = ({ planType }: { planType: "vaccination" | "treatment" }) => {
  const { toast } = useToast();
  // const [vaccinationTemplate, setVaccinationTemplate] = React.useState<any[]>([]);
  const [planTemplate, setPlanTemplate] = React.useState<PlanTemplate[]>([]);
  const [selectedPlanTemplate, setSelectedPlanTemplate] = React.useState<PlanTemplate | undefined>(undefined);
  const [selectedStage, setSelectedStage] = React.useState<StageTemplate | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Table state
  const [page, setPage] = React.useState(1);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [filterValue, setFilterValue] = React.useState("");
  // const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
  // const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  // const [statusFilter, setStatusFilter] = React.useState<Selection>("all");

  const fetchTemplate = async () => {
    // fetch treatment template
    if (planType === "treatment") {
      const response: ResponseObjectList<PlanTemplate> = await planTemplateService.getTreatmentPlanTemplate(page, rowsPerPage);
      if (response.isSuccess) {
        setPlanTemplate(response.data.data);
      } else {
        console.log(response.errorMessage);
      }
    } else {
      // fetch vaccination template
      const response: ResponseObjectList<PlanTemplate> = await planTemplateService.getVaccinationPlanTemplate(page, rowsPerPage);
      if (response.isSuccess) {
        setPlanTemplate(response.data.data);
      } else {
        console.log(response.errorMessage);
      }
    }
  };

  const isAllFieldsFilled = () => {
    return selectedPlanTemplate?.stageTemplates.every(
      (stage) => stage.title && stage.timeSpan && stage.medicineTemplates.length > 0 && stage.toDoTemplates.every((todo) => todo.description)
    )
      ? true
      : false;
  };

  const handleUpdateTemplate = async () => {
    try {
      if (selectedPlanTemplate) {
        if (!isAllFieldsFilled()) {
          toast({
            title: "Vui lòng điền đầy đủ thông tin cho giai đoạn",
            variant: "destructive",
          });
          return;
        }
        const payload = {
          ...selectedPlanTemplate,
          stageTemplates: selectedPlanTemplate.stageTemplates.map((stage) => {
            // stage.toDoTemplates.every((todo) => todo.id === null) ? delete stage?.id : null;
            return {
              ...stage,
              id: stage.toDoTemplates.some((todo) => todo.id === null) ? null : stage.id,
              medicineTemplates: stage.toDoTemplates.some((todo) => todo.id === null)
                ? [
                    ...stage.medicineTemplates.map((medicine) => {
                      return {
                        ...medicine,
                        id: null,
                      };
                    }),
                  ]
                : stage.medicineTemplates,
            };
          }),
        };
        console.log(payload);
        const response: ResponseObject<any> = await planTemplateService.updatePlanTemplate(selectedPlanTemplate.id, payload);
        if (response.isSuccess) {
          toast({
            title: "Cập nhật mẫu thành công",
            variant: "success",
          });
          fetchTemplate();
          setSelectedPlanTemplate(undefined);
          setSelectedStage(undefined);
        } else {
          toast({
            title: response.errorMessage || "Cập nhật mẫu thất bại",
            variant: "destructive",
          });
          console.log(response.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onAddStage = () => {
    setSelectedPlanTemplate(
      selectedPlanTemplate && {
        ...selectedPlanTemplate,
        stageTemplates: [
          ...selectedPlanTemplate.stageTemplates,
          {
            id: v4(),
            title: "",
            timeSpan: "",
            numberOfDays: 10,
            toDoTemplates: [
              {
                id: null,
                description: "",
              },
            ],
            medicineTemplates: [],
            planTemplateId: selectedPlanTemplate.id,
          },
        ],
      }
    );
  };

  const onStageChange = (event: string, key: string, stageId: string) => {
    setSelectedPlanTemplate(
      selectedPlanTemplate && {
        ...selectedPlanTemplate,
        stageTemplates: selectedPlanTemplate.stageTemplates.map((stage) => {
          if (stage.id === stageId) {
            return {
              ...stage,
              [key]: event,
            };
          }
          return stage;
        }),
      }
    );
  };

  const handleToDoChange = (event: any, stageIndex: number, index: number) => {
    setSelectedPlanTemplate(
      selectedPlanTemplate && {
        ...selectedPlanTemplate,
        stageTemplates: selectedPlanTemplate.stageTemplates.map((stage, i) => {
          if (i === stageIndex) {
            return {
              ...stage,
              toDoTemplates: stage.toDoTemplates.map((toDo, j) => {
                if (j === index) {
                  return {
                    ...toDo,
                    description: event.target.value,
                  };
                }
                return toDo;
              }),
            };
          }
          return stage;
        }),
      }
    );
  };

  const onAddTodoInStage = (stageIndex: number) => {
    setSelectedPlanTemplate(
      selectedPlanTemplate && {
        ...selectedPlanTemplate,
        stageTemplates: selectedPlanTemplate.stageTemplates.map((stage, i) => {
          if (i === stageIndex) {
            return {
              ...stage,
              toDoTemplates: [
                ...stage.toDoTemplates,
                {
                  id: null,
                  description: "",
                },
              ],
            };
          }
          return stage;
        }),
      }
    );
  };

  const onDeleteTodoInStage = (stageIndex: number, index: number) => {
    setSelectedPlanTemplate(
      selectedPlanTemplate && {
        ...selectedPlanTemplate,
        stageTemplates: selectedPlanTemplate.stageTemplates.map((stage, i) => {
          if (i === stageIndex) {
            return {
              ...stage,
              toDoTemplates: stage.toDoTemplates.filter((_, j) => j !== index),
            };
          }
          return stage;
        }),
      }
    );
  };

  const onDeleteStage = () => {
    if (selectedStage) {
      setSelectedPlanTemplate(
        selectedPlanTemplate && {
          ...selectedPlanTemplate,
          stageTemplates: selectedPlanTemplate.stageTemplates.filter((stage) => stage.id !== selectedStage.id),
        }
      );
      onClose();
    }
  };

  React.useEffect(() => {
    fetchTemplate();
  }, []);
  return (
    <div>
      <div className="mb-3 grid grid-cols-4 gap-2">
        {planTemplate.map((template) => (
          <Card
            className="col-span-1"
            key={template.id}
            isPressable
            onPress={() => setSelectedPlanTemplate(template)}
            classNames={{
              base: selectedPlanTemplate?.id === template.id ? "bg-emerald-100" : "",
            }}
          >
            <CardBody>
              <Image className="mx-auto" src="/assets/vma-logo.png" alt="plan-template" width={50} height={50} />
              {template.name}
            </CardBody>
          </Card>
        ))}
      </div>
      <Card>
        <CardBody>
          <div>
            {selectedPlanTemplate && (
              <div className="mb-4 flex flex-row justify-between items-center">
                <p className="text-2xl font-semibold">Giai đoạn tiêm phòng</p>
                <Button color="primary" endContent={<FaRegSave size={20} />} onPress={handleUpdateTemplate} isDisabled={!isAllFieldsFilled()}>
                  Lưu thay đổi
                </Button>
              </div>
            )}
            {selectedPlanTemplate ? (
              <Accordion variant="splitted">
                {selectedPlanTemplate.stageTemplates
                  .sort((a, b) => a.numberOfDays - b.numberOfDays)
                  .map((stage, stageIndex: number) => {
                    return (
                      <AccordionItem
                        key={stage.id}
                        title={`Giai đoạn ${stageIndex + 1}`}
                        startContent={
                          <div className="flex flex-row items-start mr-2">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                              {selectedPlanTemplate.stageTemplates.length > 1 && (
                                <Tooltip color="danger" content="Xóa giai đoạn">
                                  <Button
                                    isIconOnly
                                    color="danger"
                                    size="sm"
                                    onPress={() => {
                                      onOpen();
                                      setSelectedStage(stage);
                                    }}
                                  >
                                    <Trash size={20} color="#ffffff" />
                                  </Button>
                                </Tooltip>
                              )}
                            </span>
                          </div>
                        }
                      >
                        <div className="flex flex-row justify-between">
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
                              <Input
                                className="mb-5"
                                type="number"
                                radius="sm"
                                size="lg"
                                label="Khoảng cách (kể từ ngày bắt đầu)"
                                placeholder="Nhập khoảng cách"
                                labelPlacement="outside"
                                isRequired
                                onKeyDown={(e) => e.preventDefault()}
                                value={String(stage.numberOfDays)}
                                isDisabled={stage.numberOfDays === 0}
                                onValueChange={(value) => onStageChange(value, "numberOfDays", stage.id || "")}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="col-span-2">
                                <MedicineListInStage stage={stage} setPlan={setSelectedPlanTemplate} />
                              </div>
                              <div>
                                <Tooltip color="primary" content={`Các bước cần thực hiện trong giai đoạn ${stageIndex + 1}`}>
                                  <Card className="" radius="sm">
                                    <CardBody>
                                      {stage.toDoTemplates?.map(
                                        (
                                          treatmentToDo: {
                                            id: string | null;
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
                                                  {stage?.toDoTemplates && stage.toDoTemplates?.length > 1 && (
                                                    <Button isIconOnly color="danger" size="sm" onClick={() => onDeleteTodoInStage(stageIndex, index)}>
                                                      <Trash size={20} color="#ffffff" />
                                                    </Button>
                                                  )}
                                                  {index === stage.toDoTemplates.length - 1 && (
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
            ) : (
              <div className="flex justify-center items-center h-40">
                <p className="text-lg">Chọn giai đoạn để xem chi tiết</p>
              </div>
            )}
            {selectedPlanTemplate && (
              <div className="mt-3 flex justify-end">
                <Button color="primary" endContent={<Plus />} onPress={onAddStage}>
                  Thêm giai đoạn
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      {isOpen && selectedStage && (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalContent>
            <ModalHeader>
              <p className="text-lg">Xác nhận xóa giai đoạn</p>
            </ModalHeader>
            <ModalBody>
              <p>Bạn có chắc chắn muốn xóa giai đoạn?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="solid" onClick={onClose}>
                Hủy
              </Button>
              <Button color="primary" variant="solid" onClick={onDeleteStage}>
                Xác nhận
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default CommonPlanTemplate;
