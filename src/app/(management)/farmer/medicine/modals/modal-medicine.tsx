import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button, Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import React from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "../api-request";
import {
  CreateMedicineRequest,
  UpdateMedicineRequest,
} from "../models/medicine";
const ModalMedicine = ({
  isOpen,
  onOpenChange,
  updateId,
  context,
  setSubmitDone,
}: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      mainIngredient: "",
      registerNumber: 0,
      netWeight: "",
      usage: "",
      unit: "",
    },
  });

  const [loading, setLoading] = React.useState<boolean | undefined>(false);

  React.useEffect(() => {
    getDataById();
  }, [updateId]);

  const getDataById = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.getMedicineById(updateId);
      if (response.isSuccess) {
        reset({
          name: response.data.name,
          mainIngredient: response.data.mainIngredient,
          registerNumber: response.data.registerNumber,
          netWeight: response.data.netWeight,
          usage: response.data.usage,
          unit: response.data.unit,
        });
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title:
          error instanceof AggregateError
            ? error.message
            : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (context) {
      case "create":
        return "Tạo mới";
      case "edit":
        return "Cập nhật";
      case "detail":
        return "Chi tiết";
    }
  };

  const handleSubmitForm = async (
    data: CreateMedicineRequest | UpdateMedicineRequest
  ) => {
    try {
      setLoading(true);
      const response =
        context === "create"
          ? await apiRequest.createMedicine(data)
          : await apiRequest.updateMedicine(updateId, data);
          console.log(response);
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: context === "create" ? 'Tạo thuốc thành công': 'Cập nhật thành công',
        });
        setSubmitDone(true);
      } else {
        throw new AggregateError(response.errorMessage);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title:
          error instanceof AggregateError
            ? error.message
            : "Lỗi hệ thống. Vui lòng thử lại sau!",
      });
    } finally {
      setLoading(false);
    }
  };

  const onClearForm = () => {
    reset({
      name: "",
      mainIngredient: "",
      registerNumber: 0,
      netWeight: "",
      usage: "",
      unit: "",
    });
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Modal
          backdrop="opaque"
          isOpen={isOpen}
          size="4xl"
          onOpenChange={onOpenChange}
          onClose={() => onClearForm()}
        >
          <ModalContent>
            {isOpen && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {getTitle()}
                  <Divider orientation="horizontal" />
                </ModalHeader>
                <form onSubmit={handleSubmit(handleSubmitForm)}>
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
                        isInvalid={errors.name ? true : false}
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
                        isInvalid={errors.unit ? true : false}
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
                        isInvalid={errors.netWeight ? true : false}
                        errorMessage="Trọng lượng không được để trống"
                        {...register("netWeight", { required: true })}
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
                        isInvalid={errors.registerNumber ? true : false}
                        errorMessage="Số đăng ký không được để trống"
                        {...register("registerNumber", { required: true })}
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
                        // isRequired
                        // isInvalid={errors.usage ? true : false}
                        // errorMessage="Cách sử dụng không được để trống"
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
                        // isRequired
                        // isInvalid={errors.mainIngredient ? true : false}
                        // errorMessage="Thành phần chính không được để trống"
                        {...register("mainIngredient", { required: true })}
                      />
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <div className="flex justify-end">
                      <Button
                        variant="solid"
                        color="primary"
                        isDisabled={errors && Object.keys(errors).length > 0}
                        isLoading={loading}
                        size="lg"
                        type="submit"
                      >
                        <p className="text-white">{getTitle()}</p>
                      </Button>
                    </div>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};
export default ModalMedicine;
