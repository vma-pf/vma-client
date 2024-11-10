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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RangeValue,
  Selection,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import HerdListReadOnly from "@oursrc/components/herds/herd-list-read-only";
import { toast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { Herd } from "@oursrc/lib/models/herd";
import { Pig } from "@oursrc/lib/models/pig";
import { VaccinationTemplate } from "@oursrc/lib/models/plan-template";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { CreateVaccinationStageProps, VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { pigService } from "@oursrc/lib/services/pigService";
import { planTemplateService } from "@oursrc/lib/services/planTemplateService";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import { Check, ChevronDown, Filter, SaveAll } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Key } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import CreateVaccinationStages from "./create-vaccination-stages";
import SelectedPigsList from "./selected-pigs-list";

const CreateVaccination = ({ pigIds = [] }: { pigIds?: string[] }) => {
  const router = useRouter();
  //State
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [openBy, setOpenBy] = React.useState<string>("");
  const [templateName, setTemplateName] = React.useState("");
  const [templates, setTemplates] = React.useState<VaccinationTemplate[]>();
  const [selectedTemplate, setSelectedTemplate] = React.useState<VaccinationTemplate | undefined>();

  const [stages, setStages] = React.useState<VaccinationStageProps[]>([
    {
      id: v4(),
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
    end: parseDate(new Date(new Date().getTime() + 86400000).toJSON().slice(0, 10)),
  });
  const [stageDate, setStageDate] = React.useState<DateValue | null>(today(getLocalTimeZone()));
  const [templateKeys, setTemplateKeys] = React.useState<Key[]>([]);
  const [firstStageDate, setFirstStageDate] = React.useState<DateValue>(today(getLocalTimeZone()));
  const { isOpen: isOpenChooseStageDate, onOpen: onOpenChooseStageDate, onClose: onCloseChooseStageDate } = useDisclosure();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
  });

  //Use Effect
  React.useEffect(() => {
    fetchTemplates();
  }, []);

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

  const fetchTemplates = async () => {
    try {
      const res: ResponseObjectList<VaccinationTemplate> = await planTemplateService.getVaccinationPlanTemplate(1, 500);
      if (res.isSuccess) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPigs = async (fetchBy: string) => {
    try {
      let fetchedPigs: Pig[] = [];
      if (fetchBy === "herd") {
        const response: ResponseObjectList<Pig> = await pigService.getPigsByHerdId(selectedHerds[0]?.id ?? "", 1, 100);
        if (response.isSuccess) {
          fetchedPigs = [...response.data.data, ...fetchedPigs];
        }
      } else {
        for (let i = 0; i < selectedCages.length; i++) {
          const response = await pigService.getPigsByCageId(selectedCages[i]?.id ?? "", 1, 100);
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

  const validate = (): boolean => {
    const validateStages = stages.filter(
      (x: VaccinationStageProps) =>
        x.title === "" ||
        x.timeSpan === "" ||
        x.applyStageTime === "" ||
        x.vaccinationToDos.some((y) => y.description === "") ||
        x.inventoryRequest.medicines.length === 0
    );
    if (validateStages.length > 0) {
      toast({
        variant: "destructive",
        title: "Có giai đoạn chưa nhập đủ thông tin",
      });
      return false;
    } else if (allSelectedPigs.length === 0) {
      toast({
        variant: "destructive",
        title: "Chưa chọn heo",
      });
      return false;
    } else {
      return true;
    }
  };

  const checkStages = (): boolean => {
    const validateStages = stages.filter(
      (x: VaccinationStageProps) =>
        x.title === "" ||
        x.timeSpan === "" ||
        x.applyStageTime === "" ||
        x.vaccinationToDos.some((y) => y.description === "") ||
        x.inventoryRequest.medicines.length === 0
    );
    if (validateStages.length > 0) {
      toast({
        variant: "destructive",
        title: "Có giai đoạn chưa nhập đủ thông tin",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleTemplateChanges = (keys: Selection) => {
    const selectedKeysArray = Array.from(keys);
    setTemplateKeys(selectedKeysArray);
    onOpenChooseStageDate();
  };
  const handleChooseTemplate = () => {
    onCloseChooseStageDate();
    const selectedKeysArray = templateKeys;
    if (selectedKeysArray.length === 0) {
      setSelectedTemplate(undefined);
      setStages([
        {
          id: v4(),
          title: "",
          timeSpan: "",
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
      return;
    }
    const template = templates?.filter((item) => item.id && selectedKeysArray.includes(item.id))[0] || undefined;
    setSelectedTemplate(template);
    const newStages = template?.stageTemplates
      .sort((a, b) => a.numberOfDays - b.numberOfDays)
      .map((templateStage: any) => {
        const applyStageDate = firstStageDate.add({ days: templateStage.numberOfDays });
        const applyStageDateString = applyStageDate.toString();
        return {
          id: v4(),
          title: templateStage.title,
          timeSpan: templateStage.timeSpan,
          applyStageTime: applyStageDateString,
          vaccinationToDos: templateStage.toDoTemplates,
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
      }) as CreateVaccinationStageProps[];
    setStages(newStages);
  };

  const handleCreateTemplate = async () => {
    const templateRequest = stages.map((x: VaccinationStageProps, index: number) => ({
      title: x.title,
      timeSpan: x.timeSpan,
      numberOfDays: index === 0 ? 0 : Math.round((new Date(x.applyStageTime).valueOf() - new Date(stages[0].applyStageTime).valueOf()) / (1000 * 3600 * 24)) + 1,
      medicineTemplates: x.inventoryRequest.medicines.map((medicine: any) => ({
        medicineId: medicine.type === "existed" ? medicine.medicineId : null,
        portionEachPig: medicine.portionEachPig,
      })),
      toDoTemplates: x.vaccinationToDos,
    }));
    if (!checkStages()) {
      return;
    }
    const request = {
      treatmentGuideId: null,
      name: templateName,
      stageTemplates: templateRequest,
    };
    try {
      const response = await planTemplateService.createPlanTemplate(request);
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: "Lưu mẫu lịch tiêm phòng thành công!!!",
          description: "Đã tạo thành công mẫu lịch tiêm phòng! Vui lòng hoàn thành các bước còn lại để kết thúc",
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

  const handleSubmitForm = async (data: any) => {
    try {
      data.startDate = new Date(date.start.toString()).toISOString();
      data.expectedEndDate = new Date(date.end.toString()).toISOString();

      if (!validate()) {
        return;
      }

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
          title: "Tạo thành công lịch tiêm phòng",
          description: "Đã tạo thành công lịch tiêm phòng! Xem chi tiết tại màn hình thống kê",
        });
        router.push("/veterinarian/vaccination");
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

  const handleVaccinationDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };

  const onOpenSelectedPigsByHerdCage = (openBy: string = "herd") => {
    setOpenBy(openBy);
  };

  return (
    <div>
      <div className="container mx-auto">
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Card className="w-full">
            <CardBody>
              <div className="flex justify-end">
                <div className="w-2/5 mr-2 flex justify-end">
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="ghost" color="primary" endContent={<ChevronDown size={20} />}>
                        Chọn mẫu tiêm phòng
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      selectionMode="single"
                      items={templates}
                      selectedKeys={selectedTemplate && selectedTemplate.id ? new Set([selectedTemplate?.id]) : new Set<string>()}
                      onSelectionChange={(keys: Selection) => handleTemplateChanges(keys)}
                    >
                      {(item) => (
                        <DropdownItem key={item.id} description={item.name}>
                          <p className="font-semibold">{item.name}</p>
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="mr-2">
                  <Popover placement="bottom">
                    <PopoverTrigger>
                      <Button color="default" variant="solid" isIconOnly>
                        <Tooltip placement="bottom" content="Lưu lịch tiêm phòng thành mẫu">
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
                        <Button color="primary" isIconOnly onClick={handleCreateTemplate}>
                          <Check />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button color="primary" variant="solid" isDisabled={errors && Object.keys(errors).length > 0} type="submit">
                  Xác nhận lịch tiêm phòng
                </Button>
              </div>
            </CardBody>
          </Card>
          <Card className="p-4 mt-4">
            <p className="text-2xl mb-2 font-semibold">Thông tin kế hoạch tiêm phòng</p>
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
              <CreateVaccinationStages stages={stages} setStages={setStages} date={stageDate} />
            </CardBody>
          </Card>
          {pigIds.length === 0 && (
            <Card>
              <CardBody>
                <p className="text-2xl font-semibold">Chọn heo cho kế hoạch tiêm phòng</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <Card className="mt-2" radius="sm">
                      <CardBody>
                        <div className="mb-1 flex justify-between">
                          <p className="text-lg">Chọn heo theo {openBy === "cage" ? "Chuồng" : "Đàn"}</p>
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
                                  onClick={() => onOpenSelectedPigsByHerdCage("herd")}
                                >
                                  <p className="text-white">Chọn theo đàn</p>
                                </Button>
                                <Button color="primary" variant="solid" isDisabled={false} size="sm" onClick={() => onOpenSelectedPigsByHerdCage("cage")}>
                                  <p className="text-white">Chọn theo chuồng</p>
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
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
              </CardBody>
            </Card>
          )}
        </form>
      </div>
      <Modal size="3xl" isOpen={isOpenChooseStageDate} onClose={onCloseChooseStageDate}>
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
    </div>
  );
};
export default CreateVaccination;
