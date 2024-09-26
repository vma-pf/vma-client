import {
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter
} from "@nextui-org/modal";
import { Button } from "@nextui-org/react";

const ModalRequestMedicine = ({isOpen, onOpenChange}: any) => {
  return (
    <div>
      <Modal isOpen={isOpen} size="4xl" onOpenChange={onOpenChange} >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tạo yêu cầu mới
              </ModalHeader>
              <ModalBody>
                <div className="">

                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                Tạo yêu cầu mới
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default ModalRequestMedicine;
