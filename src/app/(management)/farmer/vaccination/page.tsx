"use client";
import React from "react";
import VaccinationList from "./components/vaccination-list";
import { FaRegCalendarPlus } from "react-icons/fa6";
import {
  VaccinationData,
  VaccinationStageProps,
} from "./components/vaccination";
import VaccinationStage from "./components/vaccination-stage";
import { Accordion, AccordionItem } from "@nextui-org/react";

const vaccinationData: VaccinationData[] = [
  {
    id: "1",
    title: "Lịch xuân",
    description: "Lịch tiêm phòng cho mùa xuân",
    type: "Cá thể",
    startDate: "2021-09-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "2",
    title: "Lịch hạ",
    description: "Lịch tiêm phòng cho mùa hạ",
    type: "Nhiều cá thể",
    startDate: "2022-09-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "3",
    title: "Lịch thu",
    description: "Lịch tiêm phòng cho mùa thu",
    type: "Cá thể",
    startDate: "2022-08-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "4",
    title: "Lịch đông",
    description: "Lịch tiêm phòng cho mùa đông",
    type: "Nhiều cá thể",
    startDate: "2022-07-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "5",
    title: "Lịch mùa",
    description: "Lịch tiêm phòng cho mùa mưa",
    type: "Cá thể",
    startDate: "2023-10-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "6",
    title: "Lịch nắng",
    description: "Lịch tiêm phòng cho mùa nắng",
    type: "Nhiều cá thể",
    startDate: "2023-09-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "7",
    title: "Lịch mưa",
    description: "Lịch tiêm phòng cho mùa mưa",
    type: "Cá thể",
    startDate: "2023-08-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "8",
    title: "Lịch gió",
    description: "Lịch tiêm phòng cho mùa gió",
    type: "Nhiều cá thể",
    startDate: "2023-07-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "9",
    title: "Lịch nắng",
    description: "Lịch tiêm phòng cho mùa nắng",
    type: "Cá thể",
    startDate: "2023-05-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
  {
    id: "10",
    title: "Lịch mưa",
    description: "Lịch tiêm phòng cho mùa mưa",
    type: "Nhiều cá thể",
    startDate: "2023-04-10",
    expectedEndDate: "2021-09-10",
    actualEndDate: "2021-09-10",
    note: "Đã tiêm phòng",
  },
];

const vaccinationStage: VaccinationStageProps[] = [
  {
    id: "1",
    title: "Tiêm phòng cho heo",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "8:00 - 10:00",
    isDone: true,
  },
  {
    id: "2",
    title: "Tiêm phòng cho gà",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "10:00 - 12:00",
    isDone: true,
  },
  {
    id: "3",
    title: "Tiêm phòng cho bò",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "13:00 - 15:00",
    isDone: true,
  },
  {
    id: "4",
    title: "Tiêm phòng cho chó",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "15:00 - 17:00",
    isDone: false,
  },
  {
    id: "5",
    title: "Tiêm phòng cho mèo",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "17:00 - 19:00",
    isDone: false,
  },
  {
    id: "6",
    title: "Tiêm phòng cho cá",
    applyStageTime: new Date("2023-05-28"),
    timeSpan: "19:00 - 21:00",
    isDone: false,
  },
  {
    id: "7",
    title: "Tiêm phòng cho ngựa",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "21:00 - 23:00",
    isDone: false,
  },
  {
    id: "8",
    title: "Tiêm phòng cho dê",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "23:00 - 1:00",
    isDone: false,
  },
  {
    id: "9",
    title: "Tiêm phòng cho cừu",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "1:00 - 3:00",
    isDone: false,
  },
  {
    id: "10",
    title: "Tiêm phòng cho lợn",
    applyStageTime: new Date("2024-05-28"),
    timeSpan: "3:00 - 5:00",
    isDone: false,
  },
];

const herd = {
  id: "1",
  name: "Đàn 1",
  quantity: 100,
  breed: "Iberico",
  barns: [
    {
      id: "1",
      code: "CAG001",
      name: "Chuồng 1",
      quantity: 50,
    },
    {
      id: "2",
      code: "CAG002",
      name: "Chuồng 2",
      quantity: 50,
    },
    {
      id: "3",
      code: "CAG003",
      name: "Chuồng 3",
      quantity: 50,
    },
    {
      id: "4",
      code: "CAG004",
      name: "Chuồng 4",
      quantity: 50,
    },
  ],
};

const Vaccination = () => {
  const [selectedVaccinationId, setSelectedVaccinationId] = React.useState(
    new Set<string>()
  );

  const findVaccination = (id: Set<String>) => {
    return vaccinationData.find(
      (vaccination) => vaccination.id === id.values().next().value
    );
  };

  return (
    <div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-xl mb-3">Trước tiên, hãy chọn lịch tiêm phòng</p>
        <VaccinationList
          data={vaccinationData}
          setSelectedVaccination={setSelectedVaccinationId}
        />
      </div>
      <div className="mb-3 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <div className="flex flex-shrink gap-5">
          <div className="p-3 border-2 rounded-2xl w-1/2">
            <p className="text-xl font-semibold">Chi tiết lịch tiêm phòng</p>
            {findVaccination(selectedVaccinationId) ? (
              <div>
                <div className="mby-2 flex items-center">
                  <FaRegCalendarPlus className="my-auto mr-4 text-3xl" />
                  <p className="my-auto text-2xl font-bold mt-3">
                    {findVaccination(selectedVaccinationId)?.title}
                  </p>
                </div>
                <p className="text-lg mt-3">
                  {findVaccination(selectedVaccinationId)?.description}
                </p>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Phân loại:</p>
                  <p className="text-lg mt-3 font-semibold">
                    {findVaccination(selectedVaccinationId)?.type}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ngày bắt đầu:</p>
                  <p className="text-lg mt-3 font-semibold">
                    {findVaccination(selectedVaccinationId)?.startDate}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ngày kết thúc (dự kiến):</p>
                  <p className="text-lg mt-3 font-semibold">
                    {findVaccination(selectedVaccinationId)?.expectedEndDate}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ngày kết thúc (thực tế):</p>
                  <p className="text-lg mt-3 font-semibold">
                    {findVaccination(selectedVaccinationId)?.actualEndDate}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ghi chú:</p>
                  <p className="text-lg mt-3 font-semibold">
                    {findVaccination(selectedVaccinationId)?.note}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-lg mt-3">
                Chưa chọn lịch tiêm phòng
              </p>
            )}
          </div>
          <div className="p-3 border-2 rounded-2xl w-1/2">
            {/* <Calendar days={daysToHighlight} /> */}
            <p className="text-xl font-semibold">Thông tin đàn heo</p>
            {findVaccination(selectedVaccinationId) ? (
              <div>
                <div className="mt-3 flex justify-between">
                  <p className="text-md">Tên đàn:</p>
                  <p className="text-lg font-semibold">{herd.name}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <p className="text-md">Số lượng:</p>
                  <p className="text-lg font-semibold">{herd.quantity}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <p className="text-md">Giống:</p>
                  <p className="text-lg font-semibold">{herd.breed}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
                    <AccordionItem key={1} title="Danh sách chuồng">
                      <div className="flex justify-between">
                        <p className="text-xs font-light">Mã code</p>
                        <p className="text-xs font-light">Tên chuồng</p>
                        <p className="text-xs font-light">Số lượng</p>
                      </div>
                      {herd.barns.map((barn) => (
                        <div key={barn.id} className="flex justify-between">
                          <p className="text-lg mt-2">{barn.code}</p>
                          <p className="text-lg mt-2">{barn.name}</p>
                          <p className="text-lg mt-2">{barn.quantity}</p>
                        </div>
                      ))}
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ) : (
              <p className="text-center text-lg mt-3">
                Chưa chọn lịch tiêm phòng
              </p>
            )}
          </div>
        </div>
        <div>
          {findVaccination(selectedVaccinationId) && (
            <VaccinationStage data={vaccinationStage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Vaccination;
