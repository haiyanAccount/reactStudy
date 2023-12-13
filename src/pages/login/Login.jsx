import LoginForm from "../../components/loginForm";
import "./index.less";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-form">
          <div className="login-logo">
            <span className="logo-text">恩那罗肾性贫血患者公益捐赠项目</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
