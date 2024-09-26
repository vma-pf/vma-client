"use client";
import { Tab, Tabs } from "@nextui-org/react";
import MedicineList from "./components/medicine-list";
import RequestMedicineList from "./receipt-request/components/request-medicine-list";

const Medicine = () => {
  return (
    <div>
      <div className="container mx-auto mb-4">
        <Tabs
          aria-label="Options"
          size="lg"
          color="primary"
          variant="underlined"
          defaultSelectedKey="/farmer/medicine"
        >
          <Tab key="/farmer/medicine" title="Kho thuốc">
            <MedicineList />
          </Tab>
          <Tab
            key="/farmer/medicine/receipt-request"
            title="Yêu cầu thêm thuốc"
          >
            <div className="mx-12">
              <RequestMedicineList />
            </div>
          </Tab>
          <Tab key="/farmer/disease-report" title="Từ điển bệnh" />
        </Tabs>
      </div>
    </div>
  );
};

export default Medicine;
