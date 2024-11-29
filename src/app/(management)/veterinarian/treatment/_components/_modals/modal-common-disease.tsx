import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button, Divider, Input, Select, SelectItem, Spinner, Textarea } from "@nextui-org/react";
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
  const [touched, setTouched] = React.useState(false);

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
      request.diseaseType = Number(diseaseType || 0) - 1 ?? "";
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
    setValue(
      "diseaseType",
      data?.diseaseType ? (data?.diseaseType === "Bệnh nhẹ" ? 1 : data?.diseaseType === "Bệnh thường" ? 2 : data?.diseaseType === "Bệnh nguy hiểm" ? 3 : 0) : 0
    );
  }, [data, setValue]);

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
            onClose();
          }}
          isDismissable={false}
        >
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
                      label="Tiêu đề"
                      placeholder="Nhập tiêu đề"
                      labelPlacement="outside"
                      isRequired
                      value={title || ""}
                      isInvalid={errors.title ? true : false}
                      errorMessage="Tiêu đề không được để trống"
                      {...register("title", { required: true })}
                    />
                    <Select
                      className="mb-5"
                      radius="sm"
                      size="lg"
                      label="Mức độ"
                      placeholder="Nhập mức độ"
                      labelPlacement="outside"
                      isRequired
                      isInvalid={diseaseType || !touched ? false : true}
                      errorMessage="Mức độ không được để trống"
                      selectionMode="single"
                      selectedKeys={diseaseType !== undefined ? new Set([diseaseType.toString()]) : new Set()}
                      onSelectionChange={(e) => {
                        setValue("diseaseType", e.anchorKey ? Number(e.anchorKey) : 0);
                      }}
                      onClose={() => setTouched(true)}
                    >
                      <SelectItem key={1} value={1}>
                        Bệnh nhẹ
                      </SelectItem>
                      <SelectItem key={2} value={2}>
                        Bệnh thường
                      </SelectItem>
                      <SelectItem key={3} value={3}>
                        Bệnh nguy hiểm
                      </SelectItem>
                    </Select>
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
                      isInvalid={errors.description ? true : false}
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
                      isInvalid={errors.symptom ? true : false}
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
                      isInvalid={errors.treatment ? true : false}
                      errorMessage="Cách chữa bệnh không được để trống"
                      {...register("treatment", { required: true })}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    <p className="text-white">Hủy</p>
                  </Button>
                  <Button variant="solid" color="primary" isLoading={loading} type="submit" isDisabled={Object.keys(errors).length > 0}>
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
