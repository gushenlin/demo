<!--处方信息共享平台-处方列表-->
<template>
  <div class="cloud-component PrescriptionList">
    <div class="searchTitle">
      <span>处方列表</span>
      <el-button @click="historyGoBack('/prescriptionOverviewIndex')" type="text" style="margin-left: 15px">
        &lt&lt返回上一级
      </el-button>
    </div>
    <div class="totalCountLine">
      <span style="color:#4F555D">处方张数总数：</span><span style="color:#3D99FD">{{prescriptionCount}}张</span>
      <i class="delimiter"></i>
      <span style="color:#4F555D">处方金额总数：</span><span style="color:#3D99FD">{{totalFee}}元</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small reqForm">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="65px" @submit.native.prevent>
        <el-form-item label="处方时间：" label-width="85px">
          <el-date-picker
            v-model="ruleForm.startEndDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
            style="width: 240px;"
            :disabled="dateFlag" clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="ruleForm.department" placeholder="请输入医院/科室名搜索" style="width:190px" :disabled="orgFlag" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="search" style="margin-right: 10px;">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list" v-loading="searchLoading">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table :data="prescriptionStatistics.content" style="width: 100%" v-loading="prescriptionStatisticsSearchLoading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText"
                  stripe border align="center" :highlight-current-row="true">
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="createDate" label="处方时间" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="hisPrescCode" label="处方单号" min-width="5%" align="center">
          </el-table-column>
          <el-table-column prop="hospitalName" label="医院" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="department" label="科室" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="doctorName" label="处方医生" min-width="5%" align="center">
          </el-table-column>
          <el-table-column prop="patientName" label="患者姓名" min-width="5%" align="center">
          </el-table-column>
          <el-table-column prop="patientTelephone" label="患者手机" min-width="8%" align="center">
          </el-table-column>
          <el-table-column prop="drugstroeName" label="处方药店" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="operatorDate" label="取药时间" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="isTake" label="处方状态" min-width="5%" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.isTake == "0" ? "未取药" : "已取药"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="diagnosisCharge" label="诊费" min-width="5%" align="center">
          </el-table-column>
          <el-table-column prop="source" label="来源" min-width="5%" align="center">
          </el-table-column>
          <el-table-column label="操作" min-width="5%" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goPrescriptionListDetail(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="prescriptionStatistics" @change="getPrescriptionStatistics"></pagination>
      </echarts-contain>
    </div>
  </div>
</template>

<script type="text/javascript">
import utils from 'components/utils';
import pagination from 'components/packages/pagination/pagination';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import echartsContain from 'components/packages/echartsContain/echartsContain';

export default {
  name: 'PrescriptionList',
  mixins: [],
  data () {
    return {
      prescriptionCount: 0,
      totalFee: 0,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      ruleForm: {
        startEndDate: [],
        startDate: '',
        endDate: '',
        department: ''
      },
      params_ruleForm: {
        startEndDate: [],
        startDate: '',
        endDate: '',
        department: ''
      },
      prescriptionStatistics: {content: []},
      prescriptionStatisticsSearchLoading: false,
      searchLoading: false,

      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
      dateFlag: false,
      orgFlag: false
    };
  },
  components: {pagination, echartsContain},
  watch: {},
  computed: {},
  created () {
    this.initPage();
  },
  mounted () {},
  activated () {},
  methods: {
    initPage () {
      this.startDate = utils.formateDate(this.$route.query.startDate);
      this.endDate = utils.formateDate(this.$route.query.endDate);
      this.ruleForm.startEndDate = [utils.formateDate(this.$route.query.startDate), utils.formateDate(this.$route.query.endDate)];
      this.department = this.$route.query.department;
      this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
      this.token = this.userLogin.data;
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.search();
      this.ruleForm.department = this.department;
    },
    search () {
      this.params_ruleForm = utils.deepClone(this.ruleForm);
      this.$nextTick(() => {
        this.getPrescriptionStatistics();
        this.getTotalFee();
      });
    },
    getPrescriptionStatistics (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      that.prescriptionStatisticsSearchLoading = true;
      that.searchLoading = true;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      let formData = {
        'pageIndex': pageNo,
        'itemCountPerPage': pageSize,
        args: {
          startDate: that.startDate,
          endDate: that.endDate,
          department: that.department
        }
      };
      //      ajax请求
      that.$axios({
        method: 'post',
        headers: {'Authorization': that.token},
        url: '/peps/supervise/statistics/search/presc?t=' + (+new Date()),
        data: formData
      }).then(function (response) {
        that.searchLoading = false;
        that.prescriptionStatisticsSearchLoading = false;
        let data = response.data;
        if (data.code == '0') {
          let obj = {};
          if (data.data.list) {
            obj.content = data.data.list;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.total);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.prescriptionStatistics = obj;
            that.prescriptionCount = obj.totalCount;
          } else {
            that.prescriptionStatistics = {content: []};
          }
        } else {
          that.$notice('处方列表数据查询失败');
        }
      }).catch(function (error) {
        that.prescriptionStatisticsSearchLoading = false;
        that.$notice('处方列表数据查询失败');
        that.searchLoading = false;
        console.log(error);
      });
    },
    getTotalFee () {
      let that = this;
      let formData = {
        startDate: that.startDate,
        endDate: that.endDate,
        department: that.department
      };
      //      ajax请求
      that.$axios({
        method: 'post',
        headers: {'Authorization': that.token},
        url: '/peps/supervise/statistics/total/presc?t=' + (+new Date()),
        data: formData
      }).then(function (response) {
        let data = response.data;
        if (data.code == '0') {
          that.totalFee = data.data;
        } else {
          that.totalFee = 0;
        }
      }).catch(function (error) {
        that.$notice('处方金额总数查询失败');
        console.log(error);
      });
    },
    goPrescriptionListDetail (row) {
      this.$router.push({
        name: 'prescriptionListDetail',
        query: {
          id: row.id,
          startDate: this.startDate,
          endDate: this.endDate,
          department: this.department
        }
      });
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.requestFrom = vm.$route.query.requestFrom;
      if (vm.requestFrom == 1 || vm.requestFrom == 2) {
        vm.dateFlag = true;
        vm.orgFlag = false;
      } else if (vm.requestFrom == 3) {
        vm.dateFlag = false;
        vm.orgFlag = true;
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>

<style scoped>
  .reqForm{margin-top: 10px}
  .totalCountLine{padding:10px 10px 9px; background:#E9EAEC; font-size: 16px}
</style>
