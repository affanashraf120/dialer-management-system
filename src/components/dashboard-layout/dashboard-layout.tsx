import React from "react";
import DashboardDateRange from "./dashbaord-date-range";
import DashboardTab from "./dashboard-tab";

const DashboardLayout = ({
  children,
  title,
  showDateRange = true,
}: {
  children?: React.ReactNode;
  title?: string;
  showDateRange?: boolean;
}) => {
  return (
    <div>
      <div className="sm:flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {showDateRange && (
          <div className="mt-4 sm:mt-0">
            <DashboardDateRange />
          </div>
        )}
      </div>
      {/* <DashboardTab /> */}
      {children}
    </div>
  );
};

export default DashboardLayout;
