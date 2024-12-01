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
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Skeleton,
  Spinner,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { FaClock, FaRegCalendarPlus, FaStar } from "react-icons/fa6";
import { TbMedicineSyrup } from "react-icons/tb";
import { CiBoxList, CiClock2, CiEdit, CiStickyNote } from "react-icons/ci";
import { TreatmentData, CreateTreatmentStageProps, DiseaseReport } from "@oursrc/lib/models/treatment";
import { MdCalendarToday, MdOutlineStickyNote2 } from "react-icons/md";
import { IoIosAlert, IoIosCalendar } from "react-icons/io";
import { PiNotebookDuotone, PiStethoscope } from "react-icons/pi";
import { BiDetail } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { GoDotFill } from "react-icons/go";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { pigService } from "@oursrc/lib/services/pigService";
import { Pig } from "@oursrc/lib/models/pig";
import { FaCheckCircle, FaRegSave } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { treatmentStageService } from "@oursrc/lib/services/treatmentStageService";
import { Abnormality } from "@oursrc/lib/models/abnormality";
import { CommonDisease } from "@oursrc/lib/models/common-disease";
import { abnormalityService } from "@oursrc/lib/services/abnormalityService";
import { GiCage } from "react-icons/gi";
import { BsArrowReturnRight } from "react-icons/bs";
import { Tooltip } from "recharts";
import { Filter, Layers3, Table } from "lucide-react";
import TreatmentGuideGridList from "../../veterinarian/treatment/_components/treatment-guide-grid-list";
import TreatmentGuideList from "../../veterinarian/treatment/_components/treatment-guide-list";
import CommonDiseaseGridList from "../../veterinarian/treatment/_components/common-disease-grid-list";
import CommonDiseaseList from "../../veterinarian/treatment/_components/common-disease-list";
import TreatmentList from "../../farm-assist/treatment/_components/treatment-list";

const statusColorMap = [
  { status: "Đã hoàn thành", color: "text-primary" },
  { status: "Đang diễn ra", color: "text-sky-500" },
  { status: "Chưa bắt đầu", color: "text-warning" },
  { status: "Đã hủy", color: "text-danger" },
];

const Treatment = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [loadMore, setLoadMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [selectedTreatmentId, setSelectedTreatmentId] = React.useState(new Set<string>());
  const [treatmentData, setTreatmentData] = React.useState<TreatmentData | undefined>();
  const [pigs, setPigs] = React.useState<Pig[]>([]);
  const [diseaseReports, setDiseaseReports] = React.useState<DiseaseReport[]>([]);
  const [abnormalities, setAbnormalities] = React.useState<Abnormality[]>([]);
  const [selectedAbnormality, setSelectedAbnormality] = React.useState<Abnormality>();
  const [commonDiseases, setCommonDiseases] = React.useState<CommonDisease[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("all");
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);
  const [selectedGuideId, setSelectedGuideId] = React.useState<string>();
  const [selectedTreatment, setSelectedTreatment] = React.useState<CreateTreatmentStageProps>();
  const [showFullText, setShowFullText] = React.useState<{ [key: string]: boolean }>({});

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") {
      return "Tất cả";
    } else if (filterStatus === "done") {
      return "Đã tiêm";
    } else {
      return "Chưa tiêm";
    }
  }, [filterStatus]);

  const toggleShowFullText = (id: string) => {
    setShowFullText((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

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

  const checkTime = (msg: Abnormality) => {
    const diffTime = new Date().getTime() - new Date(msg.createdAt).getTime();
    const minutes = Math.floor(diffTime / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const timeAgo =
      minutes < 60
        ? `${minutes} phút trước`
        : hours < 24
        ? `${hours} giờ trước`
        : days < 7
        ? `${days} ngày trước`
        : days < 30
        ? `${days} tuần trước`
        : `${days} tháng trước`;

    return timeAgo;
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

  const fetchAbnormalities = async () => {
    try {
      setLoadMore(true);
      const res: ResponseObjectList<Abnormality> = await abnormalityService.getAll(page, 4);
      if (res.isSuccess) {
        setAbnormalities((prev) => [...prev, ...res.data.data]);
        setPage(res.data.pageIndex);
        setTotalPages(res.data.totalPages);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoadMore(false);
    }
  };

  const fetchCommonDiseases = async (id: string) => {
    try {
      const res: ResponseObject<CommonDisease[]> = await abnormalityService.getCommonDiseaseById(id);
      if (res.isSuccess) {
        setCommonDiseases(res.data);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const abnormalityValue = React.useMemo(() => {
    const items: Abnormality[] = [...abnormalities];
    return items;
  }, [abnormalities]);

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

  React.useEffect(() => {
    fetchAbnormalities();
  }, [page]);

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
                </div>
                <TreatmentList setSelectedTreatment={setSelectedTreatmentId} />
              </div>
              <div className="w-1/2 ml-2 p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
                <p className="m-2 text-xl font-semibold">Dấu hiệu bất thường</p>
                {!loading ? (
                  <div className="my-2 max-h-[500px] overflow-auto">
                    {abnormalityValue.length > 0 ? (
                      abnormalityValue.map((abnormality) => (
                        <div
                          key={abnormality.id}
                          onClick={() => {
                            fetchCommonDiseases(abnormality.id);
                            setSelectedAbnormality(abnormality);
                            onOpen();
                          }}
                          className="cursor-pointer"
                        >
                          <div className="mx-2 my-3 flex justify-between items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-2 rounded-lg">
                            <div className="flex justify-start items-center">
                              <IoIosAlert className="mr-3 text-danger-500" size={30} />
                              <div className="text-start">
                                <p className="">
                                  Chuồng <strong>{abnormality.cageCode}</strong>
                                </p>
                                <p className="mt-2">{abnormality.title}</p>
                                <small className="font-bold">{abnormality.description}</small>
                                <p className="text-zinc-400 text-sm">{checkTime(abnormality).toString()}</p>
                              </div>
                            </div>
                            {(checkTime(abnormality).toString().includes("phút") || checkTime(abnormality).toString().includes("giờ")) && (
                              <GoDotFill className="text-blue-500" />
                            )}
                          </div>
                          <Divider className="my-2" orientation="horizontal" />
                        </div>
                      ))
                    ) : (
                      <p className="text-center">Không có dấu hiệu bất thường</p>
                    )}
                    {page < totalPages &&
                      (loadMore ? (
                        <div className="flex w-full justify-center">
                          <Spinner color="primary" />
                        </div>
                      ) : (
                        <div className="flex w-full justify-center">
                          <Button variant="light" size="sm" color="default" onPress={() => setPage(page + 1)}>
                            Xem thêm
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="my-2 max-h-[500px] overflow-auto">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="mx-2 my-3 flex justify-between items-center p-2 rounded-lg">
                        <Skeleton className="rounded-lg">
                          <div className="h-20 rounded-lg bg-default-300"></div>
                        </Skeleton>
                      </div>
                    ))}
                  </div>
                )}
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
                          <p className={`text-lg mt-3 font-semibold ${statusColorMap.find((status) => status.status === treatmentData.status)?.color}`}>
                            {treatmentData.status}
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
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedAbnormality && isOpen && (
              <Modal size="4xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
                <ModalContent>
                  <ModalHeader>
                    <p className="text-2xl font-bold">Chi tiết cảnh báo</p>
                  </ModalHeader>
                  <ModalBody>
                    <div className="p-5">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 flex flex-col items-center">
                          <GiCage className="text-4xl" />
                          <p className="text-md font-light">Chuồng</p>
                          <p className="text-lg">{selectedAbnormality.cageCode}</p>
                        </div>
                        <div className="col-span-6 flex flex-col items-center">
                          <CiClock2 className="text-4xl" />
                          <p className="text-md font-light">Thời gian</p>
                          <p className="text-lg">{checkTime(selectedAbnormality).toString()}</p>
                        </div>
                        <div className="col-span-6 flex flex-col items-center">
                          <CiStickyNote className="text-4xl" />
                          <p className="text-md font-light">Nội dung</p>
                          <p className="text-lg">{selectedAbnormality.title}</p>
                        </div>
                        <div className="col-span-6 flex flex-col items-center">
                          <CiStickyNote className="text-4xl" />
                          <p className="text-md font-light">Loại cảnh báo</p>
                          <p className="text-lg">{selectedAbnormality.abnormalityType}</p>
                        </div>
                        <div className="col-span-12 flex flex-col items-center">
                          <CiStickyNote className="text-4xl" />
                          <p className="text-md font-light">Mô tả</p>
                          <p className="text-lg font-bold">{selectedAbnormality.description}</p>
                        </div>
                        <div className="col-span-12 flex flex-col items-center">
                          <Image width={300} src={selectedAbnormality.imageUrl} alt="abnormality" sizes="4xl" />
                          <p className="text-md font-light">Hình ảnh</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">Bệnh có thể mắc phải:</p>
                      {commonDiseases.length > 0 ? (
                        commonDiseases.map((disease) => (
                          <Card key={disease.id} className="flex items-center my-2 p-2">
                            <CardBody>
                              <div className="mb-2 flex items-center space-x-1">
                                {Array.from({ length: Number(disease.diseaseType) }).map((_, index) => (
                                  <FaStar key={index} size={17} className="text-yellow-500" />
                                ))}
                              </div>
                              <div className="flex items-center space-x-2">
                                <BsArrowReturnRight size={20} className="text-primary" />
                                <p className="my-2 text-xl font-extrabold">{disease.title}</p>
                              </div>
                              <p>
                                <strong>Mô tả: </strong>
                                {disease.description}
                              </p>
                              <p>
                                <strong>Triệu chứng: </strong>
                                {disease.symptom}
                              </p>
                              <div className="my-3 flex items-center space-x-2">
                                <PiStethoscope size={20} className="text-primary" />
                                <p className="text-lg font-semibold">Một số hướng dẫn điều trị: </p>
                              </div>
                              {disease.treatmentGuides && disease.treatmentGuides?.length > 0 ? (
                                disease.treatmentGuides.map((guide) => (
                                  <div key={guide.id} className="flex space-x-2">
                                    <div className="w-fit">
                                      <span>{showFullText[guide.id] ? guide.cure : guide.cure.slice(0, 100) + "..."}</span>
                                      {!showFullText[guide.id] && (
                                        <span className="text-default-400 ml-2 cursor-pointer" onClick={() => toggleShowFullText(guide.id)}>
                                          Xem thêm
                                        </span>
                                      )}
                                      {showFullText[guide.id] && (
                                        <span className="text-default-400 ml-2 cursor-pointer" onClick={() => toggleShowFullText(guide.id)}>
                                          Thu gọn
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-center">Không có hướng dẫn điều trị nào</p>
                              )}
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <p className="text-center">Không có bệnh nào phù hợp</p>
                      )}
                    </div>
                  </ModalBody>
                </ModalContent>
              </Modal>
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
          <Tabs size="md" color="primary" variant="solid" defaultSelectedKey="mode-1">
            <Tab key="mode-1" title={<Layers3 size={20} />}>
              <TreatmentGuideGridList gridColumns={1} selectedGuideId={selectedGuideId} setSelectedGuideId={setSelectedGuideId} />
            </Tab>
            <Tab key="mode-2" title={<Table size={20} />}>
              <TreatmentGuideList selectedGuideId={selectedGuideId} setSelectedGuideId={setSelectedGuideId} />
            </Tab>
          </Tabs>
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
          <Tabs size="md" color="primary" variant="solid" defaultSelectedKey="mode-1">
            <Tab key="mode-1" title={<Layers3 size={20} />}>
              <CommonDiseaseGridList gridColumns={1} />
            </Tab>
            <Tab key="mode-2" title={<Table size={20} />}>
              <CommonDiseaseList />
            </Tab>
          </Tabs>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Treatment;
