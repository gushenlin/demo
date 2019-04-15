<template>
  <div class="cloud-component visualizationIndex">
    <div class="searchTitle">
      <span>平台业务监管</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small clearfix">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="65px" class="clearfix" @submit.native.prevent>
        <span class="title zfl">
          <em>数据统计</em>
        </span>
        <el-form-item label="查询日期：" label-width="85px" class="zfr">
          <el-date-picker
            v-model="ruleForm.dataTimeRange"
            type="daterange"
            align="left"
            :editable="false"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="searchByDateRange('7')"
            :picker-options="pickerOptions2"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <!--统计结果-->
    <div class="cloud-search-list" v-loading="dataStatisticsSearchLoading">
      <div class="conwrap">
        <card :dataStatistics="dataStatistics"></card>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small clearfix">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="65px" class="clearfix">
        <span class="title zfl">
          <em>近七日动态统计</em>
        </span>
        <el-form-item label="选择类型：" label-width="85px" class="zfr">
          <el-select v-model="selectOptionsValue" placeholder="请选择" @change="searchByOptions">
            <el-option
              v-for="item in selectOptions"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <transition name="el-fade-in" mode="out-in">
      <div class="cloud-search-list clearfix" v-loading="sevenSearchLoading">
        <!--处方统计-->
        <div v-show="selectOptionsValue==='0'">
          <!--图表区域-->
          <echarts-contain containType="left" :parentHeight="routerViewHeight" :heightRatio="0.55" :widthRatio="0.5">
            <div ref="prescriptionNumChart" style="width: 100%;height:100%;"></div>
          </echarts-contain>
          <echarts-contain containType="right" :parentHeight="routerViewHeight" :heightRatio="0.55" :widthRatio="0.5">
            <div ref="prescriptionPriceChart" style="width: 100%;height:100%;"></div>
          </echarts-contain>
        </div>
        <!--药店处方-->
        <div v-show="selectOptionsValue==='1'">
          <!--图表区域-->
          <echarts-contain containType="left" :parentHeight="routerViewHeight" :heightRatio="0.55" :widthRatio="0.5">
            <div ref="drugstorePrescriptionNumChart" style="width: 100%;height:100%;"></div>
          </echarts-contain>
          <echarts-contain containType="right" :parentHeight="routerViewHeight" :heightRatio="0.55" :widthRatio="0.5">
            <div ref="drugstorePrescriptionPriceChart" style="width: 100%;height:100%;"></div>
          </echarts-contain>
          <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="0.5">
            <!--列表区-->
            <el-table :data="drugstorePrescriptionList.content" style="width: 100%"
                      :empty-text="emptyText" :element-loading-text="elementLoadingText"
                      stripe border align="center" :highlight-current-row="true">
              <el-table-column type="index" width="60" label="排名" align="center"></el-table-column>
              <el-table-column prop="drugstoreName" label="药店名称" min-width="10%" align="center">
              </el-table-column>
              <el-table-column prop="count" label="处方张数" min-width="5%" align="center">
              </el-table-column>
              <el-table-column prop="total" label="处方金额" min-width="5%" align="center">
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!--<pagination :data="drugstorePrescriptionList" listName="dataList" totalNumName="dataCount"-->
            <!--@change="getDrugstorePrescriptionList"></pagination>-->
            <pagination :data="drugstorePrescriptionList" @change="getDrugstorePrescriptionList"></pagination>
          </echarts-contain>
        </div>
        <!--处方药品-->
        <div v-show="selectOptionsValue==='2'">
          <!--列表区-->
          <el-table :data="prescriptionDrugs.dataList" style="width: 100%"
                    :empty-text="emptyText"
                    element-loading-text="拼命加载中" stripe border align="center" :highlight-current-row="true">
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column prop="genericDrugName" label="药品名称" min-width="10%" align="center">
            </el-table-column>
            <el-table-column prop="tradeDrugName" label="商品名" min-width="5%" align="center">
            </el-table-column>
            <el-table-column prop="spec" label="规格" min-width="5%" align="center">
            </el-table-column>
            <el-table-column prop="dosage" label="剂型" min-width="10%" align="center">
            </el-table-column>
            <el-table-column prop="companyName" label="生产厂家" min-width="10%" align="center">
            </el-table-column>
            <el-table-column prop="num" label="开方次数" min-width="13%" align="center">
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination :data="prescriptionDrugs" listName="dataList" totalNumName="dataCount"
                      @change="getPrescriptionDrugs"></pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
  import dictionary from 'components/utils/dictionary';
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import utils from 'components/utils';
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import pagination from 'components/packages/pagination/pagination';
  import card from 'components/packages/card/card';

  export default {
    name: 'visualizationIndex',
    mixins: [],
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '今日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨日',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
            /* {
                text: '最近三个月',
                onClick(picker) {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                  picker.$emit('pick', [start, end]);
                }
             }, */
          {
            text: '本月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              const nowDay = new Date().getDate(); // 当前日
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (nowDay - 1));
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上月',
            onClick (picker) {
              const end = new Date();
              const start = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

              const nowDay = new Date().getDate(); // 当前日
              end.setTime(end.getTime() - 3600 * 1000 * 24 * nowDay);

              picker.$emit('pick', [start, end]);
            }
          }]
        },
        ruleForm: {
          dataTimeRange: [],
          dateType: '1'
        },
        params_ruleForm: {
          dataTimeRange: [],
          dateType: '1'
        },

        dataStatistics: {
          hospitals: '0',
          doctors: '0',
          patients: '0',
          prescriptions: '0'
        },

        selectOptionsValue: '',
        selectOptions: [],

        prescriptionNumChart: '',
        prescriptionPriceChart: '',
        drugstorePrescriptionNumChart: '',
        drugstorePrescriptionPriceChart: '',

        drugstorePrescriptionList: {content: []},
        prescriptionDrugs: {rows: []},

        dataStatisticsSearchLoading: false,
        sevenSearchLoading: false,
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        elementLoadingText: ''

      };
    },
    components: {echartsContain, card, pagination},
    watch: {},
    computed: {},
    created () {

    },
    mounted () {
      this.initPage();
    },
    methods: {
      initPage () {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.currentPage = pageNo;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        // this.ruleForm.dataTimeRange=[utils.formateDate(new Date()),utils.formateDate(new Date())];
        this.selectOptionsValue = '0';
        this.selectOptions = dictionary.options('VISUALIZATION_SELECT_TYPE');
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        this.search();
      },
      initEcharts () {
        // 基于准备好的dom，初始化echarts实例
        if (this.selectOptionsValue === '0' && this.prescriptionNumChart == '' && this.prescriptionPriceChart == '') {
          this.prescriptionNumChart = this.$echarts.init(this.$refs.prescriptionNumChart);
          this.prescriptionPriceChart = this.$echarts.init(this.$refs.prescriptionPriceChart);
        } else if (this.selectOptionsValue === '1' && this.drugstorePrescriptionNumChart == '' && this.drugstorePrescriptionPriceChart == '') {
          this.drugstorePrescriptionNumChart = this.$echarts.init(this.$refs.drugstorePrescriptionNumChart);
          this.drugstorePrescriptionPriceChart = this.$echarts.init(this.$refs.drugstorePrescriptionPriceChart);
        }
      },
      search () {
        this.searchByDateRange();
        this.searchByOptions();
      },
      searchByDateRange () {
        this.params_ruleForm = utils.deepClone(this.ruleForm);
        this.getDataStatistics();
      },
      searchByOptions () {
        this.$nextTick(() => {
          this.initEcharts();
          switch (this.selectOptionsValue) {
            case '0':
              this.getPrescriptionStatistics();
              break;
            case '1':
              this.getDrugstorePrescription();
              this.getDrugstorePrescriptionList();
              break;
            case '2':
              this.getPrescriptionDrugs();
              break;
            default:
              this.$notice('未绑定此参数');
          }
        });
      },
      resize () {
        if (this.selectOptionsValue === '0') {
          this.prescriptionNumChart.resize();
          this.prescriptionPriceChart.resize();
        } else if (this.selectOptionsValue === '1') {
          this.drugstorePrescriptionNumChart.resize();
          this.drugstorePrescriptionPriceChart.resize();
        }
      },
      getDataStatistics () {
        let that = this;
        that.dataStatisticsSearchLoading = true;
        let params = {
          'startDate': that.ruleForm.dataTimeRange[0],
          'endDate': that.ruleForm.dataTimeRange[1]
        };
        that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/supervise/statistics/baseData?t=' + (+new Date()),
          params: params
        }).then((response) => {
          let data = response.data;
          that.dataStatisticsSearchLoading = false;
          if (data.code == '0') {
            this.dataStatistics = data.data;
          } else {
            that.$notice('请求出错！');
          }
        }).catch((err) => {
          that.$notice('请求出错！');
          that.dataStatisticsSearchLoading = false;
          that.dataStatistics = {
            hospitals: '0',
            doctors: '0',
            patients: '0',
            prescriptions: '0'
          };
          if (err) throw err;
        });
      },
      getPrescriptionStatistics () {
        let that = this;
        that.sevenSearchLoading = true;
        const getPrescriptionNumByDayTime = that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/supervise/statistics/recently/presc?t=' + (+new Date())
        });
        const getPrescriptionPriceByDayTime = that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/supervise/statistics/recently/presc?t=' + (+new Date())
        });
        Promise.all([getPrescriptionNumByDayTime, getPrescriptionPriceByDayTime]).then((response) => {
          let data = response[0].data;
          that.sevenSearchLoading = false;
          if (data.code == '0') {
            that.drawLine('prescriptionNumChart', '处方张数时间趋势图', data.data, '处方张数/张', '张');
            that.drawLine('prescriptionPriceChart', '处方金额时间趋势图', data.data, '处方金额/元', '元');
          } else {
            that.drawLine('prescriptionNumChart', '处方张数时间趋势图', [], '处方张数/张', '张');
            that.drawLine('prescriptionPriceChart', '处方金额时间趋势图', [], '处方金额/元', '元');
            that.$notice('请求出错！');
          }
        }).catch((err) => {
          that.sevenSearchLoading = false;
          that.drawLine('prescriptionNumChart', '处方张数时间趋势图', [], '处方张数/张', '张');
          that.drawLine('prescriptionPriceChart', '处方金额时间趋势图', [], '处方金额/元', '元');
          that.$notice('请求出错！');
          if (err) throw err;
        });
      },
      getDrugstorePrescription (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.sevenSearchLoading = true;
        const getDrugstorePrescriptionNum = that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/supervise/statistics/recently/drugstore/presc?t=' + (+new Date()),
          params: {
            pageNumber: pageNo,
            pageSize: pageSize
          }
        });
        const getDrugstorePrescriptionPrice = that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/supervise/statistics/recently/drugstore/presc?t=' + (+new Date()),
          params: {
            pageNumber: pageNo,
            pageSize: pageSize
          }
        });
        Promise.all([getDrugstorePrescriptionNum, getDrugstorePrescriptionPrice]).then((response) => {
          let data = response[0].data;
          that.sevenSearchLoading = false;
          if (data.code == '0') {
            that.drawPie('drugstorePrescriptionNumChart', '药店处方张数占比', data.data.list);
            that.drawPie('drugstorePrescriptionPriceChart', '药店处方金额占比', data.data.list);
          } else {
            that.drawPie('drugstorePrescriptionNumChart', '药店处方张数占比', []);
            that.drawPie('drugstorePrescriptionPriceChart', '药店处方金额占比', []);
            that.$notice('请求出错！');
          }
        }).catch((err) => {
          that.sevenSearchLoading = false;
          that.drawPie('drugstorePrescriptionNumChart', '药店处方张数占比', []);
          that.drawPie('drugstorePrescriptionPriceChart', '药店处方金额占比', []);
          that.$notice('请求出错！');
          if (err) throw err;
        });
      },
      getDrugstorePrescriptionList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/supervise/statistics/recently/drugstore/presc?t=' + (+new Date()),
          params: {
            pageNumber: pageNo,
            pageSize: pageSize
          }
        }).then((result) => {
          let data = result.data;
          if (data.code == 0) {
            let obj = {};
            obj.content = data.data.list;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.total);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.drugstorePrescriptionList = obj;
          } else {
            that.drugstorePrescriptionList = {content: []};
            this.$notice('请求出错！');
          }
        }).catch((err) => {
          that.drugstorePrescriptionList = {content: []};
          this.$notice('请求出错！');
          if (err) throw err;
        });
      },
      getPrescriptionDrugs (currentPage = this.currentPage, pageSize = this.pageSize) {
        /* let that = this;
        that.sevenSearchLoading = true;
        that.$axios({
          method: 'get',
          url: '/PresMon/visualManagement/getPrescriptionDrugs?t=' + (+new Date()),
          params: {
            pageNo: currentPage,
            pageSize: pageSize
          }
        }).then((result) => {
          that.sevenSearchLoading = false;
          let data = result.data;
          if (data && data.dataList) {
            that.prescriptionDrugs = data;
            that.$set(that.prescriptionDrugs, 'totalPage', Math.ceil(that.prescriptionDrugs.dataCount / pageSize));
            that.$set(that.prescriptionDrugs, 'pageNo', currentPage);
            that.$set(that.prescriptionDrugs, 'pageSize', pageSize);
          } else {
            that.prescriptionDrugs = {rows: []};
            this.$notice('请求出错！');
          }
        }).catch((err) => {
          that.sevenSearchLoading = false;
          that.prescriptionDrugs = {rows: []};
          that.$notice('请求出错！');
          if (err) throw err;
        }); */
      },
      drawLine (echartId, title, data, yname, unit) {
        let option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b} <br/>' + ('{c}' + unit)
          },
          grid: {
            left: '6%',
            right: '12%',
            bottom: '2%',
            containLabel: true
          },
          toolbox: {
            show: true,
            right: '20',
            feature: {
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            name: '日期',
            type: 'category',
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              type: 'line',
              data: [],
              smooth: true,
              itemStyle: {normal: {label: {show: true}}}
            }
          ]
        };
        let xArr = [];
        let yArr = [];
        for (let i = 0; i < data.length; i++) {
          let x = data[i].date;
          let y;
          if (echartId === 'prescriptionNumChart') {
            y = data[i].count;
          } else if (echartId === 'prescriptionPriceChart') {
            y = data[i].total;
          }
          xArr.push(x + '日');
          yArr.push(y);
        }
        option.title.text = title;
        option.xAxis.data = xArr;
        option.yAxis.name = yname;
        option.series[0].data = yArr;
        this[echartId].setOption(option);
      },
      drawPie (echartId, title, data) {
        if (data.length === 0) {
          if (echartId === 'drugstorePrescriptionNumChart') {
            data = [{drugstoreName: '', prescriptionNum: 0}];
          } else if (echartId === 'drugstorePrescriptionPriceChart') {
            data = [{drugstoreName: '', prescriptionAmount: 0}];
          }
        }
        let option = {
          title: {
            text: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            right: '20',
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            bottom: 1,
            left: 'center'
          },
          series: [
            {
              name: '药店',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  label: {
                    show: true,
                    formatter: '{d}%'
                  },
                  labelLine: {
                    show: true
                  }
                }
              }
            }
          ],
          color: [
            'rgb(236,105,65)',
            'rgb(241,145,73)',
            'rgb(179,212,101)',
            'rgb(50,177,108)',
            'rgb(0,183,238)',
            'rgb(68,138,202)',
            'rgb(85,111,181)',
            'rgb(95,82,160)',
            'rgb(174,93,161)',
            'rgb(242,156,159)',
            'rgb(255,244,92)'
          ]
        };
        let xArr = [];
        let yArr = [];
        for (let i = 0; i < data.length; i++) {
          let drugstore = {};
          let x = data[i].drugstoreName;
          if (echartId === 'drugstorePrescriptionNumChart') {
            drugstore.value = Number(data[i].count);
          } else if (echartId === 'drugstorePrescriptionPriceChart') {
            drugstore.value = Number(data[i].total);
          }
          drugstore.name = x;
          xArr.push(x);
          yArr.push(drugstore);
        }
        option.title.text = title;
        option.legend.data = xArr;
        option.series[0].data = yArr;

        this[echartId].setOption(option);
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
  .title > em {
    display: inline-block;
    transform: translate(0, 50%);
    border-left: 4px solid #3D99FD;
    padding-left: 10px;
  }

  .conwrap {
    padding-bottom: 20px;
  }

</style>
