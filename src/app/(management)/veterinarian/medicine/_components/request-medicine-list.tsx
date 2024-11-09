import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import { MedicineRequest } from "@oursrc/lib/models/medicine-request";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { medicineRequestService } from "@oursrc/lib/services/medicineRequestService";
import { BanIcon, CheckIcon, InfoIcon, Plus } from "lucide-react";
import React from "react";
import { BiSolidInjection } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import { HiChevronDown } from "react-icons/hi2";

const statusColorMap = {
  "Chờ xử lý": "warning",
  "Đã duyệt": "success",
  "Từ chối": "danger",
};

const RequestMedicineList = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [requestMedicineList, setRequestMedicineList] = React.useState<MedicineRequest[]>([]);
  const [filterStatus, setFilterStatus] = React.useState("all");

  const filterValue = React.useMemo(() => {
    if (filterStatus === "all") return "Tất cả";
    else if (filterStatus === "Chờ xử lý") return "Chờ xử lý";
    else if (filterStatus === "Đã yêu cầu") return "Đã yêu cầu";
    else if (filterStatus === "Đã duyệt") return "Đã duyệt";
    else if (filterStatus === "Từ chối") return "Từ chối";
  }, [filterStatus]);

  const filterMedicineRequest = (status: string) => {
    const data = requestMedicineList || [];
    if (status === "all") return data;
    else if (status === "Chờ xử lý") return data.filter((item) => item.status === "Chờ xử lý");
    else if (status === "Đã yêu cầu") return data.filter((item) => item.status === "Đã yêu cầu");
    else if (status === "Đã duyệt") return data.filter((item) => item.status === "Đã duyệt");
    else if (status === "Từ chối") return data.filter((item) => item.status === "Từ chối");
    else return data;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response: ResponseObjectList<MedicineRequest> = await medicineRequestService.getMyMedicineRequest(1, 500);
      if (response.isSuccess) {
        setRequestMedicineList(response.data.data);
      } else {
        console.log(response.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="text-2xl font-bold">Yêu cầu nhập thuốc</p>
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<HiChevronDown className="text-small" />} variant="flat">
              {filterValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={filterStatus ? [filterStatus] : []}
            onSelectionChange={(keys: any) => {
              setFilterStatus(keys.values().next().value);
              // setRequestMedicineList(filterMedicineRequest(keys === "all" ? "all" : keys.values().next().value));
            }}
          >
            <DropdownItem key="all">Tất cả</DropdownItem>
            <DropdownItem key="Chờ xử lý">Chờ xử lý</DropdownItem>
            <DropdownItem key="Đã duyệt">Đã duyệt</DropdownItem>
            <DropdownItem key="Từ chối">Từ chối</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="max-h-[500px] overflow-auto">
        {isLoading ? (
          <div>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="my-2 border-2 rounded-lg">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            ))}
          </div>
        ) : requestMedicineList.length === 0 || filterMedicineRequest(filterStatus).length === 0 ? (
          <div className="text-center">Không có yêu cầu nào</div>
        ) : (
          filterMedicineRequest(filterStatus).map((request: MedicineRequest) => (
            <div key={request.id}>
              <div className="my-2 flex items-center hover:bg-gray-100 dark:hover:bg-zinc-600 p-3 rounded-lg">
                <BiSolidInjection size={25} className="text-primary" />
                <div className="ml-3">
                  {request.newMedicineName && <p className="text-xl mb-3">{request.newMedicineName}</p>}
                  {request.medicineName && <p className="text-xl mb-3">{request.medicineName}</p>}
                  <p>
                    Số lượng:<strong> {request.quantity}</strong>
                  </p>
                  <p>
                    Trạng thái:{" "}
                    <strong
                      className={`text-${
                        request.status === "Chờ xử lý" ? "warning" : request.status === "Đã duyệt" ? "success" : request.status === "Đã yêu cầu" ? "sky" : "danger"
                      }-500`}
                    >
                      {request.status}
                    </strong>
                  </p>
                </div>
                {request.newMedicineName && <FaStar size={25} className="ml-auto text-warning" />}
              </div>
              <Divider orientation="horizontal" />
            </div>
          ))
        )}
      </div>
      {/* <Tabs>
        <Tab key="pending" title="Chờ duyệt" className="w-full">
          <Card className="mb-2">
            <CardBody>
              <Accordion>
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
                  </div>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Accordion>
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
            </CardBody>
          </Card>
        </Tab>
        <Tab key="approved" title="Đã duyệt" className="w-full">
          <Card>
            <CardBody>
              <Accordion>
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
            </CardBody>
          </Card>
        </Tab>
        <Tab key="canceled" title="Đã từ chối" className="w-full">
          <Card>
            <CardBody>
              <Accordion>
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
            </CardBody>
          </Card>
        </Tab>
      </Tabs> */}
      {/* <ModalRequestMedicine isOpen={isOpen} onOpenChange={onOpenChange} /> */}
    </div>
  );
};

export default RequestMedicineList;
