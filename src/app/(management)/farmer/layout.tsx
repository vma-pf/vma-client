import React from "react";
import { GiCage, GiMedicines, GiPig } from "react-icons/gi";
import { TbVaccine } from "react-icons/tb";
import { BsFillCalendarHeartFill } from "react-icons/bs";
import { HiBellAlert } from "react-icons/hi2";
import { MdSpaceDashboard } from "react-icons/md";
import Footer from "@oursrc/app/(management)/footer";
import CustomNavbar, { NavbarItem } from "@oursrc/components/custom-navbar";
import CustomHeader from "@oursrc/components/custom-header";
import { LoadingStateProvider } from "@oursrc/components/context/loading-state-context";

const FarmerLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const projectName = "VMA";
  const titleMap: { [key: string]: string } = {
    "/dashboard": projectName + " - " + "Tổng quan",
    "/herd": projectName + " - " + "Quản lý đàn heo",
    "/herd/create": projectName + " - " + "Tạo đàn mới",
    "/medicine": projectName + " - " + "Quản lý thuốc",
    "/medicine/new-batch": projectName + " - " + "Tạo đợt nhập mới",
    "/vaccination": projectName + " - " + "Lịch tiêm phòng",
    "/treatment": projectName + " - " + "Kế hoạch điều trị",
    "/cage": projectName + " - " + "Quản lý chuồng",
  };
  const navbarItems: NavbarItem[] = [
    {
      path: "/dashboard",
      title: "Tổng quan",
      icon: <MdSpaceDashboard size={25} />,
    },
    {
      path: "/herd",
      title: "Quản lý đàn heo",
      icon: <GiPig size={25} />,
    },
    {
      path: "/medicine",
      title: "Quản lý thuốc",
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
          <CustomNavbar prefix="/farmer" navbarItems={navbarItems} />
        </div>
        <div className="flex-grow">
          <div className="border-b-2 border-zinc-300 dark:border-zinc-700">
            <CustomHeader titleMap={titleMap} prefix="/farmer" />
          </div>
          <div className="ml-4 mr-2 mt-2 h-fit">
            <LoadingStateProvider>{children}</LoadingStateProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerLayout;
