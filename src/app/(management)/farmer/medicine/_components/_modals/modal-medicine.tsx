import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button, Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateMedicineRequest, Medicine, UpdateMedicineRequest } from "@oursrc/lib/models/medicine";
import { medicineService } from "@oursrc/lib/services/medicineService";
const ModalMedicine = ({ isOpen, onClose, medicine, context }: { isOpen: boolean; onClose: () => void; medicine?: Medicine; context: "create" | "edit" | "delete" }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState<boolean | undefined>(false);
  const name = watch("name");
  const netWeight = watch("netWeight");
  const registerNumber = watch("registerNumber");
  const usage = watch("usage");
  const unit = watch("unit");
  const mainIngredient = watch("mainIngredient");

  const getTitle = () => {
    switch (context) {
      case "create":
        return "Tạo mới";
      case "edit":
        return "Cập nhật";
      case "delete":
        return "Xóa";
    }
  };

  const handleRegisterNumberChange = (event: string) => {
    let numericValue = event.replace(/[^0-9]/g, "");
    if (numericValue[0] === "-") {
      numericValue = numericValue.slice(1);
    }
    // if (parseInt(numericValue) > 10000) {
    //   numericValue = "10000";
    // }
    setValue("registerNumber", numericValue || "0");
  };

  const handleNetWeightChange = (event: string) => {
    let numericValue = event.replace(/[^0-9.]/g, "");
    if (numericValue[0] === "-" || numericValue[0] === "0") {
      numericValue = numericValue.slice(1);
    }
    if (parseInt(numericValue) > 10000) {
      numericValue = "10000";
    }
    setValue("netWeight", numericValue || "0");
  };

  const handleDeleteMedicine = async () => {
    try {
      setLoading(true);
      const response = await medicineService.deleteMedicine(medicine?.id || "");
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: response.data,
        });
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error instanceof AggregateError ? error.message : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    } finally {
      onClose();
      setLoading(false);
    }
  };

  const handleSubmitForm = async (data: any) => {
    try {
      setLoading(true);
      const response =
        context === "create"
          ? await medicineService.createMedicine(data)
          : context === "edit"
          ? await medicineService.updateMedicine(medicine?.id || "", data)
          : medicineService.deleteMedicine(medicine?.id || "");
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: context === "create" ? 'Tạo thuốc thành công': 'Cập nhật thành công',
        });
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error instanceof AggregateError ? error.message : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    } finally {
      onClose();
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setValue("name", medicine?.name ? medicine?.name : "");
    setValue("netWeight", medicine?.netWeight ? medicine?.netWeight : "");
    setValue("registerNumber", medicine?.registerNumber ? medicine?.registerNumber : "");
    setValue("usage", medicine?.usage ? medicine?.usage : "");
    setValue("unit", medicine?.unit ? medicine?.unit : "");
    setValue("mainIngredient", medicine?.mainIngredient ? medicine?.mainIngredient : "");
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Modal
          hideCloseButton
          backdrop="opaque"
          isOpen={isOpen}
          size="2xl"
          scrollBehavior="normal"
          onClose={() => {
            if (name || netWeight || registerNumber || usage || unit || mainIngredient) {
              onClose();
            }
          }}
        >
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            {context !== "delete" ? (
              <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                  {getTitle()}
                  <Divider orientation="horizontal" />
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Tên thuốc"
                      placeholder="Nhập tên thuốc"
                      labelPlacement="outside"
                      isRequired
                      value={name || ""}
                      isInvalid={errors.name ? true : name ? false : true}
                      errorMessage="Tên thuốc không được để trống"
                      {...register("name", { required: true })}
                    />
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Đơn vị"
                      placeholder="Nhập đơn vị"
                      labelPlacement="outside"
                      isRequired
                      value={unit || ""}
                      isInvalid={errors.unit ? true : unit ? false : true}
                      errorMessage="Đơn vị không được để trống"
                      {...register("unit", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Trọng lượng"
                      placeholder="Nhập trọng lượng"
                      labelPlacement="outside"
                      isRequired
                      value={netWeight || ""}
                      onValueChange={(event) => handleNetWeightChange(event)}
                      isInvalid={errors.netWeight ? true : netWeight ? false : true}
                      errorMessage="Trọng lượng không được để trống"
                      {...register("netWeight", { required: true, valueAsNumber: true })}
                    />
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Số đăng ký"
                      placeholder="Nhập số đăng ký"
                      labelPlacement="outside"
                      isRequired
                      value={registerNumber || ""}
                      onValueChange={(event) => handleRegisterNumberChange(event)}
                      isInvalid={errors.registerNumber ? true : registerNumber ? false : true}
                      errorMessage="Số đăng ký không được để trống"
                      {...register("registerNumber", { required: true, valueAsNumber: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Textarea
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Cách sử dụng"
                      placeholder="Nhập cách sử dụng"
                      labelPlacement="outside"
                      isRequired
                      value={usage || ""}
                      isInvalid={errors.usage ? true : usage ? false : true}
                      errorMessage="Cách sử dụng không được để trống"
                      {...register("usage", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Textarea
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Thành phần chính"
                      placeholder="Nhập thành phần chính"
                      labelPlacement="outside"
                      isRequired
                      value={mainIngredient || ""}
                      isInvalid={errors.mainIngredient ? true : mainIngredient ? false : true}
                      errorMessage="Thành phần chính không được để trống"
                      {...register("mainIngredient", { required: true })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    <p className="text-white">Hủy</p>
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    isDisabled={name && netWeight && registerNumber && usage && unit && mainIngredient ? false : true}
                    isLoading={loading}
                    type="submit"
                  >
                    <p className="text-white">{getTitle()}</p>
                  </Button>
                </ModalFooter>
              </ModalContent>
            ) : (
              <ModalContent>
                <ModalHeader>{getTitle()}</ModalHeader>
                <ModalBody>
                  <p className="text-center">
                    Bạn có chắc chắn muốn xóa chuồng <strong className="text-xl">{medicine?.id}</strong> không?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button color="primary" onPress={handleDeleteMedicine}>
                    Xóa
                  </Button>
                </ModalFooter>
              </ModalContent>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
export default ModalMedicine;
