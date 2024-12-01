"use client";
import React from "react";
import { CreateTreatmentStageProps } from "@oursrc/lib/models/treatment";
import { dateConverter } from "@oursrc/lib/utils";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";
import { Medicine, StageMedicine } from "@oursrc/lib/models/medicine";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { treatmentStageService } from "@oursrc/lib/services/treatmentStageService";

interface RenderStageProps {
  stage: CreateTreatmentStageProps;
}

const RenderStage = ({ stage }: RenderStageProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);

  const fetchMedicine = async (stageId: string) => {
    try {
      setIsLoading(true);
      const response: ResponseObject<any> =
        await treatmentStageService.getMedicineInStage(stageId ?? "");
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
  }, [stage]);

  return (
    <div className="relative">
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
            <span>{stage.isDone ? "Đã hoàn thành" : "Chưa hoàn thành"}</span>
          </div>
        </div>
        <div className="w-2/3 pl-4">
          <div className="mb-4">
            <div className="font-semibold mb-2">Các việc cần làm:</div>
            <ul className="list-disc pl-4">
              {stage.treatmentToDos.map((todo, index) => (
                <li key={index}>{todo.description}</li>
              ))}
            </ul>
          </div>
          <div className="font-semibold mb-2">Danh sách thuốc cần sử dụng:</div>
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
          {stage.inventoryRequest && (
            <div>
              <div className="font-semibold mb-2">Thuốc cần dùng:</div>
              <ul className="list-disc pl-4">
                {stage.inventoryRequest.medicines.map((medicine, index) => (
                  <li key={index}>
                    {medicine.medicineName} - {medicine.quantity} {medicine.unit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommonTreatmentStageList = ({ stages }: { stages?: CreateTreatmentStageProps[] }) => {
  if (!stages || stages.length === 0) {
    return <div className="text-center mt-4">Không có giai đoạn điều trị nào</div>;
  }

  const currentTreatmentStages = stages.filter(
    (stage) => new Date(stage.applyStageTime) >= new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
  );

  if (currentTreatmentStages.length === 0) {
    return <div className="text-center mt-4">Chưa có giai đoạn điều trị nào đến hạn</div>;  
  }

  return (
    <div className="py-2">
      <p className="text-xl my-3 font-semibold">Các giai đoạn điều trị</p>
      <div className="px-8 py-2">
        {currentTreatmentStages
          ?.sort((a, b) => new Date(a.applyStageTime).getTime() - new Date(b.applyStageTime).getTime())
          ?.map((stage) => (
            <RenderStage key={stage.id} stage={stage} />
          ))}
      </div>
    </div>
  );
};

export default CommonTreatmentStageList;