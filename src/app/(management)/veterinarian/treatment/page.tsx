"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@oursrc/hooks/use-toast";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { Button, Card, CardBody, Divider, Skeleton, Tab, Tabs } from "@nextui-org/react";
import { CiClock2, CiStickyNote } from "react-icons/ci";
import { TreatmentData, CreateTreatmentStageProps, DiseaseReport } from "@oursrc/lib/models/treatment";
import TreatmentList from "./_components/treatment-list";
import Image from "next/image";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { IoIosAlert, IoIosCalendar } from "react-icons/io";
import { PiNotebookDuotone } from "react-icons/pi";
import { GoDotFill } from "react-icons/go";
import TreatmentGuideList from "./_components/treatment-guide-list";
import CommonDiseaseList from "./_components/common-disease-list";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { Pig } from "@oursrc/lib/models/pig";
import { Layers3, Table } from "lucide-react";
import TreatmentGuideGridList from "./_components/treatment-guide-grid-list";
import CommonDiseaseGridList from "./_components/common-disease-grid-list";
import TreatmentStages from "./_components/treatment-stages";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@oursrc/components/ui/sheet";
import { GiCage } from "react-icons/gi";
import { TreatmentGuide } from "@oursrc/lib/models/treatment-guide";

const Treatment = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = React.useState(new Set<string>());
  const [treatmentData, setTreatmentData] = React.useState<TreatmentData | undefined>();
  const [diseaseReports, setDiseaseReports] = React.useState<DiseaseReport[]>([]);
  const [pigs, setPigs] = React.useState<Pig[]>([]);
  const [selectedTreatment, setSelectedTreatment] = React.useState<CreateTreatmentStageProps>();
  const [selectedTreatmentGuide, setSelectedTreatmentGuide] = React.useState<TreatmentGuide>();

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
    } else {
      setTreatmentData(undefined);
      setDiseaseReports([]);
      setPigs([]);
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
                      isDisabled={!selectedTreatmentGuide}
                      onPress={() => {
                        router.push(`/veterinarian/treatment/${selectedTreatmentGuide?.id}/create-plan`);
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
                  <Sheet>
                    <SheetTrigger className="w-full">
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
                    </SheetTrigger>
                    <SheetContent className="w-3/4">
                      <SheetHeader>
                        <SheetTitle>
                          <p className="text-2xl font-bold">Chi tiết cảnh báo</p>
                        </SheetTitle>
                      </SheetHeader>
                      <div className="p-5">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-6 flex flex-col items-center">
                            <GiCage className="text-4xl" />
                            <p className="text-md font-light">Chuồng</p>
                            <p className="text-lg">CAGE001</p>
                          </div>
                          <div className="col-span-6 flex flex-col items-center">
                            <CiClock2 className="text-4xl" />
                            <p className="text-md font-light">Thời gian</p>
                            <p className="text-lg">1 phút trước</p>
                          </div>
                          <div className="col-span-12 flex flex-col items-center">
                            <CiStickyNote className="text-4xl" />
                            <p className="text-md font-light">Nội dung</p>
                            <p className="text-lg">Có 1 cá thể có dấu hiệu bất thường</p>
                          </div>
                        </div>
                      </div>
                      <SheetFooter>
                        <SheetClose asChild>
                          <Button
                            variant="solid"
                            color="primary"
                            onPress={() => {
                              router.push(`/veterinarian/treatment/${selectedTreatmentGuide?.id}/create-plan`);
                            }}
                          >
                            Tạo kế hoạch mới
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
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
            <Card className="mb-5 mx-20">
              <CardBody>
                <p className="text-lg text-center font-semibold">Hướng dẫn điều trị đã chọn</p>
                {selectedTreatmentGuide ? (
                  <div className="">
                    <p className="">
                      <strong>Tên bệnh:</strong> {selectedTreatmentGuide.diseaseTitle}
                    </p>
                    <p className="">
                      <strong>Mô tả bệnh:</strong> {selectedTreatmentGuide.treatmentDescription}
                    </p>
                    <p className="">
                      <strong>Triệu chứng:</strong> {selectedTreatmentGuide.diseaseSymptoms}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-center">Chưa chọn hướng dẫn điều trị</p>
                )}
              </CardBody>
            </Card>
            <Tabs size="md" color="primary" variant="solid" defaultSelectedKey="mode-1">
              <Tab key="mode-1" title={<Layers3 size={20} />}>
                <TreatmentGuideGridList gridColumns={1} selectedTreatmentGuide={selectedTreatmentGuide} setSelectedTreatmentGuide={setSelectedTreatmentGuide} />
              </Tab>
              <Tab key="mode-2" title={<Table size={20} />}>
                <TreatmentGuideList selectedTreatmentGuide={selectedTreatmentGuide} setSelectedTreatmentGuide={setSelectedTreatmentGuide} />
              </Tab>
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
