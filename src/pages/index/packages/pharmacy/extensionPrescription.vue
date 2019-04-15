<template>
  <!--<template><div>外延处方统计 extensionPrescription</div></template>-->
  <div class="cloud-component extensionPrescription">
    <div class="searchTitle">
      <span>外延处方统计</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="查询日期：">
          <el-date-picker class="dataIcon"
                          v-model.trim="ruleForm.startDate"
                          :picker-options="startDateOption"
                          type="date"
                          placeholder="起始时间">
          </el-date-picker>
          <span class="index-timeInterval">至</span>
          <el-date-picker class="dataIcon"
                          v-model.trim="ruleForm.endDate"
                          :picker-options="endDateOption"
                          type="date"
                          placeholder="结束时间">
          </el-date-picker>
          <span class="index-timeInterval"></span>
          <el-form-item label="选择医院：" class="searchHospital" prop="hospitalId">
            <el-select v-model.trim="ruleForm.hospitalId" placeholder="请选择医院" :clearable="true">
              <el-option v-for="(item,index) in departmentList" :key="item.id" :label="item.hospitalName"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading">查询</el-button>
          <el-button @click="reset" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <div class="searchTitle">
        <span>列表管理</span>
      </div>
      <div style="padding:10px 19px;background:#E9EAEC">
        <span style="color:#4F555D">总计：</span><span style="color:#3D99FD;">{{totalChargeTotal.total}}元</span><i
        class="delimiter"></i>
        <span style="color:#4F555D">总交易笔数：</span><span style="color:#3D99FD;">{{totalChargeTotal.count}}笔</span><i
        class="delimiter"></i>
        <span style="color:#4F555D">诊疗费用：</span><span
        style="color:#3D99FD;">{{totalChargeTotal.diagnosis_charge}}元</span><i class="delimiter"></i>
        <span style="color:#4F555D">处方费: </span><span style="color:#3D99FD;">{{totalChargeTotal.drug_charge}}元</span>
      </div>
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="hospitalName" label="医院名称" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="diagnosisCharge" :formatter="filterTable" label="诊疗总费用(元)" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugCharge" :formatter="filterTable" label="药品总费用(元)" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="count" :formatter="filterTable" label="交易笔数" min-width="15%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="total" :formatter="filterTable" label="费用合计(元)" min-width="15%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="view(scope.row)">
                <i class="icon-view" title="查看明细"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>

  </div>
</template>

<script>
  import utils from 'components/utils';
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import {pageSize, pageNo, emptyText, elementLoadingText} from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';

  export default {
    name: 'extensionPrescription',
    mixins: [],
    data () {
      let that = this;
      return {
        startDateOption: {
          disabledDate (time) {
            if (that.ruleForm.endDate) {
              return time.getTime() > that.ruleForm.endDate.getTime();
            }
          }
        },
        endDateOption: {
          disabledDate (time) {
            if (that.ruleForm.startDate) {
              return time.getTime() < that.ruleForm.startDate.getTime();
            }
          }
        },
        ruleForm: {
          hospitalId: '',
          startDate: '',
          endDate: '',
          hospitalList: []
        },
        params_ruleForm: {
          hospitalId: '',
          startDate: '',
          endDate: '',
          hospitalList: []
        },
        totalChargeTotal: {},
        departmentList: [],
        departmentIdList: [],
        dataList: {},
        loading: false,
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        elementLoadingText: ''
      };
    },
    watch: {},
    computed: {},
    created () {
      this.initPage();
    },
    mounted () {

    },
    components: {
      pagination,
      echartsContain
    },
    methods: {
      initPage () {
        this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
        this.filterTable = utils.filterTable;
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        this.drugstroeId = JSON.parse(sessionStorage.getItem('userInfo')).orgId;
        this.getHospitalList().then(res => {
          this.ruleForm.hospitalList = res;
          this.search();
        });
      },
      search () {
        this.params_ruleForm = Object.assign({}, this.ruleForm);
        this.$nextTick(() => {
          this.getDataList();
          this.totalCharge();
        });
      },
      getHospitalList () { // 获取 下拉框
        let that = this;
        return new Promise((resolve, reject) => {
          that.$axios({
            method: 'get',
            headers: {'Authorization': that.token},
            url: '/peps/management/hospital/getHospitalByCurrentDrugstore?t=' + (+new Date())
          }).then((response) => {
            if (response.data.code == 0) {
              that.departmentList = response.data.data;
              for (let i = 0; i < that.departmentList.length; i++) {
                that.departmentIdList.push(that.departmentList[i].id);
              }
              resolve(that.departmentIdList);
            } else {
              reject(new Error());
              that.$warning();
            }
          }).catch((error) => {
            reject(new Error());
            console.log(error);
          });
        });
      },
      totalCharge () {
        let that = this;
        if (that.params_ruleForm.hospitalId != '') {
          that.params_ruleForm.hospitalList = [];
        }
        let formData = {
          'startDate': utils.formateDate(that.params_ruleForm.startDate),
          'endDate': utils.formateDate(that.params_ruleForm.endDate),
          'hospitalId': that.params_ruleForm.hospitalId,
          'drugstroeId': that.drugstroeId,
          'hospitalList': that.params_ruleForm.hospitalList
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: '/peps/presc/drugstroe/statistics?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          that.loading = false;
          if (response.data.code == 0) {
            that.totalChargeTotal = response.data.data;
          } else {
            that.$warning();
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      },
      getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.loading = true;
        if (that.params_ruleForm.hospitalId != '') {
          that.params_ruleForm.hospitalList = [];
        }
        let formData = {
          'pageIndex': pageNo,
          'itemCountPerPage': pageSize,
          args: {
            'startDate': utils.formateDate(that.params_ruleForm.startDate),
            'endDate': utils.formateDate(that.params_ruleForm.endDate),
            'hospitalId': that.params_ruleForm.hospitalId,
            'drugstroeId': that.drugstroeId,
            'hospitalList': that.params_ruleForm.hospitalList
          }
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': this.token},
          url: '/peps/presc/drugstroe/statistics/hospital?v=' + (+new Date()),
          data: formData
        }).then((response) => {
          that.loading = false;
          if (response.data.code == 0) {
            let obj = {};
            obj.content = response.data.data.list;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(response.data.data.total);
            obj.totalPage = parseInt((obj.total + obj.pageSize - 1) / obj.pageSize);
            that.dataList = obj;
          } else {
            that.$warning();
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      },
      view (row) {
        this.$router.push({
          name: 'extensionPrescriptionList',
          query: {
            hospitalId: row.hospitalId,
            startDate: utils.formateDate(this.params_ruleForm.startDate),
            endDate: utils.formateDate(this.params_ruleForm.endDate),
            drugstroeId: this.drugstroeId
          }
        });
      },
      /**
       * 有个bug，查询条件带有时间控件的，因为data中用到了let that = this;在重置的时候，
       * 调用 Object.assign(this.$data, this.$options.data());，
       * 直接将data恢复了初始值，结果let that = this就丢失了，因为内存中只保存了data中return的对象，
       * 没有保存return外的，所以如果有时间控件的，重置功能不能用Object.assign(this.$data, this.$options.data());
       * 直接手动清空 */
      reset () {
        // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.ruleForm.resetFields();
        //        //初始化注册data
        //        Object.assign(this.$data, this.$options.data());
        this.ruleForm.startDate = '';
        this.ruleForm.endDate = '';
        // 初始化data默认值及页面
        this.initPage();
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

</style>

<style>

</style>
