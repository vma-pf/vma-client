import React from "react";
import { Cage, Pig } from "./assign-tag";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const AssignInfo = ({
  isOpen,
  onClose,
  selectedPig,
  setSelectedPig,
  setUnassignedPigs,
  setAssignedPigs,
  unassignedPigs,
  assignedPigs,
  cages,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedPig: Pig;
  setSelectedPig: React.Dispatch<React.SetStateAction<Pig | undefined>>;
  setUnassignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  setAssignedPigs: React.Dispatch<React.SetStateAction<Pig[]>>;
  unassignedPigs: Pig[];
  assignedPigs: Pig[];
  cages: Cage[];
}) => {
  const handleAssignPig = (pig: Pig) => {
    setUnassignedPigs(unassignedPigs.filter((p) => p.id !== pig.id));
    setAssignedPigs([...assignedPigs, pig]);
  };
  const handleSelectCage = (cage: Cage) => {
    if (selectedPig.cage?.id === cage.id) {
      setSelectedPig({ ...selectedPig, cage: undefined });
    } else {
      if (cage.currentQuantity >= cage.capacity) {
        return;
      }
      setSelectedPig({ ...selectedPig, cage });
    }
  };
  return (
    <div>
      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <p className="text-2xl">Thông tin heo</p>
          </ModalHeader>
          <ModalBody>
            <p className="text-lg">{selectedPig?.name}</p>
            <p className="text-lg">Tag 12345678</p>
            <Input
              className="mb-5"
              type="text"
              radius="sm"
              size="lg"
              label="Cân nặng"
              placeholder="Nhập cân nặng"
              labelPlacement="outside"
              isRequired
              value={selectedPig?.weight?.toString() || ""}
              onValueChange={(e) =>
                setSelectedPig({ ...selectedPig, weight: Number(e) })
              }
            />
            <Input
              className="mb-5"
              type="text"
              radius="sm"
              size="lg"
              label="Chiều cao"
              placeholder="Nhập chiều cao"
              labelPlacement="outside"
              isRequired
              value={selectedPig?.height?.toString() || ""}
              onValueChange={(e) =>
                setSelectedPig({ ...selectedPig, height: Number(e) })
              }
            />
            <Input
              className="mb-5"
              type="text"
              radius="sm"
              size="lg"
              label="Chiều rộng"
              placeholder="Nhập chiều rộng"
              labelPlacement="outside"
              isRequired
              value={selectedPig?.width?.toString() || ""}
              onValueChange={(e) =>
                setSelectedPig({ ...selectedPig, width: Number(e) })
              }
            />
            <p className="text-lg">Danh sách chuồng</p>
            <div className="grid grid-cols-2">
              {cages.map((cage) => (
                <div
                  className={`m-2 border-2 rounded-lg p-2 ${
                    selectedPig?.cage?.id === cage.id ? "bg-primary" : ""
                  } ${
                    cage.currentQuantity >= cage.capacity
                      ? "bg-gray-300 cursor-not-allowed"
                      : ""
                  }`}
                  key={cage.id}
                  onClick={() => handleSelectCage(cage)}
                >
                  <p className="text-lg">{cage.name}</p>
                  <p className="text-lg">
                    Sức chứa: {cage.currentQuantity}/{cage.capacity}
                  </p>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="primary"
              onPress={() => {
                onClose();
                handleAssignPig(selectedPig as Pig);
              }}
              isDisabled={selectedPig?.cage ? false : true}
            >
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AssignInfo;
