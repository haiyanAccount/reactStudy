import fetch from "./fetch";

// 登录
export function login(params) {
  const myParams = params;
  return fetch({
    url: "/admin/login",
    method: "post",
    data: myParams,
  });
}

export function getHospitalList(params) {
  return fetch({
    url: "/xlt/hospital/list",
    method: "post",
    data: params,
  });
}

// 获取省市区列表
export function getCountyList(params) {
  return fetch({
    url: "/query/hospital/list",
    method: "post",
    data: params,
  });
}

// 新增医院
export function addHospital(params) {
  return fetch({
    url: "/xlt/hospital/addOrUpdate",
    method: "post",
    data: params,
  });
}

// 获取医院详情
export function getHospitalDetail(params) {
  return fetch({
    url: "/xlt/hospital/detail",
    method: "post",
    data: params,
  });
}

// 医院导入
export function excelImportHospital(file) {
  const data = new FormData();
  data.append("file", file);
  return fetch({
    url: "/xlt/hospital/import",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

//获取协议文件
export function commonExport(params) {
  return fetch({
    url: "/export/exportExcel",
    method: "post",
    data: params,
  });
}

// 获取药店列表
export function geDrugStoreList(params) {
  return fetch({
    url: "/xlt/pharmacy/list",
    method: "post",
    data: params,
  });
}

// 获取药店详情
export function getDrugStoreDetail(params) {
  return fetch({
    url: "/xlt/pharmacy/detail",
    method: "post",
    data: params,
  });
}

// 新增药店
export function addDrugStore(params) {
  return fetch({
    url: "/xlt/pharmacy/addOrUpdate",
    method: "post",
    data: params,
  });
}

// 获取协议详情
export function getAgreementDetail(params) {
  return fetch({
    url: "/xlt/pharmacy/agreement/detail",
    method: "post",
    data: params,
  });
}

// 协议审核
export function auditAgreementHandle(params) {
  return fetch({
    url: "/xlt/pharmacy/agreement/check",
    method: "post",
    data: params,
  });
}

// 获取药店库存详情
export function getInventoryDetail(params) {
  return fetch({
    url: "/xlt/pharmacy/replenishment/detail",
    method: "post",
    data: params,
  });
}

// 库存审核
export function auditInventory(params) {
  return fetch({
    url: "/xlt/pharmacy/replenishment/check",
    method: "post",
    data: params,
  });
}

// 库存增加
export function addReplenishment(params) {
  return fetch({
    url: "/xlt/pharmacy/replenishment/add",
    method: "post",
    data: params,
  });
}

// 药店导入
export function importDrugStore(file) {
  const data = new FormData();
  data.append("file", file);
  return fetch({
    url: "/xlt/pharmacy/import",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

//获取协议文件
export function fetchFileList(params) {
  return fetch({
    url: "/xlt/pharmacy/agreement/file/list",
    method: "post",
    data: params,
  });
}

// 获取处方单列表
export function getPrescriptionList(params) {
  return fetch({
    url: "/xlt/drug/apply/list",
    method: "post",
    data: params,
  });
}

// 处方单审核
export function updatePrescription(params) {
  return fetch({
    url: "/xlt/drug/apply/update",
    method: "post",
    data: params,
  });
}

// 处方单详情
export function getPrescriptionInfo(params) {
  return fetch({
    url: "/xlt/drug/apply/detail",
    method: "post",
    data: params,
  });
}

// 获取邮寄点列表
export function getAddressList(params) {
  return fetch({
    url: "xlt/drug/apply/mail/place",
    method: "post",
    data: params,
  });
}

// 处方单审核
export function auditPrescription(params) {
  return fetch({
    url: "/xlt/drug/apply/check",
    method: "post",
    data: params,
  });
}

// 获取药店资料审核列表
export function getAuditList(params) {
  return fetch({
    url: "/xlt/drug/apply/information/list",
    method: "post",
    data: params,
  });
}

//资料审核
export function auditInformation(params) {
  return fetch({
    url: "/xlt/drug/apply/information/check",
    method: "post",
    data: params,
  });
}

//查询未审核
export function checkStatus(params) {
  return fetch({
    url: "/xlt/drug/apply/status",
    method: "post",
    data: params,
  });
}

//关闭未审核
export function closeStatus(params) {
  return fetch({
    url: "/xlt/drug/apply/status/change",
    method: "post",
    data: params,
  });
}

//数据报表 - 大区城市列表
export function getSelectList(params) {
  return fetch({
    url: "xlt/drug/apply/report/params",
    method: "post",
    data: params,
  });
}

//数据报表 - 大区城市列表
export function getReportData(params) {
  return fetch({
    url: "xlt/drug/apply/report",
    method: "post",
    data: params,
  });
}
