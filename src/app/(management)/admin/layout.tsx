import React from "react";
import { GiCctvCamera } from "react-icons/gi";
import CustomNavbar, { NavbarItem } from "@oursrc/components/custom-navbar";
import CustomHeader from "@oursrc/components/custom-header";
import { BiSolidUserAccount } from "react-icons/bi";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const projectName = "VMA";
  const titleMap: { [key: string]: string } = {
    "/account": projectName + " - " + "Quản lý tài khoản",
    "/camera": projectName + " - " + "Quản lý camera",
  };
  const navbarItems: NavbarItem[] = [
    {
      path: "/account",
      title: "Quản lý tài khoản",
      icon: <BiSolidUserAccount size={25} />,
    },
    {
      path: "/camera",
      title: "Quản lý camera",
      icon: <GiCctvCamera size={25} />,
    },
  ];
  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-grow">
        <div className="border-r-1 border-zinc-300 dark:border-zinc-700">
          <CustomNavbar prefix="/admin" navbarItems={navbarItems} />
        </div>
        <div className="flex-grow">
          <div className="border-b-2 border-zinc-300 dark:border-zinc-700">
            <CustomHeader titleMap={titleMap} prefix="/admin" />
          </div>
          <div className="ml-4 mr-2 mt-2 h-fit">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
