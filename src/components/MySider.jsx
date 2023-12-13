import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SaveOutlined,
  RobotOutlined,
  ShopOutlined,
  MacCommandOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import "./style/mySider.less";
import { rootRouter } from "../router/index";
import { searchRoute } from "../utils/index";

const { Sider } = Layout;

const menuList = [
  { key: "hospitalList", label: "医院白名单", icon: <SaveOutlined /> },
  {
    key: "drugStoreList",
    label: "药店信息维护",
    icon: <RobotOutlined />,
  },
  {
    key: "prescriptionList",
    label: "处方单审核列表",
    icon: <ShopOutlined />,
  },
  {
    key: "billList",
    label: "药店端资料审核列表",
    icon: <MacCommandOutlined />,
  },
  {
    key: "dataScreen",
    label: "数据统计",
    icon: <FundProjectionScreenOutlined />,
  },
];

const MySider = () => {
  console.log(import.meta.env.VITE_NODE_ENV);
  const location = useLocation();
  const navigate = useNavigate();
  const defaultSelect = [location.pathname.replace("/", "")];
  const clickMenu = ({ key }) => {
    const route = searchRoute(key, rootRouter);
    console.log(route, "---3");
    if (route.isLink) window.open(route.isLink, "_blank");
    navigate(key);
  };

  return (
    <Sider
      width={200}
      style={{
        background: "#001529",
      }}
    >
      <Menu
        mode="inline"
        theme="dark"
        defaultSelectedKeys={defaultSelect}
        style={{ height: "100%", borderRight: 0 }}
        items={menuList}
        onClick={clickMenu}
      />
    </Sider>
  );
};

export default MySider;
