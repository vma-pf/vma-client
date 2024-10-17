import React from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button, Input, SelectItem, Textarea } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { IoMdPricetags } from "react-icons/io";
import { Pig } from "@oursrc/lib/models/pig";

const HealthCheckUp = ({ isOpen, onClose, pigInfo }: { isOpen: boolean; onClose: () => void; pigInfo: Pig }) => {
  const { register, handleSubmit, setValue } = useForm();
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

  const resetData = () => {
    setHeight(undefined);
    setWidth(undefined);
    setWeight(undefined);
  };

  const onSubmit = (data: any) => {
    console.log(data);
    onClose();
  };

  React.useEffect(() => {
    setValue("height", height || "");
    setValue("width", width || "");
    setValue("weight", weight || "");
  }, [height, width, weight]);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" hideCloseButton scrollBehavior="inside" isDismissable={false}>
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
                Close
              </Button>
              <Button color="primary" type="submit" isDisabled={height && width && weight ? false : true}>
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </div>
  );
};

export default HealthCheckUp;
