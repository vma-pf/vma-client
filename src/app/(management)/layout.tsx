import React from "react";
import Header from "./header";
import Footer from "./footer";
import SideNavbar from "./(navbar)/navbar";

const ManagementLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col h-screen justify-between">
      <div className="flex flex-grow">
        <div className="ml-4 my-4">
          <SideNavbar />
        </div>
        <div className="ml-4 flex-grow">
          <div className="p-2">
            <Header />
          </div>
          <div className="h-fit">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagementLayout;
