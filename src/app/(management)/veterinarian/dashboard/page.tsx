import React from "react";
import Schedule from "./_components/schedule";

const Dashboard = async () => {
  return (
    <div>
      <div className="mb-3 p-3 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg">
        <Schedule />
      </div>
      <div className="mb-3 p-5 w-full rounded-2xl bg-white dark:bg-zinc-800 shadow-lg"></div>
    </div>
  );
};

export default Dashboard;
