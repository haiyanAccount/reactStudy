import { Image, Table, Tag, Button } from "antd";
import "./style/common.less";
import "./style/view.less";
import { getPrescriptionInfo } from "../../api/serviceAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const viewPrescription = () => {
  const [detail, setDetail] = useState({});
  const [list, setList] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();
  const statusName = {
    0: "待审核",
    1: "审核通过",
    2: "审核未通过",
    3: "修改待审核",
  };

  const logColumn = [
    {
      title: "审核人",
      dataIndex: "createUser",
      key: "createUser",
      align: "center",
      width: 250,
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      width: 250,
    },
    {
      title: "审核结果",
      dataIndex: "checkStatus",
      key: "checkStatus",
      align: "center",
      width: 250,
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus == 1 && <Tag color="success">审核通过</Tag>}
            {record.checkStatus == 2 && <Tag color="error">审核驳回</Tag>}
          </div>
        );
      },
    },
    {
      title: "备注",
      dataIndex: "refuseReason",
      key: "refuseReason",
      align: "center",
      width: 250,
    },
  ];

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      const res = await getPrescriptionInfo({ code: state.code });
      setDetail(res.data);
      if (res.data.checkLogList) {
        res.data.checkLogList.forEach((ele, index) => {
          ele.key = `${index + 1}`;
        });
        setList(res.data.checkLogList);
      } else {
        setList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="add__wrap">
      <div className="add__title">处方单详情</div>
      <div className="add__box">
        <div className="content__title">基本信息</div>
        <div className="content__box">
          <div className="content__list">
            <div className="content__item">姓名：{detail.name}</div>
            <div className="content__item">手机号：{detail.mobile}</div>
            <div className="content__item">身份证号：{detail.idCard}</div>
            <div className="content__item">
              邮寄地址：{detail.province} &nbsp; &nbsp;{detail.city}&nbsp;
              &nbsp;{detail.region}
            </div>
          </div>
          <div className="content__list">
            <div className="content__item">年龄：{detail.age}</div>
            <div className="content__item">医院：{detail.hospitalName}</div>
            <div className="content__item">医生：{detail.doctorName}</div>
            <div className="content__item">
              详细地址：{detail.mailingAddress}
            </div>
          </div>
        </div>
        <div className="content__title">处方单照片</div>
        <div className="content__box">
          <div className="img__list">
            <Image.PreviewGroup>
              {detail.fileList &&
                detail.fileList.map((item, index) => {
                  return <Image key={index} width={200} src={item.fileUrl} />;
                })}
            </Image.PreviewGroup>
          </div>
          <div className="info__item">
            审核状态：{statusName[detail.checkStatus]}
          </div>
          <div className="info__item">邮寄点：{detail.pharmacyName}</div>
          <div className="info__item">
            建议用量：{detail.suggestedDosage} mg/天
          </div>
          <div className="info__item">药品盒数：{detail.drugBoxCount}</div>
          <div className="info__item">
            处方时间：
            {detail.prescriptionTime && detail.prescriptionTime.substr(0, 10)}
          </div>
        </div>
        <Table
          dataSource={list}
          style={{ width: 1000 }}
          columns={logColumn}
          pagination={{ hideOnSinglePage: true }}
        />
        <div className="content__btn">
          <Button
            type="primary"
            onClick={() => {
              navigate("/prescriptionList");
            }}
          >
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default viewPrescription;
