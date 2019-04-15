<template>
  <div class="cloud-component hospitalDrugDirectory">
    <div class="searchTitle">
      <span>医生处方统计</span>
       <el-button @click="historyGoBack('/prescriptionStatistics')" type="text" style="margin-left: 15px">
         &lt&lt返回上一级
          </el-button>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
         <el-table :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
                  :data="dataList.content" style="width: 100%" v-loading="loading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="createDate" label="时间" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hisPrescCode" label="处方单号" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="doctorName" label="医生姓名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="patientName" label="患者姓名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="patientTelephone" label="患者手机" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="isTake" label="状态" min-width="12%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.isTake == "0" ? "未取药" : "已取药"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="view(scope.row.id)">
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
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import {pageSize, pageNo, emptyText, elementLoadingText} from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';

  export default {
    name: 'hospitalDrugDirectory',
    mixins: [],
    data () {
      let that = this;
      return {
        startTimeOption: {
          disabledDate (time) {
            if (that.ruleForm.endTime) {
              return time.getTime() > that.ruleForm.endTime.getTime();
            }
          }
        },
        endTimeOption: {
          disabledDate (time) {
            if (that.ruleForm.startTime) {
              return time.getTime() < that.ruleForm.startTime.getTime();
            }
          }
        },
        ruleForm: {
          hospitalName: '',
          startTime: '',
          endTime: ''
        },
        params_ruleForm: {
          hospitalName: '',
          startTime: '',
          endTime: ''
        },
        rowDoctorCode: '',
        rowHospitalId: '',
        rowStartDate: '',
        rowEndDate: '',
        rowDepartment: '',
        departmentList: '',
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
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.rowDoctorCode = this.$route.query.doctorCode;
        this.rowHospitalId = this.$route.query.hospitalId;
        this.rowStartDate = this.$route.query.startDate;
        this.rowEndDate = this.$route.query.endDate;
        this.rowDepartment = this.$route.query.department;
        if (!this.rowDoctorCode) {
          return false;
        }
        this.elementLoadingText = elementLoadingText;
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        this.search();
      },
      search () {
        this.params_ruleForm = Object.assign({}, this.ruleForm);
        this.$nextTick(() => {
          this.getDataList();
        });
      },
      getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.loading = true;
        let formData = {
          'pageIndex': pageNo,
          'itemCountPerPage': pageSize,
          args: {
            'doctorCode': that.rowDoctorCode,
            'hospitalId': that.rowHospitalId,
            'startDate': that.rowStartDate,
            'endDate': that.rowEndDate,
            'department': that.rowDepartment
          }
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': this.token},
          url: '/peps/presc/hospital/search/page?t=' + (+new Date()),
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
      view (id) {
        this.$router.push({
          name: 'prescriptionStatisticsDetail',
          query: {
            id: id
          }
        });
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
