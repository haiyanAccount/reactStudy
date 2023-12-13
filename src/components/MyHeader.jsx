import { Layout } from "antd";
import "./style/myHeader.less";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setToken, setUserInfo } from "../store/user/actions";
import { store } from "../store/index";
import { connect } from "react-redux";
const { Header } = Layout;

const MyHeader = (props) => {
  const navigate = useNavigate();
  const { setToken, setUserInfo } = props;
  const userInfo = store.getState().user.userInfo;

  const logOut = () => {
    setToken(null);
    setUserInfo({});
    navigate("/login");
  };
  return (
    <Header
      style={{
        display: "flex",
        backgroundColor: "#fff",
        alignItems: "center",
        height: "80px",
      }}
      className="head__box"
    >
      <div className="left__title">恩那罗肾性贫血患者公益捐赠项目</div>
      <div className="right__content">
        <div className="right__name">{userInfo.userName}</div>
        <div className="right__out" onClick={logOut}>
          <LogoutOutlined />
        </div>
      </div>
    </Header>
  );
};

// export default MyHeader;
const mapDispatchToProps = { setToken, setUserInfo };
export default connect(null, mapDispatchToProps)(MyHeader);
