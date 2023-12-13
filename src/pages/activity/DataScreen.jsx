import { DatePicker, Select } from "antd";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import moment from "moment";
import { getSelectList, getReportData } from "../../api/serviceAPI";
import geoJson from "../../utils/geoJson";
dayjs.extend(customParseFormat);
import "./style/chart.less";
import * as echarts from "echarts";
const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
const DataScreen = () => {
  const [head, setHead] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [areaName, setAreaName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [timeRange, setTimeRange] = useState([
    "2023-08-10",
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}`,
  ]);
  const chinaMap = {
    北京市: "北京",
    天津市: "天津",
    河北省: "河北省",
    山西省: "山西省",
    内蒙古自治区: "内蒙古自治区",
    辽宁省: "辽宁省",
    吉林省: "吉林省",
    黑龙江省: "黑龙江省",
    上海市: "上海",
    江苏省: "江苏省",
    浙江省: "浙江省",
    安徽省: "安徽省",
    福建省: "福建省",
    江西省: "江西省",
    山东省: "山东省",
    河南省: "河南省",
    湖北省: "湖北省",
    湖南省: "湖南省",
    广东省: "广东省",
    广西壮族自治区: "广西壮族自治区",
    海南省: "海南省",
    重庆市: "重庆",
    四川省: "四川省",
    贵州省: "贵州省",
    云南省: "云南省",
    西藏自治区: "西藏自治区",
    陕西省: "陕西省",
    甘肃省: "甘肃省",
    青海省: "青海省",
    宁夏回族自治区: "宁夏回族自治区",
    新疆维吾尔自治区: "新疆维吾尔自治区",
    台湾省: "台湾省",
    香港特别行政区: "香港特别行政区",
    澳门特别行政区: "澳门特别行政区",
  };

  useEffect(() => {
    getList();
  }, [timeRange]);

  const timeRangeChange = (a, value) => {
    setTimeRange(value);
  };

  //大区赠药情况
  const initAreaChart = (areaX, areaY) => {
    const chartSecond = echarts.init(document.getElementById("chartSecond"));
    chartSecond.setOption({
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "top",
        feature: {
          saveAsImage: {
            show: true,
            name: "大区赠药情况",
            iconStyle: {
              borderColor: "#4d88ff",
            },
          }, // 保存图表
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (item) => {
          return `${item[0].name} <br/> <strong>${item[0].value}</strong>  盒`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      yAxis: [
        {
          type: "category",
          data: areaX,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: "#cdcdcd",
            },
          },
        },
      ],
      xAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#cdcdcd",
            },
          },
        },
      ],
      series: [
        {
          name: "",
          type: "bar",
          barWidth: "60%",
          data: areaY,
          itemStyle: {
            normal: {
              color: function (colors) {
                var colorList = [
                  "#B79FFF",
                  "#FF998C",
                  "#FFDD93",
                  "#8BFFF5",
                  "#8FB5FF",
                  "#b3f6c4",
                  "#B3B4FF",
                  "#8097FF ",
                  "#66B5FF",
                  "#FFB3EB",
                  "#5CE4E6",
                  "#FFBE33",
                ];
                return colorList[colors.dataIndex];
              },
            },
          },
        },
      ],
    });
  };

  const initMapChart = async (provinceData) => {
    let thirdChart = echarts.init(document.getElementById("chartThird"));
    echarts.registerMap("china", geoJson);
    thirdChart.setOption({
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "top",
        feature: {
          saveAsImage: {
            show: true,
            name: "省份处方单开具情况",
            iconStyle: {
              borderColor: "#4d88ff",
            },
          }, // 保存图表
        },
      },
      tooltip: {
        formatter: function (params) {
          return `${params.name}<br>已开具处方单：<strong>${
            params.value ? params.value : 0
          }</strong> 份`;
        },
      },
      layoutCenter: ["50%", "55%"],
      layoutSize: "88%",
      visualMap: {
        type: "continuous",
        min: 0,
        max: 20,
        text: ["High", "Low"],
        realtime: true,
        calculable: false,
        inRange: {
          color: ["#D8E3FF", "#0156FF", "#003CAF"],
        },
        show: false,
      },
      select: {
        // 地图选中区域样式
        disabled: true,
        itemStyle: {
          areaColor: "#0156FF",
        },
      },
      series: [
        {
          name: "中国区域",
          type: "map",
          map: "china",
          showLegendSymbol: true, // 存在legend时显示
          label: {
            show: true,
            fontSize: 8,
            emphasis: {
              show: true,
              textStyle: {
                color: "#000",
              },
            },
          },
          zoom: 1.2,
          itemStyle: {
            normal: {
              borderWith: 0.5, // 区域边框宽度
              borderColor: "#fff", // 区域边框颜色
              areaColor: "#D8E3FF", // 区域颜色
            },
          },
          data: provinceData,
          // 自定义名称映射
          nameMap: chinaMap,
        },
      ],
    });
  };

  const initPieChart = (regionData) => {
    let chartFirst = echarts.init(document.getElementById("chartFirst"));
    chartFirst.setOption({
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "top",
        feature: {
          saveAsImage: {
            show: true,
            name: "事业部赠药情况",
            iconStyle: {
              borderColor: "#4d88ff",
            },
          }, // 保存图表
        },
      },
      title: {
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: (item) => {
          return `${item.name} <br/> <strong>${item.value}</strong> 盒`;
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
        formatter: function (name) {
          let total = 0;
          let tarValue;
          for (let i = 0; i < regionData.length; i++) {
            total += regionData[i].value;
            if (regionData[i].name == name) {
              tarValue = regionData[i].value;
            }
          }
          return `${name}： ${tarValue}盒`;
        },
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: regionData,
          itemStyle: {
            normal: {
              color: function (colors) {
                var colorList = [
                  "#B79FFF",
                  "#FF998C",
                  "#FFDD93",
                  "#8BFFF5",
                  "#8FB5FF",
                  "#b3f6c4",
                  "#B3B4FF",
                  "#8097FF ",
                  "#66B5FF",
                  "#FFB3EB",
                  "#5CE4E6",
                  "#FFBE33",
                ];
                return colorList[colors.dataIndex];
              },
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });
  };

  const getData = async ({ type, areaName, city }) => {
    try {
      const res = await getReportData({
        queryStartTime: new Date(timeRange[0]).getTime() / 1000,
        queryEndTime: new Date(`${timeRange[1]} 23:59:59`).getTime() / 1000,
        type,
        areaName,
        city,
      });
      switch (type) {
        case 1:
          setHead(res.data.head);
          res.data.region.forEach((ele) => {
            ele.value = ele.num;
          });
          res.data.province.forEach((ele) => {
            ele.value = ele.num;
          });
          initMapChart(res.data.province);
          initPieChart(res.data.region);
          break;
        case 2:
          const area = res.data.area;
          const areaX = [];
          const areaY = [];
          area.forEach((ele) => {
            areaX.push(ele.name);
            areaY.push(ele.num);
          });
          initAreaChart(areaX, areaY);
          break;
        case 3:
          const city = res.data.city;
          const cityX = [];
          const cityY = [];
          city.forEach((ele) => {
            cityX.push(ele.name);
            cityY.push(ele.num);
          });
          initCityChart(cityX, cityY);
          break;
        default:
      }
    } catch (error) {
      console.log(error);
    }
  };

  //城市赠药情况
  const initCityChart = (cityX, cityY) => {
    const chartFourth = echarts.init(document.getElementById("chartFourth"));
    chartFourth.setOption({
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "top",
        feature: {
          saveAsImage: {
            show: true,
            name: "城市处方单开具情况",
            iconStyle: {
              borderColor: "#4d88ff",
            },
          }, // 保存图表
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (item) => {
          return `${item[0].name} <br/> <strong>${item[0].value}</strong>  份`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      yAxis: [
        {
          type: "category",
          data: cityX,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: "#cdcdcd",
            },
          },
        },
      ],
      xAxis: [
        {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#cdcdcd",
            },
          },
        },
      ],
      series: [
        {
          name: "",
          type: "bar",
          barWidth: "60%",
          data: cityY,
          itemStyle: {
            normal: {
              color: function (colors) {
                var colorList = [
                  "#B79FFF",
                  "#FF998C",
                  "#FFDD93",
                  "#8BFFF5",
                  "#8FB5FF",
                  "#b3f6c4",
                  "#B3B4FF",
                  "#8097FF ",
                  "#66B5FF",
                  "#FFB3EB",
                  "#5CE4E6",
                  "#FFBE33",
                ];
                return colorList[colors.dataIndex];
              },
            },
          },
        },
      ],
    });
  };

  const areaChange = (data) => {
    setAreaName(data);
    getData({ type: 2, areaName: data });
    console.log(data);
  };

  const cityChange = (data) => {
    setCityName(data);
    getData({ type: 3, city: data });
  };

  const getList = async () => {
    console.log(timeRange[1]);
    try {
      const res = await getSelectList({
        queryStartTime: new Date(timeRange[0]).getTime() / 1000,
        queryEndTime: new Date(`${timeRange[1]} 23:59:59`).getTime() / 1000,
      });
      setAreaList(res.data.areaList);
      setCityList(res.data.cityList);
      if (res.data.areaList.length > 0) {
        setAreaName(res.data.areaList[0]);
      }
      if (res.data.cityList.length > 0) {
        setCityName(res.data.cityList[0]);
      }
      getData({
        type: 1,
      });
      getData({ type: 2, areaName: res.data.areaList[0] });
      getData({ type: 3, city: res.data.cityList[0] });
    } catch (error) {
      console.log(error);
    }
  };

  const disabledDate = (current) => {
    return current && current > moment().endOf("day");
  };

  return (
    <div className="data-wrap">
      <div className="select-box">
        <RangePicker
          onChange={timeRangeChange}
          defaultValue={[
            dayjs("2023-08-10", dateFormat),
            dayjs(
              `${new Date().getFullYear()}/${
                new Date().getMonth() + 1
              }/${new Date().getDate()}`,
              dateFormat
            ),
          ]}
          disabledDate={disabledDate}
          format={dateFormat}
        />
      </div>
      <div className="chart-content">
        <div className="top-box">
          <div className="common-title">
            <div className="title-text">处方单审核情况</div>
          </div>
          <div className="top-data">
            {head.map((item, index) => {
              return (
                <div className="data-item" key={index}>
                  <div className="item-title">{item.name}</div>
                  <span>{item.num}</span>份
                </div>
              );
            })}
          </div>
        </div>
        <div className="chart-box">
          <div className="chart-item">
            <div className="common-title">
              <div className="title-text">事业部赠药情况</div>
            </div>
            <div className="chart-select"></div>
            <div className="chart-wrap" id="chartFirst"></div>
          </div>
          <div className="chart-item">
            <div className="common-title">
              <div className="title-text">大区赠药情况</div>
            </div>
            <div className="chart-select">
              <Select
                value={areaName}
                style={{ width: 360 }}
                onChange={areaChange}
              >
                {areaList.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </div>
            <div className="chart-wrap" id="chartSecond"></div>
          </div>
          <div className="chart-item">
            <div className="common-title">
              <div className="title-text">省份处方单开具情况</div>
            </div>
            <div className="chart-select"></div>
            <div className="chart-wrap" id="chartThird"></div>
          </div>
          <div className="chart-item">
            <div className="common-title">
              <div className="title-text">城市处方单开具情况</div>
            </div>
            <div className="chart-select">
              <Select
                value={cityName}
                style={{ width: 360 }}
                onChange={cityChange}
              >
                {cityList.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </div>
            <div className="chart-wrap" id="chartFourth"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataScreen;
