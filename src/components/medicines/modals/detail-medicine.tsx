"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  SortDescriptor,
  Table,
  Tooltip,
  Selection,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { toast } from "@oursrc/hooks/use-toast";
import { Batch } from "@oursrc/lib/models/batch";
import { Medicine } from "@oursrc/lib/models/medicine";
import { ResponseObjectList } from "@oursrc/lib/models/response-object";
import { batchService } from "@oursrc/lib/services/batchService";
import { dateTimeConverter } from "@oursrc/lib/utils";
import { EyeIcon, Plus, Search } from "lucide-react";
import React from "react";
import { HiChevronDown } from "react-icons/hi2";
import { TbBuildingWarehouse } from "react-icons/tb";
import BatchList from "./batch-list";
import TransactionList from "./transaction-list";
import { GrTransaction } from "react-icons/gr";

const DetailMedicine = ({ isOpen, onClose, medicine }: { isOpen: boolean; onClose: () => void; medicine: Medicine | undefined }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <p className="text-2xl font-bold">Chi tiết thuốc {medicine?.name || ""}</p>
        </ModalHeader>
        <ModalBody>
          <Tabs color="primary" variant="solid" defaultSelectedKey="1">
            <Tab
              key="1"
              title={
                <div className="flex items-center">
                  <TbBuildingWarehouse size={20} />
                  <span className="ml-2">Danh sách đợt nhập</span>
                </div>
              }
            >
              <BatchList medicine={medicine} />
            </Tab>
            <Tab
              key="2"
              title={
                <div className="flex items-center">
                  <GrTransaction size={20} />
                  <span className="ml-2">Danh sách giao dịch</span>
                </div>
              }
            >
              <TransactionList medicine={medicine} />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DetailMedicine;
