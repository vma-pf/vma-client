"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ButtonCreateHerd = () => {
  const router = useRouter();
  return (
    <Button
      className="ml-3"
      variant="solid"
      color="primary"
      endContent={<Plus />}
      onPress={() => {
        router.push("/farmer/herd/create");
      }}
    >
      Tạo đàn mới
    </Button>
  );
};

export default ButtonCreateHerd;
