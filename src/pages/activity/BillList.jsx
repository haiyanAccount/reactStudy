import { Input, Button, Table, Image, Select, message, Tag, Modal } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  getAuditList,
  commonExport,
  auditInformation,
} from "../../api/serviceAPI";
import "./style/audit.less";

const BillList = () => {
  const [name, setName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [checkStatus, setCheckStatus] = useState(null);
  const [searchStatus, setSearchStatus] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [images, setImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditItem, setAuditItem] = useState(false);
  const [auditStatus, setAuditStatus] = useState(null);
  const [refuseReason, setRefuseReason] = useState(null);
  const { TextArea } = Input;

  const column = [
    {
      title: "申请单号",
      dataIndex: "applyCode",
      width: 180,
      key: "applyCode",
      align: "center",
    },
    {
      title: "药店名称",
      dataIndex: "pharmacyName",
      align: "center",
      width: 150,
      key: "pharmacyName",
    },
    {
      title: "资料照片",
      dataIndex: "fileUrlList",
      width: 80,
      align: "center",
      key: "fileUrlList",
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setImages(record.fileUrlList);
              setVisible(true);
            }}
          >
            查看
          </Button>
        );
      },
    },
    {
      title: "资料提交时间",
      dataIndex: "createTime",
      width: 150,
      align: "center",
      key: "createTime",
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
            {record.checkStatus == 2 && <Tag color="error">审核驳回</Tag>}
            {record.checkStatus == 3 && <Tag color="warning">修改待审核</Tag>}
          </div>
        );
      },
    },
    {
      title: "驳回原因",
      dataIndex: "refuseReason",
      width: 150,
      align: "center",
      key: "refuseReason",
    },
    {
      title: "审核人",
      dataIndex: "checkUser",
      width: 150,
      align: "center",
      key: "checkUser",
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
        pharmacyName: searchName || null,
        checkStatus: searchStatus || null,
        exportId: "export.xlt.information",
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

  const getList = async () => {
    try {
      const res = await getAuditList({
        pharmacyName: searchName,
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
    const data = {
      checkStatus: auditStatus,
      refuseReason: refuseReason,
      id: auditItem.id,
    };
    try {
      await auditInformation(data);
      getList();
      acncelAudit();
    } catch (error) {
      console.log(error);
    }
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
                }
              }}
              placeholder="请选择审核状态"
              options={[
                { value: "1", label: "审核通过" },
                { value: "2", label: "审核驳回" },
              ]}
            />
          </div>
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

export default BillList;
