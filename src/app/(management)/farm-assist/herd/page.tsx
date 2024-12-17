"use client";
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  ChipProps,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useState } from "react";
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
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { herdService } from "@oursrc/lib/services/herdService";
import HerdDetail from "@oursrc/components/herds/modals/herd-detail";
import { EyeIcon } from "lucide-react";
import { calculateProgress } from "@oursrc/lib/utils/dev-utils";
import { EndHerdStatistic, HerdStatistic } from "@oursrc/lib/models/statistic";
import { AvgStatistic } from "./_components/avg-statistic";
import { LuFileBarChart } from "react-icons/lu";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { useToast } from "@oursrc/hooks/use-toast";
import { TbReportSearch } from "react-icons/tb";
import { FaFileDownload } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { SERVERURL } from "@oursrc/lib/http";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { monitorDevelopmentLogService } from "@oursrc/lib/services/monitorDevelopmentLogService";
import { pigService } from "@oursrc/lib/services/pigService";

const statusColorMap = [
  { status: "Chưa kết thúc", color: "warning" },
  { status: "Đã kết thúc", color: "primary" },
];

export type SensorData = {
  Uid: string;
  Weight: number;
  Height?: number | null;
  Width?: number | null;
};

const Herd = () => {
  const { toast } = useToast();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [isEndHerd, setIsEndHerd] = React.useState(false);
  const { isOpen: isOpenHerdDetail, onOpen: onOpenHerdDetail, onClose: onCloseHerdDetail } = useDisclosure();
  const { isOpen: isOpenPigDetail, onOpen: onOpenPigDetail, onClose: onClosePigDetail } = useDisclosure();
  const { isOpen: isOpenChangeCage, onOpen: onOpenChangeCage, onClose: onCloseChangeCage } = useDisclosure();
  const { isOpen: isOpenCheckup, onOpen: onOpenCheckup, onClose: onCloseCheckup } = useDisclosure();
  const { isOpen: isOpenEndHerd, onOpen: onOpenEndHerd, onClose: onCloseEndHerd } = useDisclosure();
  // const [isOpen, setIsOpen] = React.useState(false);
  const [selectedHerd, setSelectedHerd] = React.useState<HerdInfo>();
  const [selectedPig, setSelectedPig] = React.useState<Pig | undefined>();
  // const [pigList, setPigList] = React.useState<Pig[]>([]);
  const [statisticData, setStatisticData] = React.useState<HerdStatistic | undefined>();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [pigInfo, setPigInfo] = React.useState<SensorData | undefined>(undefined);
  const [pigOptions, setPigOptions] = React.useState<Pig[]>([]);
  const [isPigLoading, setIsPigLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const weight = watch("weight");
  const height = watch("height");
  const width = watch("width");
  const pigCode = watch("pigCode");
  const note = watch("note");

  const handleHeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("height", numericValue);
  };

  const handleWidthChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("width", numericValue);
  };

  const handleWeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("weight", numericValue);
  };

  const getStatistics = async () => {
    try {
      const res: ResponseObject<HerdStatistic> = await herdService.getHerdStatistics(selectedHerd?.id ?? "");
      if (res.isSuccess) {
        setStatisticData(res.data);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchPigList = async () => {
  //   try {
  //     const res: ResponseObjectList<Pig> = await pigService.getPigsByHerdId(selectedHerd?.id ?? "", 1, 9999);
  //     if (res.isSuccess) {
  //       setPigList(res.data.);
  //     } else {
  //       console.log(res.errorMessage);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleEndHerd = async () => {
    try {
      setLoading(true);
      const res: ResponseObject<any> = await herdService.endHerd(selectedHerd?.id ?? "");
      if (res.isSuccess) {
        setIsEndHerd(true);
        onCloseEndHerd();
        setSelectedHerd(undefined);
        setStatisticData(undefined);
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

  const fetchPigs = async () => {
    try {
      setIsPigLoading(true);
      const response = await pigService.getPigsByHerdId(selectedHerd?.id ?? "", 1, 100); // Adjust page size as needed
      if (response.isSuccess) {
        setPigOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching pigs:", error);
    } finally {
      setIsPigLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedHerd?.id) {
      fetchPigs();
    }
  }, [selectedHerd]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const pigs = await pigService.getPigsBySearch(1, 500, `pigCode(${pigCode})`, "");
      const res: ResponseObject<any> = await monitorDevelopmentLogService.createMonitoringLog({
        pigId: pigs.data.data[0].id,
        weight: Number(weight || ""),
        height: Number(height || ""),
        width: Number(width || ""),
        note: data.note,
        status: 0,
      });
      if (res.isSuccess) {
        toast({
          title: res.errorMessage || "Cập nhật thành công",
          variant: "success",
        });
        // onCloseEndHerd()\
        setValue("weight", "");
        setValue("height", "");
        setValue("width", "");
        setValue("pigCode", "");
        setValue("note", "");
      } else {
        toast({
          title: res.errorMessage || "Nhập thông tin không thành công",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
  }, [height, width, weight]);

  React.useEffect(() => {
    if (!selectedHerd) {
      setPigOptions([]);
      setStatisticData(undefined);
    } else {
      getStatistics();
    }
  }, [selectedHerd]);
  return (
    <div>
      {/* <Sheet open={isOpen} onOpenChange={setIsOpen}> */}
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
          <div className="mb-2 flex items-center justify-between">
            <p className="text-2xl font-bold mb-3">Danh sách heo</p>
            {/* <SheetTrigger asChild> */}
            {selectedHerd && (
              <Button color="primary" onClick={() => onOpenCheckup()}>
                Kiểm tra sức khỏe
              </Button>
            )}
            {/* </SheetTrigger> */}
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
        {isOpenEndHerd && selectedHerd && (
          <Modal isOpen={isOpenEndHerd} onClose={onCloseEndHerd} size="xl">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            >
              <ModalContent>
                <ModalHeader>
                  <p className="text-xl">Kết thúc đàn {selectedHerd?.code}</p>
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-semibold">Bạn có chắc chắn muốn kết thúc đàn {selectedHerd?.code}?</p>
                    <p className="text-sm mt-3">Khi kết thúc đàn các thông tin tiêm phòng, điều trị, sức khỏe của heo sẽ kết thúc</p>
                  </div>
                  <hr />
                  <p className="text-lg font-semibold">Cập nhật thông tin tăng trưởng lần cuối</p>
                  <div className="mb-5">
                    <Select
                      className="w-full"
                      items={pigOptions}
                      label="Mã heo"
                      placeholder="Chọn mã heo"
                      labelPlacement="outside"
                      isRequired
                      isLoading={isPigLoading}
                      selectedKeys={pigCode ? new Set([pigCode]) : new Set()}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0]?.toString();
                        setValue("pigCode", selectedKey || "");
                      }}
                    >
                      {(pig) => (
                        <SelectItem key={pig.pigCode} value={pig.pigCode} textValue={pig.pigCode}>
                          {pig.pigCode.length > 5 ? pig.pigCode.substring(0, 5) + "..." : pig.pigCode} (Cân nặng: {pig.weight}, Chiều cao: {pig.height}, Chiều rộng:{" "}
                          {pig.width})
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <div className="mb-5 flex">
                    <Input
                      className="w-1/2 mr-2"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Cân nặng"
                      placeholder="Nhập cân nặng"
                      labelPlacement="outside"
                      isRequired
                      endContent="kg"
                      isInvalid={errors.weight ? true : false}
                      errorMessage="Cân nặng không được để trống"
                      value={weight || ""}
                      onValueChange={(e) => handleWeightChange(e)}
                    />
                    <Input
                      className="w-1/2"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Chiều cao"
                      placeholder="Nhập chiều cao"
                      labelPlacement="outside"
                      isRequired
                      endContent="cm"
                      isInvalid={errors.height ? true : false}
                      errorMessage="Chiều cao không được để trống"
                      value={height || ""}
                      onValueChange={(e) => handleHeightChange(e)}
                    />
                  </div>
                  <div className="mb-5 flex">
                    <Input
                      className="w-1/2"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Chiều rộng"
                      placeholder="Nhập chiều rộng"
                      labelPlacement="outside"
                      isRequired
                      endContent="cm"
                      isInvalid={errors.width ? true : false}
                      errorMessage="Chiều rộng không được để trống"
                      value={width || ""}
                      onValueChange={(e) => handleWidthChange(e)}
                    />
                    <Textarea
                      className="w-1/2 ml-2"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Ghi chú"
                      placeholder="Nhập ghi chú"
                      labelPlacement="outside"
                      isRequired
                      isInvalid={errors.note ? true : false}
                      errorMessage="Ghi chú không được để trống"
                      value={note || ""}
                      {...register("note", { required: true })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Cập nhật thông tin
                  </Button>
                  <Button color="danger" onPress={handleEndHerd} isLoading={loading}>
                    Kết thúc đàn
                  </Button>
                </ModalFooter>
              </ModalContent>
            </form>
          </Modal>
        )}
        {isOpenCheckup && <MonitorDevelopment isOpen={isOpenCheckup} onOpen={onOpenCheckup} onClose={onCloseCheckup} pigList={pigOptions} />}
      </div>
      {/* <SheetContent className="w-11/12 overflow-auto">
          <SheetHeader>
            <SheetTitle>
              <p className="text-2xl font-bold">Thông tin sức khỏe</p>
            </SheetTitle>
          </SheetHeader>
          <div>{pigOptions && <MonitorDevelopment setIsOpen={setIsOpen} pigList={pigOptions} />}</div>
        </SheetContent> */}
      {/* </Sheet> */}
    </div>
  );
};

export default Herd;
