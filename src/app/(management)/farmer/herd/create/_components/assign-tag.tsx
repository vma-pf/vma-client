"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Skeleton, useDisclosure } from "@nextui-org/react";
import { useToast } from "@oursrc/hooks/use-toast";
import { useAppDispatch } from "@oursrc/lib/hooks";
import { setNextHerdProgressStep } from "@oursrc/lib/features/herd-progress-step/herdProgressStepSlice";
import { RiRfidLine } from "react-icons/ri";
import AssignInfo from "./assign-info";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { GiPig } from "react-icons/gi";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@oursrc/components/ui/hover-card";
import { FaWeightHanging } from "react-icons/fa6";
import { CiLineHeight } from "react-icons/ci";
import { AiOutlineColumnWidth } from "react-icons/ai";
import { HerdInfo } from "@oursrc/lib/models/herd";
import { Cage } from "@oursrc/lib/models/cage";
import { cageService } from "@oursrc/lib/services/cageService";
import { pigService } from "@oursrc/lib/services/pigService";
import { Pig } from "@oursrc/lib/models/pig";

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
  const [assignedPigs, setAssignedPigs] = useState<Pig[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [cages, setCages] = React.useState<Cage[]>([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
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

  const getCages = async () => {
    try {
      setLoading(true);
      const res: ResponseObjectList<Cage> = await cageService.getCages(1, 500);
      if (res && res.isSuccess) {
        setCages(res.data.data);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllPigs = async () => {
    try {
      const herdData: HerdInfo = JSON.parse(localStorage.getItem("herdData") || "{}");
      const res: ResponseObjectList<Pig> = await pigService.getPigsByHerdId(herdData.id, 1, 500);
      if (res && res.isSuccess) {
        setAssignedPigs(res.data.data);
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (!isOpen) {
      getAllPigs();
      getCages();
    }
  }, [isOpen]);

  React.useEffect(() => {
    getAllPigs();
    getCages();
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
            <RiRfidLine className="mx-auto text-primary" size={150} onClick={onOpen} />
          </motion.div>
          <p className="text-center text-lg mt-4">Quét tag bằng thiết bị RFID để gắn tag cho heo</p>
        </div>
        {/* <div className="p-3 mx-4 mt-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
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
                        <p className="text-lg font-semibold">{pig.code?.slice(-3)}</p>
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
        </div> */}
        <div className="mt-5 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
          <p className="text-3xl font-bold text-center mb-5">Danh sách heo</p>
          {!loading ? (
            <div className="m-3 grid grid-cols-3">
              {assignedPigs?.length > 0 ? (
                cages.map((cage, idx) => (
                  <div key={idx} className="m-2 col-span-1 border-2 rounded-lg">
                    <p className="text-center text-xl font-semibold">Chuồng: {cage.code}</p>
                    <div className="flex justify-center items-center">
                      <p className="text-center mr-2 text-lg">
                        Sức chứa: {cage.availableQuantity} / {cage.capacity}
                      </p>
                      <GiPig size={30} className="text-primary" />
                    </div>
                    <div className="grid grid-cols-2">
                      {assignedPigs
                        .filter((pig) => pig.cageId === cage.id)
                        .map((pig: Pig, index) => (
                          <motion.div
                            className="col-span-1 mx-2 my-2 p-2 border-2 rounded-xl shadow-md cursor-pointer"
                            key={index}
                            layout
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <HoverCard openDelay={100} closeDelay={100}>
                              <HoverCardTrigger asChild>
                                <div className="">
                                  <p className="overflow-auto break-all">Mã: {pig.pigCode}</p>
                                  {/* <p className="text-lg font-semibold overflow-auto">Giới tính: {pig.gender === "Male" ? "Đực" : "Cái"}</p> */}
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent>
                                <div className="flex items-center">
                                  <FaWeightHanging size={20} className="text-primary" />
                                  <p className="text-lg ml-2">Cân nặng: {pig.weight} kg</p>
                                </div>
                                <div className="flex items-center">
                                  <CiLineHeight size={20} className="text-primary" />
                                  <p className="text-lg ml-2">Chiều cao: {pig.height} cm</p>
                                </div>
                                <div className="flex items-center">
                                  <AiOutlineColumnWidth size={20} className="text-primary" />
                                  <p className="text-lg ml-2">Chiều rộng: {pig.width} cm</p>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-lg">Chưa có heo nào được xếp</div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="m-2 col-span-1 border-2 rounded-lg">
                  <Skeleton className="rounded-lg">
                    <div className="h-24 rounded-lg bg-default-300"></div>
                  </Skeleton>
                </div>
              ))}
            </div>
          )}
        </div>
        <AssignInfo isOpen={isOpen} onClose={onClose} setAssignedPigs={setAssignedPigs} />
        <div className="flex justify-end">
          <Button color="primary" variant="solid" isLoading={loading} size="lg" isDisabled={assignedPigs?.length <= 0} type="submit" onPress={handleSubmit}>
            Bước tiếp theo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignTag;
