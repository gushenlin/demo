<template>
  <!--<template><div>历史处方查询 historyPrescriptionInquiry</div></template>-->
  <div class="cloud-component historyPrescriptionInquiry">
    <div class="searchTitle">
      <span>历史处方查询</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="处方单号：" prop="id">
          <el-input v-model.trim="ruleForm.id"
                    placeholder="请输入8位数处方单号" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="患者手机号：" prop="patientTelephone">
          <el-input v-model.trim="ruleForm.patientTelephone"
                    placeholder="请输入11位数手机号" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="患者姓名：" prop="patientName">
          <el-input v-model.trim="ruleForm.patientName"
                    placeholder="请输入患者姓名" :clearable="true"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="处方日期：">
          <el-date-picker
            v-model.trim="ruleForm.startDate"
            :picker-options="startTimeOption"
            type="date"
            placeholder="选择开始时间">
          </el-date-picker>&nbsp;&nbsp;至&nbsp;&nbsp;
          <el-date-picker
            v-model.trim="ruleForm.endDate"
            :picker-options="endTimeOption"
            type="date"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading">查询</el-button>
          <el-button @click="reset" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="createDate" label="时间" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="id" label="处方单号" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="doctorName" label="医生姓名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="patientName" label="患者姓名" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="patientTelephone" label="患者手机" min-width="14%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="isTake" label="状态" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.isTake == "0" ? "未取药" : "已取药"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="view('check',scope.row.id)">
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
    name: 'historyPrescriptionInquiry',
    mixins: [],
    data () {
      let that = this;
      return {
        startTimeOption: {
          disabledDate (time) {
            if (that.ruleForm.endDate) {
              return time.getTime() > that.ruleForm.endDate.getTime();
            }
          }
        },
        endTimeOption: {
          disabledDate (time) {
            if (that.ruleForm.startDate) {
              return time.getTime() < that.ruleForm.startDate.getTime();
            }
          }
        },
        ruleForm: {
          id: '',
          patientTelephone: '',
          patientName: '',
          startDate: '',
          endDate: ''
        },
        params_ruleForm: {
          id: '',
          patientTelephone: '',
          patientName: '',
          startDate: '',
          endDate: ''
        },
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
        this.elementLoadingText = elementLoadingText;
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
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
            'id': that.params_ruleForm.id,
            'patientTelephone': that.params_ruleForm.patientTelephone,
            'patientName': that.params_ruleForm.patientName,
            'startDate': utils.formateDate(that.params_ruleForm.startDate),
            'endDate': utils.formateDate(that.params_ruleForm.endDate),
            'drugstroeId': JSON.parse(sessionStorage.getItem('userInfo')).orgId
          }
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': this.token},
          url: '/peps/presc/drugstroe/search/page?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          console.log(response);
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

      view (option, id) {
        this.$router.push({
          name: 'historyPrescriptionDetail',
          query: {
            id: id || ''
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
    }
  };
</script>

<style scoped>
</style>

<style>

</style>
