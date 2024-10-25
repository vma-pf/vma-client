import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Pig } from "@oursrc/lib/models/pig";
import React from "react";
import DevelopmentLogList from "../development-log-list";

const PigDetail = ({ isOpen, onClose, pigInfo }: { isOpen: boolean; onClose: () => void; pigInfo: Pig }) => {
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
          <p className="text-2xl font-bold">Chi tiết heo {pigInfo?.pigCode}</p>
        </ModalHeader>
        <ModalBody>
          <DevelopmentLogList selectedPig={pigInfo as Pig} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PigDetail;
