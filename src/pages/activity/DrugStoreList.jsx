import {
  Input,
  Button,
  Table,
  Modal,
  Upload,
  message,
  Tag,
  Popover,
} from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import {
  geDrugStoreList,
  commonExport,
  importDrugStore,
  fetchFileList,
} from "../../api/serviceAPI";
import DrugDetail from "./DrugDetail";
import JSZip from "jszip";
import FileSaver from "file-saver";

const DrugStoreList = () => {
  const [pharmacyName, setPharmacyName] = useState("");
  const [pharmacy, setPharmacy] = useState("");
  const [volunteer, setVolunteer] = useState("");
  const [volunteerName, setVolunteerName] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [item, setItem] = useState({});
  const navigate = useNavigate();
  const zip = new JSZip();

  useEffect(() => {
    getList();
  }, [pageNum, pharmacyName, volunteerName]);

  const exportHandle = async () => {
    try {
      const res = await commonExport({
        pharmacyName: pharmacyName,
        volunteerName: volunteerName,
        exportId: "export.xlt.pharmacy",
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

  const auditHandle = (type, item) => {
    navigate(`/auditAgreement`, {
      state: { type: type, pharmacyCode: item.pharmacyCode },
    });
  };

  const viewHandle = (type, item) => {
    navigate(`/auditAgreement`, {
      state: { type: type, pharmacyCode: item.pharmacyCode, disabled: true },
    });
  };

  const getList = async () => {
    try {
      const res = await geDrugStoreList({
        pharmacyName: pharmacyName,
        volunteerName: volunteerName,
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
      width: 70,
      key: "key",
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
      title: "药店地址",
      dataIndex: "address",
      width: 200,
      align: "center",
      key: "address",
    },
    {
      title: "药店联系方式",
      dataIndex: "pharmacyMobile",
      align: "center",
      key: "pharmacyMobile",
      width: 140,
    },
    {
      title: "所在省市",
      dataIndex: "hospitalName",
      width: 150,
      align: "center",
      key: "hospitalName",
      render: (_, record) => (
        <div>
          {record.province}&nbsp;{record.city}
        </div>
      ),
    },
    {
      title: "目标库存",
      dataIndex: "targetInventory",
      width: 100,
      align: "center",
      key: "targetInventory",
    },
    {
      title: "已入库",
      dataIndex: "receivedCount",
      align: "center",
      key: "receivedCount",
      width: 90,
    },
    {
      title: "已出库",
      dataIndex: "outCount",
      width: 90,
      align: "center",
      key: "outCount",
    },
    {
      title: "事业部",
      dataIndex: "regionName",
      align: "center",
      key: "regionName",
      width: 100,
    },
    {
      title: "所属大区",
      dataIndex: "areaName",
      width: 120,
      align: "center",
      key: "areaName",
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
      dataIndex: "createUser",
      align: "center",
      width: 90,
      key: "createUser",
    },

    {
      title: "免赠协议状态",
      dataIndex: "volunteerMasterMobile",
      align: "center",
      key: "volunteerMasterMobile",
      width: 120,
      render: (_, record) => (
        <div className="tag__btn">
          {record.freeAgreement == 0 && <Tag color="default">未上传</Tag>}
          {record.freeAgreement == 1 && <Tag color="warning">待审核</Tag>}
          {record.freeAgreement == 2 && <Tag color="success">已通过</Tag>}
          {record.freeAgreement == 3 && <Tag color="error">已驳回</Tag>}
        </div>
      ),
    },
    {
      title: "买赠协议状态",
      dataIndex: "volunteerMasterName",
      width: 120,
      align: "center",
      key: "volunteerMasterName",
      render: (_, record) => (
        <div className="tag__btn">
          {record.buyAgreement == 0 && <Tag color="default">未上传</Tag>}
          {record.buyAgreement == 1 && <Tag color="warning">待审核</Tag>}
          {record.buyAgreement == 2 && <Tag color="success">已通过</Tag>}
          {record.buyAgreement == 3 && <Tag color="error">已驳回</Tag>}
        </div>
      ),
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
      width: 260,
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <div className="table__btn">
          <Button
            onClick={() => {
              editHandle(record);
            }}
            type="link"
          >
            编辑
          </Button>
          <Popover
            content={
              <div>
                <Button
                  type="link"
                  disabled={record.freeAgreement != 1}
                  onClick={() => {
                    auditHandle("free", record);
                  }}
                >
                  审核
                </Button>
                <br />
                <Button
                  type="link"
                  onClick={() => {
                    viewHandle("free", record);
                  }}
                  disabled={record.freeAgreement == 0}
                >
                  查看
                </Button>
                <br />
                <Button
                  type="link"
                  onClick={() => {
                    download("free", record);
                  }}
                >
                  下载
                </Button>
              </div>
            }
            trigger="hover"
          >
            <Button type="link">免赠协议</Button>
          </Popover>
          <Popover
            content={
              <div>
                <Button
                  type="link"
                  disabled={record.buyAgreement != 1}
                  onClick={() => {
                    auditHandle("buy", record);
                  }}
                >
                  审核
                </Button>
                <br />
                <Button
                  type="link"
                  onClick={() => {
                    viewHandle("buy", record);
                  }}
                  disabled={record.buyAgreement == 0}
                >
                  查看
                </Button>
                <br />
                <Button
                  type="link"
                  onClick={() => {
                    download("buy", record);
                  }}
                >
                  下载
                </Button>
              </div>
            }
            trigger="hover"
          >
            <Button type="link">买赠协议</Button>
          </Popover>
          <Button
            onClick={() => {
              setItem(record);
              setShowDetail(true);
            }}
            type="link"
          >
            库存
            {record.replenishmentPictureFlag === 1 ? (
              <ExclamationCircleOutlined
                style={{ color: "red", marginLeft: "2px" }}
              />
            ) : null}
          </Button>
        </div>
      ),
    },
  ];

  const searchHandle = () => {
    setPageNum(1);
    setVolunteerName(volunteer);
    setPharmacyName(pharmacy);
  };

  const editHandle = (record) => {
    navigate(`/addDrug`, { state: { pharmacyCode: record.pharmacyCode } });
  };

  const resetHandle = () => {
    setPharmacy("");
    setPharmacyName("");
    setVolunteer("");
    setVolunteerName("");
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
      try {
        await importDrugStore(file.file);
        message.success("导入成功");
        setIsModalOpen(false);
        getList();
      } catch (error) {
        message.error(error);
      }
    },
  };

  const closeHandle = () => {
    setShowDetail(false);
    setItem({});
  };

  //获取图片
  const getImgArrayBuffer = (url) => {
    return new Promise((resolve, reject) => {
      //通过请求获取文件blob格式
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", url, true);
      xmlHttp.responseType = "blob";
      xmlHttp.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        } else {
          reject(this.status);
        }
      };
      xmlHttp.send();
    });
  };

  const download = async (type, item) => {
    try {
      const res = await fetchFileList({
        pharmacyCode: item.pharmacyCode,
        type: type === "buy" ? 1 : 0,
      });
      if (res.data.length === 0) {
        message.error("暂无协议文件");
        return;
      }
      for (let i = 0; i < res.data.length; i++) {
        //imageList是后端返回的数组
        //通过每个图片对应的id，拿到该图片并获取到对应的ArrayBuffer
        const imageResponse = await getImgArrayBuffer(res.data[i]);
        // zip.file(`image${i + 1}`, imageResponse);
        zip.file(
          `${imageResponse.size}${i + 1}.${imageResponse.type.split("/")[1]}`,
          imageResponse,
          {
            binary: true,
          }
        );
      }
      zip.generateAsync({ type: "blob" }).then((content) => {
        FileSaver.saveAs(
          content,
          `${item.pharmacyName}-${
            type === "free" ? "免赠协议" : "买赠协议"
          }.zip`
        );
      });
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <div className="common__wrap">
      <div className="common__search">
        <Input
          placeholder="请输入药店名称搜索"
          value={pharmacy}
          onChange={(e) => {
            setPharmacy(e.target.value);
          }}
        />
        <Input
          placeholder="请输入总负责人姓名或手机号搜索"
          value={volunteer}
          onChange={(e) => {
            setVolunteer(e.target.value);
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
              navigate(`/addDrug`);
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
              <div className="upload__title">请上传填写好的药店信息文件</div>
            </div>
            <div className="upload__content">文件为excel格式</div>
            <div className="btn__box">
              <Button
                type="primary"
                onClick={() => {
                  window.location.href =
                    "https://studioyszimg.yxj.org.cn/药店导入模板-信立泰-new_7.xlsx";
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
        <Modal
          title="库存管理"
          footer={null}
          width={1000}
          open={showDetail}
          onCancel={() => {
            setShowDetail(false);
            setItem({});
            getList();
          }}
        >
          {showDetail ? (
            <DrugDetail item={item} closeHandle={closeHandle} />
          ) : null}
        </Modal>
      </div>
    </div>
  );
};

export default DrugStoreList;
