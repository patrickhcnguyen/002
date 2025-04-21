import { RouteObject } from "react-router-dom";
import MobileEmployeePortal from "@/pages/employee/MobileEmployeePortal";
import MySchedule from "@/pages/employee/MySchedule";
import OpenShifts from "@/pages/employee/OpenShifts";
import PayStubs from "@/pages/employee/PayStubs";
import Employers from "@/pages/employee/Employers";
import { HomeContent } from "@/components/employee/HomeContent";

export const mobileEmployeeRoutes: RouteObject = {
  path: "mobile-employee",
  element: <MobileEmployeePortal />,
  children: [
    {
      index: true,
      element: <HomeContent />,
    },
    {
      path: "schedule",
      element: <MySchedule />,
    },
    {
      path: "open-shifts",
      element: <OpenShifts />,
    },
    {
      path: "paystubs",
      element: <PayStubs />,
    },
    {
      path: "employers",
      element: <Employers />,
    },
  ],
};