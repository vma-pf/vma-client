"use client";
import React from "react";
import MedicineList from "./components/medicine-list";
import { Image, Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { apiRequest } from "./api-request";

const Medicine = async () => {
  const pathname = usePathname();
  const res = await apiRequest.getMedicine(1, 5);
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
          <Tab
            key="/farmer/disease-report"
            href="/farmer/disease-report"
            title="Từ điển bệnh"
          />
        </Tabs>
      </div>
      <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/assets/vma-logo.png"
              alt="logo"
              width={50}
              height={55}
            />
            <p className="text-2xl font-bold ml-4">Thông tin kho thuốc</p>
          </div>
        </div>
      </div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <MedicineList data={res} />
      </div>
    </div>
  );
};

export default Medicine;
