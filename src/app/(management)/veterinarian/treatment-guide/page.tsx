"use client"
import { Button, Tab, Tabs } from "@nextui-org/react";
import TreatmentGuideList from "./_components/treatment-guide-list"
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const TreatmentGuide = () => {
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
        <Tab key="/veterinarian/treatment-guide" title="Hướng dẫn chữa bệnh">
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-2xl font-bold mb-3">Danh sách hướng dẫn chữa bệnh</p>
            <TreatmentGuideList />
          </div>
        </Tab>
        <Tab key="/veterinarian" title="Từ điển bệnh">
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            {/* <RequestMedicineList /> */}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
export default TreatmentGuide