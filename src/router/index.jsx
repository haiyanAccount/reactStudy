import { Navigate, useRoutes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/login/Login";
import HospitalList from "../pages/activity/HospitalList";
import BillList from "../pages/activity/BillList";
import DrugStoreList from "../pages/activity/DrugStoreList";
import PrescriptionList from "../pages/activity/PrescriptionList";
import AddHospital from "../pages/activity/AddHospital";
import AddDrug from "../pages/activity/AddDrug";
import AuditAgreement from "../pages/activity/AuditAgreement";
import ViewPrescription from "../pages/activity/ViewPrescription";
import DataScreen from "../pages/activity/BillList";
export const rootRouter = [
  {
    path: "/",
    element: <Navigate to="/hospitalList" />,
  },
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/hospitalList",
        element: <HospitalList />,
      },
      {
        path: "/billList",
        element: <BillList />,
      },
      {
        path: "/drugStoreList",
        element: <DrugStoreList />,
      },
      {
        path: "/prescriptionList",
        element: <PrescriptionList />,
      },
      {
        path: "/addHospital",
        element: <AddHospital />,
      },
      {
        path: "/addDrug",
        element: <AddDrug />,
      },
      {
        path: "/auditAgreement",
        element: <AuditAgreement />,
      },
      {
        path: "/viewPrescription",
        element: <ViewPrescription />,
      },
      {
        path: "/dataScreen",
        element: <DataScreen />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      requiresAuth: false,
      title: "登录页",
      key: "login",
    },
  },
  {
    path: "*",
    element: <Navigate to="/billList" />,
  },
];

const Router = () => {
  const routes = useRoutes(rootRouter);
  return routes;
};

export default Router;
