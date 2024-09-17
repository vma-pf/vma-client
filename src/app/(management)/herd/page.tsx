import { Button, Divider } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import Chart from "./chart";
import PigList from "./pig-list";

const Herd = () => {
  return (
    <div>
      <div className="p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <div className="mb-2 flex items-center">
          <Image src="/assets/vma-logo.png" alt="logo" width={50} height={50} />
          <p className="text-2xl font-bold ml-4">Thông tin đàn heo</p>
        </div>
        <div className="flex space-x-2 justify-between">
          <div className="border-2 px-2 w-full">
            <div className="flex justify-between items-center">
              <p className="my-2">Tên đàn:</p>
              <p className="my-2 font-semibold">Đàn 1</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Số lượng:</p>
              <p className="my-2 font-semibold">100</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Giống:</p>
              <p className="my-2 font-semibold">Iberico</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Ngày tạo đàn:</p>
              <p className="my-2 font-semibold">2021-09-10</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Ngày kết thúc nuôi (dự kiến):</p>
              <p className="my-2 font-semibold">2021-09-10</p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Trạng thái:</p>
              <p className="my-2 p-1 font-semibold bg-primary rounded-md">
                Đang nuôi
              </p>
            </div>
            <Divider orientation="horizontal" />
            <div className="flex justify-between items-center">
              <p className="my-2">Cân nặng trung bình:</p>
              <p className="my-2 font-semibold">100kg</p>
            </div>
          </div>
          <div className="border-2 w-full">
            <p className="m-2 text-xl font-semibold">Tình trạng đàn</p>
            <Chart />
          </div>
          <div className="border-2 w-full">Hello</div>
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
