"use client";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import Chart from "./_components/chart";
import PigList from "./_components/pig-list";
import SeasonFilter from "./_components/season-filter";
import { IoIosAlert } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import ButtonCreateHerd from "./_components/button-create-herd";
import { dateConverter } from "@oursrc/lib/utils";
import { HerdInfo } from "@oursrc/lib/models/herd";

const Herd = () => {
  const [selectedHerd, setSelectedHerd] = React.useState<HerdInfo>();
  return (
    <div>
      <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
            <p className="text-2xl font-bold ml-4">Thông tin đàn heo</p>
          </div>
          <div className="flex">
            <SeasonFilter setSelectedHerd={setSelectedHerd} />
            <ButtonCreateHerd />
          </div>
        </div>
        <div className="flex space-x-2 justify-between">
          <div className="border-2 px-2 w-full">
            <div className="flex justify-between items-center">
              <p className="my-2">Tên đàn:</p>
              <p className="my-2 font-semibold">{selectedHerd?.code}</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Số lượng:</p>
              <p className="my-2 font-semibold">{selectedHerd?.totalNumber}</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Giống:</p>
              <p className="my-2 font-semibold">{selectedHerd?.breed}</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Ngày tạo đàn:</p>
              <p className="my-2 font-semibold">{dateConverter(selectedHerd?.startDate ?? "")}</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Ngày kết thúc nuôi (dự kiến):</p>
              <p className="my-2 font-semibold">{dateConverter(selectedHerd?.expectedEndDate ?? "")}</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Trạng thái:</p>
              <p className={`my-2 p-1 font-semibold rounded-md ${selectedHerd?.status === 1 ? "text-success-500" : "text-danger-500"}`}>
                {selectedHerd?.status === 1 ? "Đang nuôi" : "Đã kết thúc"}
              </p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Cân nặng trung bình:</p>
              <p className="my-2 font-semibold">{selectedHerd?.averageWeight}</p>
            </div>
          </div>
          <div className="border-2 w-full">
            <p className="m-2 text-xl font-semibold">Tình trạng đàn</p>
            <Chart />
          </div>
          <div className="border-2 w-full">
            <p className="m-2 text-xl font-semibold">Dấu hiệu bất thường</p>
            <div className="my-2 max-h-[300px] overflow-auto">
              <div className="mx-2 my-3 flex justify-between items-center">
                <div className="flex justify-start items-center">
                  <IoIosAlert className="mr-3 text-danger-500" size={30} />
                  <div>
                    <p className="font-semibold">Chuồng 001</p>
                    <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                    <p className="text-zinc-400 text-sm">bây giờ</p>
                  </div>
                </div>
                <GoDotFill className="text-blue-500" />
              </div>
              <Divider className="my-2" orientation="horizontal" />
              <div className="mx-2 my-3 flex justify-between items-center">
                <div className="flex justify-start items-center">
                  <IoIosAlert className="mr-3" size={30} />
                  <div>
                    <p className="font-semibold">Chuồng 002</p>
                    <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                    <p className="text-zinc-400 text-sm">hôm qua</p>
                  </div>
                </div>
              </div>
              <Divider orientation="horizontal" />
              <div className="mx-2 my-3 flex justify-between items-center">
                <div className="flex justify-start items-center">
                  <IoIosAlert className="mr-3" size={30} />
                  <div>
                    <p className="font-semibold">Chuồng 001</p>
                    <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                    <p className="text-zinc-400 text-sm">tuần trước</p>
                  </div>
                </div>
              </div>
              <Divider orientation="horizontal" />
              <div className="mx-2 my-3 flex justify-between items-center">
                <div className="flex justify-start items-center">
                  <IoIosAlert className="mr-3" size={30} />
                  <div>
                    <p className="font-semibold">Chuồng 001</p>
                    <p className="my-2">Có 1 cá thể có dấu hiệu bất thường</p>
                    <p className="text-zinc-400 text-sm">tháng trước</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-5 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <p className="text-2xl font-bold mb-3">Danh sách heo</p>
        <PigList />
      </div>
    </div>
  );
};

export default Herd;
