import React from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Skeleton, Textarea } from "@nextui-org/react";
import { IoMdPricetags } from "react-icons/io";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { useToast } from "@oursrc/hooks/use-toast";
import { useForm } from "react-hook-form";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { Cage } from "@oursrc/lib/models/cage";
import { pigService } from "@oursrc/lib/services/pigService";
import { cageService } from "@oursrc/lib/services/cageService";
import { Pig } from "@oursrc/lib/models/pig";
import { SensorData } from "./assign-tag";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";

const AssignInfo = ({
  isOpen,
  onClose,
  setAssignedPigs,
  pigInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  setAssignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  pigInfo: SensorData;
}) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  // const [pig, setPig] = React.useState<Pig>();
  // const [tag, setTag] = React.useState<string>(
  //   Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  // );
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isDoneAll, setIsDoneAll] = React.useState<boolean>(false);
  const [touched, setTouched] = React.useState(false);
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage>();
  // const [height, setHeight] = React.useState<string | undefined>();
  // const [width, setWidth] = React.useState<string | undefined>();
  // const [weight, setWeight] = React.useState<string | undefined>();
  // const [gender, setGender] = React.useState<string | undefined>(undefined);
  const weight = watch("weight");
  const height = watch("height");
  const width = watch("width");
  const gender = watch("gender");

  // console.log(pigInfo.Weight, pigInfo.Uid);

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

  const handleAssignPig = async (data: any) => {
    try {
      setLoading(true);
      const herdData: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "null");
      const pig = {
        ...data,
        herdId: herdData.id ?? "",
        cageId: selectedCage?.id ?? "",
        code: pigInfo.Uid ?? "",
        note: data.note ?? "",
      };
      const res: ResponseObject<any> = await pigService.assignPigToCage(pig);
      if (res && res.isSuccess) {
        onClose();
        setAssignedPigs(res.data);
        resetData();
        setIsDoneAll(true);
        toast({
          variant: "success",
          title: "Gán heo vào chuồng thành công",
        });
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCage = (cage: Cage) => {
    if (cage.availableQuantity && cage.availableQuantity >= cage.capacity) {
      return;
    }
    // check if a cage is already selected
    if (cage.id === selectedCage?.id) {
      setSelectedCage(undefined);
      return;
    }
    setSelectedCage(cage);
  };

  const getCages = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res && res.isSuccess) {
        setCages(res.data.data);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    reset();
    setSelectedCage(undefined);
  };

  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
    setValue("gender", gender || "");
  }, [height, width, weight]);

  React.useEffect(() => {
    if (isOpen === true) {
      getCages();
      // setTag(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
      // setWeight(pigInfo.Weight ? pigInfo.Weight.toString() : undefined);
      // setHeight(pigInfo.Height ? pigInfo.Height.toString() : undefined);
      // setWidth(pigInfo.Width ? pigInfo.Width.toString() : undefined);
      setValue("weight", pigInfo.Weight ? pigInfo.Weight.toString() : "");
      setValue("height", pigInfo.Height ? pigInfo.Height.toString() : "");
      setValue("width", pigInfo.Width ? pigInfo.Width.toString() : "");
    }
  }, [isOpen]);

  return (
    <div>
      <Modal size="3xl" isOpen={isOpen} onClose={() => onClose} hideCloseButton isDismissable={false} scrollBehavior="inside">
        <form onSubmit={handleSubmit(handleAssignPig)}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-2xl">Nhập thông tin heo</p>
            </ModalHeader>
            <ModalBody>
              <div className="mb-4 flex items-center">
                <IoMdPricetags className="text-primary" size={30} />
                {/* <p className="ml-2 text-lg">{tag}</p> */}
                <p className="ml-2 text-lg">{pigInfo.Uid}</p>
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
                <Select
                  className="w-1/2 ml-2"
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  size="lg"
                  radius="sm"
                  labelPlacement="outside"
                  selectionMode="single"
                  isInvalid={gender || !touched ? false : true}
                  errorMessage="Giới tính không được để trống"
                  // value={gender || ""}
                  // onChange={(e) => setGender(e.target.value)}
                  selectedKeys={gender ? new Set([gender.toString()]) : new Set()}
                  onSelectionChange={(e) => {
                    setValue("gender", e.anchorKey ? e.anchorKey.toString() : "");
                  }}
                  onClose={() => setTouched(true)}
                >
                  <SelectItem key="Đực">Đực</SelectItem>
                  <SelectItem key="Cái">Cái</SelectItem>
                </Select>
              </div>
              <div className="mb-5 flex">
                <Input
                  className="w-1/2 mr-2"
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
                  className="w-1/2 ml-2"
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
              </div>
              {/* <Textarea minRows={5} type="text" radius="sm" size="lg" label="Ghi chú" placeholder="Nhập ghi chú" labelPlacement="outside" {...register("note")} /> */}
              <p className="text-xl font-semibold">Danh sách chuồng</p>
              <div className="grid grid-cols-2">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="m-2 col-span-1 border-2 rounded-lg">
                        <Skeleton className="rounded-lg">
                          <div className="h-24 rounded-lg bg-default-300"></div>
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
                          Sức chứa: {cage.availableQuantity ?? 0}/{cage.capacity}
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
                Đóng
              </Button>
              <Button color="primary" type="submit" isDisabled={selectedCage && height && width && weight && gender && !isDoneAll ? false : true} isLoading={loading}>
                Lưu
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default AssignInfo;
