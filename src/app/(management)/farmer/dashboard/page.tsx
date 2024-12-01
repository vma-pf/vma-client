"use client";
import { Card, CardBody } from "@nextui-org/react";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { ResponseObject } from "@oursrc/lib/models/response-object";
import { dashboardService } from "@oursrc/lib/services/dashboardService";
import React from "react";
import PigHealthStatusPieChart from "./_components/pig-health-status-pie-chart";
import Schedule from "./_components/schedule";

const Dashboard = () => {
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [dashboard, setDashboard] = React.useState<any>({});
  const [statisticData, setStatisticData] = React.useState<{
    numberOfPigsAlive: number;
    numberOfPigsDead: number;
    numberOfPigsHealthNormal: number;
    numberOfPigsHealthSick: number;
  }>();
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res: ResponseObject<any> = await dashboardService.getDashboard();
      if (res.isSuccess) {
        setDashboard(res.data || {});
        setStatisticData(res.data.herdStatistic);
      } else {
        console.log(res.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchDashboard();
  }, []);
  return (
    <div>
      <div className="mx-7 my-3 grid grid-cols-4 gap-6">
        <Card>
          <CardBody className="m-2">
            <p className="text-lg text-default-500">Tổng số đàn</p>
            <p className="text-3xl font-bold text-primary">
              {dashboard.totalHerdNotEndInFarm ? dashboard.totalHerdNotEndInFarm : 0} <span className="text-sm text-default-400">đàn</span>
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
              {dashboard.totalPigAliveInFarm ? dashboard.totalPigAliveInFarm : 0} <span className="text-sm text-default-400">con</span>
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="m-2">
            <p className="text-lg text-default-500">Tổng chuồng</p>
            <p className="text-3xl font-bold text-primary">
              {dashboard.totalCageInFarm ? dashboard.totalCageInFarm : 0} <span className="text-sm text-default-400">chuồng</span>
            </p>
          </CardBody>
        </Card>
      </div>
      <div className="my-5 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Card>
            <CardBody>
              <Schedule />
            </CardBody>
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
          <CardBody>
            <p className="text-xl font-semibold">Tình hình sức khỏe</p>
            {statisticData && <PigHealthStatusPieChart data={statisticData} />}
          </CardBody>
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
