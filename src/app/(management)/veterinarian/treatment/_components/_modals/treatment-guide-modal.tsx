import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/modal";
import { Button, Card, CardBody, Divider, Input, Skeleton, Spinner, Textarea } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { CommonDisease } from "@oursrc/lib/models/common-disease";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { TreatmentGuide } from "@oursrc/lib/models/treatment-guide";
import { commonDiseasesService } from "@oursrc/lib/services/commonDiseaseService";
import { treatmentGuideService } from "@oursrc/lib/services/treatmentGuideService";
import { dateTimeConverter } from "@oursrc/lib/utils";
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
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [commonDiseases, setCommonDiseases] = React.useState<CommonDisease[]>([]);
  const [selectedCommonDisease, setSelectedCommonDisease] = React.useState<CommonDisease | null>(null);

  const title = watch("title");
  const description = watch("description");
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

  const fetchCommonDiseases = async () => {
    try {
      setIsLoading(true);
      const res: ResponseObjectList<CommonDisease> = await commonDiseasesService.getByPagination(1, 1000);
      if (res.isSuccess) {
        setCommonDiseases(res.data.data);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await treatmentGuideService.delete(data?.id || "");
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
      const payload = {
        title: request.title,
        description: request.description,
        cure: request.cure,
        commonDiseaseId: selectedCommonDisease?.id || "",
      };
      const response =
        context === "create"
          ? await treatmentGuideService.create(payload)
          : context === "edit"
          ? await treatmentGuideService.update(data?.id || "", payload)
          : treatmentGuideService.delete(data?.id || "");
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
    setValue("title", data?.treatmentTitle ?? "");
    setValue("description", data?.treatmentDescription ?? "");
    setValue("cure", data?.cure ?? "");
  }, [data, setValue]);

  React.useEffect(() => {
    fetchCommonDiseases();
  }, []);
  return (
    <Modal hideCloseButton backdrop="opaque" isOpen={isOpen} size={context === "delete" ? "lg" : "4xl"} scrollBehavior="inside" onClose={() => onClose()}>
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
              <p className="text-xl font-semibold">{getTitle() + " hướng dẫn điều trị"}</p>
              <Divider orientation="horizontal" />
            </ModalHeader>
            <ModalBody>
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
              <div className="grid grid-cols-2 gap-3">
                <Textarea
                  className="mb-5"
                  type="text"
                  radius="sm"
                  size="lg"
                  label="Mô tả bệnh"
                  placeholder="Nhập mô tả bệnh"
                  labelPlacement="outside"
                  isRequired
                  value={description || ""}
                  isInvalid={errors.description ? true : false}
                  errorMessage="Mô tả bệnh không được để trống"
                  {...register("description", { required: true })}
                />
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
                  isInvalid={errors.cure ? true : false}
                  errorMessage="Hướng dẫn chữa bệnh không được để trống"
                  {...register("cure", { required: true })}
                />
              </div>
              <p className="text-lg font-semibold">Danh sách bệnh thường gặp</p>
              <div className="grid grid-cols-3 gap-3">
                {isLoading ? (
                  [...Array(9)].map((_, idx) => (
                    <div key={idx} className="m-2 border-2 rounded-lg">
                      <Skeleton className="rounded-lg">
                        <div className="h-36 w-full"></div>
                      </Skeleton>
                    </div>
                  ))
                ) : commonDiseases.length > 0 ? (
                  commonDiseases.map((x) => (
                    <Card
                      key={x.id}
                      isPressable
                      onPress={() => setSelectedCommonDisease(x)}
                      classNames={{
                        base: selectedCommonDisease?.id === x.id ? "bg-emerald-100" : "",
                      }}
                    >
                      <CardBody>
                        <p className="text-lg font-semibold">{x.title}</p>
                        <Divider className="my-3" orientation="horizontal" />
                        <div>
                          <strong>Mức độ: </strong>
                          <span>{x.diseaseType}</span>
                        </div>
                        <div>
                          <strong>Tạo lúc: </strong>
                          <span>{dateTimeConverter(x.createdAt)}</span>
                        </div>
                        <div>
                          <strong>Lần cuối cập nhật: </strong>
                          <span>{dateTimeConverter(x.lastUpdatedAt)}</span>
                        </div>
                        <div>
                          <strong>Mô tả bệnh: </strong>
                          <span>{x.description}</span>
                        </div>
                      </CardBody>
                    </Card>
                  ))
                ) : (
                  <div className="text-center">Không có bệnh nào</div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                <p className="text-white">Hủy</p>
              </Button>
              <Button variant="solid" color="primary" isLoading={loading} type="submit" isDisabled={Object.keys(errors).length > 0 || !selectedCommonDisease}>
                <p className="text-white">{getTitle()}</p>
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>{getTitle()}</ModalHeader>
            <ModalBody>
              <p className="text-center">
                Bạn có chắc chắn muốn xóa <strong className="text-xl">{data?.diseaseTitle}</strong> không?
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
  );
};
export default ModalTreamentGuide;
