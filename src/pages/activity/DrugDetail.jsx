import { Table, Input, Tag, Button, Image, Modal, Select, message } from "antd";
import { useState, useEffect } from "react";
import {
  getInventoryDetail,
  auditInventory,
  addReplenishment,
} from "../../api/serviceAPI";
import "./style/detail.less";
const DrugDetail = (props) => {
  const [logList, setLogList] = useState([]);
  const [tableDate, setTableData] = useState([]);
  const [replenishmentNow, setReplenishmentNow] = useState("");
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState([]);
  const [item, setItem] = useState({});
  const [checkStatus, setCheckStatus] = useState(null);
  const [remark, setRemark] = useState("");
  const { TextArea } = Input;

  useEffect(() => {
    getInfo();
  }, [props]);

  const logColumn = [
    {
      title: "补货凭证",
      dataIndex: "updateUser",
      key: "updateUser",
      align: "center",
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              const list = [];
              record.fileList.forEach((ele) => {
                list.push(ele.fileUrl);
              });
              setImages(list);
              setVisible(true);
            }}
          >
            查看
          </Button>
        );
      },
    },
    {
      title: "提交时间",
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
    },
    {
      title: "审核状态",
      dataIndex: "checkStatus",
      key: "checkStatus",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus == 0 && <Tag color="warning">未审核</Tag>}
            {record.checkStatus == 1 && <Tag color="success">已通过</Tag>}
            {record.checkStatus == 2 && <Tag color="error">已驳回</Tag>}
          </div>
        );
      },
    },
    {
      title: "审核时间",
      dataIndex: "checkTime",
      key: "checkTime",
      align: "center",
    },
    {
      title: "审核人员",
      dataIndex: "checkUserName",
      key: "checkUserName",
      align: "center",
    },
    {
      title: "驳回原因",
      dataIndex: "refuseReason",
      key: "refuseReason",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "checkStatus",
      key: "checkStatus",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                audit(record);
              }}
              disabled={record.checkStatus !== 0}
            >
              审核
            </Button>
          </div>
        );
      },
    },
  ];

  const infoColumn = [
    {
      title: "总目标库存",
      dataIndex: "targetInventory",
      key: "targetInventory",
      align: "center",
    },
    {
      title: "已入库",
      dataIndex: "receivedCount",
      key: "receivedCount",
      align: "center",
    },
    {
      title: "已出库",
      dataIndex: "outCount",
      key: "outCount",
      align: "center",
    },
    {
      title: "当前库存",
      dataIndex: "nowCount",
      key: "nowCount",
      align: "center",
    },
    {
      title: "增加库存",
      dataIndex: "remark",
      key: "remark",
      align: "center",
      width: 280,
      render: (_, record) => {
        return (
          <div>
            <Input
              placeholder="请输入增加库存量"
              value={replenishmentNow}
              type="number"
              onChange={(e) => {
                setReplenishmentNow(e.target.value);
              }}
            />
          </div>
        );
      },
    },
    {
      title: "最后更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      align: "center",
    },
  ];

  const getInfo = async () => {
    try {
      const res = await getInventoryDetail({
        pharmacyCode: props.item.pharmacyCode,
      });
      setTableData([{ ...res.data.pharmacy, key: "1" }]);
      if (res.data.logList) {
        res.data.logList.forEach((ele, index) => {
          ele.key = index + 1;
        });
        setLogList(res.data.logList);
      } else {
        setLogList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const audit = (item) => {
    setItem(item);
    setShow(true);
  };

  const handleChange = (value) => {
    setCheckStatus(value);
    if (value == "2") {
      setRemark("");
    }
  };

  const auditSave = async () => {
    if (!checkStatus) {
      message.error("请选择审核状态");
      return;
    }
    if (checkStatus == "2" && !remark) {
      message.error("请输入驳回原因");
      return;
    }
    try {
      await auditInventory({
        checkStatus: checkStatus,
        remark: remark,
        id: item.id,
      });
      setShow(false);
      setRemark("");
      setItem({});
      setCheckStatus(null);
      getInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const saveNum = async () => {
    if (!replenishmentNow) {
      message.error("请输入增加库存量");
      return;
    }
    try {
      await addReplenishment({
        replenishmentNow: replenishmentNow,
        pharmacyCode: tableDate[0].pharmacyCode,
      });
      setReplenishmentNow(null);
      props.closeHandle();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="detail__wrap">
      <div className="log__data">
        <Table
          dataSource={logList}
          columns={logColumn}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>
      <div className="info__data">
        <Table
          dataSource={tableDate}
          columns={infoColumn}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>

      <Image.PreviewGroup
        preview={{
          visible,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
        items={images}
      ></Image.PreviewGroup>

      <div className="btn__box">
        <Button type="primary" onClick={saveNum}>
          保存
        </Button>
        <Button
          type="default"
          onClick={() => {
            props.closeHandle();
            setReplenishmentNow(null);
          }}
        >
          返回
        </Button>
      </div>

      <Modal
        open={show}
        onCancel={() => {
          setShow(false);
        }}
        title="审核"
        footer={null}
        width={600}
      >
        <div className="agree__form">
          <div>
            审核状态：
            <Select
              style={{ width: 360 }}
              value={checkStatus}
              onChange={handleChange}
              placeholder="请选择审核状态"
              options={[
                { value: "1", label: "通过" },
                { value: "2", label: "驳回" },
              ]}
            />
          </div>
          {checkStatus == "2" ? (
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
        <div className="btn__box">
          <Button type="primary" onClick={auditSave}>
            确认
          </Button>
          <Button
            type="default"
            onClick={() => {
              setCheckStatus(null);
              setItem({});
              setRemark("");
              setShow(false);
            }}
          >
            返回
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DrugDetail;
