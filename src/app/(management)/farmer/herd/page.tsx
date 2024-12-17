"use client";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  ChipProps,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import Chart from "@oursrc/components/herds/chart";
import { IoIosAlert } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { dateConverter } from "@oursrc/lib/utils";
import { HerdInfo } from "@oursrc/lib/models/herd";
import HerdList from "./_components/herd-list";
import { BiDetail } from "react-icons/bi";
import { FaChartPie } from "react-icons/fa6";
import { AiFillAlert } from "react-icons/ai";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { herdService } from "@oursrc/lib/services/herdService";
import { Pig } from "@oursrc/lib/models/pig";
import PigDetail from "@oursrc/components/herds/modals/pig-detail";
import PigList from "../../veterinarian/herd/_components/pig-list";
import HerdDetail from "@oursrc/components/herds/modals/herd-detail";
import { EyeIcon } from "lucide-react";
import { calculateProgress } from "@oursrc/lib/utils/dev-utils";
import { EndHerdStatistic, HerdStatistic } from "@oursrc/lib/models/statistic";
import { AvgStatistic } from "../../farm-assist/herd/_components/avg-statistic";
import { LuFileBarChart } from "react-icons/lu";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { useToast } from "@oursrc/hooks/use-toast";
import { TbReportSearch } from "react-icons/tb";
import { FaFileDownload } from "react-icons/fa";
import { SERVERURL } from "@oursrc/lib/http";

const statusColorMap = [
  { status: "Chưa kết thúc", color: "warning" },
  { status: "Đã kết thúc", color: "primary" },
];

const Herd = () => {
  const { toast } = useToast();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [isEndHerd, setIsEndHerd] = React.useState(false);
  const { isOpen: isOpenHerdDetail, onOpen: onOpenHerdDetail, onClose: onCloseHerdDetail } = useDisclosure();
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenEndHerd, onOpen: onOpenEndHerd, onClose: onCloseEndHerd } = useDisclosure();
  const [selectedHerd, setSelectedHerd] = React.useState<HerdInfo>();
  const [selectedPig, setSelectedPig] = React.useState<Pig | undefined>();
  const [statisticData, setStatisticData] = React.useState<HerdStatistic | undefined>();
  const [avgStatisticData, setAvgStatisticData] = React.useState<EndHerdStatistic | undefined>();

  const getStatistics = async () => {
    try {
      const res: ResponseObject<any> = await herdService.getHerdStatistics(selectedHerd?.id ?? "");
      if (res.isSuccess) {
        setStatisticData(res.data);
      } else {
        console.log(res.errorMessage);
      }
      if (selectedHerd?.status === "Đã kết thúc") {
        const response: ResponseObject<EndHerdStatistic> = await herdService.getAvgStatistics(selectedHerd?.id ?? "");
        if (response.isSuccess) {
          setAvgStatisticData(response.data);
        } else {
          console.log(response.errorMessage);
        }
      } else {
        setAvgStatisticData(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndHerd = async () => {
    try {
      setLoading(true);
      const res: ResponseObject<any> = await herdService.endHerd(selectedHerd?.id ?? "");
      if (res.isSuccess) {
        setIsEndHerd(true);
        onCloseEndHerd();
        setSelectedHerd(undefined);
        setStatisticData(undefined);
        setAvgStatisticData(undefined);
        toast({
          title: "Kết thúc đàn thành công",
          variant: "success",
        });
      } else {
        console.log(res.errorMessage);
        toast({
          title: "Kết thúc đàn thất bại",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await fetch(`${SERVERURL}/api/herds/${selectedHerd?.id}/export-statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get blob data from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `herd-report-${selectedHerd?.id}.xlsx`; // Set filename with extension

      // Trigger download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("There was an error downloading the report:", error);
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
                <p className="my-2">Cân nặng trung bình ban đầu:</p> <p className="my-2 ml-2 font-semibold"> {avgStatisticData.avgWeightInStart.toFixed(2)} kg</p>
              </div>
              <div className="flex items-center">
                <p className="my-2">Cân nặng trung bình cuối cùng:</p> <p className="my-2 ml-2 font-semibold"> {avgStatisticData.avgWeightInEnd.toFixed(2)} kg</p>
              </div>
              <Button color="primary" endContent={<FaFileDownload size={20} />} onPress={handleDownloadReport}>
                Tải xuống báo cáo
              </Button>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <div className="mb-2 flex items-center">
            <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
            <p className="text-2xl font-bold ml-4">Danh sách đàn</p>
          </div>
          <HerdList selectedHerd={selectedHerd} setSelectedHerd={setSelectedHerd} isEndHerd={isEndHerd} />
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
                      <Chip color={statusColorMap.find((item) => item.status === selectedHerd?.status)?.color as ChipProps["color"]} variant="flat">
                        {selectedHerd?.status}
                      </Chip>
                    </div>
                    <Divider orientation="horizontal" />
                    <div className="flex justify-between items-center">
                      <p className="my-2">Cân nặng trung bình:</p>
                      <p className="my-2 font-semibold">{selectedHerd?.averageWeight.toFixed(2) + " kg"}</p>
                    </div>
                    <Divider orientation="horizontal" />
                    <p className="my-2">Mô tả:</p>
                    <p className="my-2">{selectedHerd?.description}</p>
                    <div className="my-2 flex gap-2">
                      <Button color="primary" onPress={onOpenHerdDetail} endContent={<EyeIcon size={20} />}>
                        Xem chi tiết
                      </Button>
                      {selectedHerd?.status !== "Đã kết thúc" && (
                        <Button color="danger" onPress={onOpenEndHerd} endContent={<AiFillAlert size={20} />}>
                          Kết thúc đàn
                        </Button>
                      )}
                    </div>
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
        <p className="text-2xl font-bold mb-3">Danh sách heo</p>
        {selectedHerd ? (
          <PigList selectedHerd={selectedHerd as HerdInfo} setSelectedPig={setSelectedPig} onOpenDetail={onOpenDetail} />
        ) : (
          <p className="text-center">Chọn đàn để xem danh sách heo</p>
        )}
      </div>
      {isOpenHerdDetail && selectedHerd && <HerdDetail isOpen={isOpenHerdDetail} onClose={onCloseHerdDetail} herdInfo={selectedHerd} />}
      {isOpenDetail && selectedPig && <PigDetail isOpen={isOpenDetail} onClose={onCloseDetail} pigInfo={selectedPig} />}
      {isOpenEndHerd && selectedHerd && (
        <Modal isOpen={isOpenEndHerd} onClose={onCloseEndHerd} size="xl">
          <ModalContent>
            <ModalHeader>
              <p className="text-xl">Kết thúc đàn {selectedHerd?.code}</p>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">Bạn có chắc chắn muốn kết thúc đàn {selectedHerd?.code}?</p>
                <p className="text-md mt-3">Khi kết thúc đàn các thông tin tiêm phòng, điều trị, sức khỏe của heo sẽ kết thúc</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onCloseEndHerd}>
                Hủy
              </Button>
              <Button color="primary" onPress={handleEndHerd} isLoading={loading}>
                Xác nhận
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Herd;
