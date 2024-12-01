"use client";
import {
  Card,
  CardBody,
  Divider,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Medicine, StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import {
  MedicineEachStage,
  VaccinationStageProps,
} from "@oursrc/lib/models/vaccination";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter, dateTimeConverter } from "@oursrc/lib/utils";
import { pluck } from "@oursrc/lib/utils/dev-utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";
import React, { useMemo } from "react";
import { CiBoxList } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { medicineService } from "@oursrc/lib/services/medicineService";

const statusMapColor = [
  { name: "red", value: 0 },
  { name: "green", value: 1 },
];

const RenderStage = ({ stage }: { stage: VaccinationStageProps }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);
  const [selectedMedicineDetail, setSelectedMedicineDetail] = React.useState<Medicine | null>(null);

  const fetchMedicine = async (stageId: string) => {
    try {
      setIsLoading(true);
      const response: ResponseObject<any> =
        await vaccinationService.getMedicineInStage(stageId ?? "");
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
        <FaCheckCircle
          size={20}
          className={`text-primary absolute left-0 translate-x-[-33.5px] z-10 top-1`}
        />
      ) : (
        <GrStatusGoodSmall
          size={20}
          className={`text-danger absolute left-0 translate-x-[-33.5px] z-10 top-1`}
        />
      )}
      <div className="mb-10 flex">
        <div className="w-1/3 border-r-1">
          <Divider
            orientation="vertical"
            className="absolute left-0 translate-x-[-24.3px] z-0 top-1"
          />
          <div className="text-lg my-1 font-semibold">
            {dateConverter(stage.applyStageTime)}
          </div>
          <div className="text-lg my-3 font-extrabold">{stage.title}</div>
          <div className="my-3 flex items-center gap-2">
            <div
              className={`w-3 h-3 ${
                stage.isDone ? "bg-green-500" : "bg-red-500"
              } rounded-full`}
            />
            <div
              className={`${stage.isDone ? "text-green-500" : "text-red-500"}`}
            >
              {stage.isDone ? "Đã tiêm" : "Chưa tiêm"}
            </div>
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
          <p className="text-xl mb-3 font-semibold">
            Danh sách thuốc cần sử dụng
          </p>
          <div className="grid grid-cols-3 gap-3">
            {medicineList.length > 0 ? (
              medicineList.map((medicine) => (
                <HoverCard key={medicine.id}>
                    <HoverCardTrigger>
                    <Card className="hover:scale-105 transition-transform">
                      <CardBody className="px-3 py-2">
                      <h4 className="text-small font-semibold leading-none text-default-600">{medicine.medicineName}</h4>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-1">
                        <span className="text-small text-default-500">Số lượng:</span>
                        <p className="text-small">{medicine.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1">
                        <span className="text-small text-default-500">Trạng thái:</span>
                        <p className="text-small">{medicine.status}</p>
                        </div>
                      </div>
                      </CardBody>
                    </Card>
                    </HoverCardTrigger>
                  <HoverCardContent align="start" className="w-96 bg-gray-100">
                    {(medicine.medicine && medicine.medicine != null) ? (
                      <div>
                        <p><strong>Thành phần chính:</strong> {medicine.medicine.mainIngredient}</p>
                        <p><strong>Số đăng ký:</strong> {medicine.medicine.registerNumber}</p>
                        <p><strong>Số lượng còn:</strong> {medicine.medicine.quantity}</p>
                        <p><strong>Cách sử dụng:</strong> {medicine.medicine.usage}</p>
                        <p><strong>Khối lượng:</strong> {medicine.medicine.netWeight} {medicine.medicine.unit}</p>
                      </div>
                    ) : (
                      <p>Thuốc mới không có sẵn</p>
                    )}
                  </HoverCardContent>
                </HoverCard>
              ))
            ) : (
              <p className="text-center text-lg mt-3">
                Không có thuốc cần sử dụng
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CommonVaccinationStageList = ({
  stages,
}: {
  stages: VaccinationStageProps[];
}) => {
  return (
    <div className="mt-5">
      <p className="text-xl my-3 font-semibold">Các giai đoạn tiêm phòng</p>
      {stages.length === 0 ? (
        <p className="text-center text-lg mt-3">
          Không có giai đoạn tiêm phòng
        </p>
      ) : (
        stages
          ?.sort(
            (a, b) =>
              new Date(a.applyStageTime).getTime() -
              new Date(b.applyStageTime).getTime()
          )
          ?.map((stage) => <RenderStage key={stage.id} stage={stage} />)
      )}
    </div>
  );
};
export default CommonVaccinationStageList;
