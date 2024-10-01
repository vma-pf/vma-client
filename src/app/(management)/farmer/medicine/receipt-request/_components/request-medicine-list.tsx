import { Accordion, AccordionItem, Button, Card, Tooltip, useDisclosure } from "@nextui-org/react";
import { InfoIcon, Plus } from "lucide-react";
import RequestMedicineModal from "../_modals/modal-request-medicine";
import ModalRequestMedicine from "../_modals/modal-request-medicine";

const RequestMedicineList = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const getStatus = (status: string = "pending") => {
    switch (status) {
      case "pending":
        return (
          <Tooltip color="warning" content="Đang chờ duyệt">
            <InfoIcon className="text-warning" />
          </Tooltip>
        );
      case "canceled":
        return (
          <Tooltip color="danger" content="Đã từ chối">
            <InfoIcon className="text-danger" />
          </Tooltip>
        );
      case "approved":
        return (
          <Tooltip color="success" content="Đã duyệt">
            <InfoIcon className="text-success" />
          </Tooltip>
        );
    }
  };
  const getRequestItemTitle = (title: string, requestDate: string) => {
    return (
      <div className="flex justify-between items-center">
        <h3>{title}</h3>
        <h3>{requestDate}</h3>
      </div>
    );
  };
  const openRequestModal = () => {};
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-end mb-6">
          <Button color="primary" endContent={<Plus />} onPress={onOpen}>
            Tạo yêu cầu mới
          </Button>
        </div>
        <Accordion variant="splitted">
          <AccordionItem key="1" startContent={getStatus("pending")} aria-label="Accordion 1" title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh", "20/09/2024")}>
            <div className="mx-auto">
              <div className="grid grid-cols-4 gap-4">
                <Card className="flex justify-between p-4">
                  <span>Thuốc A</span>
                  <span>Đang chờ duyet</span>
                </Card>
                <Card className="p-4">Thuoc A</Card>
                <Card className="p-4">Thuoc A</Card>
                <Card className="p-4">Thuoc A</Card>
                <Card className="p-4">Thuoc A</Card>
              </div>
            </div>
          </AccordionItem>
          <AccordionItem key="1" startContent={getStatus("canceled")} aria-label="Accordion 1" title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh", "20/09/2024")}>
            <div className="mx-auto">
              <Card className="p-4">{defaultContent}</Card>
            </div>
          </AccordionItem>
          <AccordionItem key="1" startContent={getStatus("approved")} aria-label="Accordion 1" title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh", "20/09/2024")}>
            <div className="mx-auto">
              <Card className="p-4">{defaultContent}</Card>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      <ModalRequestMedicine isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
};

export default RequestMedicineList;
