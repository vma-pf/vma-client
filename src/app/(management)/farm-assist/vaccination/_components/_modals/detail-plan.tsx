import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { dateConverter } from "@oursrc/lib/utils";
import Image from "next/image";
import React from "react";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import { GrStatusGoodSmall } from "react-icons/gr";
import { PiSubtitlesLight } from "react-icons/pi";

const statusMap = [
  { status: 0, value: "Đang chờ" },
  { status: 1, value: "Đã yêu cầu" },
  { status: 2, value: "Chấp nhận" },
  { status: 3, value: "Từ chối" },
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
                <p className="text-lg">{selectedVaccination?.timeSpan}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <CiCalendar className="text-5xl" />
                <p className="text-md font-light">Ngày áp dụng</p>
                <p className="text-lg">{selectedVaccination && dateConverter(selectedVaccination?.applyStageTime)}</p>
              </div>
              <div className="col-span-6 flex flex-col items-center">
                <GrStatusGoodSmall className="text-5xl" />
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
                        <p className="text-md font-light">{medicine.status}</p>
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
      </ModalContent>
    </Modal>
  );
};

export default DetailPlan;
