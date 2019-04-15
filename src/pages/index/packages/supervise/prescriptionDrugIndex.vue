<!--可视化管理平台-处方药品统计-->
<template>
  <div class="cloud-component prescriptionDrugIndex">
    <template>
      <span class="totalCount">处方药品总数——{{totalDrugCount}}</span>
    </template>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small reqForm">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" label-width="65px" @submit.native.prevent>
        <el-form-item label="">
          <el-input v-model="ruleForm.drugName" placeholder="请输入药品名称搜索" style="width:190px; margin-left: 10px" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="search" style="margin-right: 10px;">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list" v-loading="searchLoading">
      <el-table :data="drugStatistics.dataList" style="width: 100%" v-loading="drugStatisticsSearchLoading"
                :empty-text="emptyText"
                element-loading-text="拼命加载中" stripe border align="center" :highlight-current-row="true">
        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
        <el-table-column prop="" label="药品通用名" min-width="10%" align="center">
        </el-table-column>
        <el-table-column prop="" label="药品商品名" min-width="10%" align="center">
        </el-table-column>
        <el-table-column prop="" label="规格" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="" label="剂型" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="" label="生产厂家" min-width="10%" align="center">
        </el-table-column>
        <el-table-column prop="" label="开方次数" min-width="5%" align="center">
        </el-table-column>
        <el-table-column prop="" label="开方医院数" min-width="5%" align="center">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination :data="drugStatistics" listName="dataList" totalNumName="dataCount"
                  @change="getDrugStatistics"></pagination>
    </div>

  </div>
</template>

<script type="text/javascript">
  import utils from 'components/utils';
  import pagination from 'components/packages/pagination/pagination';
  import {pageSize, pageNo, emptyText} from 'components/utils/constant';

export default {
    name: 'prescriptionDrugIndex',
    mixins: [],
    data () {
      return {
        totalDrugCount: '',
        ruleForm: {
          drugName: ''
        },
        params_ruleForm: {
          drugName: ''
        },
        drugStatistics: {dataList: []},
        drugStatisticsSearchLoading: false,
        searchLoading: false,

        emptyText: '',
        pageSize: '',
        currentPage: ''
      };
    },
    components: {pagination},
    watch: {},
    computed: {},
    created () {
    },
    mounted () {
      this.initPage();
    },
    methods: {
      initPage () {
        this.pageSize = pageSize;
        this.currentPage = pageNo;
        this.emptyText = emptyText;
        this.search();
      },
      search () {
        this.params_ruleForm = utils.deepClone(this.ruleForm);
        this.getDrugStatistics();
      },
      getDrugStatistics (currentPage = this.currentPage, pageSize = this.pageSize) {
        var that = this;
        that.drugStatisticsSearchLoading = true;
        that.emptyText = '数据加载中';
        that.searchLoading = true;
        //      ajax请求
        that.$axios({
          method: 'get',
          //          url: '/PresMon/visualManagement/getDrugstoreList?t=' + (+new Date()),
          params: that.removeNullKey({
            drugName: that.params_ruleForm.drugName,
            pageNo: currentPage,
            pageSize: pageSize
          })
        }).then(function (response) {
          that.searchLoading = false;
          that.drugStatisticsSearchLoading = false;
          that.emptyText = '暂无数据';
          let data = response.data;
          if (data) {
            if (data.dataList) {
              that.drugStatistics = data;
              that.$set(that.drugStatistics, 'totalPage', Math.ceil(that.drugStatistics.dataCount / pageSize));
              that.$set(that.drugStatistics, 'pageNo', currentPage);
              that.$set(that.drugStatistics, 'pageSize', pageSize);
              that.totalDrugCount = data.dataCount;
            } else {
              that.drugStatistics = {dataList: []};
            }
          } else {
            that.$notice('处方药品监管数据查询失败');
          }
        }).catch(function (error) {
          that.drugStatisticsSearchLoading = false;
          that.emptyText = '暂无数据';
          that.$notice('处方药品监管数据查询失败');
          that.searchLoading = false;
          console.log(error);
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
  .totalCount{color: #2b9bff; font-size: 14px; margin-left: 3px;}
  .reqForm{margin-top: 10px;margin-left: -10px}
</style>
