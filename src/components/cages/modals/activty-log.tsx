"use client";
import { DatePicker, DateValue, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import { Cage } from "@oursrc/lib/models/cage";
import React from "react";
import { CiBoxList } from "react-icons/ci";
import ActivityLogList from "../activity-log-list";
import ActivityChart from "../activity-chart";
import { FaRegChartBar } from "react-icons/fa";
import { parseDate } from "@internationalized/date";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaChartArea } from "react-icons/fa6";

const ActivityLog = ({ isOpen, onClose, cage }: { isOpen: boolean; onClose: () => void; cage?: Cage }) => {
  const [date, setDate] = React.useState<DateValue>(parseDate(new Date().toISOString().split("T")[0]));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      scrollBehavior="inside"
      classNames={{
        wrapper: "w-full h-fit",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <p className="text-xl">Lịch sử hoạt động của chuồng {cage?.code}</p>
        </ModalHeader>
        <ModalBody>
          <DatePicker
            className="mb-4 px-7"
            label="Chọn ngày"
            labelPlacement="outside-left"
            value={date}
            onChange={(value) => {
              setDate(value);
            }}
          />
          <Tabs color="primary" variant="solid" defaultSelectedKey="1">
            <Tab
              key="1"
              title={
                <div className="flex items-center">
                  <FaRegChartBar size={20} />
                  <span className="ml-2">Biểu đồ cột</span>
                </div>
              }
            >
              <ActivityChart cage={cage} date={date} />
            </Tab>
            <Tab
              key="2"
              title={
                <div className="flex items-center">
                  <FaChartArea size={20} />
                  <span className="ml-2">Biểu đồ miền</span>
                </div>
              }
            >
              <ActivityLogList cage={cage} date={date} />
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ActivityLog;
