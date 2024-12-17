"use client";
import React from "react";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { VaccinationData } from "@oursrc/lib/models/vaccination";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, Skeleton } from "@nextui-org/react";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { dateConverter } from "@oursrc/lib/utils";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { useRouter } from "next/navigation";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { Filter } from "lucide-react";
import VaccinationList from "@oursrc/components/vaccination/vaccination-list";
import VaccinationStage from "@oursrc/components/vaccination/vaccination-stage";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang thực hiện", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

const Vaccination = () => {
  const [loading, setLoading] = React.useState(false);
  const [selectedVaccinationId, setSelectedVaccinationId] = React.useState(new Set<string>());
  const [vaccinationData, setVaccinationData] = React.useState<VaccinationData | undefined>();
  const [herds, setHerds] = React.useState<HerdInfo[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("all");

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
        <VaccinationList selectedVaccination={selectedVaccinationId} setSelectedVaccination={setSelectedVaccinationId} type="all" />
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
                    {vaccinationData.actualEndDate && vaccinationData.status !== "Đã hoàn thành" && (
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
                <div className="relative after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20">
                  {vaccinationData?.vaccinationStages.length === 0 || filterVaccination(filterStatus).length === 0 ? (
                    <p className="text-center text-lg mt-3">Không có lịch trình tiêm phòng</p>
                  ) : (
                    filterVaccination(filterStatus)
                      // ?.filter((vaccination: VaccinationStageProps) => vaccination.applyStageTime < new Date().toISOString())
                      ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
                      ?.map((stage) => (
                        <div key={stage.id} className="grid ml-16 relative">
                          <VaccinationStage stage={stage} setSelectedVaccinationId={setSelectedVaccinationId} action="view" />
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vaccination;
