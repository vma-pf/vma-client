import React from "react";
import { FaHome, FaUser } from "react-icons/fa";
import SideBarOption from "./navbar-option";
import Link from "next/link";
import { GiCctvCamera, GiMedicines, GiPig } from "react-icons/gi";
import { TbVaccine } from "react-icons/tb";
import { BsFillCalendarHeartFill } from "react-icons/bs";
import { HiBellAlert } from "react-icons/hi2";
import ButtonLogout from "./button-logout";
import { Button, Divider } from "@nextui-org/react";

const SideNavbar = () => {
  return (
    <div className="flex flex-col bg-slate-200 dark:bg-zinc-800 items-center rounded-2xl w-52 h-full">
      <Link href="/dashboard">
        <p className="text-2xl font-bold mt-5">VMA-PF</p>
      </Link>
      <Divider orientation="horizontal" className="w-4/5 mt-5" />
      <div className="w-full mt-5">
        <SideBarOption
          path="/dashboard"
          title="Tổng quan"
          icon={<FaHome size={25} />}
        />
        <SideBarOption path="/pig" title="Heo" icon={<GiPig size={25} />} />
        <SideBarOption
          path="/medicine"
          title="Thuốc"
          icon={<GiMedicines size={25} />}
        />
        <SideBarOption
          path="/vaccination"
          title="Vacxin"
          icon={<TbVaccine size={25} />}
        />
        <SideBarOption
          path="/camera"
          title="Camera"
          icon={<GiCctvCamera size={25} />}
        />
        <SideBarOption
          path="/treatment-plan"
          title="Kế hoạch điều trị"
          icon={<BsFillCalendarHeartFill size={25} />}
        />
        <SideBarOption
          path="/alert"
          title="Cảnh báo"
          icon={<HiBellAlert size={25} />}
        />
      </div>
      <ButtonLogout />
    </div>
  );
};

export default SideNavbar;
