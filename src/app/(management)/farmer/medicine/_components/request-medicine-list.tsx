import { Accordion, AccordionItem, Button, Card, CardBody, Input, Tab, Tabs, Tooltip, useDisclosure } from "@nextui-org/react";
import { BanIcon, CheckIcon, InfoIcon, Plus } from "lucide-react";
import ModalRequestMedicine from "./_modals/modal-request-medicine";
import { useState } from "react";
import { useForm } from "react-hook-form";

const RequestMedicineList = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpenReasonField, setIsOpenReasonField] = useState(false);
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const getStatus = (status: string) => {
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
            <BanIcon className="text-danger" />
          </Tooltip>
        );
      case "approved":
        return (
          <Tooltip color="success" content="Đã duyệt">
            <CheckIcon className="text-success" />
          </Tooltip>
        );
    }
  };
  const getRequestItemTitle = (title: string, requestDate: string) => {
    return (
      <div className="flex justify-between items-center">
        <h3 className="truncate max-w-96">{title}</h3>
        <small>
          yêu cầu ngày: <strong>{requestDate}</strong>
        </small>
      </div>
    );
  };

  const handleChangeRequestStatus = (data: any) => {
    console.log("data", data);
  };
  return (
    <form>
      <div className="container mx-auto">
        {/* <div className="flex justify-end mb-6">
          <Button color="primary" endContent={<Plus />} onPress={onOpen}>
            Tạo yêu cầu mới
          </Button>
        </div> */}
        <div>
          <Tabs isVertical={true}>
            <Tab key="pending" title="Chờ duyệt" className="w-full">
              <Accordion variant="splitted" className="mb-2">
                <AccordionItem
                  key="1"
                  startContent={getStatus("pending")}
                  aria-label="Accordion 1"
                  title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh", "20/09/2024")}
                >
                  <div className="mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        <Tooltip color="warning" content="Đang chờ duyệt">
                          <InfoIcon className="text-warning" />
                        </Tooltip>
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        <Tooltip color="warning" content="Đang chờ duyệt">
                          <InfoIcon className="text-warning" />
                        </Tooltip>
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        <Tooltip color="warning" content="Đang chờ duyệt">
                          <InfoIcon className="text-warning" />
                        </Tooltip>
                      </Card>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <Button
                        color="primary"
                        onClick={() => {
                          handleChangeRequestStatus({ status: "approved" });
                        }}
                      >
                        Phê duyệt
                      </Button>
                      <Button
                        color="danger"
                        isDisabled={isOpenReasonField && errors.reason ? true : false}
                        onClick={() => {
                          setValue("status", "rejected");
                          if (isOpenReasonField && !errors.reason) {
                            handleSubmit(handleChangeRequestStatus)();
                          } else {
                            setIsOpenReasonField(true);
                          }
                        }}
                      >
                        Từ chối
                      </Button>
                    </div>
                    {isOpenReasonField && (
                      <Input
                        size="lg"
                        isRequired
                        placeholder="Nhập lý do"
                        label="Lý do từ chối"
                        labelPlacement="outside"
                        isInvalid={errors.reason ? true : false}
                        errorMessage="Lý do từ chối không được để trống"
                        {...register("reason", { required: true })}
                      />
                    )}
                  </div>
                </AccordionItem>
              </Accordion>
              <Accordion variant="splitted" className="mb-2">
                <AccordionItem
                  key="1"
                  startContent={getStatus("pending")}
                  aria-label="Accordion 1"
                  title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh lý cho heooooooooooooooooo", "20/09/2024")}
                >
                  <div className="mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        <Tooltip color="warning" content="Đang chờ duyệt">
                          <InfoIcon className="text-warning" />
                        </Tooltip>
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        <Tooltip color="warning" content="Đang chờ duyệt">
                          <InfoIcon className="text-warning" />
                        </Tooltip>
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        <Tooltip color="warning" content="Đang chờ duyệt">
                          <InfoIcon className="text-warning" />
                        </Tooltip>
                      </Card>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </Tab>
            <Tab key="approved" title="Đã duyệt" className="w-full">
              <Accordion variant="splitted" className="mb-2">
                <AccordionItem
                  key="1"
                  startContent={getStatus("approved")}
                  aria-label="Accordion 1"
                  title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh", "20/09/2024")}
                >
                  <div className="mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        {getStatus("approved")}
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        {getStatus("approved")}
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        {getStatus("approved")}
                      </Card>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </Tab>
            <Tab key="canceled" title="Đã từ chối" className="w-full">
              <Accordion variant="splitted" className="mb-2">
                <AccordionItem
                  key="1"
                  startContent={getStatus("canceled")}
                  aria-label="Accordion 1"
                  title={getRequestItemTitle("Yêu cầu nhập thuốc kháng sinh", "20/09/2024")}
                >
                  <div className="mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        {getStatus("approved")}
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        {getStatus("canceled")}
                      </Card>
                      <Card className="flex flex-row justify-between p-4">
                        <span className="truncate">Thuốc Aaaaaaaaaaaaaaaaaaa</span>
                        {getStatus("canceled")}
                      </Card>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </Tab>
          </Tabs>
        </div>
      </div>
      {/* <ModalRequestMedicine isOpen={isOpen} onOpenChange={onOpenChange} /> */}
    </form>
  );
};

export default RequestMedicineList;
