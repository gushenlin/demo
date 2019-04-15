<template>
  <!--<template><div>医院药品目录 hospitalDrugDirectory</div></template>-->
  <div class="cloud-component hospitalDrugDirectory">
    <div class="searchTitle">
      <span>医院药品目录</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="药品名称：">
          <el-input v-model.trim="ruleForm.name"
                    placeholder="请输入药品名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="医院名称：">
          <el-select v-model="ruleForm.hospitalId" placeholder="请选择医院">
            <el-option v-for="item in organizationList"
                       :key="item.id" :label="item.hospitalName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading">查询</el-button>
          <el-button @click="reset" size="mini">重置</el-button>
          <span class="delimiter"></span>
          <el-button type="primary" size="mini" @click="download">导出药品</el-button>
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
          <el-table-column prop="code" label="医院药品编码" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="commonName" label="通用名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="商品名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="spec" label="药品规格" min-width="14%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="剂型" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家" min-width="20%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalName" label="医院名称" min-width="16%" show-overflow-tooltip>
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
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';

export default {
  name: 'hospitalDrugDirectory',
  mixins: [],
  data () {
    return {
      ruleForm: {
        name: '', // 药品名称
        hospitalId: ''// 医院名称
      },
      params_ruleForm: {
        name: '', // 药品名称
        hospitalId: '' // 医院名称
      },
      organizationList: [], // 医院名称列表
      organizationIds: [],
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
      this.token = this.userLogin.data;
      this.getOrganizationList().then(res => {
        this.ruleForm.hospitalId = res[0].id;
        this.search();
      });
    },
    getOrganizationList () {
      let that = this;
      return new Promise((resolve, reject) => {
        that.$axios({
          method: 'get',
          headers: {'Authorization': this.token},
          url: '/peps/management/hospital/getHospitalByCurrentDrugstore?t=' + (+new Date())
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.organizationList = data.data;
            resolve(that.organizationList);
            that.organizationList.forEach(function (element) {
              that.organizationIds.push(element.id);
            });
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
    search () {
      this.params_ruleForm = utils.deepClone(this.ruleForm);
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    reset () {
      // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.ruleForm.resetFields();
      // 初始化注册data
      Object.assign(this.$data, this.$options.data());
      // 初始化data默认值及页面
      this.initPage();
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
          'name': that.params_ruleForm.name,
          'hospitalId': that.params_ruleForm.hospitalId
        }
      };
      that.$axios({
        method: 'post',
        headers: {'Authorization': this.token},
        url: '/peps/drug/hospital/search/page?t=' + (+new Date()),
        data: formData
      }).then((response) => {
        that.loading = false;
        let data = response.data;
        if (data.code == '0') {
          let obj = {};
          obj.content = data.data.list;
          obj.pageNo = pageNo;
          obj.pageSize = pageSize;
          obj.totalCount = parseInt(data.data.total);
          obj.totalPage = parseInt((obj.total + obj.pageSize - 1) / obj.pageSize);
          that.dataList = obj;
        } else {
          that.$warning(data.message);
        }
      }).catch((error) => {
        that.loading = false;
        console.log(error);
      });
    },
    download () {
      let that = this;
      let formData;
      let hospitalName;
      if (that.ruleForm.hospitalId) {
        that.organizationList.forEach(function (element) {
          if (element.id == that.ruleForm.hospitalId) {
            hospitalName = element.hospitalName + '.xls';
          }
        });
        formData = {
          'commonName': that.ruleForm.name,
          'name': that.ruleForm.name,
          'hospitalId': that.ruleForm.hospitalId
        };
      } else {
        hospitalName = '医院药品目录.xlsx';
        formData = {
          'commonName': that.ruleForm.name,
          'name': that.ruleForm.name,
          'hospitalIdList': that.organizationIds
        };
      }
      that.$axios({
        method: 'post',
        headers: {'Authorization': this.token},
        responseType: 'blob',
        url: '/peps/drug/drugstore/search/download?t=' + (+new Date()),
        data: formData
      }).then((response) => {
        let blob = new Blob([response.data]);
        that.$download(hospitalName, blob);
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

