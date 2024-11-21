import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button, Divider, Input, Spinner, Textarea } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { CommonDisease } from "@oursrc/lib/models/common-disease";
import { commonDiseasesService } from "@oursrc/lib/services/commonDiseaseService";
import React from "react";
import { useForm } from "react-hook-form";

const ModalCommonDisease = ({
  isOpen,
  onClose,
  data,
  context,
}: {
  isOpen: boolean;
  onClose: () => void;
  data?: CommonDisease;
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

  const title = watch("title");
  const description = watch("description");
  const symptom = watch("symptom");
  const treatment = watch("treatment");
  const diseaseType = watch("diseaseType");

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
      const response = await commonDiseasesService.delete(data?.id || "");
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

  const handleSubmitForm = async (request: any) => {
    try {
      setLoading(true);
      const response =
        context === "create"
          ? await commonDiseasesService.create(request)
          : context === "edit"
          ? await commonDiseasesService.update(data?.id || "", request)
          : commonDiseasesService.delete(data?.id || "");
      if (response && response.isSuccess) {
        toast({
          variant: "success",
          title: context === "create" ? "Tạo thành công" : "Cập nhật thành công",
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
    setValue("title", data?.title ? data?.title : "");
    setValue("description", data?.description ? data?.description : "");
    setValue("symptom", data?.symptom ? data?.symptom : "");
    setValue("treatment", data?.treatment ? data?.treatment : "");
    setValue("diseaseType", data?.diseaseType ? data?.diseaseType : "");
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
          size="4xl"
          scrollBehavior="inside"
          onClose={() => {
            if (title || description || symptom || treatment || diseaseType) {
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
                      value={title || ""}
                      isInvalid={errors.title ? true : title ? false : true}
                      errorMessage="Tiêu đề không được để trống"
                      {...register("title", { required: true })}
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
                      isInvalid={errors.diseaseType ? true : diseaseType ? false : true}
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
                      value={description || ""}
                      isInvalid={errors.description ? true : description ? false : true}
                      errorMessage="Mô tả không được để trống"
                      {...register("description", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Triệu chứng"
                      placeholder="Nhập triệu chứng"
                      labelPlacement="outside"
                      isRequired
                      value={symptom || ""}
                      isInvalid={errors.symptom ? true : symptom ? false : true}
                      errorMessage="Triệu chứng không được để trống"
                      {...register("symptom", { required: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1">
                    <Textarea
                      className="mb-5"
                      type="text"
                      radius="sm"
                      size="lg"
                      label="Cách chữa bệnh"
                      placeholder="Nhập cách chữa bệnh"
                      labelPlacement="outside"
                      isRequired
                      value={treatment || ""}
                      isInvalid={errors.treatment ? true : treatment ? false : true}
                      errorMessage="Cách chữa bệnh không được để trống"
                      {...register("treatment", { required: true })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    <p className="text-white">Hủy</p>
                  </Button>
                  <Button variant="solid" color="primary" isLoading={loading} type="submit">
                    <p className="text-white">{getTitle()}</p>
                  </Button>
                </ModalFooter>
              </ModalContent>
            ) : (
              <ModalContent>
                <ModalHeader>{getTitle()}</ModalHeader>
                <ModalBody>
                  <p className="text-center">
                    Bạn có chắc chắn muốn xóa <strong className="text-xl">{data?.title}</strong> không?
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
export default ModalCommonDisease;
