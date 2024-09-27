"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, useDisclosure } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { setNextHerdProgressStep } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { RiRfidLine } from "react-icons/ri";
import AssignInfo from "./assign-info";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { apiRequest } from "../../api-request";

export type Pig = {
  code: string;
  cage?: Cage;
  herdId?: string;
  weight?: number;
  height?: number;
  width?: number;
  note?: string;
};

export type Cage = {
  id: string;
  code: string;
  description: string;
  capacity: number;
  availableQuantity: number;
};

// const pigList: Pig[] = [
//   { id: 1, name: "Heo 001", pigCode: "HEO001" },
//   { id: 2, name: "Heo 002", pigCode: "HEO002" },
//   { id: 3, name: "Heo 003", pigCode: "HEO003" },
//   { id: 4, name: "Heo 004", pigCode: "HEO004" },
//   { id: 5, name: "Heo 005", pigCode: "HEO005" },
//   { id: 6, name: "Heo 006", pigCode: "HEO006" },
// ];

// const cages: Cage[] = [
//   { id: "1", name: "Chuồng 001", capacity: 10, currentQuantity: 0 },
//   { id: "2", name: "Chuồng 002", capacity: 10, currentQuantity: 0 },
//   { id: "3", name: "Chuồng 003", capacity: 10, currentQuantity: 5 },
//   { id: "4", name: "Chuồng 004", capacity: 10, currentQuantity: 0 },
//   { id: "5", name: "Chuồng 005", capacity: 10, currentQuantity: 0 },
//   { id: "6", name: "Chuồng 006", capacity: 10, currentQuantity: 10 },
// ];

const AssignTag = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [unassignedPigs, setUnassignedPigs] = useState<Pig[]>([]);
  const [assignedPigs, setAssignedPigs] = useState<Pig[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedPig, setSelectedPig] = React.useState<Pig>();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log(assignedPigs);
      localStorage.setItem("assignedPigs", JSON.stringify(assignedPigs));
      dispatch(setNextHerdProgressStep());
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchHerdInfo = async () => {
    try {
      const res: ResponseObject<any> = await apiRequest.getHerdById("31c334fc-308a-40a9-a058-21bc4c4a3da0");
      if (res && res.isSuccess) {
        const pigs: Pig[] = [];
        for (let i = 0; i < res.data.totalNumber; i++) {
          pigs.push({
            code: `HEO-${(i + 1).toString().padStart(3, "0")}`,
            herdId: res.data.id,
          });
        }
        setUnassignedPigs(pigs);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    const storedData: Pig[] = JSON.parse(localStorage.getItem("assignedPigs") || "[]");
    if (storedData.length > 0) {
      setAssignedPigs(storedData);
      return;
    } else {
      fetchHerdInfo();
    }
  }, []);
  return (
    <div className="container mx-auto">
      <div className="mt-12 mb-8">
        <h1 className="text-3xl">Gắn tag và Sắp xếp</h1>
        <div className="mx-72 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <motion.div
            animate={{
              scale: [0.5, 1, 1, 1, 0.5],
              rotate: [0, 0, 360, 360, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <RiRfidLine className="mx-auto text-primary" size={150} />
          </motion.div>
          <p className="text-center text-lg mt-4">
            Quét tag bằng thiết bị RFID để gắn tag cho heo
          </p>
        </div>
        <div className="p-3 mx-4 mt-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <p className="text-2xl font-bold">Danh sách heo</p>
          <div className="grid grid-cols-2">
            <div className="px-3 border-r-1">
              <p className="text-center text-xl font-semibold">Chưa được xếp</p>
              <div className="grid grid-cols-3">
                {unassignedPigs.map((pig: Pig, index) => (
                  <motion.div
                    className="mx-2 my-3 p-2 flex flex-col justify-center items-center border-2 rounded-xl shadow-md cursor-pointer"
                    key={index}
                    layout
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-lg font-semibold">{pig.code}</p>
                    <Button
                      className="mt-2"
                      color="primary"
                      onPress={() => {
                        setSelectedPig(pig);
                        onOpen();
                      }}
                    >
                      Assign
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="px-3 border-l-1">
              <p className="text-center text-xl font-semibold">Đã được xếp</p>
              <div className="grid grid-cols-4">
                <AnimatePresence>
                  {assignedPigs.map((pig, index) => (
                    <motion.div
                      className="col-span-2 mx-2 my-3 p-2 border-2 rounded-xl shadow-md cursor-pointer"
                      key={index}
                      layout
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-md">Heo</p>
                        <p className="text-lg font-semibold">{pig.code.slice(-3)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-md">Chuồng</p>
                        <p className="text-lg font-semibold">{pig.cage?.code}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-md">Kích thước</p>
                        <p className="text-md">
                          {pig.height?.toString()} x {pig.width?.toString()}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-md">Cân nặng</p>
                        <p className="text-md">{pig.weight?.toString()} kg</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <AssignInfo
          isOpen={isOpen}
          onClose={onClose}
          selectedPig={selectedPig as Pig}
          setSelectedPig={setSelectedPig}
          setUnassignedPigs={setUnassignedPigs}
          setAssignedPigs={setAssignedPigs}
          unassignedPigs={unassignedPigs}
          assignedPigs={assignedPigs}
        />
        <div className="flex justify-end">
          <Button
            color="primary"
            variant="solid"
            isLoading={loading}
            size="lg"
            isDisabled={unassignedPigs.length > 0}
            type="submit"
            onPress={handleSubmit}
          >
            Bước tiếp theo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignTag;
