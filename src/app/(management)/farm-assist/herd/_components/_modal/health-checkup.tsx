import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button, Input, SelectItem, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { IoMdPricetags } from "react-icons/io";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { monitorDevelopmentLogService } from "@oursrc/lib/services/monitorDevelopmentLogService";
import { toast } from "@oursrc/hooks/use-toast";
import { Cage } from "@oursrc/lib/models/cage";
import { cageService } from "@oursrc/lib/services/cageService";

const HealthCheckUp = ({ isOpen, onClose, pigInfo }: { isOpen: boolean; onClose: () => void; pigInfo: Pig }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [height, setHeight] = React.useState<string | undefined>();
  const [width, setWidth] = React.useState<string | undefined>();
  const [weight, setWeight] = React.useState<string | undefined>();
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | undefined>();

  const handleHeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setHeight(numericValue);
  };

  const handleWidthChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setWidth(numericValue);
  };

  const handleWeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseFloat(numericValue) > 10000) {
      numericValue = "10000";
    }
    setWeight(numericValue);
  };

  const resetData = () => {
    setHeight(undefined);
    setWidth(undefined);
    setWeight(undefined);
  };

  const handleSelectCage = (cage: Cage) => {
    if (cage.availableQuantity && cage.availableQuantity < cage.capacity) {
      if (cage.id !== selectedCage?.id) {
        setSelectedCage(cage);
      } else {
        setSelectedCage(undefined);
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const res: ResponseObject<any> = await monitorDevelopmentLogService.createMonitoringLog({
        pigId: pigInfo.id,
        cageId: selectedCage?.id ?? pigInfo.cageId,
        weight: Number(weight || ""),
        height: Number(height || ""),
        width: Number(width || ""),
        note: data.note,
        status: 0,
      });
      if (res.isSuccess) {
        resetData();
        onClose();
      } else {
        toast({
          title: res.errorMessage || "Nhập thông tin không thành công",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data);
        setSelectedCage(res.data.data.find((cage) => cage.id === pigInfo.cageId) || undefined);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
  }, [height, width, weight]);

  React.useEffect(() => {
    fetchCages();
  }, []);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" hideCloseButton scrollBehavior="inside" isDismissable={false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>
              <p className="text-2xl font-bold">Thông tin sức khỏe của heo {pigInfo?.pigCode}</p>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4 flex items-center">
                <IoMdPricetags className="text-primary" size={30} />
                <p className="ml-2 text-lg">{pigInfo?.pigCode}</p>
              </div>
              <p className="text-lg font-semibold mb-2">Giống: {pigInfo?.breed}</p>
              <Input
                type="text"
                radius="sm"
                size="lg"
                label="Cân nặng"
                placeholder="Nhập cân nặng"
                labelPlacement="outside"
                isRequired
                endContent="kg"
                isInvalid={weight ? false : true}
                errorMessage="Cân nặng không được để trống"
                value={weight || ""}
                onValueChange={(e) => handleWeightChange(e)}
              />
              <Input
                type="text"
                radius="sm"
                size="lg"
                label="Chiều cao"
                placeholder="Nhập chiều cao"
                labelPlacement="outside"
                isRequired
                endContent="cm"
                isInvalid={height ? false : true}
                errorMessage="Chiều cao không được để trống"
                value={height || ""}
                onValueChange={(e) => handleHeightChange(e)}
              />
              <Input
                type="text"
                radius="sm"
                size="lg"
                label="Chiều rộng"
                placeholder="Nhập chiều rộng"
                labelPlacement="outside"
                isRequired
                endContent="cm"
                isInvalid={width ? false : true}
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
              <p className="text-xl font-semibold">Danh sách chuồng</p>
              <div className="grid grid-cols-2">
                {cages.map((cage) => (
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
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  resetData();
                  onClose();
                }}
              >
                Hủy
              </Button>
              <Button color="primary" type="submit" isDisabled={height && width && weight && !errors.note && selectedCage ? false : true}>
                Lưu
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default HealthCheckUp;
