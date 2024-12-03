"use client";
import { Card, CardBody, Skeleton } from "@nextui-org/react";
import LoadingStateContext from "@oursrc/lib/context/loading-state-context";
import { ResponseObject, ResponseObjectList } from "@oursrc/lib/models/response-object";
import { dashboardService } from "@oursrc/lib/services/dashboardService";
import React from "react";
import PigHealthStatusPieChart from "./_components/pig-health-status-pie-chart";
import Schedule from "./_components/schedule";
import { User } from "@oursrc/lib/models/account";
import { accountService } from "@oursrc/lib/services/accountService";
import UserList from "./_components/user-list";
import Abnormal from "./_components/abnormality";
import { HerdStatistic } from "@oursrc/lib/models/statistic";

const Dashboard = () => {
  const { loading, setLoading } = React.useContext(LoadingStateContext);
  const [dashboard, setDashboard] = React.useState<any>({});
  const [statisticData, setStatisticData] = React.useState<HerdStatistic | undefined>();
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
      {loading ? (
        <div className="my-3">
          <div className="mx-7 my-3 grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="m-2 col-span-1 border-2 rounded-lg">
                <Skeleton className="rounded-lg">
                  <div className="h-60 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            ))}
          </div>
          <div className="my-5 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Skeleton className="rounded-lg">
                <div className="h-60 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
            <div>
              <Skeleton className="rounded-lg">
                <div className="h-60 rounded-lg bg-default-300"></div>
              </Skeleton>
            </div>
          </div>
          <div className="my-5 grid grid-cols-2 gap-4">
            <Skeleton className="rounded-lg">
              <div className="h-60 rounded-lg bg-default-300"></div>
            </Skeleton>
            <Skeleton className="rounded-lg">
              <div className="h-60 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
          <Skeleton className="rounded-lg">
            <div className="h-60 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      ) : (
        <div className="my-3">
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
          <div className="my-5 grid grid-cols-2 gap-4">
            <Card>
              <CardBody>
                <p className="text-xl font-semibold">Tình hình sức khỏe</p>
                {statisticData && <PigHealthStatusPieChart data={statisticData} />}
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-xl font-semibold">Dấu hiệu bất thường</p>
                <Abnormal />
              </CardBody>
            </Card>
          </div>
          <Card className="col-span-2">
            <CardBody>
              <p className="text-xl mb-2 font-semibold">Danh sách nhân viên của trang trại</p>
              <UserList />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
