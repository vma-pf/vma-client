import { Button, Divider, useDisclosure } from "@nextui-org/react";
import { StageMedicine } from "@oursrc/lib/models/medicine";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { vaccinationService } from "@oursrc/lib/services/vaccinationService";
import { dateConverter } from "@oursrc/lib/utils";
import React from "react";
import { CiBoxList, CiEdit } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { TbMedicineSyrup } from "react-icons/tb";
import DetailPlan from "./modals/detail-plan";
import UpdatePlanStatus from "../../app/(management)/veterinarian/vaccination/_components/_modals/update-plan-status";

const VaccinationStage = ({ stage, setSelectedVaccinationId, action }: { stage: VaccinationStageProps; setSelectedVaccinationId?: any; action: "view" | "request" }) => {
  const { isOpen: isOpenDetail, onOpen: onOpenDetail, onClose: onCloseDetail } = useDisclosure();
  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
  const [medicineList, setMedicineList] = React.useState<StageMedicine[]>([]);

  const getMedicineInStage = async (id: string) => {
    try {
      const res: any = await vaccinationService.getMedicineInStage(id);
      if (res.isSuccess) {
        setMedicineList(res.data.medicine || []);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (stage.id) {
      getMedicineInStage(stage.id);
    }
  }, []);
  return (
    <div>
      {stage.isDone ? (
        <FaCheckCircle size={20} className={`text-primary absolute left-0 translate-x-[-33.5px] z-10 top-1`} />
      ) : (
        <GrStatusGoodSmall
          size={20}
          className={`${stage.applyStageTime > new Date().toISOString() ? "text-default" : "text-danger"}
    absolute left-0 translate-x-[-33.5px] z-10 top-1`}
        />
      )}
      <div className="mb-10 grid gap-3">
        <Divider orientation="vertical" className="absolute left-0 translate-x-[-24.3px] z-0 top-1" />
        <div className="text-lg font-semibold">
          {dateConverter(stage.applyStageTime)}{" "}
          {!stage.isDone &&
            stage.applyStageTime.split("T")[0] < new Date().toISOString().split("T")[0] &&
            Math.floor((new Date().getTime() - new Date(stage.applyStageTime).getTime()) / (1000 * 60 * 60 * 24)) > 0 && (
              <span className="ml-4 text-danger text-md">
                *Đã quá hạn {Math.floor((new Date().getTime() - new Date(stage.applyStageTime).getTime()) / (1000 * 60 * 60 * 24))} ngày
              </span>
            )}
        </div>
        <div className="text-lg font-extrabold">{stage.title}</div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${stage.isDone ? "bg-green-500" : "bg-red-500"} rounded-full`} />
          <div className={`${stage.isDone ? "text-green-500" : "text-red-500"}`}>{stage.isDone ? "Đã tiêm" : "Chưa tiêm"}</div>
        </div>
        <div className="flex gap-2">
          <CiBoxList className="text-primary" size={25} />
          <p className="text-lg">Các công việc cần thực hiện:</p>
        </div>
        <ul className="list-disc pl-5">
          {stage.vaccinationToDos.map((todo, idx) => (
            <li key={idx}>{todo.description}</li>
          ))}
        </ul>
        <div className="space-x-2">
          <Button
            variant="ghost"
            color="primary"
            endContent={<TbMedicineSyrup size={20} />}
            onPress={() => {
              onOpenDetail();
            }}
          >
            Xem thuốc
          </Button>
          {action === "request" && (
            <Button
              variant="solid"
              color="primary"
              endContent={<CiEdit size={20} />}
              isDisabled={
                stage.isDone ||
                stage.applyStageTime.split("T")[0] > new Date().toISOString().split("T")[0] ||
                medicineList.some((medicine) => medicine.status !== "Đã duyệt")
              }
              onPress={() => {
                onOpenUpdate();
              }}
            >
              Cập nhật kết quả
            </Button>
          )}
        </div>
      </div>
      {isOpenDetail && stage && medicineList && (
        <DetailPlan isOpen={isOpenDetail} onClose={onCloseDetail} selectedVaccination={stage} medicineList={medicineList} action={action} />
      )}
      {isOpenUpdate && stage && action === "request" && (
        <UpdatePlanStatus isOpen={isOpenUpdate} onClose={onCloseUpdate} selectedVaccination={stage} setSelectedVaccinationId={setSelectedVaccinationId} />
      )}
    </div>
  );
};

export default VaccinationStage;
