import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { dateConverter } from "@oursrc/lib/utils";
import Image from "next/image";
import React from "react";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import { GrStatusGoodSmall } from "react-icons/gr";
import { PiSubtitlesLight } from "react-icons/pi";
import { Pig, VaccinationPig } from "@oursrc/lib/models/pig";
import { Cage } from "@oursrc/lib/models/cage";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import { vaccinationStageService } from "@oursrc/lib/services/vaccinationStageService";
import { useToast } from "@oursrc/hooks/use-toast";
import { CreateTreatmentStageProps, TreatmentLog } from "@oursrc/lib/models/treatment";
import PigTreatmentStage from "../pig-treatment-stage";
import { treatmentStageService } from "@oursrc/lib/services/treatmentStageService";
import { treatmentLogService } from "@oursrc/lib/services/treatmentLogService";

const statusMap = [
  { status: 0, value: "Đang chờ" },
  { status: 1, value: "Đã yêu cầu" },
  { status: 2, value: "Chấp nhận" },
  { status: 3, value: "Từ chối" },
];

const UpdatePlanStatus = ({
  isOpen,
  onClose,
  selectedTreatment,
  setSelectedTreatmentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedTreatment: CreateTreatmentStageProps;
  setSelectedTreatmentId: any;
}) => {
  const { toast } = useToast();
  const [selectedPigs, setSelectedPigs] = React.useState<TreatmentLog[]>([]);
  const [cages, setCages] = React.useState<Cage[]>([]);

  const updatePlanStatus = async () => {
    try {
      const res: ResponseObject<any> = await treatmentLogService.checkLogCovered(
        selectedTreatment?.id || "",
        selectedPigs.map((pig) => pig.pigId)
      );
      if (res.isSuccess) {
        toast({
          title: "Cập nhật trạng thái kế hoạch điều trị thành công",
          variant: "success",
        });
        onClose();
        setSelectedTreatmentId("");
      } else {
        toast({
          title: res.errorMessage || "Câp nhật trạng thái kế hoạch điều trị thất bại",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  const fetchCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data || []);
      }
    } catch (error: any) {
      console.log("Error: ", error);
    }
  };

  React.useEffect(() => {
    if (selectedTreatment) fetchCages();
  }, [selectedTreatment]);

  return (
    <Modal
      classNames={{
        wrapper: "w-full h-fit",
      }}
      size="full"
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <p className="text-2xl">Cập nhật trạng thái quá trình điều trị</p>
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
                <p className="text-lg">{selectedTreatment?.timeSpan}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <CiCalendar className="text-5xl" />
                <p className="text-md font-light">Ngày áp dụng</p>
                <p className="text-lg">{selectedTreatment && dateConverter(selectedTreatment?.applyStageTime)}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <GrStatusGoodSmall className={`text-5xl ${selectedTreatment?.isDone ? "text-green-500" : "text-red-500"}`} />
                <p className="text-md font-light">Trạng thái</p>
                <p className={`text-lg ${selectedTreatment?.isDone ? "text-green-500" : "text-red-500"}`}>{selectedTreatment?.isDone ? "Đã tiêm" : "Chưa tiêm"}</p>
              </div>
            </div>
            <p className="text-lg mt-3">Danh sách heo cần tiêm</p>
            {/* <div className="grid grid-cols-2">
              {medicineList?.length > 0 ? (
                medicineList?.map((medicine: StageMedicine) => (
                  <div key={medicine.id} className="m-2 p-4 border-2 rounded-xl">
                    <div className="grid grid-cols-12">
                      <Image className="my-auto col-span-2" src="/assets/vma-logo.png" alt="medicine" width={70} height={70} />
                      <div className="my-auto col-span-8">
                        <p className="text-lg font-bold">{medicine.medicineName}</p>
                        <p className="text-md font-light">{statusMap.find((status) => status.status === medicine.status)?.value}</p>
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
            </div> */}
            <PigTreatmentStage treatmentStage={selectedTreatment} setSelectedPigs={setSelectedPigs} cages={cages} setCages={setCages} />
            {selectedPigs.length > 0 && (
              <div>
                <Input
                  placeholder="Nhập ghi chú"
                  size="lg"
                  label="Ghi chú"
                  labelPlacement="outside"
                  onValueChange={(e) => {
                    console.log(e);
                  }}
                />
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="solid" onClick={onClose}>
            Đóng
          </Button>
          <Button
            color="primary"
            variant="solid"
            isDisabled={selectedPigs.length === 0}
            onPress={() => {
              if (selectedPigs.length > 0) {
                updatePlanStatus();
              }
            }}
          >
            Cập nhật
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdatePlanStatus;
