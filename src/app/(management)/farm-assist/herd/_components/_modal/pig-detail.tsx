import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import PigTreatmentPlanList from "@oursrc/components/treatment/pig-treatment-plan-list";
import PigVaccinationList from "@oursrc/components/vaccination/pig-vaccination-list";
import PigVaccinationStageList from "@oursrc/components/vaccination/pig-vaccination-stage-list";
import { Pig } from "@oursrc/lib/models/pig";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import { ClipboardCheck, ClipboardList } from "lucide-react";
import React from "react";
import { TbVaccine } from "react-icons/tb";
import DevelopmentLogList from "../development-log-list";
import PigDiseaseReportList from "@oursrc/components/disease-reports/pig-disease-report-list";

const PigDetail = ({
  isOpen,
  onClose,
  pigInfo,
}: {
  isOpen: boolean;
  onClose: () => void;
  pigInfo: Pig;
}) => {
  const [currentStages, setCurrentStages] = React.useState<
    VaccinationStageProps[]
  >([]);
  const [treatment, setSelectedTreatment] = React.useState();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      classNames={{
        wrapper: "w-full h-fit",
      }}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <p className="text-2xl font-bold">
            Chi tiết heo [{pigInfo?.pigCode}]
          </p>
        </ModalHeader>
        <ModalBody>
          <DevelopmentLogList selectedPig={pigInfo as Pig} />
          <Tabs
            size="lg"
            color="primary"
            variant="solid"
            defaultSelectedKey="1"
          >
            <Tab
              key="1"
              title={
                <div className="flex items-center">
                  <TbVaccine size={20} />
                  <span className="ml-2">Thông tin tiêm phòng</span>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <PigVaccinationList
                  pigId={pigInfo.id}
                  setCurrentStages={setCurrentStages}
                />
                <PigVaccinationStageList stages={currentStages} />
              </div>
            </Tab>
            <Tab
              key="2"
              title={
                <div className="flex items-center">
                  <ClipboardCheck size={20} />
                  <span className="ml-2">Thông tin chữa bệnh</span>
                </div>
              }
            >
              <div>
                <PigTreatmentPlanList pigId={pigInfo.id} setSelectedTreatment={setSelectedTreatment}/>
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
              <div>
                <PigDiseaseReportList pigId={pigInfo.id}/>
              </div>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PigDetail;
