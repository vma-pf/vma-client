import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Pig } from "@oursrc/lib/models/pig";
import React from "react";
import DevelopmentLogList from "../development-log-list";
import PigVaccinationList from "@oursrc/components/vaccination/pig-vaccination-list";
import { VaccinationStageProps } from "@oursrc/lib/models/vaccination";
import PigVaccinationStageList from "@oursrc/components/vaccination/pig-vaccination-stage-list";

const PigDetail = ({ isOpen, onClose, pigInfo }: { isOpen: boolean; onClose: () => void; pigInfo: Pig }) => {
  const [currentStages, setCurrentStages] = React.useState<VaccinationStageProps[]>([]);
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
          <p className="text-2xl font-bold">Chi tiết heo [{pigInfo?.pigCode}]</p>
        </ModalHeader>
        <ModalBody>
          <DevelopmentLogList selectedPig={pigInfo as Pig} />
          <div className="grid grid-cols-2 gap-4">
            <PigVaccinationList pigId={pigInfo.id} setCurrentStages={setCurrentStages}/>
            <PigVaccinationStageList stages={currentStages} />
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PigDetail;
