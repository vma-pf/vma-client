"use client";
import React from "react";
import VaccinationList from "../../../../components/vaccination/vaccination-list";
import { FaClock, FaRegCalendarPlus } from "react-icons/fa6";
import { VaccinationData } from "../../../../lib/models/vaccination";
import { Accordion, AccordionItem, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, Skeleton, useDisclosure } from "@nextui-org/react";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { dateConverter } from "@oursrc/lib/utils";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { herdService } from "@oursrc/lib/services/herdService";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { useRouter } from "next/navigation";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { useToast } from "@oursrc/hooks/use-toast";
import { TbMedicineSyrup } from "react-icons/tb";
import { CiBoxList, CiEdit } from "react-icons/ci";
import DetailPlan from "../../../../components/vaccination/modals/detail-plan";
import UpdatePlanStatus from "./_components/_modals/update-plan-status";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { GrStatusGoodSmall } from "react-icons/gr";
import ChangeVaccinationPlan from "./_components/_modals/change-vaccination-plan";
import { Filter } from "lucide-react";
import { setHours } from "date-fns";
import { calculateProgress } from "@oursrc/lib/utils/dev-utils";
import VaccinationStage from "@oursrc/components/vaccination/vaccination-stage";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang thực hiện", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

// const herdData: HerdInfo = {
//   id: "1",
//   code: "herd-spring-2025",
//   breed: "Yorkshire",
//   totalNumber: 100,
//   expectedEndDate: "2022-12-30",
//   actualEndDate: "2022-12-30",
//   startDate: "2022-12-30",
//   description: "Đàn heo mới",
//   averageWeight: 100,
//   status: 1,
// };

const barnData = [
  {
    id: "1",
    code: "barn-1",
    name: "Chuồng 1",
    quantity: 50,
  },
  {
    id: "2",
    code: "barn-2",
    name: "Chuồng 2",
    quantity: 50,
  },
];

const Vaccination = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [selectedVaccinationId, setSelectedVaccinationId] = React.useState(new Set<string>());
  const [vaccinationData, setVaccinationData] = React.useState<VaccinationData | undefined>();
  const [herds, setHerds] = React.useState<HerdInfo[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("all");

  const { isOpen: isOpenChangeVaccinationPlanModal, onOpen: onOpenChangeVaccinationPlanModal, onClose: onCloseChangeVaccinationPlanModal } = useDisclosure();
  // const [selectedVaccination, setSelectedVaccination] = React.useState<VaccinationStageProps | undefined>();

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") {
      return "Tất cả";
    } else if (filterStatus === "done") {
      return "Đã tiêm";
    } else {
      return "Chưa tiêm";
    }
  }, [filterStatus]);

  const filterVaccination = (status: string) => {
    const data = vaccinationData?.vaccinationStages || [];
    if (status === "all") {
      return data;
    } else if (status === "done") {
      return data.filter((vaccination) => vaccination.isDone === true);
    } else {
      return data.filter((vaccination) => vaccination.isDone === false);
    }
  };

  const findVaccination = async (id: string) => {
    try {
      setLoading(true);
      // const vaccinationId = "4b75d78c-7c38-4447-9fe7-ebbcaff55faf";
      const res: ResponseObject<any> = await vaccinationService.getVaccinationPlan(id);
      if (res && res.isSuccess) {
        setVaccinationData(res.data);
      } else {
        console.log("Error: ", res.errorMessage);
      }
      const response: ResponseObject<HerdInfo[]> = await vaccinationService.getHerdByVaccinationPlanId(id);
      if (response && response.isSuccess) {
        setHerds(response.data);
      } else {
        console.log("Error: ", response.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
    // return vaccinationData.find(
    //   (vaccination) => vaccination.id === id.values().next().value
    // );
  };

  React.useEffect(() => {
    if (selectedVaccinationId.size > 0) {
      findVaccination(selectedVaccinationId.values().next().value);
    } else {
      setVaccinationData(undefined);
      setHerds([]);
    }
  }, [selectedVaccinationId]);

  // React.useEffect(() => {
  //   if (!selectedVaccination) {
  //     findVaccination(selectedVaccinationId.values().next().value);
  //   }
  // }, [selectedVaccination]);

  return (
    <div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <div className="flex justify-between mb-2">
          <p className="text-xl mb-3">Trước tiên, hãy chọn lịch tiêm phòng</p>
          <Button
            variant="solid"
            color="primary"
            onPress={() => {
              router.push("/veterinarian/vaccination/create-plan");
            }}
          >
            Tạo lịch tiêm phòng
          </Button>
        </div>
        <VaccinationList selectedVaccination={selectedVaccinationId} setSelectedVaccination={setSelectedVaccinationId} type="my" />
      </div>
      <div className="mb-3 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        {loading ? (
          <div className="grid grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="m-2 col-span-1 border-2 rounded-lg">
                <Skeleton className="rounded-lg">
                  <div className="h-60 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="flex flex-shrink gap-5">
              <div className="p-3 border-2 rounded-2xl w-1/2">
                <p className="text-xl font-semibold">Chi tiết lịch tiêm phòng</p>
                {vaccinationData ? (
                  <div>
                    <div className="mby-2 flex items-center">
                      <FaRegCalendarPlus className="my-auto mr-4 text-3xl" />
                      <p className="my-auto text-2xl font-bold mt-3">{vaccinationData.title}</p>
                    </div>
                    <p className="text-lg mt-3">{vaccinationData.description}</p>
                    <div className="flex justify-between">
                      <p className="text-md mt-3">Ngày bắt đầu</p>
                      <p className="text-md mt-3">Ngày kết thúc (dự kiến)</p>
                    </div>
                    <Progress value={calculateProgress(vaccinationData.startDate, vaccinationData.expectedEndDate)} />
                    <div className="flex justify-between">
                      <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.startDate)}</p>
                      <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.expectedEndDate)}</p>
                    </div>
                    {vaccinationData.actualEndDate && vaccinationData.status !== "Đang thực hiện" && (
                      <div className="flex justify-between">
                        <p className="text-md mt-3">Ngày kết thúc (thực tế):</p>
                        <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.actualEndDate)}</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p className="text-md mt-3">Ghi chú:</p>
                      <p className="text-lg mt-3 font-semibold">{vaccinationData.note ? vaccinationData.note : "Không có"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-md mt-3">Tình trạng</p>
                      <p className={`text-lg mt-3 font-semibold ${statusColorMap.find((status) => status.status === String(vaccinationData.status))?.color}`}>
                        {vaccinationData.status}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-lg mt-3">Chưa chọn lịch tiêm phòng</p>
                )}
              </div>
              <div className="p-3 border-2 rounded-2xl w-1/2">
                <p className="text-xl font-semibold">Thông tin đàn heo</p>
                {herds.length > 0 ? (
                  herds.map((herd) => (
                    <div key={herd.id}>
                      <div className="mt-3 flex justify-between">
                        <p className="text-md">Tên đàn:</p>
                        <p className="text-lg font-semibold">{herd.code}</p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <p className="text-md">Số lượng heo:</p>
                        <p className="text-lg font-semibold">{herd.totalNumber}</p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <p className="text-md">Giống:</p>
                        <p className="text-lg font-semibold">{herd.breed}</p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <p className="text-md">Ngày sinh:</p>
                        <p className="text-lg font-semibold">{dateConverter(herd.dateOfBirth)}</p>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <p className="text-md">Trọng lượng trung bình:</p>
                        <p className="text-lg font-semibold">{herd.averageWeight.toFixed(2)} kg</p>
                      </div>
                      {/* <div className="mt-3 flex justify-between">
                        <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
                          <AccordionItem key={1} title="Danh sách chuồng">
                            <div className="flex justify-between">
                              <p className="text-xs font-light">Mã code</p>
                              <p className="text-xs font-light">Tên chuồng</p>
                              <p className="text-xs font-light">Số lượng</p>
                            </div>
                            {barnData.map((barn) => (
                              <div key={barn.id} className="flex justify-between">
                                <p className="text-lg mt-2">{barn.code}</p>
                                <p className="text-lg mt-2">{barn.name}</p>
                                <p className="text-lg mt-2">{barn.quantity}</p>
                              </div>
                            ))}
                          </AccordionItem>
                        </Accordion>
                      </div> */}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-lg mt-3">Chưa chọn lịch tiêm phòng</p>
                )}
              </div>
            </div>
            {vaccinationData?.vaccinationStages && (
              <div>
                <div className="mt-5 mb-3 flex justify-between items-center">
                  <p className="text-xl font-semibold">Các giai đoạn tiêm phòng</p>
                  <div>
                    <Button
                      variant="solid"
                      color="primary"
                      endContent={<CiEdit size={20} />}
                      className="mr-2"
                      onClick={onOpenChangeVaccinationPlanModal}
                      isDisabled={vaccinationData?.status === "Đã hoàn thành" || vaccinationData?.status === "Đã hủy"}
                    >
                      Đổi lịch tiêm phòng
                    </Button>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="bordered" color="primary" className="capitalize" startContent={<Filter size={20} />}>
                          {filterValue}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={filterStatus ? [filterStatus] : []}
                        onSelectionChange={(selectedKeys: any) => {
                          setFilterStatus(selectedKeys.values().next().value);
                        }}
                      >
                        <DropdownItem key="all">Tất cả</DropdownItem>
                        <DropdownItem key="done">Đã tiêm</DropdownItem>
                        <DropdownItem key="not-done">Chưa tiêm</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <div className="relative after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20">
                  {vaccinationData?.vaccinationStages.length === 0 || filterVaccination(filterStatus).length === 0 ? (
                    <p className="text-center text-lg mt-3">Không có lịch trình tiêm phòng</p>
                  ) : (
                    filterVaccination(filterStatus)
                      // ?.filter((vaccination: VaccinationStageProps) => vaccination.applyStageTime < new Date().toISOString())
                      ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
                      ?.map((stage) => (
                        <div key={stage.id} className="grid ml-16 relative">
                          <VaccinationStage stage={stage} setSelectedVaccinationId={setSelectedVaccinationId} action="request" />
                        </div>
                      ))
                  )}
                </div>
                {isOpenChangeVaccinationPlanModal && <ChangeVaccinationPlan isOpen={isOpenChangeVaccinationPlanModal} onClose={onCloseChangeVaccinationPlanModal} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vaccination;
