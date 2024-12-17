"use client";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Skeleton } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { monitorDevelopmentLogService } from "@oursrc/lib/services/monitorDevelopmentLogService";
import React from "react";
import { useForm } from "react-hook-form";
import { IoMdPricetags } from "react-icons/io";
import { motion } from "framer-motion";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { SERVERURL } from "@oursrc/lib/http";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";
import { SensorData } from "../create/_components/assign-tag";

const MonitorDevelopment = ({ isOpen, onOpen, onClose, pigList }: { isOpen: boolean; onOpen: () => void; onClose: () => void; pigList: Pig[] }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const { toast } = useToast();
  const [selectedPig, setSelectedPig] = React.useState<Pig | undefined>();
  const [isOpenChooseCage, setIsOpenChooseCage] = React.useState(false);
  const width = watch("width");
  const height = watch("height");
  const weight = watch("weight");
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDoneAll, setIsDoneAll] = React.useState(false);

  const handleHeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("height", numericValue || "0");
  };
  const handleWidthChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("width", numericValue || "0");
  };
  const handleWeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("weight", numericValue || "0");
  };
  const handleSelectCage = (cage: Cage) => {
    if (cage.availableQuantity !== undefined && cage.availableQuantity < cage.capacity) {
      if (cage.id !== selectedCage?.id) {
        setSelectedCage(cage);
      } else {
        setSelectedCage(undefined);
      }
    }
  };
  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res: ResponseObject<any> = await monitorDevelopmentLogService.createMonitoringLog({
        pigId: selectedPig?.id ?? "",
        weight: Number(weight || ""),
        height: Number(height || ""),
        width: Number(width || ""),
        note: data.note,
        status: 0,
      });
      if (res.isSuccess) {
        setIsDoneAll(true);
        reset();
        onClose();
        toast({
          title: "Kiểm tra sức khỏe thành công",
          variant: "success",
        });
      } else {
        toast({
          title: res.errorMessage || "Kiểm tra sức khỏe thất bại",
          variant: "destructive",
        });
      }
      if (selectedCage && (selectedPig?.cageId !== selectedCage?.id) === true) {
        const response: ResponseObject<any> = await cageService.assignPigToCage(selectedCage?.id ?? "", selectedPig?.id ?? "");
        if (response.isSuccess) {
          setIsDoneAll(true);
          console.log("Chuyển chuồng thành công");
        } else {
          console.log(response.errorMessage);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCages = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data);
        setSelectedCage(res.data.data.find((cage) => cage.id === selectedPig?.cageId ?? "") || undefined);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
  }, [height, width, weight]);
  React.useEffect(() => {
    // fetchCages();
    const accessToken = localStorage.getItem("accessToken")?.toString();
    const connect = new HubConnectionBuilder()
      .withUrl(`${SERVERURL}/hubs/create-herd-sensor-hub`, {
        // send access token here
        accessTokenFactory: () => accessToken || "",
      })
      .withAutomaticReconnect()
      .withHubProtocol(
        new MessagePackHubProtocol({
          // encoder: encode,
        })
      )
      .configureLogging(LogLevel.Information)
      .build();
    connect
      .start()
      .then(() => {
        console.log("Connected to Sensor Hub");
        connect.on("ConsumeSensorData", (data: SensorData) => {
          console.log(data);
          setValue("height", data.Height || "");
          setValue("width", data.Width || "");
          setValue("weight", data.Weight || "");
          setSelectedPig(pigList.find((pig) => pig.pigCode === data.Uid));
        });
      })

      .catch((err) => console.error("Error while connecting to SignalR Hub:", err));

    return () => {
      connect.stop().then(() => {
        console.log("Disconnected from Sensor Hub");
      });
      // const cleanup = async () => {
      //   if (connect.state !== "Disconnected") {
      //     console.log("Disconnecting from Sensor Hub");
      //     await connect.stop().then(() => {
      //       console.log("Disconnected from Sensor Hub");
      //     });
      //   }
      // };
      // cleanup();
    };
  }, []);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isDismissable={false} scrollBehavior="inside">
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
            <p className="text-xl font-semibold">Thông tin sức khỏe</p>
          </ModalHeader>
          <ModalBody>
            <div>
              <div className="mb-3">
                <Select
                  className="w-full"
                  radius="sm"
                  size="lg"
                  label="Mã heo"
                  placeholder="Chọn mã heo"
                  labelPlacement="outside"
                  isRequired
                  // value={selectedPig?.pigCode || ""}
                  // isInvalid={roleName || !touched ? false : true}
                  // errorMessage="Vai trò không được để trống"
                  disallowEmptySelection
                  items={pigList}
                  selectionMode="single"
                  selectedKeys={selectedPig ? new Set([selectedPig?.id]) : new Set()}
                  onSelectionChange={(e) => {
                    // const selectedKey = Array.from(e)[0]?.toString();
                    setSelectedPig(pigList.find((pig) => pig.id === e.anchorKey));
                  }}
                >
                  {(item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.pigCode}
                    </SelectItem>
                  )}
                </Select>
              </div>
              <Input
                className="mb-3"
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
                className="mb-3"
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
              <Input
                className="mb-3"
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
              <Input
                type="text"
                radius="sm"
                size="lg"
                label="Ghi chú"
                placeholder="Nhập ghi chú"
                labelPlacement="outside"
                isRequired
                isInvalid={errors.note ? true : false}
                errorMessage="Ghi chú không được để trống"
                {...register("note", { required: true })}
              />
              <div className="my-3">
                <Button
                  color="primary"
                  onClick={() => {
                    setIsOpenChooseCage(!isOpenChooseCage);
                    fetchCages();
                  }}
                  className="mt-2"
                  isDisabled={selectedPig ? false : true}
                >
                  Đổi chuồng
                </Button>
              </div>
              {isOpenChooseCage && selectedPig && (
                <div>
                  <p className="text-xl mt-2 font-semibold">Danh sách chuồng</p>
                  <div className="my-2 grid grid-cols-3">
                    {isLoading
                      ? [...Array(3)].map((_, idx) => (
                          <div key={idx} className="m-2 border-2 rounded-lg">
                            <Skeleton className="rounded-lg">
                              <div className="h-20"></div>
                            </Skeleton>
                          </div>
                        ))
                      : cages.map((cage) => (
                          <div
                            className={`m-2 border-2 rounded-lg p-2 ${
                              cage.availableQuantity && cage.availableQuantity >= cage.capacity ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
                            } ${selectedCage?.id === cage.id ? "bg-emerald-200" : ""}`}
                            key={cage.id}
                            onClick={() => handleSelectCage(cage)}
                          >
                            <p className="text-lg">Chuồng: {cage.code}</p>
                            <p className="text-lg">
                              Sức chứa: {cage.availableQuantity}/{cage.capacity}
                            </p>
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit" isDisabled={height && width && weight && !errors.note && !isDoneAll ? false : true} isLoading={loading}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default MonitorDevelopment;
