<template>
  <div class="cloud-component">
    <div class="searchTitle">
      <span>用户管理</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small clearfix">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="用户名称：">
          <el-input v-model.trim="ruleForm.name"
                    placeholder="请输入用户姓名" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading" :disabled="currOrgId == ''">查询
          </el-button>
          <el-button @click="reset" size="mini" :disabled="currOrgId == ''">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="addButton">
        <el-button @click="add" size="mini" :disabled="currOrgId == ''">新建</el-button>
      </div>
    </div>

    <!--搜索结果-->
    <div class="cloud-search-list">
      <!-- 左侧药店树 -->
      <el-tree :data="branchList" :props="branchProps" accordion @node-click="handleNodeClick"
               :expand-on-click-node="false" class="branchTree" default-expand-all
               :style="{height: ((dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)) + 'px'}"></el-tree>
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-table
          :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
          :data="dataList.content" style="width: 100%" v-loading="loading"
          :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="nickname" label="姓名" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="sex" label="性别" min-width="10%" show-overflow-tooltip>
            <template slot-scope='scope'>
              {{scope.row.sex == '0' ? '女' : '男'}}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="" label="出生年月" min-width="16%" show-overflow-tooltip>
          </el-table-column> -->
          <el-table-column prop="telephone" label="联系电话" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="roleName" label="角色" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="duties" label="职务" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="orgName" label="医院" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="edit(scope.row)" style="margin-left: 8px">
                <i class="icon-edit" title="编辑"></i>
              </el-button>
              <el-button type="text" size="small" @click="resetPwd(scope.row)">
                <template>
                  <i class="icon-chongzhimima" title="重置密码"></i>
                </template>
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
    <!--新增/编辑用户弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="380px"
               @close="closeDialog">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="userRules" label-width="120px"
               class="el-dialog--center systemDirectoryDialog" @submit.native.prevent>
        <el-form-item label="姓名：" prop="nickname">
          <el-input v-model.trim="ruleFormDialog.nickname" placeholder="请输入姓名" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleId">
          <el-select v-model.trim="ruleFormDialog.roleId" placeholder="请选择角色" :clearable="true">
            <el-option v-for="(item,index) in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="出生日期：" prop="birthdate">
          <el-date-picker v-model="ruleFormDialog.birthdate" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="职务：" prop="duties">
          <el-input v-model.trim="ruleFormDialog.duties" placeholder="请输入职务" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <template>
            <el-radio v-model="ruleFormDialog.sex" :label="0">女</el-radio>
            <el-radio v-model="ruleFormDialog.sex" :label="1">男</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="手机号码：" prop="telephone">
          <el-input v-model.trim="ruleFormDialog.telephone" placeholder="请输入手机号码" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="closeDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveUserDialog" size="mini">确定</el-button>
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

      dialogTitle: '',
      dialogVisible: false,
      userOption: '',
      disabledFlag: false,
      saveUrl: '',
      ruleFormDialog: {
        id: '',
        nickname: '',
        roleId: '',
        // birthdate: '',
        duties: '',
        sex: 0,
        telephone: '',
        platformType: 3, // 平台类型：药店端
        orgId: ''
      },
      userRules: {
        nickname: [
          {required: true, message: '姓名不能为空！', trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: '角色不能为空！', trigger: 'blur', type: 'number'}
        ],
        // birthdate:[
        //   {required: true, message:'出生日期不能为空！',trigger: 'blur'}
        // ],
        duties: [
          {required: true, message: '职务不能为空！', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '性别不能为空！', trigger: 'blur', type: 'number'}
        ],
        telephone: [
          {required: true, message: '手机号码不能为空！', trigger: 'blur'}
        ],
        platformType: [
          {default: 3, type: 'number'}
        ]
      },
      branchList: [],
      branchProps: {
        children: 'children',
        label: 'drugstoreName'
      },
      currOrgId: '', // 当前选中机构id
      currOrgName: '', // 当前选中机构名称
      curId: '', // 当前用户id
      roleList: []
    };
  },
  watch: {
    'ruleFormDialog.roleId': function (val) {
      console.log(val);
    }
  },
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
      this.elementLoadingText = elementLoadingText;
      this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
      this.token = this.userLogin.data;
      this.search();
      this.getBranch();
      this.getRoleList();
      this.emptyText = '点击左侧选择组织机构';
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
    // 获取角色列表
    getRoleList () {
      let that = this;

      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/management/role/queryRoleInfo?t=' + (+new Date())
      }).then((response) => {
        let data = response.data;
        that.loading = false;
        if (data.code == '0') {
          that.roleList = data.data;
        } else {
          that.$warning(data.message);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    // 获取左侧药店树
    getBranch () {
      let that = this;

      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/management/drugstore/getDrugstoreInfoAndBranchByCurrentUser?t=' + (+new Date())
      }).then((response) => {
        let data = response.data;
        that.loading = false;
        if (data.code == '0') {
          that.branchList.push(data.data.drugstore);
          that.branchList[0].children = data.data.list;
        } else {
          that.$warning(data.message);
        }
      }).catch((error) => {
        that.loading = false;
        console.log(error);
      });
    },
    getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
      let that = this;

      if (that.currOrgId !== '') {
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.emptyText = emptyText;
        that.loading = true;
        let formData = {
          'pageIndex': pageNo,
          'itemCountPerPage': pageSize,
          args: {
            nickname: that.params_ruleForm.name,
            selectOrgId: that.currOrgId
          }
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: '/peps/management/user/queryUserByNicknamePage?t=' + (+new Date()),
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
      } else {
        that.emptyText = '点击左侧选择组织机构';
      }
    },
    add () {
      this.dialogTitle = '添加用户';
      this.dialogVisible = true;
      this.disabledFlag = false;
      this.userOption = 'add';

      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.ruleFormDialog.sex = 0;
      this.ruleFormDialog.platformType = 3;
    },
    edit (row) {
      this.dialogTitle = '编辑用户';
      this.dialogVisible = true;
      this.userOption = 'edit';
      this.disabledFlag = true;
      this.currId = row.id;
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
    },
    saveUserDialog () {
      let that = this;

      that.$refs.ruleFormDialog.validate((valid) => {
        if (!valid) {
          return false;
        }

        let formData = {
          nickname: that.ruleFormDialog.nickname,
          roleId: that.ruleFormDialog.roleId,
          // birthdate: that.ruleFormDialog.birthdate,
          duties: that.ruleFormDialog.duties,
          sex: that.ruleFormDialog.sex,
          telephone: that.ruleFormDialog.telephone,
          platformType: that.ruleFormDialog.platformType,
          orgId: that.currOrgId,
          orgName: that.currOrgName
        };
        if (that.userOption === 'add') {
          that.saveUrl = '/peps/management/user/addUser?t=' + (+new Date());
        } else {
          formData.id = that.currId;
          that.saveUrl = '/peps/management/user/updateUser?t=' + (+new Date());
        }
        console.log('formData', formData);
        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: that.saveUrl,
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.$message({
              message: data.message,
              type: 'notice'
            });
            that.closeDialog();
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
    closeDialog () {
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.ruleFormDialog.platformType = 3;
      this.$refs.ruleFormDialog.clearValidate();
      this.dialogVisible = false;
    },
    resetPwd (row) {
      let that = this;
      that.$confirm('确认重置密码？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          id: row.id,
          password: '123456',
          department: row.department,
          nickname: row.nickname,
          orgCode: row.orgCode,
          orgId: row.orgId,
          orgName: row.orgName,
          roleId: row.roleId,
          selectOrgId: that.currOrgId,
          sex: row.sex,
          telephone: row.telephone,
          isEnable: row.isEnable
        };

        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: '/peps/management/user/resetPassword?t=' + (+new Date()),
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.$notice(data.message || '密码重置成功');
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          console.log(error);
        }).catch(() => {
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
          userId: row.id
        };
        that.$axios({
          method: 'get',
          headers: {'Authorization': this.token},
          url: '/peps/management/user/delete?t=' + (+new Date()),
          params: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.$notice(data.message || '删除成功');
            that.getDataList();
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          console.log(error);
        }).catch(() => {
        });
      }).catch(() => {
      });
    },
    handleNodeClick (data) {
      this.currOrgId = data.id;
      this.currOrgName = data.drugstoreName;
      this.ruleForm.name = '';
      this.getDataList();
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

  .cloud-search-list {
    position: relative;
    padding-left: 240px;

  }

  .el-tree {
    position: absolute;
    top: 10px;
    left: 0;
    width: 220px;
    bottom: 0;
  }

  .cloud-search {
    border-bottom: none;
  }

  .el-tree {
    overflow: auto;
  }
</style>

<style>

</style>
