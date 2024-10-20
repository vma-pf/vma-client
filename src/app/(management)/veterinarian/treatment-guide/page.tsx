"use client"
import { Tab, Tabs } from "@nextui-org/react";
import TreatmentGuideList from "./_components/treatment-guide-list";
import { usePathname } from "next/navigation";

const TreatmentGuide = () => {
  const pathname  = usePathname();
  return (
    <div className="mb-4">
      <Tabs aria-label="Options" size="lg" color="primary" variant="underlined" defaultSelectedKey={pathname}>
        <Tab key="/veterinarian/treatment-guide" title="Hướng dẫn chữa bệnh" href="/veterinarian/treatment-guide">
          <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-2xl font-bold mb-3">Danh sách hướng dẫn chữa bệnh</p>
            <TreatmentGuideList />
          </div>
        </Tab>
        <Tab key="/veterinarian/common-disease" title="Từ điển bệnh" href="/veterinarian/common-disease">
        </Tab>
      </Tabs>
    </div>
  );
}
export default TreatmentGuide