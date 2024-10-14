"use client";
import { Button, ResizablePanel, Tab, Tabs } from "@nextui-org/react";
import MedicineList from "./_components/medicine-list";
import RequestMedicineList from "./_components/request-medicine-list";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

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
            router.push("/farmer/medicine/new-batch");
          }}
        >
          Tạo lô mới
        </Button>
      </div>
      <Tabs aria-label="Options" size="lg" color="primary" variant="underlined" defaultSelectedKey="/farmer/medicine">
        <Tab key="/farmer/medicine" title="Kho thuốc">
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-2xl font-bold mb-3">Danh sách thuốc đã nhập</p>
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
