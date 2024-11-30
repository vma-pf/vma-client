"use client";
import React from "react";
import { CreateTreatmentStageProps } from "@oursrc/lib/models/treatment";
import { dateConverter } from "@oursrc/lib/utils";
import { Divider } from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";

interface RenderStageProps {
  stage: CreateTreatmentStageProps;
}

const RenderStage = ({ stage }: RenderStageProps) => {
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