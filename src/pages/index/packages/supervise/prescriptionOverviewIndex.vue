<!--处方信息共享平台-处方总览-->
<template>
  <div class="cloud-component prescriptionOverviewIndex">
    <div class="searchTitle">
      <span>实时处方监管</span>
    </div>
    <div class="main_wrap">
      <!--今日处方-->
      <div class="box">
        <span class="titlea clear">
          <em>今日处方</em>
        </span>
        <div class="chartbox mt30 " v-loading="dataPieLoading">
          <div class="chartouter fl wpa">
            <div class="cardwrap hc bc9">
              <div class="card" style="cursor: pointer;" @click="GoPrescriptionList('1', '')">
                <p class="relat">
                  <i class="icon icon-chufang lico fc5"></i><em id="todayPrescriptionCount"
                                                                v-text="todayPrescription.count"></em><i
                  class="icon">
                  &nbsp;</i>
                </p>
                <span>今日处方</span>
              </div>
              <div class="card">
                <p>
                  <i class="icon2 icon-Statistics lico fc5"></i><em
                  id="prescriptionCountAddRate">{{prescriptionLimit}}%</em><i
                  class="icon" :class="prescriptionLimitIcon"></i>
                </p>
                <span v-text="prescriptionLimitText"></span>
              </div>
            </div>
          </div>
          <div class="chartouter fl wpa">
            <div class="cardwrap hc bc10">
              <div class="card" style="cursor: pointer;" @click="GoPrescriptionList('2', '')">
                <p class="relat">
                  <i class="icon icon-chufang lico fc6"></i><em id="todayPrescriptionMoney"
                                                                v-text="todayPrescription.total"></em><i
                  class="icon fc7">&nbsp;</i>
                </p>
                <span>今日处方总金额</span>
              </div>
              <div class="card">
                <p class="">
                  <i class="icon2 icon-Statistics lico fc6"></i><em id="prescriptionMoneyAddRate">{{moneyLimit}}%</em><i
                  class="icon" :class="moneyLimitIcon"></i>
                </p>
                <span v-text="moneyLimitText"></span>
              </div>
            </div>
          </div>
          <div class="chartouter fl wpb clear">
            <div class="cardwrap hc bc11">
              <!-- 今日科室处方饼状图 -->
              <div ref="todayDeptPrescriptionChart" class="ringHei"></div>
            </div>
          </div>
        </div>
      </div>
      <!--科室处方统计-->
      <div class="box" v-loading="dataBarLoading">
        <span class="titlea clear">
          <em>科室处方统计</em>
        </span>
        <div class="conwrap">
          <div class="chartbox clear">
            <p class="tabbox mt30">
              <el-radio-group v-model="radio" @change="radioChange">
                <el-radio-button label="1">周</el-radio-button>
                <el-radio-button label="2">月</el-radio-button>
                <el-radio-button label="3">年</el-radio-button>
              </el-radio-group>
            </p>
            <div class="tabwrap">
              <div class="tabcontent">
                <h5 class="topbar">
                  <i class="icon4 icon-xiayiye-copy" id="minusDate" @click="MinusDate"></i> <span
                  v-text="staticsDate"></span>
                  <i class="icon4 icon-xiayiye" id="addDate" @click="AddDate"></i>
                </h5>
                <div class="bc8">
                  <!-- 科室处方统计柱状图 -->
                  <div ref="deptPrescriptionStaticsChart" class="barHei"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'PrescriptionOverviewIndex',
  mixins: [],
  data () {
    return {
      radio: '1',
      todayPrescription: {
        'count': 0, // 今日处方总数
        'countChange': '', // 处方数量变化百分比
        'total': 0, // 今日处方总金额
        'totalChange': '', // 处方金额变化百分比
        'createTime': null
      }, // 今日处方
      prescriptionLimit: '', // 处方涨停
      prescriptionLimitText: '暂无数据', // 处方涨停文案
      prescriptionLimitIcon: 'icon-jiantouUp', // 处方涨停图标
      moneyLimit: '', // 处方金额涨停
      moneyLimitText: '暂无数据', // 处方金额涨停文案
      moneyLimitIcon: 'icon-jiantouUp', // 处方金额涨停图标
      todayDepartmentPieData: [
        {
          'id': null,
          'deptId': null,
          'department': null,
          'count': 0,
          'createTime': null
        }
      ], // 今日科室处方
      todayDepartmentBarData: [
        {
          'id': null,
          'deptId': null,
          'department': null,
          'count': 0,
          'createTime': null
        }
      ], // 今日科室统计
      staticsDate: '', // 选择周、月、年后显示日期
      nowDayOfWeek: 0, // 今天本周的第几天
      nowDay: 0, // 当前日
      nowMonth: 0, // 当前月
      nowYear: 0, // 当前年
      currentWeekStartDate: 0, // 当前显示的开始周
      currentWeekEndDate: 0, // 当前显示的结束周
      currentMonthDate: 0, // 当前显示的月
      currentYearDate: 0, // 当前显示的年
      dataPieLoading: false,
      dataBarLoading: false,
      todayDeptPrescriptionChart: '', // pie
      deptPrescriptionStaticsChart: ''// bar
    };
  },
  components: {},
  watch: {},
  computed: {},
  created () {

  },
  mounted () {
    this.initPage();
  },
  methods: {
    initPage () {
      let now = new Date(); // 当前日期
      this.nowDayOfWeek = now.getDay(); // 今天本周的第几天
      this.nowDay = now.getDate(); // 当前日
      this.nowMonth = now.getMonth(); // 当前月
      this.nowYear = now.getYear(); // 当前年
      this.nowYear += (this.nowYear < 2000) ? 1900 : 0; //
      this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
      this.token = this.userLogin.data;
      this.$nextTick(() => {
        this.initEcharts();
        this.getDataStatistics();
        this.radioChange(1);// 初始化周、月、年，并请求周的bar
      });
    },
    initEcharts () {
      // 基于准备好的dom，初始化echarts实例
      let that = this;
      this.todayDeptPrescriptionChart = this.$echarts.init(that.$refs.todayDeptPrescriptionChart);
      this.deptPrescriptionStaticsChart = this.$echarts.init(that.$refs.deptPrescriptionStaticsChart);
    },
    // 切换周、月、年
    radioChange (value) {
      this.radio = value;
      if (value == '1') { // 周
        let weekStartDate = this.getWeekStartDate();
        let weekEndDate = this.getWeekEndDate();
        this.currentWeekStartDate = weekStartDate;
        this.currentWeekEndDate = weekEndDate;
        this.staticsDate = weekStartDate + '——' + weekEndDate;
        this.getPeriodDeptPrescription({
          // 'dateType': '1',
          'startDate': weekStartDate.toString(),
          'endDate': weekEndDate.toString()
        });
      } else if (value == '2') { // 月
        let nowMonthadd = this.nowMonth + 1;
        if (nowMonthadd <= 9) {
          nowMonthadd = '0' + nowMonthadd;
        }
        let monthDate = this.nowYear + '-' + (nowMonthadd);
        this.currentMonthDate = monthDate;
        this.staticsDate = monthDate;
        this.getPeriodDeptPrescription({
          // 'dateType': '2',
          // 'monthOrYear': monthDate.toString()
          'startDate': this.getMonthFirstDay('first', this.currentMonthDate),
          'endDate': this.getMonthFirstDay('last', this.currentMonthDate)
        });
      } else if (value == '3') {
        let yearDate = this.nowYear;
        this.currentYearDate = yearDate;
        this.staticsDate = yearDate;
        this.getPeriodDeptPrescription({
          // 'dateType': '3',
          // 'monthOrYear': yearDate.toString()
          'startDate': `${this.currentYearDate}-01-01`,
          'endDate': `${this.currentYearDate}-12-31`
        });
      }
    },
    /**
     * 点击左箭头减日期
     */
    MinusDate () {
      let dateType = this.radio;
      // 如果统计日期类型为周，则在当前显示的周减去一周
      if (dateType == '1') {
        let newWeekStartDate = this.calcAddDate(this.currentWeekStartDate, -7);
        let newWeekEndDate = this.calcAddDate(this.currentWeekEndDate, -7);
        this.currentWeekStartDate = newWeekStartDate;
        this.currentWeekEndDate = newWeekEndDate;
        this.staticsDate = newWeekStartDate + '——' + newWeekEndDate;
        this.getPeriodDeptPrescription({
          // 'dateType': '1',
          'startDate': newWeekStartDate.toString(),
          'endDate': newWeekEndDate.toString()
        });
      } else if (dateType == '2') { // 如果统计日期类型为月，则在当前显示的月份减1
        let newMonthDate = this.calcAddMonth(this.currentMonthDate + '-01', -1);
        this.currentMonthDate = newMonthDate;
        this.staticsDate = newMonthDate;
        this.getPeriodDeptPrescription({
          // 'dateType': '2',
          // 'monthOrYear': monthDate.toString()
          'startDate': this.getMonthFirstDay('first', this.currentMonthDate),
          'endDate': this.getMonthFirstDay('last', this.currentMonthDate)
        });
      } else { // 如果统计日期类型为年，则在当前显示的年份减1
        // let currentYearDate = $("#dateCondition").val();
        let newYearDate = this.calcAddYear(this.currentYearDate + '-01-01', -1);
        this.currentYearDate = newYearDate;
        this.staticsDate = newYearDate;
        this.getPeriodDeptPrescription({
          // 'dateType': '3',
          // 'monthOrYear': yearDate.toString()
          'startDate': `${this.currentYearDate}-01-01`,
          'endDate': `${this.currentYearDate}-12-31`
        });
      }
    },
    /**
     * 点击右箭头加日期
     */
    AddDate () {
      let dateType = this.radio;
      // 如果统计日期类型为周，则在当前显示的周加上一周
      if (dateType == '1') {
        let newWeekStartDate = this.calcAddDate(this.currentWeekStartDate, 7);
        let newWeekEndDate = this.calcAddDate(this.currentWeekEndDate, 7);

        if (!this.CompareDate(newWeekStartDate, this.getWeekStartDate())) {
          this.currentWeekStartDate = newWeekStartDate;
          this.currentWeekEndDate = newWeekEndDate;
          this.staticsDate = newWeekStartDate + '——' + newWeekEndDate;
          this.getPeriodDeptPrescription({
            // 'dateType': '1',
            'startDate': newWeekStartDate.toString(),
            'endDate': newWeekEndDate.toString()
          });
        }
      } else if (dateType == '2') { // 如果统计日期类型为月，则在当前显示的月份加1
        let newMonthDate = this.calcAddMonth(this.currentMonthDate + '-01', 1);
        if (!this.CompareDate(newMonthDate + '-01', this.nowYear + '-' + (this.nowMonth + 1) +
            '-01')) {
          this.currentMonthDate = newMonthDate;
          this.staticsDate = newMonthDate;
          this.getPeriodDeptPrescription({
            // 'dateType': '2',
            // 'monthOrYear': newMonthDate
            'startDate': this.getMonthFirstDay('first', this.currentMonthDate),
            'endDate': this.getMonthFirstDay('last', this.currentMonthDate)
          });
        }
      } else { // 如果统计日期类型为年，则在当前显示的年份加1
        let newYearDate = this.calcAddYear(this.currentYearDate + '-01-01', 1);
        if (!this.CompareDate(newYearDate + '-01-01', this.nowYear + '-01-01')) {
          this.currentYearDate = newYearDate;
          this.staticsDate = newYearDate;
          this.getPeriodDeptPrescription({
            // 'dateType': '3',
            // 'monthOrYear': newYearDate
            'startDate': `${this.currentYearDate}-01-01`,
            'endDate': `${this.currentYearDate}-12-31`
          });
        }
      }
    },

    // 获得本周的开始日期
    getWeekStartDate () {
      let weekStartDate = new Date(this.nowYear, this.nowMonth, this.nowDay - this.nowDayOfWeek + 1);
      return this.formatDate(weekStartDate);
    },

    // 获得本周的结束日期
    getWeekEndDate () {
      let weekEndDate = new Date(this.nowYear, this.nowMonth, this.nowDay + (7 - this.nowDayOfWeek));
      return this.formatDate(weekEndDate);
    },

    // 格式化日期：yyyy-MM-dd
    formatDate (date) {
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = '0' + mymonth;
      }
      if (myweekday < 10) {
        myweekday = '0' + myweekday;
      }
      return (myyear + '-' + mymonth + '-' + myweekday);
    },
    /**
     * 计算日期大小
     */
    /* eslint-disable no-useless-escape */
    CompareDate (d1, d2) {
      return ((new Date(d1.replace(/-/g, '\/'))) > (new Date(d2.replace(/-/g, '\/'))));
    },
    /**
     * 加减计算日期
     */
    calcAddDate (date, day) {
      let d = new Date(date);
      d.setDate(d.getDate() + day);
      let m = d.getMonth() + 1;
      if (m < 10) {
        m = '0' + m;
      }
      if (d.getDate().toString().length == 1) {
        return d.getFullYear() + '-' + m + '-0' + d.getDate();
      } else {
        return d.getFullYear() + '-' + m + '-' + d.getDate();
      }
    },
    /**
     * 加减计算月份
     */
    calcAddMonth (date, day) {
      let d = new Date(date);
      d.setMonth(d.getMonth() + day);
      let m = d.getMonth() + 1;
      if (m.toString().length == 1) {
        return d.getFullYear() + '-0' + m;
      } else {
        return d.getFullYear() + '-' + m;
      }
    },

    /**
     * 加减计算年份
     */
    calcAddYear (date, day) {
      let d = new Date(date);
      d.setFullYear(d.getFullYear() + day);
      let m = d.getFullYear();
      return m;
    },
    // 今日处方
    getDataStatistics () {
      let that = this;
      that.dataPieLoading = true;
      // 今日处方
      const getPrescriptionNum = that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/supervise/statistics/today/presc?t=' + (+new Date())
      });
      // 今日科室处方pie
      const getHospitalNum = that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/supervise/statistics/today/department/presc?t=' + (+new Date())
      });
      Promise.all([getPrescriptionNum, getHospitalNum]).then((res) => {
        that.dataPieLoading = false;
        if (res[0].data.code == '0' && res[1].data.code == '0') {
          if (JSON.stringify(res[1].data.data) !== '[]') {
            that.todayDepartmentPieData = res[1].data.data;
          } else {
            that.todayDepartmentPieData = [{
              department: '',
              count: 0
            }];
          }
          that.drawPie();

          that.todayPrescription = res[0].data.data; // 今日处方
          if (!res[1].data.data.department) {
            res[1].data.data.department = '暂无数据';
          }
          if (that.todayPrescription.countChange) {
            that.prescriptionLimit = parseInt(that.todayPrescription.countChange).toFixed(2);
            if (that.prescriptionLimit > 0) {
              that.prescriptionLimitText = '较昨日上涨';
              that.prescriptionLimitIcon = 'icon-jiantouUp';
            } else if (that.prescriptionLimit == 0) {
              that.prescriptionLimitText = '较昨日持平';
              that.prescriptionLimitIcon = '';
            } else if (that.prescriptionLimit < 0) {
              that.prescriptionLimitText = '较昨日下跌';
              that.prescriptionLimitIcon = 'icon-jiantouDown';
            }
          } else {
            that.prescriptionLimit = '0.00';
            that.prescriptionLimitText = '暂无数据';
            that.prescriptionLimitIcon = '';
          }
          if (that.todayPrescription.totalChange) {
            that.moneyLimit = parseInt(that.todayPrescription.totalChange).toFixed(2);
            if (that.moneyLimit > 0) {
              that.moneyLimitText = '较昨日上涨';
              that.moneyLimitIcon = 'icon-jiantouUp';
            } else if (that.moneyLimit == 0) {
              that.moneyLimitText = '较昨日持平';
              that.moneyLimitIcon = '';
            } else if (that.moneyLimit < 0) {
              that.moneyLimitText = '较昨日下跌';
              that.moneyLimitIcon = 'icon-jiantouDown';
            }
          } else {
            that.moneyLimit = '0.00';
            that.moneyLimitText = '暂无数据';
            that.moneyLimitIcon = '';
          }
        } else {
          that.$notice('暂无数据！');
        }
      }).catch((err) => {
        if (that.todayPrescription.countChange) {
          that.prescriptionLimit = parseInt(that.todayPrescription.countChange).toFixed(2);
          if (that.prescriptionLimit > 0) {
            that.prescriptionLimitText = '较昨日上涨';
            that.prescriptionLimitIcon = 'icon-jiantouUp';
          } else if (that.prescriptionLimit == 0) {
            that.prescriptionLimitText = '较昨日持平';
            that.prescriptionLimitIcon = '';
          } else if (that.prescriptionLimit < 0) {
            that.prescriptionLimitText = '较昨日下跌';
            that.prescriptionLimitIcon = 'icon-jiantouDown';
          }
        } else {
          that.prescriptionLimit = '0.00';
          that.prescriptionLimitText = '暂无数据';
          that.prescriptionLimitIcon = '';
        }
        if (that.todayPrescription.totalChange) {
          that.moneyLimit = parseInt(that.todayPrescription.totalChange).toFixed(2);
          if (that.moneyLimit > 0) {
            that.moneyLimitText = '较昨日上涨';
            that.moneyLimitIcon = 'icon-jiantouUp';
          } else if (that.moneyLimit == 0) {
            that.moneyLimitText = '较昨日持平';
            that.moneyLimitIcon = '';
          } else if (that.moneyLimit < 0) {
            that.moneyLimitText = '较昨日下跌';
            that.moneyLimitIcon = 'icon-jiantouDown';
          }
        } else {
          that.moneyLimit = '0.00';
          that.moneyLimitText = '暂无数据';
          that.moneyLimitIcon = '';
        }
        that.drawPie();
        that.$notice('请求出错！');
        that.dataPieLoading = false;
        if (err) throw err;
      });
    },
    // 科室处方统计（柱状图）
    getPeriodDeptPrescription (dataParam) {
      let that = this;
      that.dataBarLoading = true;
      // 3)科室处方统计Bar
      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/supervise/statistics/department/presc?t=' + (+new Date()),
        params: dataParam
        // params: that.removeNullKey(dataParam)
        // params: that.$qs.stringify(that.removeNullKey(dataParam))
      }).then(function (response) {
        that.dataBarLoading = false;
        let data = response.data;
        if (data.code == '0') {
          that.todayDepartmentBarData = data.data;
        } else {
          that.todayDepartmentBarData = [];
          that.$notice('暂无数据');
        }
        that.drawColumn();
      }).catch(function (error) {
        that.dataBarLoading = false;
        that.$notice('查询失败');
        that.drawColumn();
        console.log(error);
      });
    },
    resize () {
      this.todayDeptPrescriptionChart.resize();
      this.deptPrescriptionStaticsChart.resize();
    },
    /**
     * 画今日科室处方饼状图
     */
    drawPie () {
      let that = this;
      //        let title =  that.todayDepartmentPieData[0].department||'暂无数据';
      let title = that.todayDepartmentPieData.length == 0 ? '暂无数据' : '';
      let data = that.todayDepartmentPieData;
      let option = {
        backgroundColor: '#B8B4D8',
        title: {
          text: '',
          left: '50%',
          top: '15'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          x: '15',
          y: '15'
        },
        toolbox: {
          show: true,
          top: '15',
          right: '20',
          feature: {
            mark: {
              show: true
            },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'center',
                  max: 1548
                }
              }
            },
            /*
             * restore : { show : true },
             */
            saveAsImage: {
              show: true
            }
            /*
             * magicType: {//动态类型切换 type: ['bar', 'line'] }
             */
          }
        },
        calculable: true,
        series: [{
          name: '科室',
          type: 'pie',
          radius: ['45%', '65%'],
          center: ['60%', '55 %'], // 环形图位置设置
          avoidLabelOverlap: false, // 中央显示
          selectedMode: 'single',
          itemStyle: {
            normal: {
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              }
            },
            emphasis: {
              label: {
                show: true,
                position: 'center',
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            }
          },
          data: [{
            value: 335,
            name: '直接访问'
          }]
        }],
        color: ['rgb(236,105,65)', 'rgb(241,145,73)', 'rgb(179,212,101)',
          'rgb(50,177,108)', 'rgb(0,183,238)', 'rgb(68,138,202)',
          'rgb(85,111,181)', 'rgb(95,82,160)', 'rgb(174,93,161)',
          'rgb(242,156,159)', 'rgb(255,244,92)']
      };
      let xArr = [];
      let yArr = [];
      for (let i = 0; i < data.length; i++) {
        let dept = {};
        let x = data[i].department || '暂无数据';
        dept.value = Number(data[i].count);
        dept.name = x;
        xArr.push(x);
        yArr.push(dept);
      }

      option.title.text = title;
      option.legend.data = xArr;
      option.series[0].data = yArr;

      that.todayDeptPrescriptionChart.setOption(option);
    },

    /**
     * 画科室处方统计柱状图
     */
    drawColumn () {
      let that = this;
      let data = that.todayDepartmentBarData;
      let myChart = this.deptPrescriptionStaticsChart;
      myChart.setOption({
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b} <br/>{a}:{c}张'
        },
        toolbox: {
          show: true,
          right: '20',
          feature: {
            mark: {
              show: true
            },
            magicType: {// 动态类型切换
              show: true,
              type: ['bar', 'line'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'center',
                  max: 1548
                }
              }
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        legend: {},
        calculable: true,
        xAxis: [{
          name: '科室',
          data: []
        }],
        yAxis: [{
          name: '处方数/张',
          type: 'value'
        }],
        dataZoom: {
          type: 'inside',
          show: true,
          realtime: true,
          y: 36,
          height: 20,
          start: 0,
          end: 100
        },
        series: [{
          name: '处方数',
          type: 'bar',
          data: [],
          barWidth: 30// 柱图宽度
        }]
      });

      let xArr = [];
      let yArr = [];

      for (let i = 0; i < data.length; i++) {
        xArr.push((data[i].department || '暂无数据'));
        yArr.push(Number(data[i].count));
      }
      myChart.setOption({
        xAxis: {
          data: xArr,
          axisLabel: {
            interval: 0,
            rotate: 0, // 倾斜度 -90 至 90 默认为0
            formatter: function (val) {
              return val.split('').join('\n');
            }
          }
        },
        series: [{
          // 根据名字对应到相应的系列
          name: '处方数',
          data: yArr
        }],
        grid: {
          y2: 130
        }
      });
      myChart.on('click', function (params) {
        let department = params.name;
        if (department != null && typeof (department) != 'undefined') {
          if (department.length != 0) {
            that.GoPrescriptionList('3', department);
          }
        }
        return false;
      });
    },
    getNewDate (date) {
      return new Date(date);
    },
    /**
     *  获取月的第一天和最后一天
     */
    getMonthFirstDay (type, date) {
      switch (type) {
        case 'first':// 获取月的第一天
          let firstDate = this.getNewDate(date);
          firstDate.setDate(1);
          return this.formatDate(firstDate);
          /* eslint-disable no-unreachable */
          break;
        case 'last':// 获取月的最后一天
          let arryDay = date.split('-');
          let strdate;
          if (parseInt(arryDay[1]) + 1 < 10) {
            strdate = `${arryDay[0]}-0${(parseInt(arryDay[1]) + 1)}`;
          } else {
            strdate = `${arryDay[0]}-${(parseInt(arryDay[1]) + 1)}`;
          }
          let lastDate = this.getNewDate(strdate);
          lastDate.setDate(0);
          return this.formatDate(lastDate);
          break;
      }
    },
    /**
     * 跳转到处方列表页 requestFrom：跳转来源：1是处方单数点击跳转；2是处方金额跳转；3是点击科室柱状图跳转，department为点击的科室
     */
    GoPrescriptionList (requestFrom, department) {
      console.log(department);
      let dateDay = this.formatDate(new Date(this.nowYear, this.nowMonth, this.nowDay));
      switch (requestFrom) {
        case '1':
          this.$router.push({
            name: 'prescriptionList',
            query: {requestFrom: '1', department: '', startDate: dateDay, endDate: dateDay}
          });
          break;
        case '2':
          this.$router.push({
            name: 'prescriptionList',
            query: {requestFrom: '2', department: '', startDate: dateDay, endDate: dateDay}
          });
          break;
        case '3':
          let dateType = this.radio; // 统计日期类型：1是周，2是月，3是年
          if (dateType == 1) {
            this.$router.push({
              name: 'prescriptionList',
              query: {
                requestFrom: '3',
                dateType: '1',
                startDate: this.currentWeekStartDate,
                endDate: this.currentWeekEndDate,
                department: department
              }
            });
          } else if (dateType == 2) {
            this.$router.push({
              name: 'prescriptionList',
              query: {
                requestFrom: '3',
                dateType: '2',
                startDate: this.getMonthFirstDay('first', this.currentMonthDate),
                endDate: this.getMonthFirstDay('last', this.currentMonthDate),
                department: department
              }
            });
          } else if (dateType == 3) {
            this.$router.push({
              name: 'prescriptionList',
              query: {
                requestFrom: '3',
                dateType: '3',
                startDate: `${this.currentYearDate}-01-01`,
                endDate: `${this.currentYearDate}-12-31`,
                department: department
              }
            });
          }
          break;
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>

<style scoped>
  .titlea {
    /*padding-top: 24px;*/
    font-size: 14px;
  }

  .titlea > em {
    display: inline-block;
    transform: translate(0, 50%);
    border-left: 4px solid #3D99FD;
    padding-left: 10px;
  }

  .chartbox {
    overflow: hidden;
    /*margin-right: -22px;*/
  }

  .chartouter {
    padding-left: 22px;
  }

  .chartouter:first-child {
    padding-left: 0;
  }

  .fl {
    float: left;
  }

  .relat {
    position: relative;
  }

  .wpa {
    width: 30%;
  }

  .wpb {
    width: 40%;
  }

  .ringHei {
    background-color: rgba(0, 164, 226, 0.29);
    height: 300px;
    width: 100%;
  }

  .barHei {
    background-color: rgba(0, 164, 226, 0.29);
    height: 400px;
    /*width: 60%;*/
    margin-bottom: 20px;
  }

  .mt30 {
    margin-top: 30px;
  }

  .pb30 {
    padding-bottom: 30px;
  }

  .bc9 {
    background: #7cc8ec;
  }

  .card {
    height: 147px;
    text-align: center;
    margin: 0 20px;
    padding: 30px 0;
  }

  .card em {
    font-size: 36px;
    font-weight: bold;
    color: white;
    display: inline-block;
    width: 179px;
  }

  .card span {
    font-size: 20px;
    color: white;
  }

  .cardwrap .card + .card {
    border-top: 1px solid #3c9dda;
  }

  .hc {
    height: 295px;
  }

  .bc10 {
    background: #84cbc4;
  }

  .box {
    background: white;
    border-radius: 6px;
    padding-bottom: 10px;
  }

  .tabbox {
    text-align: center;
  }

  .topbar {
    text-align: center;
    padding: 30px 0;
  }

  .topbar span {
    font-size: 20px;
    color: #666;
    font-weight: bold;
    margin: 0 20px;
    vertical-align: middle;
  }

  .icon {
    display: inline-block;
    width: 32px;
    height: 32px;
  }

  .icon2 {
    display: inline-block;
    width: 32px;
    height: 32px;
  }

  .icon4 {
    position: relative;
    display: inline-block;
    width: 22px;
    height: 22px;
    cursor: pointer;
    top: 6px;
  }

  .icon-chufang {
    background: url("./images/notes.png") no-repeat;
    background-size: 32px;
  }

  .icon-Statistics {
    background: url("./images/chart.png") no-repeat;
    background-size: 32px;
  }

  .icon-jiantouUp {
    background: url("./images/up.png") no-repeat;
    background-size: 32px;
  }

  .icon-jiantouDown {
    background: url("./images/down.png") no-repeat;
    background-size: 32px;
  }

  .icon-xiayiye-copy {
    background: url("./images/left-btn.png") no-repeat;
    background-size: 22px;
  }

  .icon-xiayiye {
    background: url("./images/right-btn.png") no-repeat;
    background-size: 22px;
  }

  .tabwrap {
    /*padding-right: 22px;*/
  }

  @media (max-width: 1300px) {
    .card em {
      font-size: 20px;
      display: inline-block;
      width: 100px;
    }

    .icon2, .icon {
      position: relative;
      top: 5px;
      width: 25px;
      height: 25px;
      background-size: 25px;
    }

    .icon2 {
      left: -5px;
    }

    .icon.icon-chufang {
      left: -5px;
    }

    .icon {
      right: -5px;
    }

    .card span {
      position: relative;
      bottom: -20px;
    }
  }
</style>
<style>
  .tabbox .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 6px 0 0 6px;
  }

  .tabbox .el-radio-button__inner {
    padding: 12px 70px;
  }

  .tabbox .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0 6px 6px 0;
  }
</style>
