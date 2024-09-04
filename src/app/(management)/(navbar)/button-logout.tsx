"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { FiLogOut } from "react-icons/fi";
import { apiRequest } from "@oursrc/app/(auth)/api-request";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@oursrc/lib/utils";

const ButtonLogout = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await apiRequest.logoutFromNextClientToNextServer();
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Button
      className="mt-10"
      variant="solid"
      color="danger"
      endContent={<FiLogOut size={20} />}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default ButtonLogout;
