import React from "react";
import { FaHome, FaUser } from "react-icons/fa";
import SideBarOption from "./navbar-option";
import Link from "next/link";
import { GiCctvCamera, GiMedicines, GiPig } from "react-icons/gi";
import { TbVaccine } from "react-icons/tb";
import { BsFillCalendarHeartFill } from "react-icons/bs";
import { HiBellAlert } from "react-icons/hi2";
import ButtonLogout from "./button-logout";

const SideNavbar = () => {
  return (
    <div className="flex flex-col items-center w-52 border-r-1 h-full">
      <Link href="/dashboard">
        <p className="text-2xl font-bold mt-5">VMA-PF</p>
      </Link>
      <div className="w-full mt-10">
        <SideBarOption
          path="/dashboard"
          title="Tổng quan"
          icon={<FaHome size={25} />}
        />
        <SideBarOption path="/pig" title="Heo" icon={<GiPig size={25} />} />
        <SideBarOption
          path="#"
          title="Thuốc"
          icon={<GiMedicines size={25} />}
        />
        <SideBarOption path="#" title="Vacxin" icon={<TbVaccine size={25} />} />
        <SideBarOption
          path="#"
          title="Camera"
          icon={<GiCctvCamera size={25} />}
        />
        <SideBarOption
          path="#"
          title="Kế hoạch điều trị"
          icon={<BsFillCalendarHeartFill size={25} />}
        />
        <SideBarOption
          path="#"
          title="Cảnh báo"
          icon={<HiBellAlert size={25} />}
        />
      </div>
      <ButtonLogout />
    </div>
  );
};

export default SideNavbar;
