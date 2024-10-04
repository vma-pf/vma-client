"use client";
import { Tab, Tabs } from "@nextui-org/react";
import MedicineList from "./_components/medicine-list";
import RequestMedicineList from "./_components/request-medicine-list";

const Medicine = () => {
  return (
    <div className="mb-4">
      <Tabs aria-label="Options" size="lg" color="primary" variant="underlined" defaultSelectedKey="/farmer/medicine">
        <Tab key="/farmer/medicine" title="Kho thuốc">
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-2xl font-bold mb-3">Danh sách thuốc trong kho</p>
            <MedicineList />
          </div>
        </Tab>
        <Tab key="/farmer/medicine/receipt-request" title="Yêu cầu thêm thuốc">
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <RequestMedicineList />
          </div>
        </Tab>
        <Tab key="/farmer/disease-report" title="Từ điển bệnh" />
      </Tabs>
    </div>
  );
};

export default Medicine;
