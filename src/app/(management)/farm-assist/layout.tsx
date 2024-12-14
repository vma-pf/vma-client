import React from "react";
import { GiCage, GiMedicines, GiPig } from "react-icons/gi";
import { TbVaccine } from "react-icons/tb";
import { BsFillCalendarHeartFill } from "react-icons/bs";
import { HiBellAlert } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import Footer from "@oursrc/app/(management)/footer";
import CustomNavbar, { NavbarItem } from "@oursrc/components/custom-navbar";
import CustomHeader from "@oursrc/components/custom-header";
import { LoadingStateProvider } from "@oursrc/lib/context/loading-state-context";

const FarmerAssistantLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const projectName = "VMA";
  const titleMap: { [key: string]: string } = {
    "/herd": projectName + " - " + "Quản lý đàn heo",
    "/herd/create": projectName + " - " + "Tạo đàn mới",
    "/medicine": projectName + " - " + "Quản lý danh mục thuốc",
    "/medicine/new-batch": projectName + " - " + "Tạo đợt nhập thuốc",
    "/vaccination": projectName + " - " + "Lịch tiêm phòng",
    "/treatment": projectName + " - " + "Kế hoạch điều trị",
    "/cage": projectName + " - " + "Quản lý chuồng",
  };
  const navbarItems: NavbarItem[] = [
    {
      path: "/herd",
      title: "Quản lý đàn heo",
      icon: <GiPig size={25} />,
    },
    {
      path: "/medicine",
      title: "Danh mục thuốc",
      icon: <GiMedicines size={25} />,
    },
    {
      path: "/vaccination",
      title: "Lịch tiêm phòng",
      icon: <TbVaccine size={25} />,
    },
    {
      path: "/treatment",
      title: "Kế hoạch điều trị",
      icon: <BsFillCalendarHeartFill size={25} />,
    },
    {
      path: "/cage",
      title: "Quản lý chuồng",
      icon: <GiCage size={25} />,
    },
  ];
  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-grow">
        <div className="border-r-1 border-zinc-300 dark:border-zinc-700">
          <CustomNavbar prefix="/farm-assist" navbarItems={navbarItems} />
        </div>
        <div className="flex-grow">
          <div className="border-b-2 border-zinc-300 dark:border-zinc-700">
            <CustomHeader titleMap={titleMap} prefix="/farm-assist" />
          </div>
          <div className="ml-4 mr-2 mt-2 h-fit">
            <LoadingStateProvider>{children}</LoadingStateProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerAssistantLayout;
