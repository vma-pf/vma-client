"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import LoadingStateContext from "@oursrc/components/context/loading-state-context";

const ButtonCreateHerd = () => {
  const router = useRouter();
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  return (
    <Button
      className="ml-3"
      variant="solid"
      color="primary"
      endContent={<Plus />}
      isLoading={loading}
      onPress={() => {
        setLoading(true);
        router.push("/farm-assist/herd/create");
        setLoading(false);
      }}
    >
      Tạo đàn mới
    </Button>
  );
};

export default ButtonCreateHerd;
