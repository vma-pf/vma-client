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
import { Pig } from "@oursrc/lib/models/pig";
import { PlanTemplate } from "@oursrc/lib/models/plan-template";
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
import { areaService } from "@oursrc/lib/services/areaService";
import { Area } from "@oursrc/lib/models/area";
import AreaListReadOnly from "@oursrc/components/areas/area-list-read-only";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { HerdInfo } from "@oursrc/lib/models/herd";

const CreateVaccination = ({ pigIds = [] }: { pigIds?: string[] }) => {
  const router = useRouter();
  //State
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [isDoneAll, setIsDoneAll] = React.useState(false);
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<HerdInfo[]>([]);
  const [selectedAreas, setSelectedAreas] = React.useState<Area[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  // const [selectedPigs, setSelectedPigs] = React.useState<Pig[]>([]);
  const [openBy, setOpenBy] = React.useState<"herd" | "cage" | "area">("herd");
  const [templateName, setTemplateName] = React.useState("");
  const [templates, setTemplates] = React.useState<PlanTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<PlanTemplate | undefined>();

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
  const [firstStageDate, setFirstStageDate] = React.useState<DateValue>(today(getLocalTimeZone()));
  const { isOpen: isOpenChooseStageDate, onOpen: onOpenChooseStageDate, onClose: onCloseChooseStageDate } = useDisclosure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    shouldUnregister: false,
  });

  //Use Effect
  React.useEffect(() => {
    fetchTemplates();
  }, []);

  React.useEffect(() => {
    if (stages.length > 0) {
      const sortedStages = [...stages].sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime());

      if (sortedStages[0].applyStageTime) {
        const lastStage = sortedStages[sortedStages.length - 1];
        const lastDate = new Date(lastStage.applyStageTime);
        lastDate.setDate(lastDate.getDate() + parseInt(lastStage.timeSpan));

        const firstStageDate = new Date(sortedStages[0].applyStageTime);
        firstStageDate.setHours(0, 0, 0, 0);
        setDate({
          start: parseDate(firstStageDate.toJSON().slice(0, 10)),
          end: parseDate(lastDate.toJSON().slice(0, 10)),
        });
      }
    }
  }, [stages]);

  React.useEffect(() => {
    console.log(selectedHerds);
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
    if (selectedAreas.length > 0) {
      fetchPigs("area");
    } else {
      setAllSelectedPigs([]);
    }
  }, [selectedAreas]);

  React.useEffect(() => {
    if (allSelectedPigs.length === 0) {
      setStages([
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
      setSelectedTemplate(undefined);
    }
  }, [allSelectedPigs]);

  const fetchTemplates = async () => {
    try {
      const res: ResponseObjectList<PlanTemplate> = await planTemplateService.getVaccinationPlanTemplate(1, 500);
      if (res.isSuccess) {
        setTemplates(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      setStages([
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
      setSelectedTemplate(undefined);
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
    const template = templates?.filter((item) => item.id && selectedKeysArray.includes(item.id))[0] || undefined;
    if (!template) {
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
    setSelectedTemplate(template);
    onOpenChooseStageDate();
  };
  const handleChooseTemplate = () => {
    const newStages = selectedTemplate?.stageTemplates
      .sort((a, b) => a.numberOfDays - b.numberOfDays)
      .map((templateStage: any) => {
        const applyStageDate = firstStageDate.add({
          days: templateStage.numberOfDays,
        });
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
    onCloseChooseStageDate();
    setFirstStageDate(today(getLocalTimeZone()));
  };

  const handleCreateTemplate = async () => {
    try {
      setLoading(true);
      const isNewMedicine = stages.some((x) => x.inventoryRequest.medicines.some((y: any) => y.type === "new"));
      if (isNewMedicine) {
        toast({
          variant: "destructive",
          title: "Tạo mẫu lịch tiêm phòng thất bại",
          description: "Mẫu lịch tiêm phòng không thể chứa thuốc mới",
        });
        return;
      }
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
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
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
          inventoryRequestDto: {
            ...x.inventoryRequest,
            medicines: x.inventoryRequest.medicines.map((y: any) => {
              if (y.type === "new") {
                return {
                  medicineId: null,
                  newMedicineName: y.medicineName,
                  portionEachPig: y.portionEachPig,
                };
              } else {
                return {
                  medicineId: y.medicineId,
                  newMedicineName: null,
                  portionEachPig: y.portionEachPig,
                };
              }
            }),
          },
        };
      });

      const request = {
        ...data,
        createVaccinationStages: stagesRequest,
        isApplyToAll: false,
        pigIds: pluck("id", allSelectedPigs),
      };
      console.log(request);

      const response = await vaccinationService.createVaccinationPlan(request);
      if (response && response.isSuccess) {
        setIsDoneAll(true);
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
      setLoading(false);
    }
  };

  const handleVaccinationDateChange = (event: RangeValue<CalendarDate>) => {
    setDate({
      start: event.start,
      end: event.end,
    });
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <Card className="w-full">
          <CardBody>
            <div className="flex justify-end">
              <div className="w-2/5 mr-2 flex justify-end">
                <Dropdown isDisabled={allSelectedPigs.length === 0}>
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
                    emptyContent="Không có mẫu"
                  >
                    {(item) => <DropdownItem key={item.id}>{item.name}</DropdownItem>}
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
                      <Button color="primary" isIconOnly onClick={handleCreateTemplate} isLoading={loading} isDisabled={allSelectedPigs.length === 0}>
                        <Check />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button color="primary" variant="solid" isDisabled={Object.keys(errors).length > 0 && !isDoneAll} type="submit" isLoading={loading}>
                Xác nhận lịch tiêm phòng
              </Button>
            </div>
          </CardBody>
        </Card>
        {pigIds.length === 0 && (
          <Card className="mt-4">
            <CardBody>
              <p className="text-2xl font-semibold">Chọn heo cho kế hoạch tiêm phòng</p>
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
                      <SelectedPigsList pigList={allSelectedPigs} />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
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
                isDisabled
                isInvalid={date.end <= date.start ? true : false}
                errorMessage="Vui lòng nhập đúng ngày bắt đầu - ngày kết thúc"
                minValue={selectedHerds.length > 0 ? parseDate(selectedHerds[0]?.startDate.split("T")[0]) : today(getLocalTimeZone())}
                maxValue={selectedHerds.length > 0 ? parseDate(selectedHerds[0]?.expectedEndDate.split("T")[0]) : undefined}
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
            <CreateVaccinationStages stages={stages} setStages={setStages} date={date} />
          </CardBody>
        </Card>
      </form>
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
    </div>
  );
};
export default CreateVaccination;
