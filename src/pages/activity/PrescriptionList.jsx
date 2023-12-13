import {
  Input,
  Button,
  Table,
  Image,
  Select,
  message,
  DatePicker,
  Tag,
  Modal,
} from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  getPrescriptionList,
  commonExport,
  updatePrescription,
  getAddressList,
  auditPrescription,
} from "../../api/serviceAPI";
import DebounceSelect from "./DebounceSelect";
import "./style/audit.less";

const PrescriptionList = () => {
  const [name, setName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [checkStatus, setCheckStatus] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const formatDate = "YYYY-MM-DD";
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditItem, setAuditItem] = useState(false);
  const [address, setAddress] = useState(null);
  const [auditStatus, setAuditStatus] = useState(null);
  const [refuseReason, setRefuseReason] = useState(null);
  const { TextArea } = Input;
  const navigate = useNavigate();
  const column = [
    {
      title: "申请单号",
      dataIndex: "code",
      width: 180,
      key: "code",
      align: "center",
    },
    {
      title: "姓名",
      dataIndex: "name",
      align: "center",
      width: 90,
      key: "name",
    },
    {
      title: "申请次数",
      dataIndex: "applyCount",
      width: 90,
      align: "center",
      key: "applyCount",
    },
    {
      title: "申请阶段",
      dataIndex: "type",
      align: "center",
      key: "type",
      width: 90,
      render: (_, record) => {
        return <div>{record.type === 1 ? "买药赠药" : "免费赠药"}</div>;
      },
    },
    {
      title: "邮寄地区",
      dataIndex: "province",
      width: 170,
      align: "center",
      key: "province",
      render: (_, record) => {
        return (
          <div>
            {record.province}&nbsp;{record.city}&nbsp;{record.region}
          </div>
        );
      },
    },
    {
      title: "详细地址",
      dataIndex: "mailingAddress",
      width: 160,
      align: "center",
      key: "mailingAddress",
    },
    {
      title: "申请提交时间",
      dataIndex: "submitTime",
      align: "center",
      key: "submitTime",
      width: 160,
    },
    {
      title: "处方单",
      dataIndex: "fileList",
      width: 80,
      align: "center",
      key: "fileList",
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
      title: "医生",
      dataIndex: "doctorCode",
      align: "center",
      key: "doctorCode",
      width: 200,
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus != 0 && record.checkStatus != 3 ? (
              record.doctorCode
            ) : (
              <Input
                style={{ width: 160 }}
                defaultValue={record.doctorCode}
                onChange={(e) => {
                  record.doctorCode = e.target.value;
                }}
                onBlur={(e) => {
                  doctorChange(record, e.target.value);
                }}
                placeholder="请输入"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "建议用量",
      dataIndex: "suggestedDosage",
      width: 200,
      align: "center",
      key: "suggestedDosage",
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus != 0 && record.checkStatus != 3 ? (
              <div>{record.suggestedDosage} mg/天</div>
            ) : (
              <Select
                style={{ width: 160 }}
                defaultValue={record.suggestedDosage}
                onChange={(value) => {
                  dosageChange(record, value);
                }}
                placeholder="请选择"
                options={[
                  { value: 2, label: "2 mg/天" },
                  { value: 4, label: "4 mg/天" },
                  { value: 6, label: "6 mg/天" },
                  { value: 8, label: "8 mg/天" },
                ]}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "药品盒数",
      dataIndex: "drugBoxCount",
      align: "center",
      width: 160,
      key: "drugBoxCount",
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus != 0 && record.checkStatus != 3 ? (
              record.drugBoxCount
            ) : (
              <Input
                style={{ width: 120 }}
                defaultValue={record.drugBoxCount}
                onChange={(e) => {
                  record.drugBoxCount = e.target.value;
                }}
                onBlur={(e) => {
                  countChange(record, e.target.value);
                }}
                placeholder="请输入"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "处方时间",
      dataIndex: "prescriptionTime",
      align: "center",
      width: 180,
      key: "prescriptionTime",
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus != 0 && record.checkStatus != 3 ? (
              record.prescriptionTime && record.prescriptionTime.substr(0, 10)
            ) : (
              <DatePicker
                disabledDate={disabledDate}
                style={{ width: 160 }}
                defaultValue={
                  record.prescriptionTime
                    ? dayjs(record.prescriptionTime, formatDate)
                    : null
                }
                format={formatDate}
                onChange={(value, dateStrings) => {
                  dateChange(record, dateStrings);
                }}
                placeholder="请选择"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "审核状态",
      dataIndex: "checkStatus",
      align: "center",
      width: 160,
      key: "checkStatus",
      render: (_, record) => {
        return (
          <div>
            {record.checkStatus == 0 && <Tag color="warning">待审核</Tag>}
            {record.checkStatus == 1 && <Tag color="success">审核通过</Tag>}
            {record.checkStatus == 2 && <Tag color="error">审核未通过</Tag>}
            {record.checkStatus == 3 && <Tag color="warning">修改待审核</Tag>}
          </div>
        );
      },
    },
    {
      title: "审核日期",
      dataIndex: "checkTime",
      align: "center",
      width: 160,
      key: "checkTime",
    },
    {
      title: "操作",
      align: "center",
      width: 160,
      key: "action",
      fixed: "right",
      render: (_, record) => {
        return (
          <div>
            <Button
              disabled={record.checkStatus != "0" && record.checkStatus != "3"}
              type="link"
              onClick={() => {
                setIsModalOpen(true);
                setAuditItem(record);
              }}
            >
              审核
            </Button>
            <Button
              type="link"
              onClick={() => {
                navigate("/viewPrescription", { state: { code: record.code } });
              }}
            >
              查看
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getList();
  }, [pageNum, searchName, searchStatus]);

  const exportHandle = async () => {
    try {
      const res = await commonExport({
        name: searchName,
        checkStatus: searchStatus,
        exportId: "export.xlt.drug",
      });
      const uploadUrl =
        import.meta.env.VITE_NODE_ENV == "development"
          ? "https://t.merch.yishengzhan.cn/api/"
          : import.meta.env.VITE_API_URL;
      const downUrl = `${uploadUrl}export/exportExcelDown?fileName=${res.data.fileName}&fileUrl=${res.data.fileUrl}`;
      window.open(downUrl);
    } catch (error) {
      message.error(error);
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const getList = async () => {
    try {
      const res = await getPrescriptionList({
        name: searchName,
        checkStatus: searchStatus,
        pageNum: pageNum,
        pageSize: 10,
      });
      res.data.list.forEach((ele, index) => {
        ele.key = index + 1;
      });
      setTotal(res.data.total);
      setDataList(res.data.list);
    } catch (error) {
      console.log(error);
    }
  };

  const doctorChange = async (item, name) => {
    if (!name) {
      return;
    }
    try {
      await updatePrescription({ doctorCode: name, id: item.id });
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  const countChange = async (item, count) => {
    if (!count) {
      return;
    }
    try {
      await updatePrescription({ drugBoxCount: count, id: item.id });
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  const dateChange = async (item, date) => {
    if (!date) {
      return;
    }
    try {
      await updatePrescription({ prescriptionTime: date, id: item.id });
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  const dosageChange = async (item, suggestedDosage) => {
    if (!suggestedDosage) {
      return;
    }
    try {
      await updatePrescription({
        suggestedDosage: suggestedDosage,
        id: item.id,
      });
      getList();
    } catch (error) {
      console.log(error);
    }
  };

  const searchHandle = () => {
    setPageNum(1);
    setSearchName(name);
    setSearchStatus(checkStatus);
  };

  const resetHandle = () => {
    setName("");
    setSearchName("");
    setCheckStatus(null);
    setSearchStatus(null);
    setPageNum(1);
  };

  const pageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const acncelAudit = () => {
    setIsModalOpen(false);
    setAuditItem({});
    setAuditStatus(null);
    setAddress(null);
    setRefuseReason(null);
  };

  const auditSave = async () => {
    if (!auditStatus) {
      message.error("请选择审核状态");
      return;
    }
    if (auditStatus == "2" && !refuseReason) {
      message.error("请输入驳回原因");
      return;
    }
    if (
      auditStatus == "1" &&
      (!auditItem.drugBoxCount ||
        !auditItem.prescriptionTime ||
        !auditItem.suggestedDosage ||
        !auditItem.doctorCode)
    ) {
      message.error("请先完善医生、建议用量、药品盒数和处方时间信息");
      return;
    }
    if (auditStatus == "1" && (!address || !address.value)) {
      message.error("请选择邮寄地址");
      return;
    }
    const data = {
      checkStatus: auditStatus,
      refuseReason: refuseReason,
      id: auditItem.id,
      pharmacyCode: (address && address.value) || null,
    };
    try {
      await auditPrescription(data);
      getList();
      acncelAudit();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserList = async (value) => {
    return getAddressList({
      code: auditItem.code,
      pharmacyName: value,
    });
  };

  return (
    <div className="common__wrap">
      <div className="common__search">
        <Input
          placeholder="请输入姓名或药店名称搜索"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Select
          style={{ width: 280 }}
          value={checkStatus}
          onChange={(value) => {
            setCheckStatus(value);
          }}
          placeholder="请选择审核状态"
          options={[
            { value: "0", label: "待审核" },
            { value: "1", label: "审核通过" },
            { value: "2", label: "审核未通过" },
            { value: "3", label: "修改待审核" },
          ]}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={searchHandle}>
          搜索
        </Button>
        <Button icon={<CloseCircleOutlined />} onClick={resetHandle}>
          重置
        </Button>
      </div>
      <div className="common__table">
        <div className="table__btns">
          <Button type="primary" onClick={exportHandle}>
            导出
          </Button>
        </div>

        <div className="table__box">
          <Table
            scroll={{ y: 470 }}
            columns={column}
            dataSource={dataList}
            pagination={{ pagination: 10, total: total, current: pageNum }}
            onChange={pageChange}
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
      </div>

      <Modal
        title="审核"
        footer={null}
        open={isModalOpen}
        onCancel={acncelAudit}
      >
        <div className="audit__box">
          <div className="audit__item">
            <div className="audit__label">审核状态：</div>
            <Select
              value={auditStatus}
              style={{ width: 300 }}
              onChange={(value) => {
                setAuditStatus(value);
                if (value == "2") {
                  setRefuseReason(null);
                } else {
                  setAddress(null);
                }
              }}
              placeholder="请选择审核状态"
              options={[
                { value: "1", label: "审核通过" },
                { value: "2", label: "审核驳回" },
              ]}
            />
          </div>
          {auditStatus == "1" ? (
            <div className="audit__item">
              <div className="audit__label">邮寄点：</div>
              <DebounceSelect
                style={{ width: 300 }}
                value={address}
                item={auditItem}
                placeholder="请选择"
                fetchOptions={fetchUserList}
                onChange={(newValue) => {
                  setAddress(newValue);
                }}
              />
            </div>
          ) : null}
          {auditStatus == "2" ? (
            <div className="audit__item">
              <div className="audit__label">驳回原因：</div>
              <TextArea
                placeholder="请输入驳回原因"
                style={{ width: 300 }}
                value={refuseReason}
                onChange={(e) => {
                  setRefuseReason(e.target.value);
                }}
                rows={3}
              />
            </div>
          ) : null}
          <div className="btn__box">
            <Button type="primary" onClick={auditSave}>
              确认
            </Button>
            <Button type="default" onClick={acncelAudit}>
              返回
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrescriptionList;
