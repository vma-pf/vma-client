"use client";
import React from "react";
import VaccinationList from "./_components/vaccination-list";
import { FaRegCalendarPlus } from "react-icons/fa6";
import { VaccinationData, VaccinationStageProps } from "../../../../lib/models/vaccination";
import VaccinationStage from "./_components/vaccination-stage";
import { Accordion, AccordionItem, Progress } from "@nextui-org/react";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { herdService } from "@oursrc/lib/services/herdService";
import { HerdInfo } from "@oursrc/lib/models/herd";

// const vaccinationList: any[] = [
//   {
//     id: "1",
//     title: "Lịch xuân",
//     description: "Lịch tiêm phòng cho mùa xuân",
//     herdId: "1",
//     startDate: "2021-09-10",
//     expectedEndDate: "2021-09-10",
//     actualEndDate: "2021-09-10",
//     note: "Đã tiêm phòng",
//     status: 0,
//     vaccinationStages: [
//       {
//         vaccinationPlanId: "1",
//         title: "Tiêm phòng cho heo",
//         applyStageTime: "2024-05-28",
//         timeSpan: "8:00 - 10:00",
//         isDone: true,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho heo con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "1",
//         title: "Tiêm phòng cho gà",
//         applyStageTime: "2024-05-28",
//         timeSpan: "10:00 - 12:00",
//         isDone: true,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho gà con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "1",
//         title: "Tiêm phòng cho bò",
//         applyStageTime: "2024-05-28",
//         timeSpan: "13:00 - 15:00",
//         isDone: true,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho bò con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "1",
//         title: "Tiêm phòng cho chó",
//         applyStageTime: "2024-05-28",
//         timeSpan: "15:00 - 17:00",
//         isDone: false,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho chó con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "1",
//         title: "Tiêm phòng cho mèo",
//         applyStageTime: "2024-05-28",
//         timeSpan: "17:00 - 19:00",
//         isDone: false,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho mèo con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "1",
//         title: "Tiêm phòng cho cá",
//         applyStageTime: "2023-05-28",
//         timeSpan: "19:00 - 21:00",
//         isDone: false,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho cá con",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "2",
//     title: "Lịch hạ",
//     description: "Lịch tiêm phòng cho mùa hạ",
//     herdId: "2",
//     startDate: "2021-09-10",
//     expectedEndDate: "2021-09-10",
//     actualEndDate: "2021-09-10",
//     note: "Đã tiêm phòng",
//     status: 0,
//     vaccinationStages: [
//       {
//         vaccinationPlanId: "2",
//         title: "Tiêm phòng cho heo",
//         applyStageTime: "2024-05-28",
//         timeSpan: "8:00 - 10:00",
//         isDone: true,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho heo con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "2",
//         title: "Tiêm phòng cho gà",
//         applyStageTime: "2024-05-28",
//         timeSpan: "10:00 - 12:00",
//         isDone: true,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho gà con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "2",
//         title: "Tiêm phòng cho bò",
//         applyStageTime: "2024-05-28",
//         timeSpan: "13:00 - 15:00",
//         isDone: true,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho bò con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "2",
//         title: "Tiêm phòng cho chó",
//         applyStageTime: "2024-05-28",
//         timeSpan: "15:00 - 17:00",
//         isDone: false,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho chó con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "2",
//         title: "Tiêm phòng cho mèo",
//         applyStageTime: "2024-05-28",
//         timeSpan: "17:00 - 19:00",
//         isDone: false,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho mèo con",
//           },
//         ],
//       },
//       {
//         vaccinationPlanId: "2",
//         title: "Tiêm phòng cho cá",
//         applyStageTime: "2023-05-28",
//         timeSpan: "19:00 - 21:00",
//         isDone: false,
//         vaccinationToDos: [
//           {
//             description: "Tiêm phòng cho cá con",
//           },
//         ],
//       },
//     ],
//   },
// ];

// const vaccinationStage: VaccinationStageProps[] = [
//   {
//     id: "1",
//     title: "Tiêm phòng cho heo",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "8:00 - 10:00",
//     isDone: true,
//   },
//   {
//     id: "2",
//     title: "Tiêm phòng cho gà",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "10:00 - 12:00",
//     isDone: true,
//   },
//   {
//     id: "3",
//     title: "Tiêm phòng cho bò",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "13:00 - 15:00",
//     isDone: true,
//   },
//   {
//     id: "4",
//     title: "Tiêm phòng cho chó",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "15:00 - 17:00",
//     isDone: false,
//   },
//   {
//     id: "5",
//     title: "Tiêm phòng cho mèo",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "17:00 - 19:00",
//     isDone: false,
//   },
//   {
//     id: "6",
//     title: "Tiêm phòng cho cá",
//     applyStageTime: new Date("2023-05-28"),
//     timeSpan: "19:00 - 21:00",
//     isDone: false,
//   },
//   {
//     id: "7",
//     title: "Tiêm phòng cho ngựa",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "21:00 - 23:00",
//     isDone: false,
//   },
//   {
//     id: "8",
//     title: "Tiêm phòng cho dê",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "23:00 - 1:00",
//     isDone: false,
//   },
//   {
//     id: "9",
//     title: "Tiêm phòng cho cừu",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "1:00 - 3:00",
//     isDone: false,
//   },
//   {
//     id: "10",
//     title: "Tiêm phòng cho lợn",
//     applyStageTime: new Date("2024-05-28"),
//     timeSpan: "3:00 - 5:00",
//     isDone: false,
//   },
// ];

// const herd = {
//   id: "1",
//   name: "Đàn 1",
//   quantity: 100,
//   breed: "Iberico",
//   barns: [
//     {
//       id: "1",
//       code: "CAG001",
//       name: "Chuồng 1",
//       quantity: 50,
//     },
//     {
//       id: "2",
//       code: "CAG002",
//       name: "Chuồng 2",
//       quantity: 50,
//     },
//     {
//       id: "3",
//       code: "CAG003",
//       name: "Chuồng 3",
//       quantity: 50,
//     },
//     {
//       id: "4",
//       code: "CAG004",
//       name: "Chuồng 4",
//       quantity: 50,
//     },
//   ],
// };

const statusMap = [
  { name: "Chưa bắt đầu", value: 0 },
  { name: "Đang diễn ra", value: 1 },
  { name: "Đã hoàn thành", value: 2 },
  { name: "Đã hủy", value: 3 },
];

const Vaccination = () => {
  const [selectedVaccinationId, setSelectedVaccinationId] = React.useState(new Set<string>());
  const [vaccinationData, setVaccinationData] = React.useState<VaccinationData>();
  const [herd, setHerd] = React.useState<HerdInfo>();

  const findVaccination = async (id: string) => {
    try {
      const vaccinationId = "4b75d78c-7c38-4447-9fe7-ebbcaff55faf";
      const res: ResponseObject<any> = await vaccinationService.getVaccinationPlan(id);
      if (res && res.isSuccess) {
        setVaccinationData(res.data);
      } else {
        console.log("Error: ", res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    // return vaccinationData.find(
    //   (vaccination) => vaccination.id === id.values().next().value
    // );
  };

  const findHerdData = async (id: string) => {
    try {
      const vaccinationId = "4b75d78c-7c38-4447-9fe7-ebbcaff55faf";
      const res: ResponseObject<HerdInfo> = await herdService.getHerdByVaccinationPlanId(id);
      console.log("res", res);
      if (res && res.isSuccess) {
        setHerd(res.data);
      } else {
        console.log("Error: ", res.errorMessage);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  React.useEffect(() => {
    if (selectedVaccinationId.size > 0) {
      findVaccination(selectedVaccinationId.values().next().value);
      findHerdData(selectedVaccinationId.values().next().value);
    }
  }, [selectedVaccinationId]);

  return (
    <div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-xl mb-3">Trước tiên, hãy chọn lịch tiêm phòng</p>
        <VaccinationList setSelectedVaccination={setSelectedVaccinationId} />
      </div>
      <div className="mb-3 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <div className="flex flex-shrink gap-5">
          <div className="p-3 border-2 rounded-2xl w-1/2">
            <p className="text-xl font-semibold">Chi tiết lịch tiêm phòng</p>
            {vaccinationData ? (
              <div>
                <div className="mby-2 flex items-center">
                  <FaRegCalendarPlus className="my-auto mr-4 text-3xl" />
                  <p className="my-auto text-2xl font-bold mt-3">{vaccinationData.title}</p>
                </div>
                <p className="text-lg mt-3">{vaccinationData.description}</p>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Đàn:</p>
                  <p className="text-lg mt-3 font-semibold">{vaccinationData.herdId}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ngày bắt đầu</p>
                  <p className="text-md mt-3">Ngày kết thúc (dự kiến)</p>
                </div>
                <Progress value={50} />
                <div className="flex justify-between">
                  <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.startDate)}</p>
                  <p className="text-lg mt-3 font-semibold">{dateConverter(vaccinationData.expectedEndDate)}</p>
                </div>
                {vaccinationData.actualEndDate && (
                  <div className="flex justify-between">
                    <p className="text-md mt-3">Ngày kết thúc (thực tế):</p>
                    <p className="text-lg mt-3 font-semibold">{vaccinationData.actualEndDate}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-md mt-3">Ghi chú:</p>
                  <p className="text-lg mt-3 font-semibold">{vaccinationData.note ? vaccinationData.note : "Không có"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md mt-3">Tình trạng</p>
                  <p
                    className={`text-lg mt-3 font-semibold ${
                      statusMap.find((status) => status.value === vaccinationData.status)?.value === 1
                        ? "text-blue-500"
                        : statusMap.find((status) => status.value === vaccinationData.status)?.value === 2
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {statusMap.find((status) => status.value === vaccinationData.status)?.name}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-center text-lg mt-3">Chưa chọn lịch tiêm phòng</p>
            )}
          </div>
          <div className="p-3 border-2 rounded-2xl w-1/2">
            <p className="text-xl font-semibold">Thông tin đàn heo</p>
            {herd ? (
              <div>
                <div className="mt-3 flex justify-between">
                  <p className="text-md">Tên đàn:</p>
                  <p className="text-lg font-semibold">{herd.code}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <p className="text-md">Số lượng:</p>
                  <p className="text-lg font-semibold">{herd.totalNumber}</p>
                </div>
                <div className="mt-3 flex justify-between">
                  <p className="text-md">Giống:</p>
                  <p className="text-lg font-semibold">{herd.breed}</p>
                </div>
                {/* <div className="mt-3 flex justify-between">
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
                </div> */}
              </div>
            ) : (
              <p className="text-center text-lg mt-3">Chưa chọn lịch tiêm phòng</p>
            )}
          </div>
        </div>
        <div>{vaccinationData?.vaccinationStages && <VaccinationStage data={vaccinationData?.vaccinationStages} />}</div>
      </div>
    </div>
  );
};

export default Vaccination;
