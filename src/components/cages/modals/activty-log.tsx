"use client";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import { Cage } from "@oursrc/lib/models/cage";
import React from "react";
import { CiBoxList } from "react-icons/ci";
import ActivityLogList from "../activity-log-list";
import ActivityChart from "../activity-chart";
import { FaRegChartBar } from "react-icons/fa";

const ActivityLog = ({ isOpen, onClose, cage }: { isOpen: boolean; onClose: () => void; cage?: Cage }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <p className="text-xl">Lịch sử hoạt động của chuồng {cage?.code}</p>
        </ModalHeader>
        <ModalBody>
          <Tabs color="primary" variant="solid" defaultSelectedKey="1">
            <Tab
              key="1"
              title={
                <div className="flex items-center">
                  <FaRegChartBar size={20} />
                  <span className="ml-2">Biểu đồ</span>
                </div>
              }
            >
              <ActivityChart cage={cage} />
            </Tab>
            <Tab
              key="2"
              title={
                <div className="flex items-center">
                  <CiBoxList size={20} />
                  <span className="ml-2">Danh sách</span>
                </div>
              }
            >
              <ActivityLogList cage={cage} />
            </Tab>
          </Tabs>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ActivityLog;
