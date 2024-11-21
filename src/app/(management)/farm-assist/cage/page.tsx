"use client";
import React from "react";
import { Grid2X2 } from "lucide-react";
import { GiCage } from "react-icons/gi";
import { Tab, Tabs } from "@nextui-org/react";
import CageList from "./_components/cage-list";
import AreaList from "./_components/area-list";

const Cage = () => {
  return (
    <div>
      <Tabs size="lg" color="primary" variant="solid" defaultSelectedKey="1">
        <Tab
          key="1"
          title={
            <div className="flex items-center">
              <GiCage size={20} />
              <span className="ml-2">Chuồng</span>
            </div>
          }
        >
          <div className="p-5 mb-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <CageList />
          </div>
        </Tab>
        <Tab
          key="2"
          title={
            <div className="flex items-center">
              <Grid2X2 size={20} />
              <span className="ml-2">Khu</span>
            </div>
          }
        >
          <div className="p-5 mb-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
            <AreaList />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Cage;
