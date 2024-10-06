"use client";
import React from "react";
import {
  Button,
  // Calendar,
  DateValue,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { FaClock } from "react-icons/fa6";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { CiCalendar, CiClock2 } from "react-icons/ci";
import { GrStatusGoodSmall } from "react-icons/gr";
import { PiSubtitlesLight } from "react-icons/pi";
import Image from "next/image";
import { dateConverter } from "@oursrc/lib/utils";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { toast } from "@oursrc/hooks/use-toast";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";

// const medicineList = [
//   {
//     name: "Thuốc 1",
//     description: "Thuốc 1 mô tả",
//     dosage: 1,
//     note: "Sáng",
//   },
//   {
//     name: "Thuốc 2",
//     description: "Thuốc 2 mô tả",
//     dosage: 2,
//     note: "Trưa",
//   },
//   {
//     name: "Thuốc 3",
//     description: "Thuốc 3 mô tả",
//     dosage: 3,
//     note: "Chiều",
//   },
//   {
//     name: "Thuốc 4",
//     description: "Thuốc 4 mô tả",
//     dosage: 4,
//     note: "Tối",
//   },
//   {
//     name: "Thuốc 5",
//     description: "Thuốc 5 mô tả",
//     dosage: 5,
//     note: "Sáng",
//   },
// ];
type MedicineListProps = {
  status: number;
  medicineName: string;
  quantity: number;
  id: string;
};

const statusMap = [
  { status: 0, value: "Đang chờ" },
  { status: 1, value: "Đã yêu cầu" },
  { status: 2, value: "Chấp nhận" },
  { status: 3, value: "Từ chối" },
];

const VaccinationStage = ({ data }: { data: VaccinationStageProps[] }) => {
  const [filterStatus, setFilterStatus] = React.useState("not-done");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [medicineList, setMedicineList] = React.useState<MedicineListProps[]>([]);
  const [selectedVaccination, setSelectedVaccination] = React.useState<VaccinationStageProps>();

  const filterVaccination = (status: string) => {
    if (status === "all") {
      return data;
    } else if (status === "done") {
      return data.filter((vaccination) => vaccination.isDone === true);
    } else {
      return data.filter((vaccination) => vaccination.isDone === false);
    }
  };

  const getMedicineInStage = async (id: string) => {
    try {
      const res: ResponseObject<any> = await vaccinationService.getMedicineInStage(id);
      if (res && res.isSuccess) {
        setMedicineList(res.data.medicine);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <div>
      <div className="mt-5 mb-3 flex justify-between items-center">
        <p className="text-xl font-semibold">Các giai đoạn tiêm phòng</p>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              Tình trạng tiêm phòng
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={filterStatus ? [filterStatus] : []}
            onSelectionChange={(selectedKeys: any) => {
              setFilterStatus(selectedKeys.values().next().value);
            }}
          >
            <DropdownItem key="all">Tất cả</DropdownItem>
            <DropdownItem key="done">Đã tiêm</DropdownItem>
            <DropdownItem key="not-done">Chưa tiêm</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {data.length === 0 || filterVaccination(filterStatus).length === 0 ? (
        <p className="text-center text-lg mt-3">Không có lịch trình tiêm phòng</p>
      ) : (
        filterVaccination(filterStatus)
          ?.filter((vaccination: VaccinationStageProps) => vaccination.applyStageTime >= new Date().toISOString())
          ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
          ?.map((stage) => (
            <div key={stage.id} className="my-4 grid grid-cols-12 p-2 border-2 rounded-xl">
              <div className="col-span-2 flex items-center justify-center border-r-2">
                <p className="text-center text-lg p-2">{dateConverter(stage.applyStageTime)}</p>
              </div>
              <div className="col-span-2 border-r-2 flex items-center justify-center">
                <FaClock className="text-lg" />
                <p className="text-lg p-2">{stage.timeSpan}</p>
              </div>
              <div className="col-span-4 border-r-2 mx-3 flex flex-col items-start">
                <p>Nội dung</p>
                <p className="text-lg">{stage.title}</p>
              </div>
              <div className="col-span-2 border-r-2 mr-3 flex flex-col items-start justify-center">
                <p>Trạng thái</p>
                <p className={`text-lg ${stage.isDone ? "text-green-500" : "text-red-500"}`}>{stage.isDone ? "Đã tiêm" : "Chưa tiêm"}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="solid"
                  color="primary"
                  endContent={<HiMiniPencilSquare size={20} />}
                  onPress={() => {
                    setSelectedVaccination(stage);
                    getMedicineInStage(stage.id ? stage.id : "");
                    onOpen();
                  }}
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))
      )}
      <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-2xl">Chi tiết lịch trình tiêm phòng</p>
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
                      <p className={`text-lg ${selectedVaccination?.isDone ? "text-green-500" : "text-red-500"}`}>
                        {selectedVaccination?.isDone ? "Đã tiêm" : "Chưa tiêm"}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg mt-3">Danh sách thuốc cần tiêm</p>
                  <div className="grid grid-cols-2">
                    {medicineList?.length > 0 ? (
                      medicineList?.map((medicine) => (
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
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default VaccinationStage;
