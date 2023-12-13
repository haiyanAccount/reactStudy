import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, Form, Input } from "antd";
import { useState, useEffect } from "react";
import {
  getCountyList,
  addHospital,
  getHospitalDetail,
} from "../../api/serviceAPI";

const AddHospital = () => {
  const [form] = Form.useForm();
  let [provinceList, setProvinceList] = useState([]);
  let [cityList, setCityList] = useState([]);
  let [districtList, setDistrictList] = useState([]);
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    getProvinceList();
  }, []);

  const getInfo = async () => {
    try {
      const res = await getHospitalDetail({
        hospitalCode: state && state.hospitalCode,
      });
      form.setFieldsValue({
        ...res.data,
      });
      setInfo(res.data);
      if (provinceList.length > 0) {
        const provinceName = provinceList.find(
          (x) => x.name == form.getFieldValue("provinceName")
        ).id;
        form.setFieldsValue({
          provinceName: provinceName,
        });
        getCityList(provinceName, "edit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const codeFormat = () => {
    const provinceName = provinceList.find(
      (x) => x.id === form.getFieldValue("provinceName")
    ).name;
    const cityName = cityList.find(
      (x) => x.id === form.getFieldValue("cityName")
    ).name;
    const districtName = districtList.find(
      (x) => x.id === form.getFieldValue("districtName")
    ).name;
    return { provinceName, cityName, districtName };
  };

  const onFinish = async (values) => {
    const { provinceName, cityName, districtName } = codeFormat();
    const data = {
      ...values,
      provinceName: provinceName,
      cityName: cityName,
      districtName: districtName,
      id: state && state.hospitalCode ? info.id : null,
    };
    try {
      await addHospital(data);
      navigate("/hospitalList");
    } catch (error) {
      console.log(error);
    }
  };

  const getProvinceList = async () => {
    try {
      const res = await getCountyList({ level: 1 });
      const list = res.data;
      list.forEach((ele) => {
        ele.label = ele.name;
        ele.value = ele.id;
      });
      setProvinceList(list);
      provinceList = list;
      if (state && state.hospitalCode) {
        getInfo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const provinceChange = (value) => {
    getCityList(value);
    form.setFieldsValue({ cityName: null, districtName: null });
  };

  const cityChange = (id) => {
    getDistrictListList(id);
    form.setFieldsValue({ districtName: null });
  };

  const getDistrictListList = async (id, type) => {
    try {
      const res = await getCountyList({ level: 1, id: id });
      const list = res.data;
      list.forEach((ele) => {
        ele.label = ele.name;
        ele.value = ele.id;
      });
      setDistrictList(list);
      districtList = list;
      if (type) {
        const districtName = districtList.find(
          (x) => x.name == form.getFieldValue("districtName")
        ).id;
        form.setFieldsValue({
          districtName: districtName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCityList = async (id, type) => {
    try {
      const res = await getCountyList({ level: 1, id: id });
      const list = res.data;
      list.forEach((ele) => {
        ele.label = ele.name;
        ele.value = ele.id;
      });
      cityList = list;
      setCityList(list);
      if (type) {
        const cityName = cityList.find(
          (x) => x.name == form.getFieldValue("cityName")
        ).id;
        form.setFieldsValue({
          cityName: cityName,
        });
        getDistrictListList(cityName, "edit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add__wrap">
      <div className="add__title">新增/编辑</div>
      <div className="add__box">
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="provinceName"
            label="省份"
            rules={[{ required: true, message: "请选择医院所属省份" }]}
          >
            <Select
              placeholder="请选择医院所属省份"
              options={provinceList}
              onChange={provinceChange}
            ></Select>
          </Form.Item>

          <Form.Item
            name="cityName"
            label="城市"
            rules={[{ required: true, message: "请选择医院所属城市" }]}
          >
            <Select
              placeholder="请选择医院所属城市"
              options={cityList}
              onChange={cityChange}
            ></Select>
          </Form.Item>

          <Form.Item
            name="districtName"
            label="区（县）"
            rules={[{ required: true, message: "请选择医院所属区（县）" }]}
          >
            <Select
              placeholder="请选择医院所属区（县）"
              options={districtList}
            ></Select>
          </Form.Item>

          <Form.Item
            label="医院名称"
            name="hospitalName"
            rules={[{ required: true, message: "请输入医院名称" }]}
          >
            <Input placeholder="请输入医院名称" />
          </Form.Item>

          <Form.Item
            label="事业部"
            name="regionName"
            rules={[{ required: true, message: "请输入事业部" }]}
          >
            <Input placeholder="请输入事业部" />
          </Form.Item>

          <Form.Item
            label="所属地区"
            name="areaName"
            rules={[{ required: true, message: "请输入所属地区" }]}
          >
            <Input placeholder="请输入所属地区" />
          </Form.Item>

          <Form.Item
            label="志愿者手机号"
            name="volunteerMobile"
            rules={[
              { required: true, message: "请输入志愿者手机号" },
              () => ({
                validateTrigger: "blur",
                validator(_, value) {
                  if (value && !/^1\d{10}$/.test(value)) {
                    return Promise.reject(new Error("请输入正确的手机号"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="请输入志愿者手机号" maxLength={11} />
          </Form.Item>

          <Form.Item
            label="志愿者姓名"
            name="volunteerName"
            rules={[{ required: true, message: "请输入志愿者姓名" }]}
          >
            <Input placeholder="请输入志愿者姓名" />
          </Form.Item>

          <Form.Item
            label="总负责人手机号"
            name="volunteerMasterMobile"
            rules={[
              { required: true, message: "请输入总负责人手机号" },
              () => ({
                validator(_, value) {
                  if (value && !/^1\d{10}$/.test(value)) {
                    return Promise.reject(new Error("请输入正确的手机号"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="请输入总负责人手机号" maxLength={11} />
          </Form.Item>

          <Form.Item
            label="总负责人姓名"
            name="volunteerMasterName"
            rules={[{ required: true, message: "请输入总负责人姓名" }]}
          >
            <Input placeholder="请输入总负责人姓名" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
            <Button
              className="next__btn"
              onClick={() => {
                navigate("/hospitalList");
              }}
            >
              返回
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddHospital;
