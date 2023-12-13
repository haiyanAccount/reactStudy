import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { login } from "../api/serviceAPI";
import { connect } from "react-redux";
import { setToken, setUserInfo } from "../store/user/actions";
import { useTranslation } from "react-i18next";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const LoginForm = (props) => {
  const { t } = useTranslation();
  const { setToken, setUserInfo } = props;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 登录
  const onFinish = async (loginForm) => {
    if (!loginForm.userMobile) {
      message.error("请输入用户名");
      return;
    }
    if (!loginForm.password) {
      message.error("请输入密码");
      return;
    }
    try {
      setLoading(true);
      loginForm.password = loginForm.password;
      const { data, encrypt } = await login(loginForm);
      setToken(encrypt);
      setUserInfo(data);
      message.success("登录成功！");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 5 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      size="large"
      autoComplete="off"
    >
      <Form.Item name="userMobile">
        <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
      </Form.Item>
      <Form.Item className="login-btn">
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%" }}
          loading={loading}
        >
          {t("登录")}
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapDispatchToProps = { setToken, setUserInfo };
export default connect(null, mapDispatchToProps)(LoginForm);
