"use client";
import { Card, CardBody } from "@nextui-org/react";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <p className="text-3xl font-bold">Tổng quan</p>
      <div className="mx-7 my-3 grid grid-cols-4 gap-6">
        <Card>
          <CardBody className="m-2">
            <p className="text-lg text-default-500">Tổng số đàn</p>
            <p className="text-3xl font-bold text-primary">
              10 <span className="text-sm text-default-400">con</span>
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="m-2">
            <p className="text-lg text-default-500">Tổng heo đã nuôi</p>
            <p className="text-3xl font-bold text-primary">
              200 <span className="text-sm text-default-400">con</span>
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="m-2">
            <p className="text-lg text-default-500">Tổng heo đang nuôi</p>
            <p className="text-3xl font-bold text-primary">
              100 <span className="text-sm text-default-400">con</span>
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="m-2">
            <p className="text-lg text-default-500">Tổng chuồng</p>
            <p className="text-3xl font-bold text-primary">
              2 <span className="text-sm text-default-400">chuồng</span>
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="my-5 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card>
            <CardBody>Lịch</CardBody>
          </Card>
        </div>
        <div>
          <Card>
            <CardBody>Heo đang bị bệnh</CardBody>
          </Card>
        </div>
      </div>
      <div className="my-5 grid grid-cols-3 gap-4">
        <Card>
          <CardBody>Heo bệnh, bth, đã chết</CardBody>
        </Card>
        <Card>
          <CardBody>Dấu hiệu bất thường</CardBody>
        </Card>
        <Card>
          <CardBody>Chưa biết để gì</CardBody>
        </Card>
      </div>
      <div className="my-5 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardBody>Danh sách nhân viên</CardBody>
        </Card>
        <Card>
          <CardBody>Chưa biết để gì</CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
