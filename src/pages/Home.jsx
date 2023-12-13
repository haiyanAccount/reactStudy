import { Layout, Modal } from "antd";
import { Route, Routes } from "react-router-dom";
import MyHeader from "../components/MyHeader";
import MySider from "../components/MySider";
import HospitalList from "./activity/HospitalList";
import DrugStoreList from "./activity/DrugStoreList";
import BillList from "./activity/BillList";
import PrescriptionList from "./activity/PrescriptionList";
import AddHospital from "./activity/AddHospital";
import AddDrug from "./activity/AddDrug";
import AuditAgreement from "./activity/AuditAgreement";
import ViewPrescription from "./activity/ViewPrescription";
import DataScreen from "./activity/DataScreen";
import "./activity/style/common.less";
import { useState, useEffect } from "react";
import { checkStatus, closeStatus } from "../api/serviceAPI";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [stayTimer, serStayTimer] = useState(null);
  const [num, setNum] = useState(0);

  useEffect(() => {
    // initTimer();
    return () => {
      clearInterval(stayTimer);
    };
  }, []);

  const initTimer = () => {
    if (stayTimer) {
      clearInterval(stayTimer);
    }
    stayTimer = setInterval(() => {
      getStatus();
    }, 3000);
  };

  const getStatus = async () => {
    try {
      const res = await checkStatus({});
      if (res.data.status) {
        setIsModalOpen(true);
        setNum(res.data.num);
        clearInterval(stayTimer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <MyHeader />
      <Layout style={{ minHeight: "calc(100vh - 80px)" }}>
        <MySider></MySider>
        <Layout style={{ padding: "24px", background: "#fff" }}>
          <Routes>
            <Route path="/hospitalList" element={<HospitalList />}></Route>
            <Route path="/drugStoreList" element={<DrugStoreList />}></Route>
            <Route path="/billList" element={<BillList />}></Route>
            <Route
              path="/prescriptionList"
              element={<PrescriptionList />}
            ></Route>
            <Route path="/addHospital" element={<AddHospital />}></Route>
            <Route path="/addDrug" element={<AddDrug />}></Route>
            <Route path="/auditAgreement" element={<AuditAgreement />}></Route>
            <Route
              path="/viewPrescription"
              element={<ViewPrescription />}
            ></Route>
            <Route path="/dataScreen" element={<DataScreen />}></Route>
            <Route path="/*" element={<HospitalList />} />
          </Routes>

          <Modal
            title="审核通知"
            footer={null}
            open={isModalOpen}
            onCancel={() => {
              setIsModalOpen(false);
              closeStatus({});
              initTimer();
            }}
          >
            <div className="tips__wrap">
              您有{num}条新的申请待审核，请前往审核列表进行审核哦！
            </div>
          </Modal>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
