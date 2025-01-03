import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Autocomplete, AutocompleteItem, Button, Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateMedicineRequest, Medicine, UpdateMedicineRequest } from "@oursrc/lib/models/medicine";
import { medicineService } from "@oursrc/lib/services/medicineService";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
const ModalMedicine = ({ isOpen, onClose, medicine, context }: { isOpen: boolean; onClose: () => void; medicine?: Medicine; context: "create" | "edit" | "delete" }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [isDoneAll, setIsDoneAll] = React.useState(false);
  const name = watch("name");
  const netWeight = watch("netWeight");
  const usage = watch("usage");
  const unit = watch("unit");
  const mainIngredient = watch("mainIngredient");

  const storedMedicine = localStorage.getItem("newMedicine") ? JSON.parse(localStorage.getItem("newMedicine") || "") : "";

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

  const unitOptions = [
    { label: "g", value: "g" },
    { label: "mg", value: "mg" },
    { label: "l", value: "l" },
    { label: "ml", value: "ml" },
  ];


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
      const response: ResponseObject<Medicine> =
        context === "create"
          ? await medicineService.createMedicine(data)
          : context === "edit"
          ? await medicineService.updateMedicine(medicine?.id || "", data)
          : medicineService.deleteMedicine(medicine?.id || "");
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: context === "create" ? "Tạo thuốc thành công" : "Cập nhật thành công",
        });
        // Call api to mark purchase medicine
        if (context === "create") {
          const res: ResponseObject<any> = await medicineRequestService.markPurchaseMedicine(storedMedicine.requestId, response.data.id ?? "");
          console.log(res);
        }
        setIsDoneAll(true);
        onClose();
      } else {
        console.log(response.errorMessage);
        toast({
          variant: "destructive",
          title: context === "create" ? "Tạo thuốc thất bại" : "Cập nhật thất bại",
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setValue("name", medicine?.name ? medicine?.name : storedMedicine.newMedicineName);
    setValue("netWeight", medicine?.netWeight ? medicine?.netWeight : "");
    setValue("usage", medicine?.usage ? medicine?.usage : "");
    setValue("unit", medicine?.unit ? medicine?.unit : "");
    setValue("mainIngredient", medicine?.mainIngredient ? medicine?.mainIngredient : "");
  }, [medicine, setValue]);

  return (
    <div>
      <Modal isDismissable={false} backdrop="opaque" isOpen={isOpen} size="3xl" scrollBehavior="inside" onClose={onClose}>
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
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
                    isInvalid={errors.name ? true : false}
                    errorMessage="Tên thuốc không được để trống"
                    {...register("name", { required: true })}
                  />
                  <Autocomplete
                    className="mb-5"
                    radius="sm"
                    size="lg"
                    label="Đơn vị"
                    placeholder="Nhập đơn vị"
                    labelPlacement="outside"
                    isInvalid={errors.unit ? true : false}
                    defaultItems={unitOptions}
                    selectedKey={unit || ""}
                    onSelectionChange={(item) => {
                      setValue("unit", item?.toString() || "");
                    }}
                    errorMessage="Đơn vị không được để trống"
                    // {...register("breed", {
                    //   required: true,
                    // })}
                  >
                    {(item) => (
                      <AutocompleteItem color="primary" key={item.value}>
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
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
                    isInvalid={errors.netWeight ? true : false}
                    errorMessage="Trọng lượng không được để trống"
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
                    isInvalid={errors.usage ? true : false}
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
                    isInvalid={errors.mainIngredient ? true : false}
                    errorMessage="Thành phần chính không được để trống"
                    {...register("mainIngredient", { required: true })}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  <p className="text-white">Hủy</p>
                </Button>
                <Button variant="solid" color="primary" isDisabled={Object.keys(errors).length > 0 || isDoneAll} isLoading={loading} type="submit">
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
    </div>
  );
};
export default ModalMedicine;
