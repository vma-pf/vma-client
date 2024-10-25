"use client";
import { Button, ResizablePanel, Tab, Tabs } from "@nextui-org/react";
import MedicineList from "./_components/medicine-list";
import RequestMedicineList from "./_components/request-medicine-list";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { MdOutlineWarehouse } from "react-icons/md";
import { TbPackageExport } from "react-icons/tb";

const Medicine = () => {
  const router = useRouter();
  return (
    <div className="mb-4">
      <div className="flex justify-end">
        <Button
          color="primary"
          variant="solid"
          endContent={<PlusIcon size={20} />}
          onPress={() => {
            router.push("/farm-assist/medicine/new-batch");
          }}
        >
          Tạo lô mới
        </Button>
      </div>
      <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="2">
        <Tab
          key="1"
          title={
            <div className="flex items-center">
              <MdOutlineWarehouse size={20} />
              <span className="ml-2">Kho thuốc</span>
            </div>
          }
        >
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-2xl font-bold mb-3">Danh sách thuốc đã nhập</p>
            <MedicineList />
          </div>
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center">
              <TbPackageExport size={20} />
              <span className="ml-2">Yêu cầu xuất thuốc</span>
            </div>
          }
        >
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <RequestMedicineList />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Medicine;
