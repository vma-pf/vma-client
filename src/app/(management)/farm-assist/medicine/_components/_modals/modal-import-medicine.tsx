import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal";
import { Button, Divider } from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { medicineService } from "@oursrc/lib/services/medicineService";
import React from "react";
import AttachFile from "@oursrc/components/ui/attach-media/attach-file";

const ImportMedicineModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | string>();
  const [loading, setLoading] = React.useState(false);

  const handleImport = async () => {
    if (!selectedFile || typeof selectedFile === "string") {
      toast({
        variant: "destructive",
        title: "Vui lòng chọn file Excel để import",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await medicineService.importMedicineExcel(selectedFile);
      if (response.isSuccess) {
        toast({
          variant: "success",
          title: response.data || "Import thuốc thành công",
        });
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: response.errorMessage || "Import thuốc thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra khi import thuốc",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(undefined);
    }
  }, [isOpen]);

  return (
    <Modal
      isDismissable={false}
      backdrop="opaque"
      isOpen={isOpen}
      size="2xl"
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Import thuốc từ Excel
          <Divider orientation="horizontal" />
        </ModalHeader>
        <ModalBody>
          <AttachFile
            fileId="import-medicine"
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose}>
            <p className="text-white">Hủy</p>
          </Button>
          <Button
            variant="solid"
            color="primary"
            isLoading={loading}
            onPress={handleImport}
          >
            <p className="text-white">Import</p>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportMedicineModal;
