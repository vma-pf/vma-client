"use client";
import React from "react";
import NavbarOptions from "./navbar-options";
import Link from "next/link";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { Button, Divider, Tooltip } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@oursrc/lib/utils";
import { FiLogOut } from "react-icons/fi";
import { authService } from "@oursrc/lib/services/authService";
import { useToast } from "@oursrc/hooks/use-toast";

export type NavbarItem = {
  path: string;
  title: string;
  icon: any;
};

const CustomNavbar = ({ navbarItems, prefix }: { navbarItems: NavbarItem[]; prefix: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState<boolean>(true);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      await authService.logoutFromNextClientToNextServer();
      router.push("/login");
      toast({
        title: "Đăng xuất thành công",
        variant: "success",
      });
    } catch (error) {
      handleErrorApi({ error });
      toast({
        title: "Đăng xuất thất bại",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`${open ? "w-56" : "w-20"} h-full duration-300`}>
      <div className={`flex flex-col py-3 bg-slate-200 dark:bg-zinc-800 items-center rounded-2xl ${open ? "w-56" : "w-20"} h-fit duration-300 fixed left-4 top-3 z-50`}>
        <Link href={prefix + "/dashboard"}>
          <Image className="duration-300" src="/assets/vma-logo.png" alt="logo" width={open ? 80 : 50} height={open ? 80 : 50} />
        </Link>
        <BsFillArrowLeftCircleFill size={25} className={`relative ${open ? "left-28" : "left-10 rotate-180"} duration-300`} onClick={() => setOpen(!open)} />
        <Divider orientation="horizontal" className="w-4/5 mt-3" />
        <div className="w-full mt-3">
          {navbarItems.map((item, index) => (
            <NavbarOptions key={index} path={item.path} prefix={prefix} title={item.title} icon={item.icon} open={open} />
          ))}
        </div>

        <Divider orientation="horizontal" className="w-4/5 mt-3" />
        {open ? (
          <Button className="mt-5" variant="solid" color="danger" isLoading={isLoading} endContent={<FiLogOut size={20} />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        ) : (
          <Tooltip content="Đăng xuất" placement="right" closeDelay={200}>
            <Button className="mt-5" variant="solid" color="danger" isIconOnly isLoading={isLoading} endContent={<FiLogOut size={20} />} onClick={handleLogout}></Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default CustomNavbar;
