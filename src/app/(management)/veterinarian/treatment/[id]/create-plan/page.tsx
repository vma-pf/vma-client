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
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { getLocalTimeZone, today } from "@internationalized/date";
import { CreateTreatmentStageProps, DiseaseReport } from "@oursrc/lib/models/treatment";
import { v4 } from "uuid";
import CreateTreatmentStage from "./_components/create-treatment-stages";
import { Check, ChevronDown, Filter, Plus, SaveAll, Trash } from "lucide-react";
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
import { planTemplateService } from "@oursrc/lib/services/planTemplate";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@oursrc/components/ui/sheet";
import { TreatmentGuide } from "@oursrc/lib/models/treatment-guide";
import { treatmentGuideService } from "@oursrc/lib/services/treatmentGuideService";
import { TreatmentTemplate } from "@oursrc/lib/models/plan-template";

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
  const [openSaveTemplate, setOpenSaveTemplate] = React.useState<boolean>(false);
  const [openTreatmentGuide, setOpenTreatmentGuide] = React.useState<boolean>(false);
  const [openBy, setOpenBy] = React.useState<string>("herd");
  const [diseaseReport, setDiseaseReport] = React.useState<DiseaseReport | undefined>();
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [selectedPigs, setSelectedPigs] = React.useState<Pig[]>([]);
  const [templateName, setTemplateName] = React.useState<string>("");
  const [treatmentGuide, setTreatmentGuide] = React.useState<TreatmentGuide | undefined>();
  const [templates, setTemplates] = React.useState<TreatmentTemplate[]>();
  const [selectedTemplate, setSelectedTemplate] = React.useState<TreatmentTemplate | undefined>();
  const {
    register,
    handleSubmit,
    getValues,
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
      const res: ResponseObjectList<TreatmentTemplate> = await planTemplateService.getTreatmentPlanTemplate(1, 500);
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
      date &&
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
      const payload = {
        ...data,
        expectedTimePeriod: new Date(date?.year ?? 0, date?.month ?? 0, date?.day ?? 0).toISOString(),
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

  const handleChooseTemplate = (keys: Selection) => {
    const selectedKeysArray = Array.from(keys);
    if (selectedKeysArray.length === 0) {
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
    const template = templates?.filter((item) => item.id && selectedKeysArray.includes(item.id))[0] || undefined;
    setSelectedTemplate(template);
    const newStages = template?.stageTemplates
      .sort((a, b) => a.numberOfDays - b.numberOfDays)
      .map((templateStage: any) => {
        const applyStageDate = new Date();
        applyStageDate.setDate(applyStageDate.getDate() + templateStage.numberOfDays);
        const applyStageDateString = applyStageDate.toISOString().split("T")[0];
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
          <div className="p-5">
            <div className="flex justify-between items-center">
              <p className="text-lg">{treatmentGuide?.diseaseDescription}</p>
            </div>
          </div>
          {/* <SheetFooter>
            <SheetClose asChild>
              <Button
                variant="solid"
                color="primary"
              >
                Tạo kế hoạch mới
              </Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
      {isOpen && <CreateDiseaseReport isOpen={isOpen} onOpen={onOpen} onClose={onClose} setDiseaseReport={setDiseaseReport} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mt-4">
          <CardBody>
            <div className="flex justify-end space-x-3">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="ghost" color="primary" endContent={<ChevronDown size={20} />}>
                    Chọn mẫu điều trị
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  selectionMode="single"
                  items={templates}
                  selectedKeys={selectedTemplate && selectedTemplate.id ? new Set([selectedTemplate?.id]) : new Set<string>()}
                  onSelectionChange={(keys: Selection) => handleChooseTemplate(keys)}
                >
                  {(item) => (
                    <DropdownItem key={item.id} description={item.treatmentGuide.title}>
                      <p className="font-semibold">{item.name}</p>
                    </DropdownItem>
                  )}
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
          <CreateTreatmentStage stages={stages} setStages={setStages} date={date} />
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
                    <SelectedPigsList pigList={allSelectedPigs} selectedPigs={selectedPigs} setSelectedPigs={setSelectedPigs} />
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
