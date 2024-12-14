"use client";
import React, { useEffect, useState } from "react";
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
  const [open, setOpen] = React.useState<boolean>(false);
  const [showText, setShowText] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100); // Match this duration with your CSS transition duration
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [open]);

  useEffect(() => {
    setOpen(JSON.parse(localStorage.getItem("openNav") || "true"));
  }, []);

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
    <div
      className={`${open ? "w-56" : "w-20"} h-full duration-400`}
      // onMouseEnter={() => {
      //   const timer = setTimeout(() => {
      //     setOpen(true);
      //   }, 200);
      //   return () => clearTimeout(timer);
      // }}
      // onMouseLeave={() => {
      //   const timer = setTimeout(() => {
      //     setOpen(false);
      //   }, 200);
      //   return () => clearTimeout(timer);
      // }}
    >
      <div className={`${open ? "w-56" : "w-20"} py-5 duration-400 p-0 bg-slate-100 dark:bg-zinc-800 fixed inset-0 z-50`}>
        <div className="h-full w-full flex flex-col items-center justify-between">
          <div className="w-full">
            <div className="flex flex-col items-center">
              <Link href={prefix + "/dashboard"}>
                <Image className="duration-400" src="/assets/vma-logo.png" alt="logo" width={70} height={70} />
              </Link>
              <BsFillArrowLeftCircleFill
                size={25}
                className={`relative ${open ? "left-28" : "left-10 rotate-180"} duration-400 bg-slate-200 dark:bg-zinc-800 rounded-full`}
                onClick={() => {
                  localStorage.setItem("openNav", JSON.stringify(!open));
                  setOpen(!open);
                }}
              />
              <Divider orientation="horizontal" className="w-4/5 mt-3" />
            </div>
            <div className="w-full mt-3">
              {navbarItems.map((item, index) => (
                <NavbarOptions key={index} path={item.path} prefix={prefix} title={item.title} icon={item.icon} open={open} showText={showText} />
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <Divider orientation="horizontal" className="w-4/5 mt-3" />
            {/* {open ? ( */}
            <Button
              className="mt-5 duration-400"
              variant="solid"
              color="danger"
              isLoading={isLoading}
              isIconOnly={!showText}
              endContent={
                <span>
                  <FiLogOut size={20} />
                </span>
              }
              onClick={handleLogout}
            >
              {open ? <p className={`transition-opacity ${showText ? "opacity-100" : "opacity-0"} ${open ? "block" : "hidden"}`}>Đăng xuất</p> : ""}
            </Button>
            {/* // ) : (
          //   <Tooltip content="Đăng xuất" placement="right" closeDelay={200}>
          //     <Button className="mt-5" variant="solid" color="danger" isIconOnly isLoading={isLoading} endContent={<FiLogOut size={20} />} onClick={handleLogout} />
          //   </Tooltip>
          // )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomNavbar;
