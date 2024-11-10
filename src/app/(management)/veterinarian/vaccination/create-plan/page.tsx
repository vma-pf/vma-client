"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CreateVaccination from "./_components/create-vaccination";
import { Tab, Tabs } from "@nextui-org/react";
import { TbVaccine } from "react-icons/tb";
import { ClipboardCheck } from "lucide-react";

const CreatePlan = () => {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.4 }}
    >
      <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="1">
        <Tab
          key="1"
          title={
            <div className="flex items-center">
              <TbVaccine size={20} />
              <span className="ml-2">Tạo lịch tiêm phòng</span>
            </div>
          }
        >
          <CreateVaccination />
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center">
              <ClipboardCheck size={20} />
              <span className="ml-2">Mẫu lịch tiêm phòng</span>
            </div>
          }
        >
          <div>
            asc
          </div>
        </Tab>
      </Tabs>
    </motion.div>
  );
};
export default CreatePlan;
