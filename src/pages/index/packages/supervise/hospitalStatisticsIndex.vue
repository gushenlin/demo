<!--可视化管理平台-医院机构统计-->
<template>
  <div class="cloud-component hospitalStatisticsIndex">
    <div class="searchTitle">
      <span>接入机构监管</span>
    </div>
    <div class="totalCountLine">
      <span style="color:#4F555D">医疗机构总数：</span><span style="color:#3D99FD">{{totalHospitalCount}}个</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small reqForm">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="65px" @submit.native.prevent>
        <el-form-item label-width="0px">
          <el-select v-model="ruleForm.provinceName" disabled></el-select>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-select v-model="ruleForm.cityName" disabled></el-select>
        </el-form-item>
        <el-form-item label-width="0px">
          <el-select v-model="ruleForm.countyCode" clearable>
            <el-option
              v-for="item in regionValueList"
              :key="item.code"
              :label="item.desc"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称：" label-width="80px">
          <el-input v-model="ruleForm.condition" placeholder="请输入机构名称搜索" style="width:190px" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="search" style="margin-right: 10px;">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list" v-loading="searchLoading">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table :data="hospitalStatistics.content" style="width: 100%" v-loading="hospitalStatisticsSearchLoading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText"
                  stripe border align="center" :highlight-current-row="true">
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column prop="hospitalName" label="机构名称" min-width="25%" align="center">
          </el-table-column>
          <el-table-column prop="provinceName" label="所在省/市" min-width="20%" align="center">
          </el-table-column>
          <el-table-column prop="cityName" label="所在市/区" min-width="15%" align="center">
          </el-table-column>
          <el-table-column prop="countyName" label="所在区/县" min-width="15%" align="center">
          </el-table-column>
          <el-table-column prop="count" label="医生数量" min-width="10%" align="center">
          </el-table-column>
          <el-table-column prop="telephone" label="责任电话" min-width="15%" align="center">
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="hospitalStatistics" @change="getHospitalStatistics"></pagination>
      </echarts-contain>
    </div>
  </div>
</template>

<script type="text/javascript">
import utils from 'components/utils';
import dictionary from 'components/utils/dictionary';
import pagination from 'components/packages/pagination/pagination';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import echartsContain from 'components/packages/echartsContain/echartsContain';

export default {
  name: 'hospitalStatisticsIndex',
  mixins: [],
  data () {
    return {
      totalHospitalCount: '',
      regionValueList: [],
      ruleForm: {
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyCode: '',
        condition: ''
      },
      params_ruleForm: {
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyCode: '',
        condition: ''
      },
      hospitalStatistics: {content: []},
      hospitalStatisticsSearchLoading: false,
      searchLoading: false,

      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: ''
    };
  },
  components: {pagination, echartsContain},
  watch: {},
  computed: {},
  created () {},
  mounted () {
    this.initPage();
  },
  methods: {
    initPage () {
      this.ruleForm.provinceCode = JSON.parse(sessionStorage.getItem('userInfo')).provinceCode;
      this.ruleForm.provinceName = JSON.parse(sessionStorage.getItem('userInfo')).provinceName;
      this.ruleForm.cityCode = JSON.parse(sessionStorage.getItem('userInfo')).cityCode;
      this.ruleForm.cityName = JSON.parse(sessionStorage.getItem('userInfo')).cityName;
      // this.ruleForm.countyCode = JSON.parse(sessionStorage.getItem('userInfo')).countyCode;
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.search();
      this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
      this.token = this.userLogin.data;
      dictionary.getRegionValue().then((res) => {
        this.regionValueList = res;
      });
    },
    search () {
      this.params_ruleForm = utils.deepClone(this.ruleForm);
      this.$nextTick(() => {
        this.getHospitalStatistics();
      });
    },
    getHospitalStatistics (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;
      that.hospitalStatisticsSearchLoading = true;
      that.searchLoading = true;
      that.currentPageNo = pageNo;
      that.currentPageSize = pageSize;
      let formData = {
        'pageIndex': pageNo,
        'itemCountPerPage': pageSize,
        args: {
          provinceCode: that.params_ruleForm.provinceCode,
          cityCode: that.params_ruleForm.cityCode,
          countyCode: that.params_ruleForm.countyCode,
          condition: that.params_ruleForm.condition
        }
      };
      //      ajax请求
      that.$axios({
        method: 'post',
        headers: {'Authorization': that.token},
        url: '/peps/supervise/statistics/hospital?t=' + (+new Date()),
        data: formData
      }).then(function (response) {
        that.searchLoading = false;
        that.hospitalStatisticsSearchLoading = false;
        let data = response.data;
        if (data.code == '0') {
          let obj = {};
          if (data.data.list) {
            obj.content = data.data.list;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.total);
            obj.totalPage = parseInt((obj.totalCount + obj.pageSize - 1) / obj.pageSize);
            that.hospitalStatistics = obj;
            that.totalHospitalCount = obj.totalCount;
          } else {
            that.hospitalStatistics = {content: []};
          }
        } else {
          that.$notice('接入机构监管数据查询失败');
        }
      }).catch(function (error) {
        that.hospitalStatisticsSearchLoading = false;
        that.$notice('接入机构监管数据查询失败');
        that.searchLoading = false;
        console.log(error);
      });
    },
    areaSelect (data) {
      this.ruleForm.areaForm = data;
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
  .reqForm{margin-top: 10px;}
  .totalCountLine{padding:10px 10px 9px; background:#E9EAEC; font-size: 16px}
</style>
