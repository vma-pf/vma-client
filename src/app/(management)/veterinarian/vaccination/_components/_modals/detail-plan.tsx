import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import { dateConverter } from "@oursrc/lib/utils";
import Image from "next/image";
import React from "react";
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
  selectedVaccination,
  medicineList,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedVaccination: VaccinationStageProps;
  medicineList: StageMedicine[];
}) => {
  const { toast } = useToast();
  const changeStatusRequest = async () => {
    try {
      medicineList?.forEach(async (medicine) => {
        const res: ResponseObject<any> = await medicineRequestService.changeStatusRequest(medicine.id);
        if (res.isSuccess) {
          toast({
            title: "Đã yêu cầu xuất thuốc",
            variant: "success",
          });
          onClose();
        } else {
          console.log(res.errorMessage);
          toast({
            title: res.errorMessage || "Yêu cầu xuất thuốc thất bại",
            variant: "destructive",
          });
        }
      });
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
                <p className="text-lg">{selectedVaccination?.title}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <CiClock2 className="text-5xl" />
                <p className="text-md font-light">Thời gian</p>
                <p className="text-lg">{selectedVaccination?.timeSpan}  ngày</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <CiCalendar className="text-5xl" />
                <p className="text-md font-light">Ngày áp dụng</p>
                <p className="text-lg">{selectedVaccination && dateConverter(selectedVaccination?.applyStageTime)}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <GrStatusGoodSmall className={`text-5xl ${selectedVaccination?.isDone ? "text-green-500" : "text-red-500"}`} />
                <p className="text-md font-light">Trạng thái</p>
                <p className={`text-lg ${selectedVaccination?.isDone ? "text-green-500" : "text-red-500"}`}>{selectedVaccination?.isDone ? "Đã tiêm" : "Chưa tiêm"}</p>
              </div>
            </div>
            <p className="text-lg mt-3">Danh sách thuốc cần tiêm</p>
            <div className="grid grid-cols-2">
              {medicineList?.length > 0 ? (
                medicineList?.map((medicine: StageMedicine) => (
                  <div key={medicine.id} className="m-2 p-4 border-2 rounded-xl">
                    <div className="grid grid-cols-12">
                      <Image className="my-auto col-span-2" src="/assets/vma-logo.png" alt="medicine" width={70} height={70} />
                      <div className="my-auto col-span-8">
                        <p className="text-lg font-bold">{medicine.medicineName}</p>
                        <p className={`text-md font-light ${statusColorMap.find((status) => status.status === medicine.status)?.color}`}>{medicine.status}</p>
                      </div>
                      <p className="my-auto col-span-2 mx-2 text-md font-semibold text-right">X{medicine.quantity}</p>
                    </div>
                    <Divider className="mt-3" orientation="horizontal" />
                    <p className="text-md font-light">Lưu ý:</p>
                    <p className="text-md font-light"></p>
                  </div>
                ))
              ) : (
                <p className="text-lg text-center">Không có thuốc cần tiêm</p>
              )}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="solid" color="primary" isDisabled={medicineList?.every((medicine) => medicine.status !== "Chờ xử lý")} onClick={() => changeStatusRequest()}>
            Xuất thuốc
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailPlan;
