import { useLocation, useNavigate } from "react-router-dom";
import { Button, Select, Form, Input } from "antd";
import { useState, useEffect } from "react";
import {
  getCountyList,
  addDrugStore,
  getDrugStoreDetail,
} from "../../api/serviceAPI";

const AddDrug = () => {
  const [form] = Form.useForm();
  let [provinceList, setProvinceList] = useState([]);
  let [cityList, setCityList] = useState([]);
  const [info, setInfo] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    getProvinceList();
  }, []);

  const getInfo = async () => {
    try {
      const res = await getDrugStoreDetail({
        pharmacyCode: state && state.pharmacyCode,
      });
      form.setFieldsValue({
        ...res.data,
      });
      setInfo(res.data);
      if (provinceList.length > 0) {
        const province = provinceList.find(
          (x) => x.name == form.getFieldValue("province")
        ).id;
        form.setFieldsValue({
          province: province,
        });
        getCityList(province, "edit");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const codeFormat = () => {
    const province = provinceList.find(
      (x) => x.id === form.getFieldValue("province")
    ).name;
    const city = cityList.find((x) => x.id === form.getFieldValue("city")).name;
    return { province, city };
  };

  const onFinish = async (values) => {
    const { province, city } = codeFormat();
    const data = {
      ...values,
      province: province,
      city: city,
      id: state && state.pharmacyCode ? info.id : null,
    };
    try {
      await addDrugStore(data);
      navigate("/drugStoreList");
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
      if (state && state.pharmacyCode) {
        getInfo();
      } else {
        form.setFieldsValue({
          receivedCount: 0,
          outCount: 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const provinceChange = (value) => {
    getCityList(value);
    form.setFieldsValue({ city: null });
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
        const city = cityList.find(
          (x) => x.name == form.getFieldValue("city")
        ).id;
        form.setFieldsValue({
          city: city,
        });
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
            label="药店名称"
            name="pharmacyName"
            rules={[{ required: true, message: "请输入药店名称" }]}
          >
            <Input placeholder="请输入药店名称" />
          </Form.Item>

          <Form.Item
            label="药店地址"
            name="address"
            rules={[{ required: true, message: "请输入药店地址" }]}
          >
            <Input placeholder="请输入药店地址" />
          </Form.Item>

          <Form.Item
            label="药店联系方式"
            name="pharmacyMobile"
            rules={[{ required: true, message: "请输入药店联系方式" }]}
          >
            <Input placeholder="请输入药店联系方式" />
          </Form.Item>

          <Form.Item
            name="province"
            label="省份"
            rules={[{ required: true, message: "请选择所在省" }]}
          >
            <Select
              placeholder="请选择所在省"
              options={provinceList}
              onChange={provinceChange}
            ></Select>
          </Form.Item>

          <Form.Item
            name="city"
            label="城市"
            rules={[{ required: true, message: "请选择所在市" }]}
          >
            <Select placeholder="请选择所在市" options={cityList}></Select>
          </Form.Item>

          <Form.Item
            label="目标库存"
            name="targetInventory"
            rules={[{ required: true, message: "请输入目标库存" }]}
          >
            <Input placeholder="请输入目标库存" type="number" />
          </Form.Item>

          <Form.Item label="已入库" name="receivedCount">
            <Input disabled placeholder="请输入目标库存" type="number" />
          </Form.Item>

          <Form.Item label="已出库" name="outCount">
            <Input disabled placeholder="请输入目标库存" type="number" />
          </Form.Item>

          <Form.Item
            label="当前库存"
            name="nowCount"
            rules={[{ required: true, message: "请输入本次铺货库存数量" }]}
          >
            <Input
              type="number"
              readOnly={state && state.pharmacyCode}
              placeholder="请输入本次铺货库存数量"
            />
          </Form.Item>

          <Form.Item
            label="事业部"
            name="regionName"
            rules={[{ required: true, message: "请输入事业部" }]}
          >
            <Input placeholder="请输入事业部" />
          </Form.Item>

          <Form.Item
            label="所属大区"
            name="areaName"
            rules={[{ required: true, message: "请输入所属大区" }]}
          >
            <Input placeholder="请输入所属大区" />
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
                navigate("/drugStoreList");
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

export default AddDrug;
