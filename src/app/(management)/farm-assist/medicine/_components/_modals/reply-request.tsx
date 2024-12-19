import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button, Input } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { MedicineRequest } from "@oursrc/lib/models/medicine-request";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import { useState } from "react";

const ReplyRequest = ({
  isOpen,
  onClose,
  selectedMedicine,
  answer,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedMedicine: MedicineRequest;
  answer: "accept" | "reject";
}) => {
  const { toast } = useToast();
  const [reason, setReason] = useState<string>("");

  const handleReplyRequest = async () => {
    try {
      if (answer === "accept") {
        const res: ResponseObject<any> = await medicineRequestService.updateStatusApprove(selectedMedicine.id);
        if (res.isSuccess) {
          toast({
            title: "Chấp nhận yêu cầu thành công",
            variant: "success",
          });
          onClose();
        } else {
          toast({
            title: res.errorMessage || "Chấp nhận yêu cầu thất bại",
            variant: "destructive",
          });
        }
      } else {
        const res: ResponseObject<any> = await medicineRequestService.updateStatusReject(selectedMedicine.id);
        if (res.isSuccess) {
          toast({
            title: "Từ chối yêu cầu thành công",
            variant: "success",
          });
          onClose();
        } else {
          toast({
            title: res.errorMessage || "Từ chối yêu cầu thất bại",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <p className="text-xl font-bold">{answer === "accept" ? "Chấp nhận yêu cầu" : "Từ chối yêu cầu"}</p>
          </ModalHeader>
          <ModalBody>
            <p className="text-lg">
              Bạn có chắc chắn muốn {answer === "accept" ? "chấp nhận" : "từ chối"} yêu cầu thuốc{" "}
              {selectedMedicine.newMedicineName ? selectedMedicine.newMedicineName : selectedMedicine.medicineName} không?
            </p>
            {/* {answer === "reject" && (
              <div className="mt-3">
                <Input
                  placeholder="Nhập lý do từ chối"
                  label="Lý do từ chối"
                  labelPlacement="outside"
                  size="lg"
                  value={reason}
                  onValueChange={setReason}
                  isInvalid={!reason}
                  errorMessage="Lý do từ chối không được để trống"
                />
              </div>
            )} */}
          </ModalBody>
          <ModalFooter>
            <Button color={answer === "accept" ? "primary" : "danger"} onPress={handleReplyRequest} isDisabled={answer === "reject" && !reason}>
              {answer === "accept" ? "Chấp nhận" : "Từ chối"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default ReplyRequest;
