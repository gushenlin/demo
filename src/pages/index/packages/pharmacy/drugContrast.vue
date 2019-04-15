<template>
  <!--<template><div>药品对照 drugContrast</div></template>-->
  <div class="cloud-component drugContrast">
    <div class="searchTitle">
      <span>医院药品目录</span>
      <el-button @click="autoContrastClick" type="text" style="float: right; margin-right: 20px" :loading="progressIsShow">{{progressIsShow ? '处理中' : '一键自动对照'}}
      </el-button>
    </div>
    <!--</div>-->
    <!--医院药品-->
    <echarts-contain containType="left" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="0.6">
      <h3 class="mod-title"><i class="el-icon-search"></i>医院药品</h3>
      <div class="cloud-search  el-form-item-small">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
          <el-form-item label="医院名称：">
            <el-select v-model="ruleForm.hospitalId" placeholder="请选择医院">
              <el-option v-for="item in organizationList" :key="item.id" :label="item.hospitalName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="药品名称：">
            <el-input v-model.trim="ruleForm.commonName" placeholder="请输入药品名称" :clearable="true"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="药品编码：">
            <el-input v-model.trim="ruleForm.code" placeholder="请输入医院药品编码" :clearable="true"></el-input>
          </el-form-item>
          <el-form-item label="对照状态：">
            <el-radio-group v-model="ruleForm.isContrast">
              <el-radio :label="0">未对照</el-radio>
              <el-radio :label="1">已对照</el-radio>
            </el-radio-group>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="search" size="mini">查询</el-button>
            <el-button @click="reset" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--搜索结果-->
      <div class="cloud-search-list hospital-drugstore">
        <el-table :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-215):(routerViewHeight*1-180)" :data="dataList.content" style="width: 100%" ref="hospital" :cell-class-name="cellClassName" :highlight-current-row="true" @select="handleSelect" :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe v-loading="loading">
          <el-table-column type="selection" width="35"> </el-table-column>
          <el-table-column prop="hospitalName" label="医院名称" min-width="15%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalDrugCode" label="医院药品编码" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalDrugName" label="药品名称" min-width="15%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalDrugSpec" label="规格" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalDrugManufacturer" label="生产厂家" min-width="15%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="drugstoreDrugCode" label="药店药品编码" min-width="15%" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </div>
    </echarts-contain>
    <!--药店药品-->
    <echarts-contain containType="right" :parentHeight="routerViewHeight" :heightRatio="1" :widthRatio="0.4">
      <h3 class="mod-title"><i class="el-icon-search"></i>药店药品目录</h3>
      <div class="cloud-search  el-form-item-small">
        <!-- 搜索区域 -->
        <el-form :inline="true" :model="ruleForm2" ref="ruleForm2" @submit.native.prevent>
          <el-form-item label="药品名称：">
            <el-input v-model.trim="ruleForm2.name" class="input-large" placeholder="请输入药品名称"
                      :clearable="true" :disabled="contrastedFlag"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="药品编码：">
            <el-input v-model.trim="ruleForm2.code" class="input-large" placeholder="请输入药店药品编码"
                      :disabled="contrastedFlag"></el-input>
          </el-form-item>
          <br>
          <el-form-item>
            <el-button type="primary" @click="contrastSearch" size="large">查询</el-button>
            <el-button @click="contrastReset" size="large">重置</el-button>
            <span class="delimiter"></span>
            <el-button type="primary" @click="contrastClick" class="contrast-btn" size="large" :disabled="!contrastFlag">{{!params_ruleForm.isContrast ?'手动对照':'取消对照'}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--搜索结果-->
      <div class="cloud-search-list hospital-drugstore">
        <el-table :height="(centerDataList.content && centerDataList.content.length>0)?(routerViewHeight*1-215):(routerViewHeight*1-180)" :data="centerDataList.content" style="width: 100%" v-loading="loading2" ref="drugstore" :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row @select="handleSelection">
          <el-table-column type="selection" width="35"> </el-table-column>
          <el-table-column prop="name" label="药品名称" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="code" label="药店药品编码" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家" min-width="18%" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="centerDataList" @change="getContrastDataList"></pagination>
      </div>
    </echarts-contain>
    <el-progress v-if="progressIsShow" :title="'自动对照进度:'+progressPercentage+'%'" class="progressPosition" :text-inside="true" :stroke-width="12" :percentage="progressPercentage"></el-progress>
  </div>
</template>
<script type="text/javascript">
  import utils from 'components/utils';
  //  import dictionary from 'components/utils/dictionary'
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
  import contrastMain from 'components/packages/contrastMain/contrastMain';
  import pagination from 'components/packages/pagination/pagination';
  export default {
    name: 'drugContrast',
    mixins: [],
    data () {
      return {
        ruleForm: {
          'hospitalId': '', // 机构名(简)称
          'commonName': '', //  药品名称
          'name': '', // 药品名称
          'code': '', // 药品代码
          'isContrast': 0 // 对照状态 未对照0
        },
        params_ruleForm: {
          'hospitalId': '', // 机构名(简)称
          'commonName': '', //  药品名称
          'name': '', // 药品名称
          'code': '', // 药品代码
          'isContrast': 0 // 对照状态 未对照0
        },
        ruleForm2: {
          'name': '',
          'code': ''
        },
        params_ruleForm2: {
          'name': '',
          'code': ''
        },
        organizationList: [], // 医院名称列表
        departmentsTypeList: [], // 字典 科室类别
        contrastList: [], // 字典 对照状态 列表
        dataList: {}, // 左侧列表
        params_dataList: [], // 左侧类别缓存
        centerDataList: {}, // 右侧列表
        templateRadio: '',
        contrastedFlag: false, // 已对照情况下 禁用右侧查询
        orgRowData: {}, // 左侧点击那行数据对象
        radio: '', // 当前右侧勾选的代码
        checkList: [],
        hospitalSelection: {},
        drugSelection: {},
        checkboxData: '',
        radioOk: '', // 存储已对照的（院内科室）的中心科室 和（中心科室）的科室代码相等值
        loading: false,
        loading2: false,
        selectCenterDepartmentIndex: '', // 记录当前 院内科室 datalist的index
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        elementLoadingText: '',
        progressPercentage: 3,
        progressIsShow: false
      };
    },
    components: {
      pagination,
      echartsContain,
      contrastMain
    },
    watch: {},
    computed: {
      contrastFlag () {
        return this.hospitalSelection.hospitalDrugCode && this.drugSelection.code;
      }
    },
    created () {
      this.initPage();
    },
    mounted () {
    },
    methods: {
      getTemplateRow () {
      },
      initPage () {
        this.$emit('handlePageHeight'); // 初始化的时候首先调用调整窗口
        this.ruleForm.ORG_CODE = '';
        this.ruleForm.isContrast = 0;
        this.contrastList = {}; // dictionary.options('CONTRAST_TYPE')
        this.departmentsTypeList = {}; // dictionary.options('DEPARTMENTS_TYPE')
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
      search () {
        this.params_ruleForm = utils.deepClone(this.ruleForm);
        this.$nextTick(() => {
          this.getDataList();
        });
        if (this.params_ruleForm.isContrast == 1) {
          this.contrastedFlag = true;
        } else {
          this.contrastedFlag = false;
        }
      },
      contrastSearch () {
        this.params_ruleForm2 = utils.deepClone(this.ruleForm2);

        this.$nextTick(() => {
          this.getContrastDataList();
        });
      },
      cellClassName ({ row, rowIndex }) {
        if (row.tableRowColor) {
          return 'tableRowColor';
        } else {
          return '';
        }
      },
      getOrganizationList () {
        let that = this;
        return new Promise((resolve, reject) => {
          that.$axios({
            method: 'get',
            headers: { 'Authorization': this.token },
            url: '/peps/management/hospital/getHospitalByCurrentDrugstore?t=' + (+new Date())
          }).then((response) => {
            let data = response.data;
            if (data.code == '0') {
              that.organizationList = data.data;
              resolve(that.organizationList);
            } else {
              reject(new Error());
              that.$warning(data.message);
            }
          }).catch((error) => {
            reject(new Error());
            console.log(error);
          });
        });
      },
      getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.loading = true;
        this.orgRowData = {};
        //        if (that.params_ruleForm.hospitalId == "") {
        //          that.params_ruleForm.hospitalId = '1005'
        //        }
        let formData = {
          'pageIndex': pageNo,
          'itemCountPerPage': pageSize,
          args: {
            'hospitalId': that.params_ruleForm.hospitalId,
            'drugstoreId': that.$getUserInfo().orgId,
            'isContrast': that.params_ruleForm.isContrast,
            'commonName': that.params_ruleForm.commonName,
            'name': that.params_ruleForm.commonName,
            'code': that.params_ruleForm.code
          }
        };
        that.$axios({
          method: 'post',
          headers: { 'Authorization': this.token },
          url: '/peps/drug/contrast/search/page?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          that.loading = false;
          let data = response.data;
          if (data.code == '0') {
            that.hospitalSelection = {};
            let getInfo = data.data.list;
            let obj = {};
            obj.content = getInfo;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.total);
            obj.totalPage = parseInt((obj.total + obj.pageSize - 1) / obj.pageSize);
            that.dataList = obj;
            that.params_dataList = utils.deepClone(obj);
            that.centerDataList = Object.assign(that.centerDataList, { content: [] });
          } else {
            that.dataList = Object.assign(that.dataList, { content: [] });
            that.centerDataList = Object.assign(that.centerDataList, { content: [] });
            that.$notice('获取医院药品失败');
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      },
      getContrastDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.loading2 = true;
        let formData = {
          'pageIndex': pageNo,
          'itemCountPerPage': pageSize,
          args: {
            'name': that.params_ruleForm2.name,
            'code': that.params_ruleForm2.code,
            onSale: 1
          }
        };
        that.$axios({
          method: 'post',
          headers: { 'Authorization': that.token },
          url: '/peps/drug/drugstore/search/page?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          let data = response.data;
          that.loading2 = false;
          if (data.code == '0') {
            that.drugSelection = {};
            let obj = {};
            obj.content = data.data.list;
            obj.pageNo = pageNo;
            obj.pageSize = pageSize;
            obj.totalCount = parseInt(data.data.total);
            obj.totalPage = parseInt((obj.total + obj.pageSize - 1) / obj.pageSize);
            that.centerDataList = obj;
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          that.loading2 = false;
          console.log(error);
        });
      },
      handleSelect (selection, row) {
        // 医院药品列表
        if (this.hospitalSelection.hospitalDrugCode == row.hospitalDrugCode) {
          this.$refs.hospital.clearSelection();
          this.hospitalSelection = {};
          // 已选中
          this.ruleForm2.name = this.ruleForm2.code = '';
          this.centerDataList.content = [];
          // this.centerDataList = Object.assign(this.centerDataList, {content: []});
        } else {
          this.$refs.hospital.clearSelection();
          this.$refs.hospital.toggleRowSelection(row);
          this.hospitalSelection = Object.assign({}, row);
          // 开始选中
          if (!this.params_ruleForm.isContrast) {
            this.ruleForm2.name = row.hospitalDrugName;
            this.ruleForm2.code = '';
          } else {
            this.ruleForm2.name = '';
            this.ruleForm2.code = row.drugstoreDrugCode;
          }
          this.contrastSearch();
        }
      },
      contrastClick () {
        let that = this;
        if (!this.hospitalSelection.hospitalDrugCode) {
          that.$notice('请选择需要对照的医院药品');
          return false;
        }
        if (!this.drugSelection.code) {
          that.$notice('请选择需要对照的药店药品目录');
          return false;
        }
        if (!this.params_ruleForm.isContrast) {
          that.$axios({
            method: 'post',
            headers: { 'Authorization': this.token },
            url: '/peps/drug/contrast/handAdd?t=' + (+new Date()),
            data: {
              'hospitalId': this.hospitalSelection.hospitalId,
              'hospitalDrugId': this.hospitalSelection.hospitalDrugId,
              'hospitalDrugCode': this.hospitalSelection.hospitalDrugCode,
              'hospitalCode': this.hospitalSelection.hospitalCode,
              'drugstoreId': this.drugSelection.drugstoreId,
              'drugstoreDrugId': this.drugSelection.id,
              'code': this.drugSelection.code,
              'commonName': this.drugSelection.commonName,
              'name': this.drugSelection.name,
              'spec': this.drugSelection.spec,
              'type': this.drugSelection.type,
              'manufacturer': this.drugSelection.manufacturer
            }
          }).then((response) => {
            if (response.data.code === 0) {
              that.$notice('对照成功');
              that.getDataList(that.currentPageNo, that.currentPageSize);
              this.centerDataList = {};
              this.hospitalSelection = {};
              this.drugSelection = {};
            } else {
              that.$notice('对照失败');
            }
          }).catch((error) => {
            console.log(error);
          });
        } else {
          that.$axios({
            method: 'get',
            headers: { 'Authorization': this.token },
            url: '/peps/drug/contrast/delete?t=' + (+new Date()),
            params: {
              id: this.hospitalSelection.id
            }
          }).then((response) => {
            if (response.data.code === 0) {
              that.$notice('已取消对照');
              that.getDataList(that.currentPageNo, that.currentPageSize);
              this.centerDataList = {};
              this.hospitalSelection = {};
              this.drugSelection = {};
            } else {
              that.$notice('对照失败');
            }
          }).catch((error) => {
            console.log(error);
          });
        }
      },
      progressInterval () {
        let that = this;
        that.progressIsShow = true;
        that.progressPercentage = 3;
        let interval = setInterval(() => {
          if (that.progressPercentage >= 80) {
            clearInterval(interval);
          } else {
            let progressRandom = Math.random();
            progressRandom = progressRandom * 10;
            progressRandom = Math.ceil(progressRandom);
            that.progressPercentage = that.progressPercentage + progressRandom;
          }
        }, 350);
      },
      autoContrastClick () {
        let that = this;
        this.$alert('您确定进行自动对照吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.progressInterval();
          that.$axios({
            method: 'post',
            headers: { 'Authorization': this.token },
            url: '/peps/drug/contrast/autoAdd?t=' + (+new Date()),
            data: {
              'hospitalId': that.params_ruleForm.hospitalId,
              'drugstoreId': that.$getUserInfo().orgId
            }
          }).then((response) => {
            let data = response.data;
            if (data.code == '0') {
              that.progressPercentage = 100;
              that.$alert('自动对照成功', '提示', {
                confirmButtonText: '确定',
                type: 'success'
              }).then(() => {
                that.progressIsShow = false;
              }).catch(() => {
                that.progressIsShow = false;
              });
            } else {
              that.$alert('自动对照失败，请联系管理员!', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              }).then(() => {
                that.progressIsShow = false;
              }).catch(() => {
                that.progressIsShow = false;
              });
            }
          }).catch((error) => {
            that.$alert('自动对照处理异常，请联系管理员！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              that.progressIsShow = false;
            }).catch(() => {
              that.progressIsShow = false;
            });
            console.log(error);
          });
        }).catch(() => {});
      },
      handleSelection (selection, row) { // 单选 方法
        if (this.drugSelection.code == row.code) {
          this.$refs.drugstore.clearSelection();
          this.drugSelection = {};
        } else {
          this.$refs.drugstore.clearSelection();
          this.$refs.drugstore.toggleRowSelection(row);
          this.drugSelection = Object.assign({}, row);
        }
      },
      reset () {
        // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.ruleForm.resetFields();
        // 初始化注册data
        // Object.assign(this.$data, this.$options.data());
        Object.keys(this.ruleForm).forEach(item => {
          this.ruleForm[item] = '';
        });
        // 初始化data默认值及页面
        this.initPage();
      },
      contrastReset () {
        // 区域对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$refs.ruleForm2.resetFields();
        // 初始化注册data
        Object.keys(this.ruleForm2).forEach(item => {
          this.ruleForm2[item] = '';
        });
        // 初始化data默认值及页面
        this.contrastSearch();
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
  .drugContrast .centerContainer .el-form .el-form-item .input-large {
    width: 148.5px;
  }
  .drugContrast .searchTitle {
    font-size: 16px;
    font-family: 'Microsoft YaHei';
    display: block;
    margin-bottom: 10px
  }
</style>
<style>
  .drugContrast .tableRowColor {
    color: #ffbd30;
  }
  .drugContrast .cloud-search-list {
    padding: 0;
    padding-top: 10px;
  }
  .drugContrast {
    padding-top: 0;
  }
  .drugContrast .mod-title {
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
  }
  .drugContrast .el-icon-search {
    font-weight: 900;
    margin-right: 5px;
  }
  .drugContrast .formItem {
    margin-bottom: 5px;
  }
  .drugContrast .centerContainer .el-form .el-form-item .el-input--suffix {
    width: 215px;
  }
  .drugContrast .el-form .el-form-item .contrast-btn {
    width: 81px;
  }
  .drugContrast .progressPosition {
    z-index: 1001;
    left: 194px;
    bottom: 10px;
    position: fixed;
    width: calc(100% - 194px);
  }
  .drugContrast .el-form .el-button {
    padding: 7px 14px;
  }
</style>
