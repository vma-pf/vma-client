"use client";
import React from "react";
import { motion } from "framer-motion";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import CreateTreatmentProgressStep from "@oursrc/components/treatment/create-treatment-progress-step";
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
import { CreateTreatmentStageProps, DiseaseReport } from "@oursrc/lib/models/treatment";
import { v4 } from "uuid";
import CreateTreatmentStage from "./_components/create-treatment-stages";
import { Filter, Plus, Trash } from "lucide-react";
import { useToast } from "@oursrc/hooks/use-toast";
import CageListReadOnly from "@oursrc/components/cages/cage-list-read-only";
import HerdListReadOnly from "@oursrc/components/herds/herd-list-read-only";
import SelectedPigsList from "../../vaccination/create-plan/_components/selected-pigs-list";
import { Cage } from "@oursrc/lib/models/cage";
import { Herd } from "@oursrc/lib/models/herd";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Pig } from "@oursrc/lib/models/pig";
import { pigService } from "@oursrc/lib/services/pigService";
import MedicineListInStage from "./_components/medine-list-in-stage";
import CreateDiseaseReport from "./_components/_modals/create-disease-report";
import { useRouter } from "next/navigation";

export type TreatmentPlanStep = {
  id: number;
  title: string;
  status: string;
  isCurrentTab: boolean;
};

const CreatePLan = () => {
  const { toast } = useToast();
  const router = useRouter();
  const storedTreatmentProgressSteps = useTreatmentProgressSteps();
  const [treatmentProgressSteps, setTreatmentProgressSteps] = React.useState(useTreatmentProgressSteps());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openBy, setOpenBy] = React.useState<string>("herd");
  const [diseaseReport, setDiseaseReport] = React.useState<DiseaseReport | undefined>();
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
      Object.keys(errors).length === 0 &&
      allSelectedPigs.length > 0
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
            medicines: stage.inventoryRequest.medicines.map((medicine) => ({
              medicineId: medicine.medicineId,
              newMedicineName: medicine.medicineName,
              portionEachPig: medicine.portionEachPig,
            })),
          },
        })),
        diseaseReportId: diseaseReport?.id,
        pigIds: allSelectedPigs.map((pig) => pig.id),
      };
      payload.treatmentStages.map((stage: any) => delete stage.inventoryRequest);
      payload.treatmentStages.map((stage: any) => delete stage.inventoryRequestDto.id);
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
      {isOpen && <CreateDiseaseReport isOpen={isOpen} onOpen={onOpen} onClose={onClose} setDiseaseReport={setDiseaseReport} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-end">
          <Button color="primary" onClick={onOpen} isDisabled={diseaseReport ? true : false}>
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
