import React from "react";
import { apiRequest } from "./api-request";

const Dashboard = async () => {
  // const packages = await apiRequest.getAllPackages();
  // console.log(packages);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {/* {packages.data?.map((p: any) => (
          <div key={p._id}>
            {p.packageName}
            {p.description}
            {p.price}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default Dashboard;
