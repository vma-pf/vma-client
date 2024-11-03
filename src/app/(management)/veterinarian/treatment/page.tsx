"use client";
import React from "react";
import { dateConverter } from "@oursrc/lib/utils";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { useRouter } from "next/navigation";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  Skeleton,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { FaClock, FaRegCalendarPlus } from "react-icons/fa6";
import { TbMedicineSyrup } from "react-icons/tb";
import { CiBoxList, CiEdit } from "react-icons/ci";
import { TreatmentData, CreateTreatmentStageProps, DiseaseReport } from "@oursrc/lib/models/treatment";
import TreatmentList from "./_components/treatment-list";
import Image from "next/image";
import { MdCalendarToday, MdOutlineStickyNote2 } from "react-icons/md";
import { IoIosAlert, IoIosCalendar } from "react-icons/io";
import { PiNotebookDuotone } from "react-icons/pi";
import { BiDetail } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GoDotFill } from "react-icons/go";
import TreatmentGuideList from "./_components/treatment-guide-list";
import CommonDiseaseList from "./_components/common-disease-list";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { pigService } from "@oursrc/lib/services/pigService";
import { Pig } from "@oursrc/lib/models/pig";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import DetailPlan from "./_components/_modals/detail-plan";
import UpdatePlanStatus from "./_components/_modals/update-plan-status";
import { treatmentStageService } from "@oursrc/lib/services/treatmentStageService";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@oursrc/components/ui/drawer";

const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang diễn ra", value: 1 },
  { name: "Đã hoàn thành", value: 2 },
  { name: "Đã hủy", value: 3 },
];

// const treatmentDetail: TreatmentData = {
//   id: "1",
//   title: "Lịch 1",
//   description: "Mô tả 1",
//   herdId: "1",
//   startDate: "2022-10-10",
//   expectedEndDate: "2022-10-20",
//   actualEndDate: "2022-10-20",
//   note: "Ghi chú 1",
//   status: 0,
//   treatmentStages: [],
// };

const Treatment = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = React.useState(new Set<string>());
  const [treatmentData, setTreatmentData] = React.useState<TreatmentData | undefined>();
  const [pigs, setPigs] = React.useState<Pig[]>([]);
  const [diseaseReports, setDiseaseReports] = React.useState<DiseaseReport[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("not-done");
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);
  const [selectedTreatment, setSelectedTreatment] = React.useState<CreateTreatmentStageProps>();

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

  const findTreatmentPlan = async (id: string) => {
    try {
      setLoading(true);
      const res: ResponseObject<TreatmentData> = await treatmentPlanService.getTreatmentPlan(id);
      if (res.isSuccess) {
        setTreatmentData(res.data);
      } else {
        console.log("Error: ", res.errorMessage);
      }
      const response: ResponseObjectList<Pig> = await treatmentPlanService.getPigList(id, 1, 5);
      if (response.isSuccess) {
        setPigs(response.data.data);
      } else {
        console.log("Error: ", response.errorMessage);
      }
      const result: ResponseObject<any> = await treatmentPlanService.getDiseaseReport(id);
      if (result.isSuccess) {
        if (result.data !== "Kế hoạch này chưa được áp dụng cho báo cáo bệnh nào cả!") {
          setDiseaseReports(result.data);
        }
      } else {
        console.log("Error: ", result.errorMessage);
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
    if (selectedTreatmentId.size > 0) {
      findTreatmentPlan(selectedTreatmentId.values().next().value);
    }
  }, [selectedTreatmentId]);

  React.useEffect(() => {
    if (!selectedTreatment) {
      findTreatmentPlan(selectedTreatmentId.values().next().value);
    }
  }, [selectedTreatment]);

  return (
    <div>
      <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="1">
        <Tab
          key="1"
          title={
            <div className="flex items-center">
              <IoIosCalendar size={20} />
              <span className="ml-2">Kế hoạch điều trị</span>
            </div>
          }
        >
          <div>
            <div className="flex mb-5">
              <div className="w-1/2 mr-2 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
                    <p className="text-2xl font-bold ml-4">Chọn kế hoạch</p>
                  </div>
                  <div className="flex">
                    <Button
                      variant="solid"
                      color="primary"
                      onPress={() => {
                        router.push("/veterinarian/treatment/create-plan");
                      }}
                    >
                      Tạo kế hoạch mới
                    </Button>
                  </div>
                </div>
                <TreatmentList setSelectedTreatment={setSelectedTreatmentId} />
              </div>
              <div className="w-1/2 ml-2 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
                <p className="m-2 text-xl font-semibold">Dấu hiệu bất thường</p>
                <div className="my-2 max-h-[500px] overflow-auto">
                  <Drawer>
                    <DrawerTrigger className="w-full">
                      <div className="mx-2 my-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
                        <div className="flex justify-start items-center">
                          <IoIosAlert className="mr-3 text-danger-500" size={30} />
                          <div className="text-start">
                            <p className="font-semibold">Chuồng 001</p>
                            <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                            <p className="text-zinc-400 text-sm">bây giờ</p>
                          </div>
                        </div>
                        <GoDotFill className="text-blue-500" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent className="rounded-t-3xl h-3/5">
                      <div className="w-full">
                        <DrawerHeader>
                          <DrawerTitle>
                            <p className="mx-auto text-2xl font-bold">Chi tiết cảnh báo</p>
                          </DrawerTitle>
                        </DrawerHeader>
                        <div className="p-5">
                          <p className="text-lg font-semibold">Chuồng 001</p>
                          <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                          <p className="text-zinc-400 text-sm">bây giờ</p>

                          <Divider orientation="horizontal" />
                          <p className="mx-auto text-lg font-semibold mt-3">Bệnh có thể gặp phải</p>
                          <p className="text-lg">Viêm phổi</p>
                          <Divider orientation="horizontal" />
                          <p className="mx-auto text-lg font-semibold mt-3">Gợi ý hướng dẫn điều trị</p>
                          <p className="text-lg">Tiêm phòng</p>
                        </div>
                        <DrawerFooter>
                          <DrawerClose>
                            <Button
                              variant="solid"
                              color="primary"
                              onPress={() => {
                                router.push("/veterinarian/treatment/create-plan");
                              }}
                            >
                              Tạo kế hoạch mới
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>
                  <Divider className="my-2" orientation="horizontal" />
                  <div className="mx-2 my-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
                    <div className="flex justify-start items-center">
                      <IoIosAlert className="mr-3" size={30} />
                      <div>
                        <p className="font-semibold">Chuồng 002</p>
                        <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                        <p className="text-zinc-400 text-sm">hôm qua</p>
                      </div>
                    </div>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="mx-2 my-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
                    <div className="flex justify-start items-center">
                      <IoIosAlert className="mr-3" size={30} />
                      <div>
                        <p className="font-semibold">Chuồng 001</p>
                        <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                        <p className="text-zinc-400 text-sm">tuần trước</p>
                      </div>
                    </div>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="mx-2 my-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
                    <div className="flex justify-start items-center">
                      <IoIosAlert className="mr-3" size={30} />
                      <div>
                        <p className="font-semibold">Chuồng 001</p>
                        <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                        <p className="text-zinc-400 text-sm">tháng trước</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                          <p
                            className={`text-lg mt-3 font-semibold ${
                              statusMap.find((status) => status.value === treatmentData.status)?.value === 1
                                ? "text-blue-500"
                                : statusMap.find((status) => status.value === treatmentData.status)?.value === 2
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {statusMap.find((status) => status.value === treatmentData.status)?.name}
                          </p>
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
                                <GrStatusGoodSmall size={20} className={`text-danger absolute left-0 translate-x-[-33.5px] z-10 top-1`} />
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
                                  {!stage.isDone && stage.applyStageTime < new Date().toISOString() && (
                                    <Button
                                      variant="solid"
                                      color="primary"
                                      endContent={<CiEdit size={20} />}
                                      onPress={() => {
                                        setSelectedTreatment(stage);
                                        onOpenUpdate();
                                      }}
                                    >
                                      Cập nhật kết quả
                                    </Button>
                                  )}
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
            )}
          </div>
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center">
              <MdOutlineStickyNote2 size={20} />
              <span className="ml-2">Hướng dẫn điều trị</span>
            </div>
          }
        >
          <TreatmentGuideList />
        </Tab>
        <Tab
          key="3"
          title={
            <div className="flex items-center">
              <PiNotebookDuotone size={20} />
              <span className="ml-2">Từ điển bệnh</span>
            </div>
          }
        >
          <CommonDiseaseList />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Treatment;
