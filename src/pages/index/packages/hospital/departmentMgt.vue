<template>
  <!--<template><div>科室管理 departmentMgt</div></template>-->
  <div class="cloud-component departmentMgt">
    <div class="searchTitle">
      <span>科室管理</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="科室名称：">
          <el-input v-model.trim="ruleForm.department"
                    placeholder="请输入科室名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading">查询</el-button>
          <el-button @click="reset" size="mini">重置</el-button>
          <span class="delimiter"></span>
          <el-upload style="display: inline-block" ref="upload" action="/peps/management/hospital/department/batchAdd"
                     :on-success="handleOnSuccess" :on-progress="handleOnProgress" :on-error="handleOnError"
                     :show-file-list="false" :headers="{'Authorization':token}"
                     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            <el-button slot="trigger" type="primary" size="mini" :loading="uploading">{{uploading ? '导入中...' : '导入科室'}}
            </el-button>
          </el-upload>
          <el-button @click="download" size="mini">导出模板</el-button>
        </el-form-item>
      </el-form>
      <div class="addButton">
        <el-button @click="add" size="mini">新增</el-button>
      </div>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column label="科室编码：" prop='departmentCode' min-width="12%"></el-table-column>
          <el-table-column label="一级科室：" prop='firstLevel' min-width="12%"></el-table-column>
          <el-table-column label="二级科室：" prop='secondLevel' min-width="12%"></el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit(scope.row)" style="margin-left: 8px">
                <i class="icon-edit" title="编辑"></i>
              </el-button>
              <el-button type="text" size="small" @click="deleteThis(scope.row.id)">
                <i class="icon-delete" title="删除"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>
    <!--新增/编辑医生弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="400px"
               @close="cancelDrugDialog">
      <el-form :inline="true" :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules" label-width="90px"
               class="el-dialog--center" @submit.native.prevent>
        <el-form-item label="科室编码：" prop='departmentCode'>
          <el-input v-model.trim="ruleFormDialog.departmentCode" placeholder="请输入科室编码" :maxlength="40" :clearable="true"
                    :disabled="disabledFlag"></el-input>
        </el-form-item>
        <el-form-item label="一级科室：" prop='firstLevel'>
          <el-input v-model.trim="ruleFormDialog.firstLevel" placeholder="请输入一级科室" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="二级科室：" prop='secondLevel'>
          <el-input v-model.trim="ruleFormDialog.secondLevel" placeholder="请输入二级科室" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="cancelDrugDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveDrugDialog" size="mini">确定</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import utils from 'components/utils';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';

export default {
  name: 'departmentMgt',
  mixins: [],
  data () {
    return {
      ruleForm: {
        name: ''
      },
      params_ruleForm: {
        name: ''
      },
      dataList: {},
      loading: false,
      uploading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
      disabledFlag: false,
      dialogTitle: '',
      dialogVisible: false,
      ruleFormDialog: {
        departmentCode: '',
        firstLevel: '',
        secondLevel: ''
      },
      dialogRules: {
        departmentCode: [
          {required: true, message: '科室编码不能为空！', trigger: 'blur'}
        ],
        secondLevel: [
          {required: true, message: '二级科室不能为空！', trigger: 'blur'}
        ]
      }
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
    download () {
      let that = this;
      let hospitalName = '科室目录.xlsx';
      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        responseType: 'blob',
        url: '/peps/management/hospital/department/download?v=' + (+new Date())
      }).then((response) => {
        let blob = new Blob([response.data]);
        that.$download(hospitalName, blob);
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
        'pageNumber': pageNo,
        'pageSize': pageSize,
        Authorization: that.token,
        department: that.ruleForm.department
      };
      that.$axios({
        method: 'get',
        headers: {'Authorization': this.token},
        url: '/peps/management/hospital/department/search?v=' + (+new Date()),
        params: formData
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
    add () {
      this.dialogTitle = '添加科室';
      this.dialogVisible = true;
      this.disabledFlag = false;
      this.drugOption = 'add';
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
    },
    edit (row) {
      this.dialogTitle = '编辑科室信息';
      this.disabledFlag = false;
      this.dialogVisible = true;
      this.drugOption = 'edit';
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
    },
    saveDrugDialog () {
      // this.dialogVisible = false;

      let that = this;
      var formData = {};
      that.$refs.ruleFormDialog.validate((valid) => {
        if (!valid) {
          return false;
        }
        if (that.drugOption === 'add') {
          formData = {
            'departmentCode': that.ruleFormDialog.departmentCode,
            'firstLevel': that.ruleFormDialog.firstLevel,
            'secondLevel': that.ruleFormDialog.secondLevel
          };
          that.saveUrl = '/peps/management/hospital/department/add?v=' + (+new Date());
        } else {
          formData = {
            'departmentCode': that.ruleFormDialog.departmentCode,
            'firstLevel': that.ruleFormDialog.firstLevel,
            'secondLevel': that.ruleFormDialog.secondLevel,
            'id': that.ruleFormDialog.id
          };
          that.saveUrl = '/peps/management/hospital/department/update?v=' + (+new Date());
        }
        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: that.saveUrl,
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            that.dialogVisible = false;
            that.getDataList();
          } else {
            that.$warning(response.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      });
    },
    handleOnSuccess (response, file, fileList) {
      this.uploading = false;
      console.log(response);
      if (response.code == '0') {
        this.$confirm(response.message, '批量上传成功', {
          confirmButtonText: '确定',
          type: 'success',
          showCancelButton: false
        }).then(() => {
          this.getDataList();
        }).catch(() => {
          this.getDataList();
        });
      } else {
        this.$confirm(response.message, '批量上传失败', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        }).then(() => {

        }).catch(() => {

        });
      }
    },
    handleOnError (err, file, fileList) {
      this.uploading = false;
      this.$confirm(`批量上传失败！`, '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showCancelButton: false
      }).then(() => {

      }).catch(() => {

      });
      if (err) throw err;
    },
    handleOnProgress (event, file, fileList) {
      this.uploading = true;
    },

    cancelDrugDialog () {
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.$refs.ruleFormDialog.clearValidate();

      this.dialogVisible = false;
    },
    changeStatus (row) {
      let that = this;
      let tips = '';
      if (row.isEnable == true) {
        tips = '禁用';
      } else {
        tips = '启用';
      }
      that.$confirm('确定是否' + tips + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          id: row.id,
          isEnable: row.isEnable != true
        };
        that.$axios({
          method: 'POST',
          headers: {'Authorization': this.token},
          url: '/peps/management/user/changeEnable',
          data: formData
        }).then((response) => {
          if (response.data.code == 0) {
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            this.search();
          } else {
            that.$warning('修改状态失败');
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch({});
    },
    deleteThis (row) {
      let that = this;
      let tips = '删除此医生信息';
      that.$confirm('确定是否' + tips + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          id: row
        };
        that.$axios({
          method: 'get',
          headers: {'Authorization': this.token},
          url: '/peps/management/hospital/department/delete',
          params: formData
        }).then((response) => {
          if (response.data.code == 0) {
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            that.search();
          } else {
            that.$warning('修改状态失败');
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch({});
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
  .departmentMgt .el-form .el-form-item .el-input {
    width: 220px
  }

  .el-dialog .el-form .el-form-item .el-input {
    width: 220px
  }

</style>
