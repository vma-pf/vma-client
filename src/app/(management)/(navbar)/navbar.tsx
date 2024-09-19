"use client";
import React from "react";
import { FaHome, FaUser } from "react-icons/fa";
import SideBarOption from "./navbar-option";
import Link from "next/link";
import { GiCage, GiCctvCamera, GiMedicines, GiPig } from "react-icons/gi";
import { TbVaccine } from "react-icons/tb";
import {
  BsFillArrowLeftCircleFill,
  BsFillCalendarHeartFill,
} from "react-icons/bs";
import { HiBellAlert } from "react-icons/hi2";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import { MdSpaceDashboard } from "react-icons/md";
import { useRouter } from "next/navigation";
import { apiRequest } from "@oursrc/app/(auth)/api-request";
import { handleErrorApi } from "@oursrc/lib/utils";
import { FiLogOut } from "react-icons/fi";

type NavbarItem = {
  path: string;
  title: string;
  icon: any;
};

const SideNavbar = () => {
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
    {
      path: "/alert",
      title: "Cảnh báo",
      icon: <HiBellAlert size={25} />,
    },
  ];
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(true);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await apiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
      setIsLoading(false);
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <div
      className={`flex flex-col py-3 bg-slate-200 dark:bg-zinc-800 items-center rounded-2xl ${
        open ? "w-56" : "w-20"
      } h-full duration-300`}
    >
      <Link href="/dashboard">
        <Image
          className="duration-300"
          src="/assets/vma-logo.png"
          alt="logo"
          width={open ? 80 : 50}
          height={open ? 80 : 50}
        />
      </Link>
      <BsFillArrowLeftCircleFill
        size={25}
        className={`relative ${
          open ? "left-28" : "left-10 rotate-180"
        } duration-300`}
        onClick={() => setOpen(!open)}
      />
      <Divider orientation="horizontal" className="w-4/5 mt-3" />
      {open ? (
        <div className="w-full mt-3">
          <SideBarOption
            path="/dashboard"
            title="Tổng quan"
            icon={<MdSpaceDashboard size={25} />}
            open={open}
          />
          <SideBarOption
            path="/herd"
            title="Quản lý đàn heo"
            icon={<GiPig size={25} />}
            open={open}
          />
          <SideBarOption
            path="/medicine"
            title="Quản lý thuốc"
            icon={<GiMedicines size={25} />}
            open={open}
          />
          <Accordion defaultExpandedKeys={["1"]}>
            <AccordionItem key="1" subtitle={open ? "Quản lý dịch tễ" : ""}>
              <SideBarOption
                path="/vaccination"
                title="Lịch tiêm phòng"
                icon={<TbVaccine size={25} />}
                open={open}
              />
              <SideBarOption
                path="/treatment"
                title="Kế hoạch điều trị"
                icon={<BsFillCalendarHeartFill size={25} />}
                open={open}
              />
            </AccordionItem>
          </Accordion>
          <SideBarOption
            path="/cage"
            title="Quản lý chuồng"
            icon={<GiCage size={25} />}
            open={open}
          />
          <SideBarOption
            path="/alert"
            title="Cảnh báo"
            icon={<HiBellAlert size={25} />}
            open={open}
          />
        </div>
      ) : (
        <div className="w-full mt-3">
          {navbarItems.map((item, index) => (
            <SideBarOption
              key={index}
              path={item.path}
              title={item.title}
              icon={item.icon}
              open={open}
            />
          ))}
        </div>
      )}
      <Divider orientation="horizontal" className="w-4/5 mt-3" />
      {open ? (
        <Button
          className="mt-5"
          variant="solid"
          color="danger"
          isLoading={isLoading}
          endContent={<FiLogOut size={20} />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      ) : (
        <Tooltip content="Đăng xuất" placement="right" closeDelay={200}>
          <Button
            className="mt-5"
            variant="solid"
            color="danger"
            isIconOnly
            isLoading={isLoading}
            endContent={<FiLogOut size={20} />}
            onClick={handleLogout}
          ></Button>
        </Tooltip>
      )}
    </div>
  );
};

export default SideNavbar;
