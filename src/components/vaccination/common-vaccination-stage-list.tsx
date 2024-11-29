"use client";
import { Card, CardBody, Divider, Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { Medicine, StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { MedicineEachStage, VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import React, { useMemo } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";

const statusMapColor = [
  { name: "red", value: 0 },
  { name: "green", value: 1 },
];

const RenderStage = ({ stage }: { stage: VaccinationStageProps }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);
  const fetchMedicine = async (stageId: string) => {
    try {
      setIsLoading(true);
      const response: ResponseObject<any> = await vaccinationService.getMedicineInStage(stageId ?? "");
      if (response.isSuccess) {
        setMedicineList(response.data?.medicine);
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMedicine(stage.id ?? "");
  }, [stage]); // Add an empty dependency array here

  return (
    <div className="grid ml-16 relative">
      {stage.isDone ? (
        <FaCheckCircle size={20} className={`text-primary absolute left-0 translate-x-[-33.5px] z-10 top-1`} />
      ) : (
        <GrStatusGoodSmall size={20} className={`text-danger absolute left-0 translate-x-[-33.5px] z-10 top-1`} />
      )}
      <div className="mb-10 flex">
        <div className="w-1/3 border-r-1">
          <Divider orientation="vertical" className="absolute left-0 translate-x-[-24.3px] z-0 top-1" />
          <div className="text-lg my-1 font-semibold">{dateConverter(stage.applyStageTime)}</div>
          <div className="text-lg my-3 font-extrabold">{stage.title}</div>
          <div className="my-3 flex items-center gap-2">
            <div className={`w-3 h-3 ${stage.isDone ? "bg-green-500" : "bg-red-500"} rounded-full`} />
            <div className={`${stage.isDone ? "text-green-500" : "text-red-500"}`}>{stage.isDone ? "Đã tiêm" : "Chưa tiêm"}</div>
          </div>
          <div className="my-2 flex gap-2">
            <CiBoxList className="text-primary" size={25} />
            <p className="text-lg">Các công việc cần thực hiện:</p>
          </div>
          <ul className="list-disc pl-5">
            {stage.vaccinationToDos.map((todo, idx) => (
              <li key={idx}>{todo.description}</li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 pl-5 border-l-1">
          <p className="text-xl mb-3 font-semibold">Danh sách thuốc cần sử dụng</p>
          <div className="grid grid-cols-3 gap-3">
            {medicineList.length > 0 ? (
              medicineList.map((medicine) => (
                <Card key={medicine.id}>
                  <CardBody>
                    <p className="text-lg font-semibold">{medicine.medicineName}</p>
                    <p className="text-md">Số lượng: {medicine.quantity}</p>
                  </CardBody>
                </Card>
              ))
            ) : (
              <p className="text-center text-lg mt-3">Không có thuốc cần sử dụng</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommonVaccinationStageList = ({ stages }: { stages: VaccinationStageProps[] }) => {
  return (
    <div className="mt-5">
      <p className="text-xl my-3 font-semibold">Các giai đoạn tiêm phòng</p>
      {stages.length === 0 ? (
        <p className="text-center text-lg mt-3">Không có giai đoạn tiêm phòng</p>
      ) : (
        stages?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())?.map((stage) => <RenderStage key={stage.id} stage={stage} />)
      )}
    </div>
  );
};
export default CommonVaccinationStageList;
