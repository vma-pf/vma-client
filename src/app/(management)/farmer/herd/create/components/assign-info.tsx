import React from "react";
import { Cage, Pig } from "./assign-tag";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IoMdPricetags } from "react-icons/io";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { useToast } from "@oursrc/hooks/use-toast";
import { apiRequest } from "../../api-request";

const AssignInfo = ({
  isOpen,
  onClose,
  selectedPig,
  setSelectedPig,
  setUnassignedPigs,
  setAssignedPigs,
  unassignedPigs,
  assignedPigs,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPig: Pig;
  setSelectedPig: React.Dispatch<React.SetStateAction<Pig | undefined>>;
  setUnassignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  setAssignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  unassignedPigs: Pig[];
  assignedPigs: Pig[];
}) => {
  const { toast } = useToast();
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [height, setHeight] = React.useState<string | undefined>();
  const [width, setWidth] = React.useState<string | undefined>();
  const [weight, setWeight] = React.useState<string | undefined>();

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

  const handleAssignPig = (pig: Pig) => {
    setUnassignedPigs(unassignedPigs.filter((p) => p.code !== pig.code));
    setAssignedPigs([...assignedPigs, pig]);
    setHeight(undefined);
    setWidth(undefined);
    setWeight(undefined);
  };
  const handleSelectCage = (cage: Cage) => {
    if (selectedPig.cage?.id === cage.id) {
      setSelectedPig({ ...selectedPig, cage: undefined });
    } else {
      if (cage.availableQuantity >= cage.capacity) {
        return;
      }
      setSelectedPig({ ...selectedPig, cage: cage });
    }
  };

  const generateTag = () => {
    const caCode = selectedPig?.cage?.id === undefined ? "0" : selectedPig.cage?.id.slice(-3);
    const tag = "HE" + selectedPig?.herdId?.slice(-3) + "-CA" + caCode + "-PI" + selectedPig?.code?.slice(-3);
    return tag;
  };

  const getCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await apiRequest.getCages(1, 500);
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
    }
  };

  React.useEffect(() => {
    setSelectedPig({
      ...selectedPig,
      height: Number(height) || 0,
      width: Number(width) || 0,
      weight: Number(weight) || 0,
    });
  }, [height, width, weight]);

  React.useEffect(() => {
    getCages();
  }, []);

  return (
    <div>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={() => {
          if (selectedPig.cage?.id && height && width, weight) {
            onClose;
          }
        }}
        hideCloseButton
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-2xl">Thông tin heo</p>
          </ModalHeader>
          <ModalBody>
            <p className="text-lg">Mã heo: {selectedPig?.code}</p>
            <div className="mb-4 flex items-center">
              <IoMdPricetags className="text-primary" size={30} />
              <p className="ml-2 text-lg">{generateTag()}</p>
            </div>
            <Input
              className="mb-5"
              type="text"
              radius="sm"
              size="lg"
              label="Cân nặng"
              placeholder="Nhập cân nặng"
              labelPlacement="outside"
              isRequired
              isInvalid={weight ? false : true}
              errorMessage="Cân nặng không được để trống"
              value={weight || ""}
              onValueChange={(e) => handleWeightChange(e)}
            />
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
                isInvalid={height ? false : true}
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
                isInvalid={width ? false : true}
                errorMessage="Chiều rộng không được để trống"
                value={width || ""}
                onValueChange={(e) => handleWidthChange(e)}
              />
            </div>
            <p className="text-xl font-semibold">Danh sách chuồng</p>
            <div className="grid grid-cols-2">
              {cages.map((cage) => (
                <div
                  className={`m-2 border-2 rounded-lg p-2 ${selectedPig?.cage?.id === cage.id ? "bg-primary" : ""
                    } ${cage.availableQuantity >= cage.capacity
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                    }`}
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
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={() => {
                handleAssignPig(selectedPig);
                onClose();
              }}
              isDisabled={selectedPig?.cage?.id && height && width && weight ? false : true}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AssignInfo;
