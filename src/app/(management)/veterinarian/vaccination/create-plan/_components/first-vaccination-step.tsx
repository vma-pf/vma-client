"use client";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Accordion,
  AccordionItem,
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
  Select,
  SelectItem,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import HerdListReadOnly from "@oursrc/components/herds/herd-list-read-only";
import { toast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { Herd } from "@oursrc/lib/models/herd";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { VaccinationTemplate } from "@oursrc/lib/models/plan-template";
import { pigService } from "@oursrc/lib/services/pigService";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { vaccinationTemplateService } from "@oursrc/lib/services/vaccinationTemplateService";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import { Check, Filter, Plus, SaveAll, Trash } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import MedicineListInStage from "./medine-list-in-stage";
import SelectedPigsList from "./selected-pigs-list";
import { useRouter } from "next/navigation";
import { planTemplateService } from "@oursrc/lib/services/templateService";
import { CreatePlanTemplate, MedicineTemplate, TodoTemplate } from "@oursrc/lib/models/plan-template";
import CreateVaccinationStages from "./create-vaccination-stages";

const FirstVaccinationStep = () => {
  const router = useRouter();
  //State
  const [vaccinationTemplatesOptions, setVaccinationTemplatesOptions] = React.useState<{ key: string; label: string }[]>([]);
  const [selectedCages, setSelectedCages] = React.useState<Cage[]>([]);
  const [selectedHerds, setSelectedHerds] = React.useState<Herd[]>([]);
  const [allSelectedPigs, setAllSelectedPigs] = React.useState<Pig[]>([]);
  const [openBy, setOpenBy] = React.useState<string>("");
  const [templateName, setTemplateName] = React.useState("");

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
      const response = await vaccinationTemplateService.getVaccinationTemplate(1, 1000);
      if (response.isSuccess) {
        setVaccinationTemplatesOptions(
          response.data.data.map((x: VaccinationTemplate) => ({
            key: x.contentTemplate,
            label: x.titleTemplate,
          }))
        );
      }
    } catch (error) {}
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

  const checkStep1Completed = (): boolean => {
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

  const onApplyTemplate = async (event: any) => {
    const data = JSON.parse(event.target.value);
    setStages(
      data.stages.map((x: any, index: number) => {
        const newDate = new Date(x.applyStageTime);
        newDate.setDate(newDate.getDate() + x.numberOfDays);
        return {
          ...x,
          applyStageTime: newDate.toJSON().slice(0, 10),
        };
      })
    );
    // setDate({
    //   start: parseDate(data.startDate.split("T")[0]),
    //   end: parseDate(data.expectedEndDate.split("T")[0]),
    // });
    toast({
      variant: "success",
      title: "Áp dụng mẫu lịch tiêm phòng thành công!!!",
      description: "Lưu ý: những thông tin yêu cầu ngày giờ sẽ không được áp dụng",
    });
  };

  const handleCreateTemplate = async () => {
    const templateRequest = stages.map((x: VaccinationStageProps, index: number) => ({
      title: x.title,
      timeSpan: x.timeSpan,
      numberOfDays: index === 0 ? 0 : Math.round((new Date(x.applyStageTime).valueOf() - new Date(stages[0].applyStageTime).valueOf()) / (1000 * 3600 * 24)) + 1,
      medicineTemplates: x.inventoryRequest.medicines as MedicineTemplate[],
      toDoTemplates: x.vaccinationToDos as TodoTemplate[],
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
      const response = await planTemplateService.create(request);
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

      if (!checkStep1Completed()) {
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
                  <Select items={vaccinationTemplatesOptions} label="Chọn mẫu tiêm phòng" className="max-w-xs" onChange={(e) => onApplyTemplate(e)}>
                    {(vaccinationTemplate) => <SelectItem key={vaccinationTemplate.key}>{vaccinationTemplate.label}</SelectItem>}
                  </Select>
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
        </form>
      </div>
    </div>
  );
};
export default FirstVaccinationStep;
