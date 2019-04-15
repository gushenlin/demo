<template>
  <div class="cloud-component drugstoreDirectory">
    <div class="searchTitle">
      <span>药店通用目录</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="药品名称：">
          <el-input v-model.trim="ruleForm.name" placeholder="请输入药品名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading">查询</el-button>
          <el-button @click="reset" size="mini">重置</el-button>
          <span class="delimiter"></span>
          <el-upload style="display: inline-block" ref="upload" action="/peps/drug/drugstore/batchAdd"
                     :on-success="handleOnSuccess" :on-progress="handleOnProgress" :on-error="handleOnError"
                     :show-file-list="false" :headers="{'Authorization':token}"
                     accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
            <el-button slot="trigger" type="primary" size="mini" :loading="uploading">{{uploading ? '导入中...' : '导入药品目录'}}
            </el-button>
          </el-upload>
          <!--<el-button type="primary" @click="search" size="mini">导入药品目录</el-button>-->
          <el-button @click="exportTemplate" size="mini" class="ml10">导出模板</el-button>
        </el-form-item>
      </el-form>
      <div class="addButton">
        <el-button @click="add" size="mini">新建</el-button>
      </div>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="code" label="药店药品编码" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="commonName" label="通用名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="商品名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="spec" label="药品规格" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="type" label="剂型" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="price" label="单价(元)" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家" min-width="18%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class='redStatus' v-if="scope.row.status == 0">下架</span>
              <span class='greenStatus' v-else>上架</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="changeStatus(scope.row)">
                <template>
                  <i class="icon-up" title="上架" v-if="scope.row.status == '0'"></i>
                  <i class="icon-down" title="下架" v-else></i>
                </template>
              </el-button>
              <el-button type="text" size="small" @click="edit(scope.row)" style="margin-left: 8px">
                <i class="icon-edit" title="编辑"></i>
              </el-button>
              <el-button type="text" size="small" @click="deleteItem(scope.row)">
                <i class="icon-delete" title="删除"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>
    <!--新增/编辑药品弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="380px"
               @close="closeDrugDialog">
      <el-form :inline="true" :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules" label-width="90px"
               class="el-dialog--center" @submit.native.prevent>
        <el-form-item label="药品编码：" prop="code">
          <el-input v-model.trim="ruleFormDialog.code" placeholder="请输入药品编码" :maxlength="20" :clearable="true"
                    :disabled="disabledFlag"></el-input>
        </el-form-item>
        <el-form-item label="通用名：" prop="commonName">
          <el-input v-model.trim="ruleFormDialog.commonName" placeholder="请输入药品通用名" :maxlength="30"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="商品名：" prop="name">
          <el-input v-model.trim="ruleFormDialog.name" placeholder="请输入药品商品名" :maxlength="30"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="spec">
          <el-input v-model.trim="ruleFormDialog.spec" placeholder="例如：0.6g*24片/盒" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="剂型：" prop="type">
          <el-input v-model.trim="ruleFormDialog.type" placeholder="例如：胶囊剂、片剂" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="单价：" prop="price">
          <el-input v-model.trim="ruleFormDialog.price" placeholder="请输入单价" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家：" prop="manufacturer">
          <el-input v-model.trim="ruleFormDialog.manufacturer" placeholder="请输入药品生产厂家" :maxlength="30"
                    :clearable="true"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="closeDrugDialog" size="mini">取消</el-button>
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
// import validation from 'components/utils/validation'

export default {
  name: 'drugstoreDirectory',
  mixins: [],
  data () {
    let priceValidator = (rule, value, callback) => {
      if (value && value.length > 10) {
        this.ruleFormDialog.price = value = value.substr(0, 10);
      }
      if (value === '') {
        callback(new Error('单价不能为空！'));
      } else if (!/^\d*(\.)?\d{0,2}$/.test(value)) {
        callback(new Error('请输入符合格式的数字'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: ''
      },
      params_ruleForm: {
        name: ''
      },
      dataList: {},
      loading: false,
      pageNo: '',
      pageSize: '',
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
      uploading: false,

      dialogTitle: '',
      dialogVisible: false,
      drugOption: '',
      disabledFlag: false,
      saveUrl: '',
      ruleFormDialog: {
        code: '', // 药品编码
        commonName: '', // 药品通用名
        name: '', // 药品名称
        spec: '', // 药品规格
        type: '', // 剂型
        price: '', // 单价
        manufacturer: ''// 生产厂商
      },
      dialogRules: {
        code: [
          {required: true, message: '药品编码不能为空！', trigger: 'blur'}
        ],
        commonName: [
          {required: true, message: '药品通用名不能为空！', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '药品名称不能为空！', trigger: 'blur'}
        ],
        spec: [
          {required: true, message: '药品规格不能为空！', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '剂型不能为空！', trigger: 'blur'}
        ],
        price: [
          {required: true, validator: priceValidator, trigger: 'blur'}
        ],
        manufacturer: [
          {required: true, message: '生产厂商不能为空！', trigger: 'blur'}
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
      this.token = this.userLogin.data;
      this.search();
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
          'name': that.params_ruleForm.name
        }
      };
      that.$axios({
        method: 'post',
        headers: {'Authorization': that.token},
        url: '/peps/drug/drugstore/search/page?t=' + (+new Date()),
        data: formData
      }).then((response) => {
        let data = response.data;
        that.loading = false;
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
    add () {
      this.dialogTitle = '添加药品';
      this.dialogVisible = true;
      this.disabledFlag = false;
      this.drugOption = 'add';
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
    },
    edit (row) {
      this.dialogTitle = '编辑药品';
      this.dialogVisible = true;
      this.drugOption = 'edit';
      this.disabledFlag = true;
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
    },
    saveDrugDialog () {
      let that = this;
      let formData = {};
      that.$refs.ruleFormDialog.validate((valid) => {
        if (!valid) {
          return false;
        }
        if (that.drugOption === 'add') {
          formData = {
            code: that.ruleFormDialog.code, // 药品编码
            commonName: that.ruleFormDialog.commonName, // 药品通用名
            name: that.ruleFormDialog.name, // 药品名称
            spec: that.ruleFormDialog.spec, // 药品规格
            type: that.ruleFormDialog.type, // 剂型
            price: that.ruleFormDialog.price, // 单价
            manufacturer: that.ruleFormDialog.manufacturer// 生产厂商
          };
          that.saveUrl = '/peps/drug/drugstore/add?t=' + (+new Date());
        } else {
          formData = {
            filter: {
              code: that.ruleFormDialog.code, // 药品编码
              id: that.ruleFormDialog.id, // 药品id
              commonName: that.ruleFormDialog.commonName, // 药品通用名
              name: that.ruleFormDialog.name, // 药品名称
              drugstoreId: that.ruleFormDialog.drugstoreId// 药店id
            },
            record: {
              code: that.ruleFormDialog.code, // 药品编码
              commonName: that.ruleFormDialog.commonName, // 药品通用名
              name: that.ruleFormDialog.name, // 药品名称
              spec: that.ruleFormDialog.spec, // 药品规格
              type: that.ruleFormDialog.type, // 剂型
              price: that.ruleFormDialog.price, // 单价
              manufacturer: that.ruleFormDialog.manufacturer// 生产厂商
            }
          };
          that.saveUrl = '/peps/drug/drugstore/update?t=' + (+new Date());
        }
        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: that.saveUrl,
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.closeDrugDialog();
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            that.getDataList();
          } else {
            that.$message({
              message: data.message,
              type: 'notice'
            });
          }
        }).catch((error) => {
          console.log(error);
        });
      });
    },
    closeDrugDialog () {
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.$refs.ruleFormDialog.clearValidate();
      this.dialogVisible = false;
    },
    changeStatus (row) {
      let that = this;
      let tips = '';
      let rowStatus = '';
      if (row.status == '1') {
        tips = '下架';
        rowStatus = '0';
      } else {
        tips = '上架';
        rowStatus = '1';
      }
      that.$confirm('确定是否' + tips + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          id: row.id,
          status: rowStatus
        };
        that.$axios({
          method: 'get',
          headers: {'Authorization': this.token},
          url: '/peps/drug/drugstore/onSale?t=' + (+new Date()),
          params: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            that.getDataList();
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      }).catch(() => {
      });
    },
    deleteItem (row) {
      let that = this;
      that.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          id: row.id
        };
        that.$axios({
          method: 'get',
          headers: {'Authorization': this.token},
          url: '/peps/drug/drugstore/delete?t=' + (+new Date()),
          params: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.$message({
              type: 'success',
              message: '操作成功'
            });
            that.getDataList();
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          console.log(error);
        }).catch(() => {
        });
      }).catch(() => { });
    },
    exportTemplate () {
      let that = this;
      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        responseType: 'blob',
        url: '/peps/drug/drugstore/download?t=' + (+new Date())
      }).then((response) => {
        let blob = new Blob([response.data]);
        that.$download('药店通用目录.xlsx', blob);
      }).catch((error) => {
        console.log(error);
      });
    },

    handleOnSuccess (response, file, fileList) {
      this.uploading = false;
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
        this.$confirm(response.data.message, '批量上传失败', {
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
  .drugstoreDirectory .el-form .el-form-item .el-input {
    width: 220px
  }

  .el-dialog .el-form .el-form-item .el-input {
    width: 220px
  }

</style>

<style>

</style>
