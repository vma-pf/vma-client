import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button, Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { TreatmentGuide } from "@oursrc/lib/models/treatment-guide";
import { treatmentService } from "@oursrc/lib/services/treatmentGuideService";
import React from "react";
import { useForm } from "react-hook-form";

const ModalTreamentGuide = ({
  isOpen,
  onClose,
  data,
  context,
}: {
  isOpen: boolean;
  onClose: () => void;
  data?: TreatmentGuide;
  context: "create" | "edit" | "delete";
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = React.useState<boolean | undefined>(false);

  const diseaseTitle = watch("diseaseTitle");
  const diseaseDescription = watch("diseaseDescription");
  const diseaseSymptoms = watch("diseaseSymptoms");
  const treatmentTitle = watch("treatmentTitle");
  const treatmentDescription = watch("treatmentDescription");
  const diseaseType = watch("diseaseType");
  const cure = watch("cure");

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

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await treatmentService.delete(data?.id || "");
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
        title:
          error instanceof AggregateError
            ? error.message
            : "Lỗi hệ thống. Vui lòng thử lại sau!",
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
          ? await treatmentService.create(data)
          : context === "edit"
          ? await treatmentService.update(data?.id || "", data)
          : treatmentService.delete(data?.id || "");
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title:
            context === "create"
              ? "Tạo thuốc thành công"
              : "Cập nhật thành công",
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: response.errorMessage,
        });
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setValue("diseaseTitle", data?.diseaseTitle ? data?.diseaseTitle : "");
    setValue(
      "diseaseDescription",
      data?.diseaseDescription ? data?.diseaseDescription : ""
    );
    setValue(
      "diseaseSymptoms",
      data?.diseaseSymptoms ? data?.diseaseSymptoms : ""
    );
    setValue(
      "treatmentTitle",
      data?.treatmentTitle ? data?.treatmentTitle : ""
    );
    setValue(
      "treatmentDescription",
      data?.treatmentDescription ? data?.treatmentDescription : ""
    );
    setValue("diseaseType", data?.diseaseType ? data?.diseaseType : "");
    setValue("cure", data?.cure ? data?.cure : "");
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
            if (
              diseaseTitle ||
              diseaseDescription ||
              diseaseSymptoms ||
              treatmentTitle ||
              treatmentDescription ||
              diseaseType
            ) {
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
                      label="Tiêu đề"
                      placeholder="Nhập tiêu đề"
                      labelPlacement="outside"
                      isRequired
                      value={treatmentTitle || ""}
                      isInvalid={
                        errors.treatmentTitle
                          ? true
                          : treatmentTitle
                          ? false
                          : true
                      }
                      errorMessage="Tiêu đề không được để trống"
                      {...register("treatmentTitle", { required: true })}
                    />
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Mức độ"
                      placeholder="Nhập mức độ"
                      labelPlacement="outside"
                      isRequired
                      value={diseaseType || ""}
                      isInvalid={
                        errors.diseaseType ? true : diseaseType ? false : true
                      }
                      errorMessage="Mức độ không được để trống"
                      {...register("diseaseType", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <Textarea
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Mô tả ngắn"
                      placeholder="Nhập mô tả ngắn"
                      labelPlacement="outside"
                      isRequired
                      value={treatmentDescription || ""}
                      isInvalid={
                        errors.treatmentDescription
                          ? true
                          : treatmentDescription
                          ? false
                          : true
                      }
                      errorMessage="Mô tả không được để trống"
                      {...register("treatmentDescription", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Tên bệnh"
                      placeholder="Nhập tên bệnh"
                      labelPlacement="outside"
                      isRequired
                      value={diseaseTitle || ""}
                      isInvalid={
                        errors.diseaseTitle ? true : diseaseTitle ? false : true
                      }
                      errorMessage="Tên bệnh không được để trống"
                      {...register("diseaseTitle", { required: true })}
                    />
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Triệu chứng"
                      placeholder="Nhập triệu chứng"
                      labelPlacement="outside"
                      isRequired
                      value={diseaseSymptoms || ""}
                      isInvalid={
                        errors.diseaseSymptoms
                          ? true
                          : diseaseSymptoms
                          ? false
                          : true
                      }
                      errorMessage="Triệu chứng không được để trống"
                      {...register("diseaseSymptoms", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <Textarea
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Mô tả bệnh"
                      placeholder="Nhập mô tả bệnh"
                      labelPlacement="outside"
                      isRequired
                      value={diseaseDescription || ""}
                      isInvalid={
                        errors.diseaseDescription
                          ? true
                          : diseaseDescription
                          ? false
                          : true
                      }
                      errorMessage="Mô tả bệnh không được để trống"
                      {...register("diseaseDescription", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Textarea
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Hướng dẫn chữa bệnh"
                      placeholder="Hướng dẫn chữa bệnh"
                      labelPlacement="outside"
                      isRequired
                      value={cure || ""}
                      isInvalid={errors.cure ? true : cure ? false : true}
                      errorMessage="Hướng dẫn chữa bệnh không được để trống"
                      {...register("cure", { required: true })}
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
                    Bạn có chắc chắn muốn xóa{" "}
                    <strong className="text-xl">{data?.diseaseTitle}</strong>{" "}
                    không?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button color="primary" onPress={handleDelete}>
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
export default ModalTreamentGuide;
