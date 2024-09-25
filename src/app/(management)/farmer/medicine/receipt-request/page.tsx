"use client"
import { Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const MedicineReceiptRequest = () => {
  const pathname = usePathname();
  return (
    <div>
      <div className="mb-4">
        <Tabs
          aria-label="Options"
          size="lg"
          color="primary"
          variant="underlined"
          selectedKey={pathname}
          defaultSelectedKey={pathname}
        >
          <Tab
            key="/farmer/medicine"
            href="/farmer/medicine"
            title="Kho thuốc"
          />
          <Tab
            key="/farmer/medicine/receipt-request"
            href="/farmer/medicine/receipt-request"
            title="Yêu cầu thêm thuốc"
          />
          <Tab key="/farmer/disease-report" href="/farmer/disease-report" title="Từ điển bệnh" />
        </Tabs>
      </div>
    </div>
  );
};

export default MedicineReceiptRequest;