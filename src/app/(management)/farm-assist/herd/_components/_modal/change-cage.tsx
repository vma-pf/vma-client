import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Cage } from "@oursrc/lib/models/cage";
import { Pig } from "@oursrc/lib/models/pig";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { cageService } from "@oursrc/lib/services/cageService";
import React from "react";

const ChangeCage = ({ isOpen, onClose, pigInfo }: { isOpen: boolean; onClose: () => void; pigInfo: Pig }) => {
  const [cages, setCages] = React.useState<Cage[]>([]);
  const [selectedCage, setSelectedCage] = React.useState<Cage | undefined>();

  const handleSelectCage = (cage: Cage) => {
    if (cage.availableQuantity && cage.availableQuantity < cage.capacity) {
      if (cage.id !== selectedCage?.id) {
        setSelectedCage(cage);
      } else {
        setSelectedCage(undefined);
      }
    }
  };

  const handleChangeCage = async () => {};

  const fetchCages = async () => {
    try {
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res.isSuccess) {
        setCages(res.data.data);
        setSelectedCage(res.data.data.find((cage) => cage.id === pigInfo.cageId) || undefined);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchCages();
  }, []);
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" hideCloseButton scrollBehavior="inside" isDismissable={false}>
        <ModalContent>
          <ModalHeader>
            <p className="text-2xl font-bold">Chuyển chuồng cho heo {pigInfo?.pigCode}</p>
          </ModalHeader>
          <ModalBody>
            <p className="text-xl font-semibold">Danh sách chuồng</p>
            <div className="grid grid-cols-2">
              {cages.map((cage) => (
                <div
                  className={`m-2 border-2 rounded-lg p-2 ${
                    cage.availableQuantity && cage.availableQuantity >= cage.capacity ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
                  } ${selectedCage?.id === cage.id ? "bg-emerald-200" : ""}`}
                  key={cage.id}
                  onClick={() => handleSelectCage(cage)}
                >
                  <p className="text-lg">Chuồng: {cage.code}</p>
                  <p className="text-lg">
                    Sức chứa: {cage.availableQuantity ?? 0}/{cage.capacity}
                  </p>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                onClose();
              }}
            >
              Hủy
            </Button>
            <Button color="primary" isDisabled={selectedCage ? false : true} onPress={handleChangeCage}>
              Lưu
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChangeCage;
