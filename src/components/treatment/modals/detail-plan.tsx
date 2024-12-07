import {
  Button,
  Card,
  CardBody,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@oursrc/components/ui/hover-card";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { CreateTreatmentStageProps } from "@oursrc/lib/models/treatment";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import { dateConverter } from "@oursrc/lib/utils";
import { Pill } from "lucide-react";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import { GrStatusGoodSmall } from "react-icons/gr";
import { PiSubtitlesLight } from "react-icons/pi";

const statusColorMap = [
  { status: "Chờ xử lý", color: "text-yellow-500" },
  { status: "Đã yêu cầu", color: "text-sky-500" },
  { status: "Đã duyệt", color: "text-green-500" },
  { status: "Đã hủy", color: "text-danger-500" },
];

const DetailPlan = ({
  isOpen,
  onClose,
  selectedTreatment,
  medicineList,
  action,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedTreatment: CreateTreatmentStageProps;
  medicineList: StageMedicine[];
  action: "view" | "request";
}) => {
  const { toast } = useToast();
  const changeStatusRequest = async () => {
    try {
      let isSuccess = true;
      medicineList?.forEach(async (medicine) => {
        const res: ResponseObject<any> =
          await medicineRequestService.changeStatusRequestEach(medicine.id);
        if (res.isSuccess) {
        } else {
          isSuccess = false;
          console.log(res.errorMessage);
          toast({
            title: res.errorMessage || "Yêu cầu xuất thuốc thất bại",
            variant: "destructive",
          });
          return;
        }
      });
      if (isSuccess) {
        toast({
          title: "Yêu cầu xuất thuốc thành công",
          variant: "success",
        });
        onClose();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };
  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-2xl">Danh sách thuốc cần tiêm</p>
        </ModalHeader>
        <ModalBody>
          <div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6 flex flex-col items-center">
                <PiSubtitlesLight className="text-5xl" />
                <p className="text-md font-light">Nội dung</p>
                <p className="text-lg">{selectedTreatment?.title}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <CiClock2 className="text-5xl" />
                <p className="text-md font-light">Thời gian</p>
                <p className="text-lg">{selectedTreatment?.timeSpan} ngày</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <CiCalendar className="text-5xl" />
                <p className="text-md font-light">Ngày áp dụng</p>
                <p className="text-lg">
                  {selectedTreatment &&
                    dateConverter(selectedTreatment?.applyStageTime)}
                </p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <GrStatusGoodSmall
                  className={`text-5xl ${
                    selectedTreatment?.isDone
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                />
                <p className="text-md font-light">Trạng thái</p>
                <p
                  className={`text-lg ${
                    selectedTreatment?.isDone
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {selectedTreatment?.isDone ? "Đã tiêm" : "Chưa tiêm"}
                </p>
              </div>
            </div>
            <p className="text-lg mt-3">Danh sách thuốc cần tiêm</p>
            <div className="grid grid-cols-2">
              {medicineList?.length > 0 ? (
                medicineList?.map((medicine: StageMedicine) => (
                  <HoverCard key={medicine.id}>
                    <HoverCardTrigger>
                      <div className="m-2 p-4 border-2 rounded-xl">
                        <div className="flex">
                          <Pill size={40} className="text-primary mr-2" />
                          <div className="my-auto col-span-8">
                            <p className="text-lg font-bold">
                              {medicine.medicineName}
                            </p>
                            <p
                              className={`text-md font-light ${
                                statusColorMap.find(
                                  (status) => status.status === medicine.status
                                )?.color
                              }`}
                            >
                              {medicine.status}
                            </p>
                          </div>
                          <p className="my-auto col-span-2 mx-2 text-md font-semibold text-right">
                            X{medicine.quantity}
                          </p>
                        </div>
                        <Divider className="mt-3" orientation="horizontal" />
                        <p className="text-md font-light">Lưu ý:</p>
                        <p className="text-md font-light"></p>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent
                      align="start"
                      className="w-96 bg-gray-100"
                    >
                      {medicine.medicine && medicine.medicine != null ? (
                        <div>
                          <p>
                            <strong>Thành phần chính:</strong>{" "}
                            {medicine.medicine.mainIngredient}
                          </p>
                          <p>
                            <strong>Số đăng ký:</strong>{" "}
                            {medicine.medicine.registerNumber}
                          </p>
                          <p>
                            <strong>Cách sử dụng:</strong>{" "}
                            {medicine.medicine.usage}
                          </p>
                          <p>
                            <strong>Khối lượng:</strong>{" "}
                            {medicine.medicine.netWeight}{" "}
                            {medicine.medicine.unit}
                          </p>
                        </div>
                      ) : (
                        <p>Thuốc mới không có sẵn</p>
                      )}
                    </HoverCardContent>
                  </HoverCard>
                ))
              ) : (
                <p className="text-lg text-center">Không có thuốc cần tiêm</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {action === "request" && (
            <Button
              variant="solid"
              color="primary"
              isDisabled={medicineList?.every(
                (medicine) => medicine.status !== "Chờ xử lý"
              )}
              onClick={() => changeStatusRequest()}
            >
              Xuất thuốc
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailPlan;
