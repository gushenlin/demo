<template>
  <div class="cloud-component cloud-component-detail">
    <div class="cloud-search  el-form-item-small">
      <!--<div class="cloud-title">-->
      <div class="searchTitle">
        <span>外延处方统计</span>
        <el-button @click="goBack()" type="text" style="margin-left: 15px">
          &lt&lt返回上一级
        </el-button>
        <!--<el-button @click="historyGoBack('/prescriptionList')" type="text" style="margin-left: 15px">-->
          <!--&lt&lt返回上一级-->
        <!--</el-button>-->
      </div>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight+30" :heightRatio="1">
        <div class="contentRegion" v-loading="loading">
          <div class="lineStyle">
            <div class="el-col-5">
              <label>医生姓名：</label>
              <span>{{allDataList.doctorName}}</span>
            </div>
            <div class="el-col-5">
              <label>处方单号：</label>
              <span>{{id}}</span>
            </div>
            <div class="el-col-5">
              <label>处方时间：</label>
              <span>{{createDateFormat }}</span>
            </div>
          </div>
          <div class="drugStatus">
            <span>{{allDataList.isTake == "0" ? "未取药" : "已取药"}}</span>
          </div>
          <div class="lineStyle">
            <div class="el-col-5">
              <label>患者姓名：</label>
              <span>{{allDataList.patientName}}</span>
            </div>
            <div class="el-col-5">
              <label>性别：</label>
              <span>{{allDataList.patientSex}}</span>
              <label style="padding-left:50px">年龄：</label>
              <span>{{allDataList.patientAge}} {{allDataList.ageUnit}}</span>
            </div>
            <div class="el-col-5">
              <label>患者手机：</label>
              <span>{{allDataList.patientTelephone}}</span>
            </div>
          </div>
          <div class="lineStyle">
            <div class="el-col-6">
              <label>诊断：</label>
              <span>{{allDataList.diagnosis}}</span>
            </div>
          </div>
        </div>
        <table class="detail-charge">
          <tr>
            <td>消费类型 </td>
            <td>费用(元) </td>
          </tr>
          <tr>
            <td>诊疗费</td>
            <td>{{allDataList.diagnosisCharge}} </td>
          </tr>
        </table>
        <el-table :height="routerViewHeight*1-280" :data="dataList.content" style="width: 100%" v-loading="loading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="commonName" label="通用名" min-width="15%">
          </el-table-column>
          <el-table-column prop="name" label="商品名" min-width="15%">
          </el-table-column>
          <el-table-column prop="spec" label="药品规格" min-width="15%">
          </el-table-column>
          <el-table-column prop="type" label="剂型" min-width="10%">
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家" min-width="20%">
          </el-table-column>
          <el-table-column prop="method" label="用法用量" min-width="20%">
          </el-table-column>
          <el-table-column prop="amount" label="数量" min-width="8%">
            <template slot-scope="scope">
              <span>{{scope.row.amount}}{{scope.row.unit}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="单位" min-width="8%">
          </el-table-column>
          <el-table-column prop="total" label="费用(元)" min-width="10%">
          </el-table-column>
        </el-table>
        <div class="total-price">
          <label>总费用：</label>
          <span>{{allDataList.total}}</span>元
        </div>
      </echarts-contain>
    </div>
  </div>
</template>

<script type="text/javascript">
  import utils from 'components/utils';
  import {emptyText, elementLoadingText} from 'components/utils/constant';
  import echartsContain from 'components/packages/echartsContain/echartsContain';

  export default {
    name: 'eitaxyPrescriptionDetail',
    mixins: [],
    data () {
      return {
        id: '', // query传参
        allDataList: {}, // query传参 列表页数据
        option: '', // query传参
        ruleForm: {
          id: '' // 处方ID
        },
        ruleFormResult: {},
        dataList: {}, // 列表数据
        loading: false,
        emptyText: '',
        elementLoadingText: '',
        userInfo: {},
        createDateFormat: '',

        // 处方笺弹窗
        prescriptionDialogVisible: false,
        prescriptionDialogTitle: ''

      };
    },
    components: {
      echartsContain
    },
    computed: {},
    created () {
      this.initPage();
    },
    mounted () {
    },
    methods: {
      initPage () {
        this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
        this.option = this.$route.query.option;
        this.id = this.$route.query.id;
        if (!this.id) {
          return false;
        }
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.userInfo = this.$getUserInfo();
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        this.search();
        this.startDate = utils.formateDate(this.$route.query.startDate);
        this.endDate = utils.formateDate(this.$route.query.endDate);
        this.department = this.$route.query.department;
      },
      search () {
        this.$nextTick(() => {
          this.getDataList();
        });
      },
      getDataList () {
        let that = this;
        that.loading = true;
        that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/presc/drugstroe/search?&t=' + (+new Date()),
          params: {
            id: that.id
          }
        }).then((response) => {
          let data = response.data;
          that.loading = false;
          if (data.code == '0') {
            let obj = {};
            that.createDateFormat = that.$dateFormat(new Date(data.data.createDate));
            obj.content = data.data.list;
            that.allDataList = data.data;
            that.dataList = obj;
            if (that.allDataList.patientSex == 1) {
              that.allDataList.patientSex = '男';
            } else {
              that.allDataList.patientSex = '女';
            }
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      },
      goBack () {
        this.$router.push({
          name: 'prescriptionList',
          query: {
            startDate: this.startDate,
            endDate: this.endDate,
            department: this.department
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

