"use client";
import { Accordion, AccordionItem, Button, Divider, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import Chart from "./_components/chart";
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
import DevelopmentLogList from "./_components/development-log-list";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@oursrc/components/ui/resizable";
import HealthCheckUp from "./_components/_modal/health-checkup";
import DevelopmentLineChart from "./_components/development-line-chart";

const Herd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedHerd, setSelectedHerd] = React.useState<HerdInfo>();
  const [selectedPig, setSelectedPig] = React.useState<Pig | undefined>();

  React.useEffect(() => {
    !selectedHerd && setSelectedPig(undefined);
  }, [selectedHerd]);
  return (
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
          <div className="flex flex-col space-y-2">
            <Accordion variant="splitted" defaultExpandedKeys={["3"]}>
              <AccordionItem key="1" title="Thông tin chung" startContent={<BiDetail className="text-sky-500" size={25} />}>
                <div className="border-2 px-2 w-full">
                  <div className="flex justify-between items-center">
                    <p className="my-2">Tên đàn:</p>
                    <p className="my-2 font-semibold">{selectedHerd?.code}</p>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="flex justify-between items-center">
                    <p className="my-2">Số lượng:</p>
                    <p className="my-2 font-semibold">{selectedHerd?.totalNumber}</p>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="flex justify-between items-center">
                    <p className="my-2">Giống:</p>
                    <p className="my-2 font-semibold">{selectedHerd?.breed}</p>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="flex justify-between items-center">
                    <p className="my-2">Ngày bắt đầu đàn:</p>
                    <p className="my-2 font-semibold">{dateConverter(selectedHerd?.startDate ?? "")}</p>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="flex justify-between items-center">
                    <p className="my-2">Ngày kết thúc nuôi (dự kiến):</p>
                    <p className="my-2 font-semibold">{dateConverter(selectedHerd?.expectedEndDate ?? "")}</p>
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="flex justify-between items-center">
                    <p className="my-2">Trạng thái:</p>
                    {/* <p className={`my-2 p-1 font-semibold rounded-md ${selectedHerd?.status === 1 ? "text-success-500" : "text-danger-500"}`}>
                {selectedHerd?.status === 1 ? "Đang nuôi" : "Đã kết thúc"}
              </p> */}
                  </div>
                  <Divider orientation="horizontal" />
                  <div className="flex justify-between items-center">
                    <p className="my-2">Cân nặng trung bình:</p>
                    <p className="my-2 font-semibold">{selectedHerd?.averageWeight}</p>
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem key="2" title="Tình trạng đàn" startContent={<FaChartPie className="text-primary" size={25} />}>
                <div className="border-2 w-full">
                  <p className="m-2 text-xl font-semibold">Tình trạng đàn</p>
                  <Chart />
                </div>
              </AccordionItem>
              <AccordionItem key="3" title="Dấu hiệu bất thường" startContent={<AiFillAlert className="text-warning-500" size={25} />}>
                <div className="border-2 w-full">
                  <p className="m-2 text-xl font-semibold">Dấu hiệu bất thường</p>
                  <div className="my-2 max-h-[300px] overflow-auto">
                    <div className="mx-2 my-3 flex justify-between items-center">
                      <div className="flex justify-start items-center">
                        <IoIosAlert className="mr-3 text-danger-500" size={30} />
                        <div>
                          <p className="font-semibold">Chuồng 001</p>
                          <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                          <p className="text-zinc-400 text-sm">bây giờ</p>
                        </div>
                      </div>
                      <GoDotFill className="text-blue-500" />
                    </div>
                    <Divider className="my-2" orientation="horizontal" />
                    <div className="mx-2 my-3 flex justify-between items-center">
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
                    <div className="mx-2 my-3 flex justify-between items-center">
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
                    <div className="mx-2 my-3 flex justify-between items-center">
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
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-2xl font-bold mb-3">Danh sách heo</p>
        <Button color="primary" onPress={onOpen}>
          Kiểm tra sức khỏe
        </Button>
        {selectedHerd ? (
          <PigList selectedHerd={selectedHerd as HerdInfo} setSelectedPig={setSelectedPig} />
        ) : (
          <p className="text-center">Chọn đàn để xem danh sách heo</p>
        )}
      </div>
      <div className="flex gap-x-3">
        <div className="p-5 w-1/2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          {/* <ResizablePanelGroup direction="horizontal" className="w-screen">
          <ResizablePanel className="pr-3" defaultSize={60} minSize={30}>
          <div>
              <p className="text-2xl font-bold mb-3">Lịch sử quá trình phát triển</p>
              {selectedPig ? <DevelopmentLogList selectedPig={selectedPig} /> : <p className="text-center">Chọn heo để xem lịch sử phát triển</p>}
            </div>
            </ResizablePanel>
          <ResizableHandle withHandle className="min-h-[400px] " />
          <ResizablePanel className="pl-3" defaultSize={40} minSize={20}>
          <p className="text-2xl font-bold mb-3">Báo cáo bệnh tật</p>
          {selectedPig ? <p>Chưa có dữ liệu</p> : <p className="text-center">Chọn heo để xem báo cáo bệnh tật</p>}
          </ResizablePanel>
        </ResizablePanelGroup> */}
          <p className="text-2xl font-bold mb-3">Lịch sử quá trình phát triển</p>
          {selectedHerd && selectedPig ? <DevelopmentLogList selectedPig={selectedPig} /> : <p className="text-center">Chọn heo để xem lịch sử phát triển</p>}
        </div>
        <div className="p-5 w-1/2 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <DevelopmentLineChart />
        </div>
      </div>
      {isOpen && selectedPig && <HealthCheckUp isOpen={isOpen} onClose={onClose} pigInfo={selectedPig} />}
    </div>
  );
};

export default Herd;
