"use client"
import { Tab, Tabs } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import CommonDiseaseList from "./_components/common-disease-list";

const CommonDisease = () => {
  const pathname = usePathname();
  return (
    <div className="mb-4">
      <div className="mb-4">
      <Tabs aria-label="Options" size="lg" color="primary" variant="underlined" defaultSelectedKey={pathname}>
        <Tab key="/veterinarian/treatment-guide" title="Hướng dẫn chữa bệnh" href="/veterinarian/treatment-guide">
        </Tab>
        <Tab key="/veterinarian/common-disease" title="Từ điển bệnh" href="/veterinarian/common-disease">
        <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <p className="text-2xl font-bold mb-3">Từ điển bệnh</p>
            <CommonDiseaseList />
          </div>
        </Tab>
      </Tabs>
    </div>
    </div>
  );
}
export default CommonDisease