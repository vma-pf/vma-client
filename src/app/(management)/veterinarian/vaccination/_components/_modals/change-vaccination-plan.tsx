import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import CreateVaccination from "../../create-plan/_components/create-vaccination";

const ChangeVaccinationPlan = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <div>
      <Modal size="5xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-2xl">Đổi lịch tiêm phòng</p>
          </ModalHeader>
          <ModalBody>
            <div>
              <CreateVaccination type="update" />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default ChangeVaccinationPlan;
