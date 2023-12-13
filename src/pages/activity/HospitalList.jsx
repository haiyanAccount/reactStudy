import { Input, Button, Table, Modal, Upload, message } from "antd";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  getHospitalList,
  excelImportHospital,
  commonExport,
} from "../../api/serviceAPI";

const HospitalList = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [searchHospital, setSearchHospital] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getList();
  }, [pageNum, searchHospital]);

  const exportHandle = async () => {
    try {
      const res = await commonExport({
        hospitalName: hospitalName ? hospitalName : null,
        exportId: "export.xlt.hospital",
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
      const res = await getHospitalList({
        hospitalName: searchHospital,
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

  const column = [
    {
      title: "序号",
      dataIndex: "key",
      width: 80,
      key: "key",
      align: "center",
    },
    {
      title: "省份",
      dataIndex: "provinceName",
      align: "center",
      width: 150,
      key: "provinceName",
    },
    {
      title: "城市",
      dataIndex: "cityName",
      width: 150,
      align: "center",
      key: "cityName",
    },
    {
      title: "区（县）",
      dataIndex: "districtName",
      align: "center",
      key: "districtName",
      width: 150,
    },
    {
      title: "医院名称",
      dataIndex: "hospitalName",
      width: 200,
      align: "center",
      key: "hospitalName",
    },
    {
      title: "所属大区",
      dataIndex: "regionName",
      width: 160,
      align: "center",
      key: "regionName",
    },
    {
      title: "志愿者手机号",
      dataIndex: "volunteerMobile",
      align: "center",
      key: "volunteerMobile",
      width: 120,
    },
    {
      title: "志愿者姓名",
      dataIndex: "volunteerName",
      width: 140,
      align: "center",
      key: "volunteerName",
    },
    {
      title: "总负责人手机号",
      dataIndex: "volunteerMasterMobile",
      align: "center",
      key: "volunteerMasterMobile",
      width: 140,
    },
    {
      title: "总负责人姓名",
      dataIndex: "volunteerMasterName",
      width: 140,
      align: "center",
      key: "volunteerMasterName",
    },
    {
      title: "创建者",
      dataIndex: "updateUser",
      align: "center",
      width: 90,
      key: "updateUser",
    },
    {
      title: "最后操作时间",
      dataIndex: "updateTime",
      align: "center",
      width: 160,
      key: "updateTime",
    },
    {
      title: "操作",
      align: "center",
      width: 90,
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Button
          onClick={() => {
            editHandle(record);
          }}
          type="link"
        >
          编辑
        </Button>
      ),
    },
  ];

  const searchHandle = () => {
    setPageNum(1);
    setSearchHospital(hospitalName);
  };

  const editHandle = (record) => {
    navigate(`/addHospital`, { state: { hospitalCode: record.hospitalCode } });
  };

  const resetHandle = () => {
    setHospitalName("");
    setSearchHospital("");
    setPageNum(1);
  };

  const pageChange = (pageInfo) => {
    setPageNum(pageInfo.current);
  };

  const props = {
    name: "file",
    action: "",
    accept: ".xlsx, .xls",
    showUploadList: false,
    async customRequest(file) {
      console.log(file, "---6");
      try {
        const res = await excelImportHospital(file.file);
        message.success("导入成功");
        setIsModalOpen(false);
        getList();
      } catch (error) {
        message.error(error);
      }
    },
  };

  return (
    <div className="common__wrap">
      <div className="common__search">
        <Input
          placeholder="请输入医院名称搜索"
          value={hospitalName}
          onChange={(e) => {
            setHospitalName(e.target.value);
          }}
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
          <Button
            type="primary"
            onClick={() => {
              navigate(`/addHospital`);
            }}
          >
            新增
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            导入
          </Button>
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

        <Modal
          title="导入"
          footer={null}
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="upload__wrap">
            <div className="upload__title">
              <div className="upload__icon">
                <CloudUploadOutlined />
              </div>
              <div className="upload__title">请上传填写好的医院信息文件</div>
            </div>
            <div className="upload__content">文件为excel格式</div>
            <div className="btn__box">
              <Button
                type="primary"
                onClick={() => {
                  window.location.href =
                    "https://studioyszimg.yxj.org.cn/医院导入模板-信立泰-new-5.xlsx";
                }}
              >
                模板下载
              </Button>
              <Upload {...props}>
                <Button type="primary">上传文件</Button>
              </Upload>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default HospitalList;
