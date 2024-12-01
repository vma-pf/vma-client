import { Accordion, AccordionItem, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, useDisclosure } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { CreateTreatmentStageProps, DiseaseReport, TreatmentData } from "@oursrc/lib/models/treatment";
import { treatmentStageService } from "@oursrc/lib/services/treatmentStageService";
import { dateConverter } from "@oursrc/lib/utils";
import React from "react";
import { BiDetail } from "react-icons/bi";
import { CiBoxList, CiEdit } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { GrStatusGoodSmall } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { TbMedicineSyrup } from "react-icons/tb";
import DetailPlan from "./_modals/detail-plan";
import UpdatePlanStatus from "./_modals/update-plan-status";
import { Filter } from "lucide-react";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang diễn ra", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

const TreatmentStages = ({
  treatmentData,
  diseaseReports,
  pigs,
  selectedTreatment,
  setSelectedTreatment,
}: {
  treatmentData: TreatmentData | undefined;
  diseaseReports: DiseaseReport[];
  pigs: Pig[];
  selectedTreatment: CreateTreatmentStageProps | undefined;
  setSelectedTreatment: React.Dispatch<React.SetStateAction<CreateTreatmentStageProps | undefined>>;
}) => {
  const { toast } = useToast();
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") {
      return "Tất cả";
    } else if (filterStatus === "done") {
      return "Đã tiêm";
    } else {
      return "Chưa tiêm";
    }
  }, [filterStatus]);

  const filterTreatment = (status: string) => {
    const data = treatmentData?.treatmentStages || [];
    if (status === "all") {
      return data;
    } else if (status === "done") {
      return data.filter((treatment) => treatment.isDone === true);
    } else {
      return data.filter((treatment) => treatment.isDone === false);
    }
  };

  const getMedicineInStage = async (id: string) => {
    try {
      const res: ResponseObject<any> = await treatmentStageService.getMedicineInStage(id);
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
  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return ((now - start) / (end - start)) * 100;
  };
  return (
    <div className="w-full mb-3 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
      <div className="flex flex-shrink gap-5">
        <div className="p-3 border-2 rounded-2xl w-1/2">
          <p className="text-xl font-semibold">Chi tiết kế hoạch điều trị</p>
          {treatmentData ? (
            <div>
              <div className="mby-2 flex items-center">
                <FaRegCalendarPlus className="my-auto mr-4 text-3xl" />
                <p className="my-auto text-2xl font-bold mt-3">{treatmentData.title}</p>
              </div>
              <p className="text-lg mt-3">{treatmentData.description}</p>
              <div className="flex justify-between">
                <p className="text-md mt-3">Đàn:</p>
                <p className="text-lg mt-3 font-semibold">{treatmentData.herdId}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-md mt-3">Ngày bắt đầu</p>
                <p className="text-md mt-3">Ngày kết thúc (dự kiến)</p>
              </div>
              <Progress value={calculateProgress(treatmentData.startDate, treatmentData.expectedEndDate)} />
              <div className="flex justify-between">
                <p className="text-lg mt-3 font-semibold">{dateConverter(treatmentData.startDate)}</p>
                <p className="text-lg mt-3 font-semibold">{dateConverter(treatmentData.expectedEndDate)}</p>
              </div>
              {treatmentData.actualEndDate && (
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ngày kết thúc (thực tế):</p>
                  <p className="text-lg mt-3 font-semibold">{treatmentData.actualEndDate}</p>
                </div>
              )}
              <div className="flex justify-between">
                <p className="text-md mt-3">Ghi chú:</p>
                <p className="text-lg mt-3 font-semibold">{treatmentData.note ? treatmentData.note : "Không có"}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-md mt-3">Tình trạng</p>
                <p className={`text-lg mt-3 font-semibold ${statusColorMap.find((status) => status.status === treatmentData.status)?.color}`}>{treatmentData.status}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-lg mt-3">Chưa chọn kế hoạch điều trị</p>
          )}
        </div>
        <div className="p-3 border-2 rounded-2xl w-1/2">
          <Accordion variant="splitted" defaultExpandedKeys={["2"]}>
            <AccordionItem key="1" title="Thông tin đàn heo" startContent={<BiDetail className="text-sky-500" size={25} />}>
              {/* <p className="text-xl font-semibold">Thông tin đàn heo</p> */}
              {pigs?.length > 0 ? (
                pigs.map((pig) => (
                  <div key={pig.id}>
                    <div className="mt-3 flex justify-between">
                      <p className="text-md">Tên heo:</p>
                      <p className="text-lg font-semibold">{pig.pigCode}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-md">Chuồng:</p>
                      <p className="text-lg font-semibold">{pig.cageCode}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-md">Giống:</p>
                      <p className="text-lg font-semibold">{pig.breed}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-lg mt-3">Chưa chọn kế hoạch điều trị</p>
              )}
            </AccordionItem>
            <AccordionItem key="2" title="Báo cáo bệnh" startContent={<HiOutlineDocumentReport className="text-emerald-500" size={25} />}>
              {diseaseReports.length > 0 ? (
                diseaseReports &&
                diseaseReports?.map((diseaseReport) => (
                  <div key={diseaseReport.id}>
                    <div className="mt-3 flex justify-between">
                      <p className="text-md">Nội dung:</p>
                      <p className="text-lg font-semibold">{diseaseReport.description}</p>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <p className="text-md">Tổng thời gian điều trị (dự kiến):</p>
                      <p className="text-lg font-semibold">{diseaseReport.totalTreatmentTime}</p>
                    </div>
                    {diseaseReport.treatmentResult && (
                      <div className="mt-3 flex justify-between">
                        <p className="text-md">Kết quả điều trị:</p>
                        <p className="text-lg font-semibold">{diseaseReport.treatmentResult}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-lg mt-3">Chưa có báo cáo bệnh</p>
              )}
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      {treatmentData?.treatmentStages && (
        <div>
          <div className="mt-5 mb-3 flex justify-between items-center">
            <p className="text-xl font-semibold">Các giai đoạn điều trị</p>
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
            {treatmentData?.treatmentStages.length === 0 || filterTreatment(filterStatus).length === 0 ? (
              <p className="text-center text-lg mt-3">Không có lịch trình tiêm phòng</p>
            ) : (
              filterTreatment(filterStatus)
                // ?.filter((vaccination: VaccinationStageProps) => vaccination.applyStageTime < new Date().toISOString())
                ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
                ?.map((stage) => (
                  <div key={stage.id} className="grid ml-16 relative">
                    {stage.isDone ? (
                      <FaCheckCircle size={20} className={`text-primary absolute left-0 translate-x-[-33.5px] z-10 top-1`} />
                    ) : (
                      <GrStatusGoodSmall
                        size={20}
                        className={`${stage.applyStageTime > new Date().toISOString() ? "text-default" : "text-danger"}
                            absolute left-0 translate-x-[-33.5px] z-10 top-1`}
                      />
                    )}
                    <div className="mb-10 grid gap-3">
                      <Divider orientation="vertical" className="absolute left-0 translate-x-[-24.3px] z-0 top-1" />
                      <div className="text-lg font-semibold">{dateConverter(stage.applyStageTime)}</div>
                      <div className="text-lg font-extrabold">{stage.title}</div>
                      {/* <div className="">{stage.timeSpan}</div> */}
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${stage.isDone ? "bg-green-500" : "bg-red-500"} rounded-full`} />
                        <div className={`${stage.isDone ? "text-green-500" : "text-red-500"}`}>{stage.isDone ? "Đã tiêm" : "Chưa tiêm"}</div>
                      </div>
                      <div className="flex gap-2">
                        <CiBoxList className="text-primary" size={25} />
                        <p className="text-lg">Các công việc cần thực hiện:</p>
                      </div>
                      <ul className="list-disc pl-5">
                        {stage.treatmentToDos.map((todo, idx) => (
                          <li key={idx}>{todo.description}</li>
                        ))}
                      </ul>
                      <div className="space-x-2">
                        <Button
                          variant="ghost"
                          color="primary"
                          endContent={<TbMedicineSyrup size={20} />}
                          onPress={() => {
                            setSelectedTreatment(stage);
                            getMedicineInStage(stage.id ? stage.id : "");
                            onOpenDetail();
                          }}
                        >
                          Xem thuốc
                        </Button>
                        <Button
                          variant="solid"
                          color="primary"
                          endContent={<CiEdit size={20} />}
                          onPress={() => {
                            setSelectedTreatment(stage);
                            onOpenUpdate();
                          }}
                          isDisabled={
                            stage.isDone ||
                            stage.applyStageTime > new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString() ||
                            medicineList.some((medicine) => medicine.status !== "Đã yêu cầu")
                          }
                        >
                          Cập nhật kết quả
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
          {isOpenDetail && selectedTreatment && medicineList && (
            <DetailPlan isOpen={isOpenDetail} onClose={onCloseDetail} selectedTreatment={selectedTreatment} medicineList={medicineList} />
          )}
          {isOpenUpdate && selectedTreatment && (
            <UpdatePlanStatus isOpen={isOpenUpdate} onClose={onCloseUpdate} selectedTreatment={selectedTreatment} setSelectedTreatment={setSelectedTreatment} />
          )}
        </div>
      )}
    </div>
  );
};

export default TreatmentStages;
