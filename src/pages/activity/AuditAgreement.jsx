import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAgreementDetail, auditAgreementHandle } from "../../api/serviceAPI";
import { Select, Input, Button, message, Table, Tag, Image } from "antd";
import "./style/agree.less";
const AuditAgreement = () => {
  const { state } = useLocation();
  const [cost, setCost] = useState({});
  const [free, setFree] = useState({});
  const [checkStatus, setCheckStatus] = useState("");
  const [remark, setRemark] = useState("");
  const { TextArea } = Input;
  const navigate = useNavigate();

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    try {
      const res = await getAgreementDetail({
        pharmacyCode: state.pharmacyCode,
      });
      if (res.data.cost.checkLogList.length > 0) {
        res.data.cost.checkLogList.forEach((ele, index) => {
          ele.key = index + 1;
        });
      }
      if (res.data.free.checkLogList.length > 0) {
        res.data.free.checkLogList.forEach((ele, index) => {
          ele.key = index + 1;
        });
      }
      setCost(res.data.cost);
      setFree(res.data.free);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (value) => {
    setCheckStatus(value);
  };

  const save = async () => {
    if (!checkStatus) {
      message.error("请选择审核状态");
      return;
    }
    if (checkStatus == "3" && !remark) {
      message.error("请输入驳回原因");
      return;
    }
    try {
      await auditAgreementHandle({
        id: state.type === "free" ? free.id : cost.id,
        checkStatus: checkStatus,
        remark: remark,
      });
      navigate("/drugStoreList");
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "审核人",
      dataIndex: "updateUser",
      key: "updateUser",
      align: "center",
    },
    {
      title: "操作时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
    },
    {
      title: "审核结果",
      dataIndex: "checkStatus",
      key: "checkStatus",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus == 1 && <Tag color="warning">未审核</Tag>}
            {record.checkStatus == 2 && <Tag color="success">已通过</Tag>}
            {record.checkStatus == 3 && <Tag color="error">已驳回</Tag>}
          </div>
        );
      },
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      align: "center",
    },
  ];

  return (
    <div className="add__wrap">
      <div className="add__title">协议详情</div>
      <div className="add__box">
        <div className="agree__title">协议照片</div>
        <div className="agree__img">
          {state.type === "free"
            ? free.fileList &&
              free.fileList.map((item, key) => {
                return (
                  <div key={key}>
                    <Image width={200} src={item.fileUrl} alt="" />
                  </div>
                );
              })
            : cost.fileList &&
              cost.fileList.map((item, index) => {
                return (
                  <div key={index}>
                    <Image width={200} src={item.fileUrl} alt="" />
                  </div>
                );
              })}
        </div>
        <div className="agree__form">
          {!state.disabled ? (
            <div>
              审核状态：
              <Select
                style={{ width: 360 }}
                onChange={handleChange}
                placeholder="请选择审核状态"
                options={[
                  { value: "2", label: "通过" },
                  { value: "3", label: "驳回" },
                ]}
              />
            </div>
          ) : null}
          {checkStatus == "3" ? (
            <div className="text__box">
              驳回原因：
              <TextArea
                placeholder="请输入驳回原因"
                style={{ width: 360 }}
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
                rows={4}
              />
            </div>
          ) : null}
        </div>
        <div className="tab__box">
          <Table
            style={{ width: "800px" }}
            dataSource={
              state.type === "free" ? free.checkLogList : cost.checkLogList
            }
            columns={columns}
            pagination={{ hideOnSinglePage: true }}
          />
        </div>
        <div className="btn__box">
          {!state.disabled ? (
            <Button type="primary" onClick={save}>
              确认
            </Button>
          ) : null}
          <Button
            onClick={() => {
              navigate("/drugStoreList");
            }}
            type="default"
          >
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditAgreement;
