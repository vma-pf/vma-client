"use client";
import { Accordion, AccordionItem, Button, Divider, Progress, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import Chart from "@oursrc/components/herds/chart";
import PigList from "./_components/pig-list";
import { IoIosAlert } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import ButtonCreateHerd from "./_components/button-create-herd";
import { dateConverter } from "@oursrc/lib/utils";
import { HerdInfo } from "@oursrc/lib/models/herd";
import HerdList from "./_components/herd-list";
import { BiDetail } from "react-icons/bi";
import { FaChartPie } from "react-icons/fa6";
import { AiFillAlert } from "react-icons/ai";
import { Pig } from "@oursrc/lib/models/pig";
import HealthCheckUp from "./_components/_modal/health-checkup";
import PigDetail from "@oursrc/components/herds/modals/pig-detail";
import ChangeCage from "./_components/_modal/change-cage";
import MonitorDevelopment from "./_components/monitor-development";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@oursrc/components/ui/sheet";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { herdService } from "@oursrc/lib/services/herdService";
import HerdDetail from "@oursrc/components/herds/modals/herd-detail";
import { EyeIcon } from "lucide-react";
import { calculateProgress } from "@oursrc/lib/utils/dev-utils";
import { EndHerdStatistic, HerdStatistic } from "@oursrc/lib/models/statistic";
import { AvgStatistic } from "./_components/avg-statistic";
import { LuFileBarChart } from "react-icons/lu";

const statusColorMap = [
  { status: "Chưa Kết Thúc", color: "bg-default" },
  { status: "Đang diễn ra", color: "bg-sky-500" },
  { status: "Đã Kết Thúc", color: "bg-primary" },
];

const Herd = () => {
  const { isOpen: isOpenHerdDetail, onOpen: onOpenHerdDetail, onClose: onCloseHerdDetail } = useDisclosure();
  const { isOpen: isOpenPigDetail, onOpen: onOpenPigDetail, onClose: onClosePigDetail } = useDisclosure();
  const { isOpen: isOpenChangeCage, onOpen: onOpenChangeCage, onClose: onCloseChangeCage } = useDisclosure();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedHerd, setSelectedHerd] = React.useState<HerdInfo>();
  const [selectedPig, setSelectedPig] = React.useState<Pig | undefined>();
  const [statisticData, setStatisticData] = React.useState<HerdStatistic | undefined>();
  const [avgStatisticData, setAvgStatisticData] = React.useState<EndHerdStatistic | undefined>();

  const getStatistics = async () => {
    try {
      const res: ResponseObject<HerdStatistic> = await herdService.getHerdStatistics(selectedHerd?.id ?? "");
      if (res.isSuccess) {
        setStatisticData(res.data);
      } else {
        console.log(res.errorMessage);
      }
      if (selectedHerd?.status === "Đã Kết Thúc") {
        const response: ResponseObject<EndHerdStatistic> = await herdService.getAvgStatistics(selectedHerd?.id ?? "");
        if (response.isSuccess) {
          setAvgStatisticData(response.data);
        } else {
          console.log(response.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (!selectedHerd) {
      setSelectedPig(undefined);
      setStatisticData(undefined);
      setAvgStatisticData(undefined);
    } else {
      getStatistics();
    }
  }, [selectedHerd]);
  return (
    <div>
      {avgStatisticData && (
        <div className="mb-4">
          <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
            <AccordionItem key="1" title={<p className="text-xl font-bold">Kết quả nuôi</p>} startContent={<LuFileBarChart className="text-primary" size={25} />}>
              <AvgStatistic data={avgStatisticData} />
              <div className="flex items-center">
                <p className="my-2">Cân nặng trung bình ban đầu:</p> <p className="my-2 ml-2 font-semibold"> {avgStatisticData.avgWeightInStart} kg</p>
              </div>
              <div className="flex items-center">
                <p className="my-2">Cân nặng trung bình cuối cùng:</p> <p className="my-2 ml-2 font-semibold"> {avgStatisticData.avgWeightInEnd} kg</p>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
                  <p className="text-2xl font-bold ml-4">Danh sách đàn</p>
                </div>
                <div className="flex">
                  <ButtonCreateHerd />
                </div>
              </div>
              <HerdList setSelectedHerd={setSelectedHerd} />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
              <p className="text-2xl font-bold mb-2">Thông tin đàn heo</p>
              {selectedHerd ? (
                <div className="flex flex-col space-y-2">
                  <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
                    <AccordionItem key="1" title="Thông tin chung" startContent={<BiDetail className="text-sky-500" size={25} />}>
                      <div className="border-2 px-2 w-full">
                        <div className="flex justify-between items-center">
                          <p className="my-2">Tên đàn:</p>
                          <p className="my-2 font-semibold">{selectedHerd?.code}</p>
                        </div>
                        <Divider orientation="horizontal" />
                        <div className="flex justify-between items-center">
                          <p className="my-2">Số lượng:</p>
                          <p className="my-2 font-semibold">{selectedHerd?.totalNumber && selectedHerd?.totalNumber + " con"}</p>
                        </div>
                        <Divider orientation="horizontal" />
                        <div className="flex justify-between items-center">
                          <p className="my-2">Giống:</p>
                          <p className="my-2 font-semibold">{selectedHerd?.breed}</p>
                        </div>
                        <Divider orientation="horizontal" />
                        <div className="flex justify-between items-center">
                          <p className="my-2">Ngày sinh:</p>
                          <p className="my-2 font-semibold">{dateConverter(selectedHerd?.dateOfBirth)}</p>
                        </div>
                        <Divider orientation="horizontal" />
                        <div className="flex justify-between">
                          <p className="text-md mt-3">Ngày bắt đầu đàn</p>
                          <p className="text-md mt-3">Ngày kết thúc nuôi (dự kiến)</p>
                        </div>
                        <Progress value={calculateProgress(selectedHerd?.startDate ?? "", selectedHerd?.expectedEndDate ?? "")} />
                        <div className="flex justify-between">
                          <p className="text-lg mt-3 font-semibold">{dateConverter(selectedHerd?.startDate)}</p>
                          <p className="text-lg mt-3 font-semibold">{dateConverter(selectedHerd?.expectedEndDate)}</p>
                        </div>
                        <Divider orientation="horizontal" />
                        <div className="flex justify-between items-center">
                          <p className="my-2">Trạng thái:</p>
                          <p
                            className={`my-2 p-1 font-semibold rounded-md ${statusColorMap.find((item) => item.status === selectedHerd?.status)?.color}
                          `}
                          >
                            {selectedHerd?.status}
                          </p>
                        </div>
                        <Divider orientation="horizontal" />
                        <div className="flex justify-between items-center">
                          <p className="my-2">Cân nặng trung bình:</p>
                          <p className="my-2 font-semibold">{selectedHerd?.averageWeight}</p>
                        </div>
                        <Divider orientation="horizontal" />
                        <p className="my-2">Mô tả:</p>
                        <p className="my-2">{selectedHerd?.description}</p>
                        <Button color="primary" onClick={onOpenHerdDetail} endContent={<EyeIcon size={20} />}>
                          Xem chi tiết
                        </Button>
                      </div>
                    </AccordionItem>
                    <AccordionItem key="2" title="Tình trạng đàn" startContent={<FaChartPie className="text-primary" size={25} />}>
                      <div className="border-2 w-full">
                        <p className="m-2 text-xl font-semibold">Tình trạng đàn</p>
                        {statisticData && <Chart data={statisticData} />}
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>
              ) : (
                <p className="text-center">Chọn đàn để xem thông tin</p>
              )}
            </div>
          </div>
          <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-2xl font-bold mb-3">Danh sách heo</p>
              <SheetTrigger asChild>
                <Button color="primary" isDisabled={!selectedPig || !selectedHerd?.isCheckUpToday} onClick={() => setIsOpen(true)}>
                  Kiểm tra sức khỏe
                </Button>
              </SheetTrigger>
            </div>
            {selectedHerd ? (
              <PigList selectedHerd={selectedHerd as HerdInfo} setSelectedPig={setSelectedPig} onOpenDetail={onOpenPigDetail} onOpenChangeCage={onOpenChangeCage} />
            ) : (
              <p className="text-center">Chọn đàn để xem danh sách heo</p>
            )}
          </div>
          {/* {isOpen && selectedPig && <HealthCheckUp isOpen={isOpen} onClose={onClose} pigInfo={selectedPig} />} */}
          {isOpenHerdDetail && selectedHerd && <HerdDetail isOpen={isOpenHerdDetail} onClose={onCloseHerdDetail} herdInfo={selectedHerd} />}
          {isOpenPigDetail && selectedPig && <PigDetail isOpen={isOpenPigDetail} onClose={onClosePigDetail} pigInfo={selectedPig} />}
          {isOpenChangeCage && selectedPig && <ChangeCage isOpen={isOpenChangeCage} onClose={onCloseChangeCage} pigInfo={selectedPig} />}
        </div>
        <SheetContent className="w-11/12 overflow-auto">
          <SheetHeader>
            <SheetTitle>
              <p className="text-2xl font-bold">Thông tin sức khỏe của heo {selectedPig?.pigCode}</p>
            </SheetTitle>
          </SheetHeader>
          {selectedPig && <MonitorDevelopment setIsOpen={setIsOpen} pigInfo={selectedPig} />}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Herd;
