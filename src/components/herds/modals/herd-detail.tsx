import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import CommonDiseaseReportList from "@oursrc/components/disease-reports/common-disease-report-list";
import CommonTreatmentPlanList from "@oursrc/components/treatment/common-treatment-plan-list";
import CommonTreatmentStageList from "@oursrc/components/treatment/common-treatment-stage-list";
import CommonVaccinationList from "@oursrc/components/vaccination/common-vaccination-list";
import CommonVaccinationStageList from "@oursrc/components/vaccination/common-vaccination-stage-list";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { TreatmentData } from "@oursrc/lib/models/treatment";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { treatmentPlanService } from "@oursrc/lib/services/treatmentPlanService";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import React from "react";
import { TbVaccine } from "react-icons/tb";

const HerdDetail = ({ isOpen, onClose, herdInfo }: { isOpen: boolean; onClose: () => void; herdInfo: HerdInfo }) => {
  const [currentStages, setCurrentStages] = React.useState<VaccinationStageProps[]>([]);
  const [currentTreatmentStages, setCurrentTreatmentStages] = React.useState<any[]>([]);
  const [treatment, setSelectedTreatment] = React.useState<any>();
  React.useEffect(() => {
    setCurrentTreatmentStages([]);
    if (treatment) {
      const selectedTreatment: string[] = Array.from(treatment);
      const id = selectedTreatment.length > 0 ? selectedTreatment[0] : undefined;
      if (Array.from(treatment).length > 0) {
        getTreatmentPlanById(id);
      }
    }
  }, [treatment]);

  const getTreatmentPlanById = async (id: string | undefined) => {
    try {
      const res = await treatmentPlanService.getTreatmentPlan(id ?? "");
      if (res.isSuccess) {
        setCurrentTreatmentStages(res.data.treatmentStages);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      classNames={{
        wrapper: "w-full h-fit",
      }}
      scrollBehavior="inside"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalHeader>
          <p className="text-2xl font-bold">Chi tiết đàn [{herdInfo?.code}]</p>
        </ModalHeader>
        <ModalBody>
          <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="1">
            <Tab
              key="1"
              title={
                <div className="flex items-center">
                  <TbVaccine size={20} />
                  <span className="ml-2">Thông tin lịch tiêm phòng</span>
                </div>
              }
            >
              <div>
                <CommonVaccinationList herdId={herdInfo.id} setCurrentStages={setCurrentStages} />
                <CommonVaccinationStageList stages={currentStages} />
              </div>
            </Tab>
            <Tab
              key="2"
              title={
                <div className="flex items-center">
                  <ClipboardCheck size={20} />
                  <span className="ml-2">Thông tin kế hoạch điều trị</span>
                </div>
              }
            >
              <div>
                <CommonTreatmentPlanList herdId={herdInfo.id} setSelectedTreatment={setSelectedTreatment} />
                <div className="px-4 pt-4">
                  <CommonTreatmentStageList stages={currentTreatmentStages} />
                </div>
              </div>
            </Tab>
            <Tab
              key="3"
              title={
                <div className="flex items-center">
                  <ClipboardList size={20} />
                  <span className="ml-2">Báo cáo bệnh</span>
                </div>
              }
            >
              <CommonDiseaseReportList herdId={herdInfo.id} />
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HerdDetail;
