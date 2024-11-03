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
import { BookCopy, Layers2, Layers2Icon, Layers3, Table } from "lucide-react";
import TreatmentGuideGridList from "./_components/treatment-guide-grid-list";
import CommonDiseaseGridList from "./_components/common-disease-grid-list";
import TreatmentStages from "./_components/treatment-stages";

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
  const [loading, setLoading] = React.useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = React.useState(new Set<string>());
  const [treatmentData, setTreatmentData] = React.useState<TreatmentData | undefined>();
  const [diseaseReports, setDiseaseReports] = React.useState<DiseaseReport[]>([]);
  const [pigs, setPigs] = React.useState<Pig[]>([]);
  const [selectedTreatment, setSelectedTreatment] = React.useState<CreateTreatmentStageProps>();

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
              <TreatmentStages
                treatmentData={treatmentData}
                diseaseReports={diseaseReports}
                pigs={pigs}
                selectedTreatment={selectedTreatment}
                setSelectedTreatment={setSelectedTreatment}
              />
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
          <div className="flex flex-col justify-end">
            <Tabs size="md" color="primary" variant="solid" defaultSelectedKey="mode-1">
              <Tab key="mode-1" title={<Layers3 size={20} />}>
                <TreatmentGuideGridList gridColumns={1} />
              </Tab>
              <Tab key="mode-2" title={<Table size={20} />}>
                <TreatmentGuideList />
              </Tab>
              {/* <Tab key="mode-3" title={<Layers2Icon size={20} />}>
                <TreatmentGuideGridList gridColumns={2} />
              </Tab> */}
            </Tabs>
          </div>
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
