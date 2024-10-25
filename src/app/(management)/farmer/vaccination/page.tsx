"use client";
import React from "react";
import VaccinationList from "./_components/vaccination-list";
import { FaClock, FaRegCalendarPlus } from "react-icons/fa6";
import { VaccinationData, VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, Skeleton, useDisclosure } from "@nextui-org/react";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { herdService } from "@oursrc/lib/services/herdService";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { useRouter } from "next/navigation";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { TbMedicineSyrup } from "react-icons/tb";
import { CiEdit } from "react-icons/ci";
import DetailPlan from "./_components/_modals/detail-plan";

const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang diễn ra", value: 1 },
  { name: "Đã hoàn thành", value: 2 },
  { name: "Đã hủy", value: 3 },
];

const Vaccination = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [selectedVaccinationId, setSelectedVaccinationId] = React.useState(new Set<string>());
  const [vaccinationData, setVaccinationData] = React.useState<VaccinationData | undefined>();
  const [herds, setHerds] = React.useState<HerdInfo[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("not-done");
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);
  const [selectedVaccination, setSelectedVaccination] = React.useState<VaccinationStageProps>();

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") {
      return "Tất cả";
    } else if (filterStatus === "done") {
      return "Đã tiêm";
    } else {
      return "Chưa tiêm";
    }
  }, [filterStatus]);

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
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return ((now - start) / (end - start)) * 100;
  };

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

  const getMedicineInStage = async (id: string) => {
    try {
      const res: any = await vaccinationService.getMedicineInStage(id);
      if (res.isSuccess) {
        setMedicineList(res.data.medicine || []);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    }
  };

  React.useEffect(() => {
    if (selectedVaccinationId.size > 0) {
      findVaccination(selectedVaccinationId.values().next().value);
    } else {
      setVaccinationData(undefined);
      setHerds([]);
    }
  }, [selectedVaccinationId]);

  return (
    <div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-xl mb-3">Trước tiên, hãy chọn lịch tiêm phòng</p>
        <VaccinationList setSelectedVaccination={setSelectedVaccinationId} />
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
                      <p className="text-md mt-3">Đàn:</p>
                      <p className="text-lg mt-3 font-semibold">{vaccinationData.herdId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-md mt-3">Ngày bắt đầu</p>
                      <p className="text-md mt-3">Ngày kết thúc (dự kiến)</p>
                    </div>
                    <Progress value={calculateProgress(vaccinationData.startDate, vaccinationData.expectedEndDate)} />
                    <div className="flex justify-between">
                      <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.startDate)}</p>
                      <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.expectedEndDate)}</p>
                    </div>
                    {vaccinationData.actualEndDate && (
                      <div className="flex justify-between">
                        <p className="text-md mt-3">Ngày kết thúc (thực tế):</p>
                        <p className="text-lg mt-3 font-semibold">{vaccinationData.actualEndDate}</p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <p className="text-md mt-3">Ghi chú:</p>
                      <p className="text-lg mt-3 font-semibold">{vaccinationData.note ? vaccinationData.note : "Không có"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-md mt-3">Tình trạng</p>
                      <p
                        className={`text-lg mt-3 font-semibold ${
                          statusMap.find((status) => status.value === vaccinationData.status)?.value === 1
                            ? "text-blue-500"
                            : statusMap.find((status) => status.value === vaccinationData.status)?.value === 2
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {statusMap.find((status) => status.value === vaccinationData.status)?.name}
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
                    <div>
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
                        <p className="text-md">Trọng lượng trung bình:</p>
                        <p className="text-lg font-semibold">{herd.averageWeight} kg</p>
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
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="bordered" className="capitalize">
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
                {vaccinationData?.vaccinationStages.length === 0 || filterVaccination(filterStatus).length === 0 ? (
                  <p className="text-center text-lg mt-3">Không có lịch trình tiêm phòng</p>
                ) : (
                  filterVaccination(filterStatus)
                    // ?.filter((vaccination: VaccinationStageProps) => vaccination.applyStageTime < new Date().toISOString())
                    ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
                    ?.map((stage) => (
                      <div key={stage.id} className="my-4 grid grid-cols-12 p-2 border-2 rounded-xl">
                        <div className="col-span-2 flex items-center justify-center border-r-2">
                          <p className="text-center text-lg p-2">{dateConverter(stage.applyStageTime)}</p>
                        </div>
                        <div className="col-span-2 border-r-2 flex items-center justify-center">
                          <FaClock className="text-lg" />
                          <p className="text-lg p-2">{stage.timeSpan}</p>
                        </div>
                        <div className="col-span-4 border-r-2 mx-3 flex flex-col items-start">
                          <p>Nội dung</p>
                          <p className="text-lg">{stage.title}</p>
                        </div>
                        <div className="col-span-2 border-r-2 mr-3 flex flex-col items-start justify-center">
                          <p>Trạng thái</p>
                          <p className={`text-lg ${stage.isDone ? "text-green-500" : "text-red-500"}`}>{stage.isDone ? "Đã tiêm" : "Chưa tiêm"}</p>
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            color="primary"
                            endContent={<TbMedicineSyrup size={20} />}
                            onPress={() => {
                              setSelectedVaccination(stage);
                              getMedicineInStage(stage.id ? stage.id : "");
                              onOpenDetail();
                            }}
                          >
                            Xem thuốc
                          </Button>
                        </div>
                      </div>
                    ))
                )}
                {isOpenDetail && selectedVaccination && medicineList && (
                  <DetailPlan isOpen={isOpenDetail} onClose={onCloseDetail} selectedVaccination={selectedVaccination} medicineList={medicineList} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vaccination;
