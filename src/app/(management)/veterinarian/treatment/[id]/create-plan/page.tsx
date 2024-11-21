"use client";
import React from "react";
import { motion } from "framer-motion";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
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
  Tabs,
  Tab,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CreateTreatmentStageProps, DiseaseReport } from "@oursrc/lib/models/treatment";
import { v4 } from "uuid";
import CreateTreatmentStage from "./_components/create-treatment-stages";
import { Check, ChevronDown, Edit, Filter, Plus, SaveAll, Trash } from "lucide-react";
import { useToast } from "@oursrc/hooks/use-toast";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import HerdListReadOnly from "@oursrc/components/herds/herd-list-read-only";
import { Cage } from "@oursrc/lib/models/cage";
import { Herd } from "@oursrc/lib/models/herd";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Pig } from "@oursrc/lib/models/pig";
import { pigService } from "@oursrc/lib/services/pigService";
import CreateDiseaseReport from "./_components/_modals/create-disease-report";
import { useRouter } from "next/navigation";
import SelectedPigsList from "./_components/selected-pig-list";
import { planTemplateService } from "@oursrc/lib/services/planTemplateService";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@oursrc/components/ui/sheet";
import { TreatmentGuide } from "@oursrc/lib/models/treatment-guide";
import { treatmentGuideService } from "@oursrc/lib/services/treatmentGuideService";
import { PlanTemplate, StageTemplate } from "@oursrc/lib/models/plan-template";
// import PlanTemplate from "@oursrc/components/template/plan-template";
import { AiOutlineSchedule } from "react-icons/ai";
import { TbTemplate } from "react-icons/tb";
import UpdateDeleteTemplate from "@oursrc/components/template/modals/update-delete-template";
import CommonPlanTemplate from "@oursrc/components/template/plan-template";
import AreaListReadOnly from "@oursrc/components/areas/area-list-read-only";
import { Area } from "@oursrc/lib/models/area";
import { areaService } from "@oursrc/lib/services/areaService";

export type TreatmentPlanStep = {
  id: number;
  title: string;
  status: string;
  isCurrentTab: boolean;
};

const CreatePLan = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const treatmentGuideId = params.id;
  const { toast } = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenChooseStageDate, onOpen: onOpenChooseStageDate, onClose: onCloseChooseStageDate } = useDisclosure();
  const [openSaveTemplate, setOpenSaveTemplate] = React.useState<boolean>(false);
  const [openTreatmentGuide, setOpenTreatmentGuide] = React.useState<boolean>(false);
  const [openBy, setOpenBy] = React.useState<"herd" | "cage" | "area">("herd");
  const [diseaseReport, setDiseaseReport] = React.useState<DiseaseReport | undefined>();
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [selectedAreas, setSelectedAreas] = React.useState<Area[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [selectedPigs, setSelectedPigs] = React.useState<Pig[]>([]);
  const [templateName, setTemplateName] = React.useState<string>("");
  const [treatmentGuide, setTreatmentGuide] = React.useState<TreatmentGuide | undefined>();
  const [templates, setTemplates] = React.useState<PlanTemplate[]>();
  const [selectedTemplate, setSelectedTemplate] = React.useState<PlanTemplate | undefined>();
  const [firstStageDate, setFirstStageDate] = React.useState<DateValue>(today(getLocalTimeZone()));

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  // Form State
  // const [date, setDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
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

  const fetchPigs = async (fetchBy: string) => {
    try {
      if (fetchBy === "herd") {
        const response: ResponseObjectList<Pig> = await pigService.getPigsByHerdId(selectedHerds[0]?.id ?? "", 1, 500);
        if (response.isSuccess) {
          setAllSelectedPigs(response.data.data || []);
        } else {
          console.log(response.errorMessage);
        }
      } else if (fetchBy === "cage") {
        for (let i = 0; i < selectedCages.length; i++) {
          const response: ResponseObjectList<Pig> = await pigService.getPigsByCageId(selectedCages[i]?.id ?? "", 1, 500);
          if (response.isSuccess) {
            setAllSelectedPigs(response.data.data || []);
          } else {
            console.log(response.errorMessage);
          }
        }
      } else if (fetchBy === "area") {
        for (let i = 0; i < selectedAreas.length; i++) {
          const response: ResponseObjectList<Pig> = await areaService.getPigsByAreaId(selectedAreas[i]?.id ?? "");
          if (response.isSuccess) {
            setAllSelectedPigs(response.data.data || []);
          } else {
            console.log(response.errorMessage);
          }
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setSelectedPigs([]);
    }
  };

  const fetchTreatmentGuide = async () => {
    try {
      const res: ResponseObject<TreatmentGuide> = await treatmentGuideService.getById(treatmentGuideId);
      if (res.isSuccess) {
        setTreatmentGuide(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTemplate = async () => {
    try {
      const res: ResponseObjectList<PlanTemplate> = await planTemplateService.getTemplateByTreatmentGuideId(treatmentGuideId, 1, 500);
      if (res.isSuccess) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isFormFilled = () => {
    return (
      stages.length > 0 &&
      stages.every(
        (stage) =>
          stage.title && stage.timeSpan && stage.applyStageTime && stage.treatmentToDos.every((todo) => todo.description) && stage.inventoryRequest.medicines.length > 0
      ) &&
      // date &&
      Object.keys(errors).length === 0 &&
      selectedPigs.length > 0
    );
  };

  const onSubmit = async (data: any) => {
    try {
      // console.log(data);
      // console.log(stages);
      // console.log(new Date(date?.year ?? 0, date?.month ?? 0, date?.day ?? 0).toISOString());
      // console.log(allSelectedPigs);

      // find the last date and the timeSpan of the that stage
      const lastStage = stages.reduce((prev, current) => (new Date(prev.applyStageTime) > new Date(current.applyStageTime) ? prev : current));
      const payload = {
        ...data,
        expectedTimePeriod: new Date(new Date(lastStage.applyStageTime).setDate(new Date(lastStage.applyStageTime).getDate() + Number(lastStage.timeSpan))).toISOString(),
        treatmentStages: stages.map((stage) => ({
          ...stage,
          note: "",
          inventoryRequestDto: {
            ...stage.inventoryRequest,
            medicines: stage.inventoryRequest.medicines.map((medicine: any) => ({
              medicineId: medicine.type === "existed" ? medicine.medicineId : null,
              newMedicineName: medicine.type === "new" ? medicine.name : null,
              portionEachPig: medicine.portionEachPig,
            })),
          },
        })),
        diseaseReportId: diseaseReport?.id,
        pigIds: selectedPigs.map((pig) => pig.id),
      };
      payload.treatmentStages.map((stage: any) => delete stage.inventoryRequest);
      payload.treatmentStages.map((stage: any) => {
        delete stage.inventoryRequestDto.id;
        delete stage.inventoryRequestDto.title;
      });
      console.log(payload);
      if (!isFormFilled()) {
        toast({
          title: "Vui lòng điền đầy đủ thông tin kế hoạch",
          variant: "destructive",
        });
        return;
      }
      if (!diseaseReport) {
        toast({
          title: "Vui lòng tạo báo cáo bệnh",
          variant: "destructive",
        });
        return;
      }
      const res: ResponseObject<any> = await treatmentPlanService.createTreatmentPlan(payload);
      if (res.isSuccess) {
        toast({
          title: "Tạo kế hoạch điều trị thành công",
          variant: "success",
        });
        router.push("/veterinarian/treatment");
      } else {
        toast({
          title: res.errorMessage || "Tạo kế hoạch điều trị thất bại",
          variant: "destructive",
        });
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const handleCreateTemplate = async () => {
    try {
      // console.log(stages);
      // console.log(new Date(date?.year ?? 0, date?.month ?? 0, date?.day ?? 0).toISOString());
      // console.log(allSelectedPigs);
      const firstStage = stages[0].applyStageTime;
      const payload = {
        name: templateName,
        treatmentGuideId: treatmentGuideId ?? null,
        stageTemplates: stages.map((stage) => ({
          title: stage.title,
          timeSpan: stage.timeSpan,
          numberOfDays: (new Date(stage.applyStageTime).getTime() - new Date(firstStage).getTime()) / (1000 * 60 * 60 * 24),
          medicineTemplates: stage.inventoryRequest.medicines.map((medicine: any) => ({
            medicineId: medicine.type === "existed" ? medicine.medicineId : null,
            portionEachPig: medicine.portionEachPig,
          })),
          toDoTemplates: stage.treatmentToDos.map((todo) => ({
            description: todo.description,
          })),
        })),
      };
      console.log(payload);
      if (stages.some((stage) => stage.inventoryRequest.medicines.some((medicine: any) => medicine.type === "new"))) {
        toast({
          title: "Mẫu không được chứa thuốc mà chưa có trong kho",
          variant: "destructive",
        });
        return;
      }
      const res: ResponseObject<any> = await planTemplateService.createPlanTemplate(payload);
      if (res.isSuccess) {
        toast({
          title: "Tạo mẫu điều trị thành công",
          variant: "success",
        });
        fetchTemplate();
      } else {
        toast({
          title: res.errorMessage || "Tạo mẫu điều trị thất bại",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const handleTemplateChanges = (keys: Selection) => {
    const selectedKeysArray = Array.from(keys);
    const template = templates?.filter((item) => item.id && selectedKeysArray.includes(item.id))[0] || undefined;
    if (!template) {
      setSelectedTemplate(undefined);
      setStages([
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
      return;
    }
    setSelectedTemplate(template);
    onOpenChooseStageDate();
  };

  const handleChooseTemplate = () => {
    const newStages = selectedTemplate?.stageTemplates
      .sort((a, b) => a.numberOfDays - b.numberOfDays)
      .map((templateStage: any) => {
        const applyStageDate = firstStageDate.add({ days: templateStage.numberOfDays });
        const applyStageDateString = applyStageDate.toString();
        return {
          id: v4(),
          title: templateStage.title,
          timeSpan: templateStage.timeSpan,
          applyStageTime: applyStageDateString,
          treatmentToDos: templateStage.toDoTemplates,
          inventoryRequest: {
            id: v4(),
            title: "",
            description: "",
            medicines: templateStage.medicineTemplates.map((medicine: any) => ({
              id: medicine.medicineId,
              type: "existed",
              medicineId: medicine.medicineId,
              medicineName: medicine.medicineName,
              name: medicine.medicineName,
              portionEachPig: medicine.portionEachPig,
            })),
          },
        };
      }) as CreateTreatmentStageProps[];
    setStages(newStages);
    onCloseChooseStageDate();
    setFirstStageDate(today(getLocalTimeZone()));
    // setOpenChooseTemplate(false);
  };

  React.useEffect(() => {
    if (treatmentGuideId) {
      fetchTemplate();
    }
  }, []);

  React.useEffect(() => {
    if (selectedHerds.length > 0) {
      fetchPigs("herd");
    }
  }, [selectedHerds]);

  React.useEffect(() => {
    if (selectedCages.length > 0) {
      fetchPigs("cage");
    }
  }, [selectedCages]);

  React.useEffect(() => {
    if (selectedAreas.length > 0) {
      fetchPigs("area");
    }
  }, [selectedAreas]);
  return (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.4 }}>
      <Sheet
        open={openTreatmentGuide}
        onOpenChange={() => {
          if (!openTreatmentGuide) {
            fetchTreatmentGuide();
          }
          setOpenTreatmentGuide(!openTreatmentGuide);
        }}
      >
        <SheetTrigger>
          <Tooltip placement="top-end" content="Xem hướng dẫn điều trị" showArrow closeDelay={200}>
            <div className="fixed z-50 top-44 right-0 rounded-l-2xl bg-primary text-white w-9 cursor-pointer hover:w-11 duration-300">
              <MdOutlineKeyboardDoubleArrowLeft size={35} />
            </div>
          </Tooltip>
        </SheetTrigger>
        <SheetContent className="w-1/3">
          <SheetHeader>
            <p className="text-2xl font-bold">Hướng dẫn điều trị</p>
          </SheetHeader>
          <div className="p-5 overflow-auto">
            <p className="text-lg font-semibold">Bệnh:</p>
            <p className="text-lg">{treatmentGuide?.diseaseDescription}</p>
            <p className="text-lg mt-2">Cách điều trị:</p>
            <p>{treatmentGuide?.cure}</p>
          </div>
        </SheetContent>
      </Sheet>
      {/* {selectedUpdateTemplate && isOpenUpdateTemplate && (
        <UpdateDeleteTemplate
          isOpen={isOpenUpdateTemplate}
          onClose={onCloseUpdateTemplate}
          operation="edit"
          planType="treatment"
          planTemplate={selectedUpdateTemplate}
          setPlanTemplate={setSelectedUpdateTemplate}
        />
      )}
      {selectedUpdateTemplate && isOpenDeleteTemplate && (
        <UpdateDeleteTemplate
          isOpen={isOpenDeleteTemplate}
          onClose={onCloseDeleteTemplate}
          operation="delete"
          planType="treatment"
          planTemplate={selectedUpdateTemplate}
          setPlanTemplate={setSelectedUpdateTemplate}
        />
      )} */}
      <Tabs defaultSelectedKey={1} color="primary" size="lg">
        <Tab
          key={1}
          title={
            <div className="flex items-center">
              <AiOutlineSchedule size={20} />
              <span className="ml-2">Kế hoạch điều trị</span>
            </div>
          }
        >
          {isOpen && <CreateDiseaseReport isOpen={isOpen} onOpen={onOpen} onClose={onClose} setDiseaseReport={setDiseaseReport} />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="mt-4">
              <CardBody>
                <div className="flex justify-end space-x-3">
                  {/* <Popover placement="bottom" isOpen={openChooseTemplate} onOpenChange={(open) => setOpenChooseTemplate(open)}>
                    <PopoverTrigger>
                      <Button color="default" variant="solid" endContent={<ChevronDown size={20} />}>
                        {selectedTemplate ? selectedTemplate.name : "Chọn mẫu"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex flex-col gap-2">
                        {templates?.map((template) => (
                          <div key={template.id} className="m-2 cursor-pointer flex items-center gap-2">
                            <div onClick={() => handleChooseTemplate(template)} className="p-3 flex hover:bg-emerald-100 rounded-xl">
                              {selectedTemplate?.id === template.id && <Check size={20} />}
                              <p className="text-medium font-medium ml-2">{template.name}</p>
                            </div>
                            <Tooltip content="Chỉnh sửa" closeDelay={200}>
                              <Edit
                                className="text-warning"
                                size={20}
                                onClick={() => {
                                  setOpenChooseTemplate(false);
                                  setSelectedUpdateTemplate(template);
                                  onOpenUpdateTemplate();
                                }}
                              />
                            </Tooltip>
                            <Tooltip content="Xóa" closeDelay={200}>
                              <Trash
                                className="text-danger"
                                size={20}
                                onClick={() => {
                                  setOpenChooseTemplate(false);
                                  setSelectedUpdateTemplate(template);
                                  onOpenDeleteTemplate();
                                }}
                              />
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover> */}
                  <Dropdown>
                    <DropdownTrigger>
                      <Button color="primary" variant="ghost" endContent={<ChevronDown size={20} />}>
                        {selectedTemplate ? selectedTemplate.name : "Chọn mẫu"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      selectionMode="single"
                      selectedKeys={selectedTemplate ? [selectedTemplate.id] : []}
                      onSelectionChange={(keys) => handleTemplateChanges(keys)}
                      items={templates}
                    >
                      {(item) => <DropdownItem key={item.id}>{item.name}</DropdownItem>}
                    </DropdownMenu>
                  </Dropdown>
                  <Popover placement="bottom" isOpen={openSaveTemplate} onOpenChange={(open) => setOpenSaveTemplate(open)}>
                    <PopoverTrigger>
                      <Button color="default" variant="solid" isIconOnly>
                        <Tooltip placement="bottom" content="Lưu mẫu điều trị" closeDelay={200}>
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
                          onValueChange={(e) => setTemplateName(e)}
                        />
                        <Button
                          color="primary"
                          isIconOnly
                          onClick={() => {
                            handleCreateTemplate();
                            setOpenSaveTemplate(false);
                          }}
                          isDisabled={!isFormFilled() || !templateName}
                        >
                          <Check />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button color="primary" onClick={onOpen} isDisabled={diseaseReport ? true : false}>
                    Tạo báo cáo bệnh
                  </Button>
                  <Button color="primary" type="submit" isDisabled={!isFormFilled()}>
                    Tạo kế hoạch
                  </Button>
                </div>
              </CardBody>
            </Card>
            <Card className="my-4">
              <CardBody>
                <p className="text-2xl mb-2 font-semibold">Thông tin kế hoạch điều trị</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <Input
                    className="mb-5 col-span-2"
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
                  {/* <DatePicker
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
                isReadOnly
              /> */}
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
              <CreateTreatmentStage
                stages={stages}
                setStages={setStages}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                // date={date}
              />
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
                          <p className="text-lg">Chọn heo theo {openBy === "cage" ? "Chuồng" : openBy === "herd" ? "Đàn" : "Khu"}</p>
                          <Dropdown>
                            <DropdownTrigger>
                              <Button isIconOnly color="primary" size="sm">
                                <Filter size={15} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              disallowEmptySelection
                              selectionMode="single"
                              selectedKeys={openBy ? new Set([openBy]) : new Set()}
                              onSelectionChange={(selectedKeys: Selection) => {
                                const selectedKeysArray = Array.from(selectedKeys);
                                setOpenBy(selectedKeysArray[0].toString() as "herd" | "cage" | "area");
                              }}
                            >
                              <DropdownItem color="primary" key="herd">
                                Chọn theo đàn
                              </DropdownItem>
                              <DropdownItem color="primary" key="cage">
                                Chọn theo chuồng
                              </DropdownItem>
                              <DropdownItem color="primary" key="area">
                                Chọn theo khu
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                        <Divider orientation="horizontal" className="my-2" />
                        {openBy === "cage" ? (
                          <CageListReadOnly setSelected={setSelectedCages} />
                        ) : openBy === "herd" ? (
                          <HerdListReadOnly setSelected={setSelectedHerds} />
                        ) : (
                          <AreaListReadOnly setSelected={setSelectedAreas} />
                        )}
                      </CardBody>
                    </Card>
                  </div>
                  <div>
                    <Card className="mt-2" radius="sm">
                      <CardBody>
                        <SelectedPigsList pigList={allSelectedPigs} selectedPigs={selectedPigs} setSelectedPigs={setSelectedPigs} />
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          {isOpenChooseStageDate && (
            <Modal size="lg" isOpen={isOpenChooseStageDate} onClose={onCloseChooseStageDate}>
              <ModalContent>
                <ModalHeader> Chọn ngày bắt đầu cho giai đoạn 1</ModalHeader>
                <ModalBody>
                  <DatePicker
                    label="Nhập ngày bắt đầu"
                    radius="md"
                    size="lg"
                    labelPlacement="outside"
                    isRequired
                    isInvalid={firstStageDate ? false : true}
                    errorMessage="Nhập ngày bắt đầu không được để trống"
                    minValue={today(getLocalTimeZone())}
                    validationBehavior="native"
                    value={firstStageDate}
                    onChange={(event) => setFirstStageDate(event)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="solid" disabled={!firstStageDate} onClick={handleChooseTemplate}>
                    Xác nhận
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Tab>
        <Tab
          key={2}
          title={
            <div className="flex items-center">
              <TbTemplate size={20} />
              <span className="ml-2">Mẫu kế hoạch</span>
            </div>
          }
        >
          <CommonPlanTemplate planType="treatment" />
        </Tab>
      </Tabs>
    </motion.div>
  );
};

export default CreatePLan;
