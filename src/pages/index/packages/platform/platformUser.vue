<template>
  <div class="cloud-component">
    <div class="searchTitle">
      <span>用户管理</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="用户名称：">
          <el-input v-model.trim="ruleForm.name"
                    placeholder="请输入用户名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading" :disabled="disabledFlag">查询
          </el-button>
          <el-button @click="reset" size="mini" :disabled="disabledFlag">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <el-tabs v-model="activeName" @tab-click="handleClick" class="cus">
          <el-tab-pane label="医院" name="hospital">
          </el-tab-pane>
          <el-tab-pane label="平台管理员" name="platformManager">
          </el-tab-pane>
          <el-tab-pane label="监管机构" name="regulator">
          </el-tab-pane>
          <el-tab-pane label="药企" name="drugstoreCompany">
          </el-tab-pane>
        </el-tabs>
        <div class="clearfix">
          <div class="addButton clearfix">
            <el-button @click="add" size="mini" :disabled="disabledFlag">新建</el-button>
          </div>
        </div>
        <div class="box">
          <div class="nav-1"
               :style="{height: ((dataList.content && dataList.content.length>0)?(routerViewHeight*1-158):(routerViewHeight*1-129)) + 'px'}">
            <el-tree :data="treeList" :props="treeProps" highlight-current @node-click="handleNodeClick"
                     v-show="platformType !== 0" class="branchTree"></el-tree>
          </div>
          <div class="nav-2">
            <el-table
              :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-158):(routerViewHeight*1-129)"
              :data="dataList.content" stripe style="width: 100%" :empty-text="emptyText" v-loading="loading">
              <el-table-column prop="nickname" label="姓名"></el-table-column>
              <el-table-column prop="sex" label="性别">
                <template slot-scope='scope'>
                  {{scope.row.sex == '0' ? '女' : '男'}}
                </template>
              </el-table-column>
              <el-table-column prop="birthday" label="出生年月"></el-table-column>
              <el-table-column prop="telephone" label="联系电话"></el-table-column>
              <el-table-column prop="roleName" label="角色"></el-table-column>
              <el-table-column prop="duties" label="职务"></el-table-column>
              <el-table-column label="账号状态">
                <template slot-scope="scope">
                  <span class='greenStatus' v-if="scope.row.isEnable">启用</span>
                  <span class='redStatus' v-else>禁用</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="changeStatus(scope.row)">
                    <template>
                      <i class="icon-unaccess" title="停用" v-if="scope.row.isEnable"></i>
                      <i class="icon-access" title="启用" v-else></i>
                    </template>
                  </el-button>
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
          </div>
        </div>
      </echarts-contain>
    </div>
    <!--新增/编辑用户弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="360px"
               @close="closeDialog">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="userRules" label-width="120px"
               class="el-dialog--center systemDirectoryDialog" @submit.native.prevent>
        <el-form-item :label="orgNameForLabel" prop="orgName" v-if="platformType !== 0">
          <el-input v-model.trim="ruleFormDialog.orgName" :maxlength="20" disabled></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名：" prop="nickname">
          <el-input v-model.trim="ruleFormDialog.nickname" placeholder="请输入姓名" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="出生日期：" prop="birthday">
          <el-date-picker v-model="ruleFormDialog.birthday" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :editable="false"></el-date-picker>
        </el-form-item>
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
          <el-button type="primary" @click="saveDialog" size="mini">确定</el-button>
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
  name: 'hospitalDrugDirectory',
  mixins: [],
  data () {
    return {
      activeName: 'hospital',
      ruleForm: {
        name: ''
      },
      params_ruleForm: {
        name: ''
      },
      dataList: {},
      loading: false,
      pageNo: '',
      pageSize: 10,
      currentPageNo: '',
      currentPageSize: '',
      emptyText: '',
      elementLoadingText: '',
      treeProps: {
        children: 'children',
        label: 'labelName'
      },
      tableData: [],
      treeList: [],
      treeRequestUrl: '/management/hospital/getAllHospitalInfo',
      dialogVisible: false,
      dialogTitle: '',
      ruleFormDialog: {
        id: '',
        nickname: '',
        roleId: '',
        birthday: '',
        duties: '',
        sex: 0,
        telephone: '',
        orgId: '',
        orgName: ''
      },
      userRules: {
        nickname: [
          {required: true, message: '姓名不能为空！', trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: '角色不能为空！', trigger: 'blur', type: 'number'}
        ],
        birthday: [
          {required: true, message: '出生日期不能为空！', trigger: 'blur'}
        ],
        duties: [
          {required: true, message: '职务不能为空！', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '性别不能为空！', trigger: 'blur', type: 'number'}
        ],
        telephone: [
          {required: true, message: '手机号码不能为空！', trigger: 'blur'}
        ]
      },
      currOrg: {},
      currOrgId: '',
      keyName: 'hospitalName',
      platformType: 2, // 平台类型：医院端
      disabledFlag: true,
      orgNameForLabel: '医院名称'
    };
  },
  watch: {
    platformType (val) {
      switch (val) {
        case 0:
          this.disabledFlag = false;
          break;
        case 1:
          this.keyName = 'regulatorName';
          this.disabledFlag = true;
          this.orgNameForLabel = '监管机构名称';
          break;
        case 2:
          this.keyName = 'hospitalName';
          this.disabledFlag = true;
          this.orgNameForLabel = '医院名称';
          break;
        case 3:
          this.keyName = 'drugstoreName';
          this.disabledFlag = true;
          this.orgNameForLabel = '药房名称';
          break;
        default:
          console.log(this.disabledFlag);
      }
    },
    currOrgId (val) {
      if (this.platformType !== 0) {
        if (val !== '') {
          this.disabledFlag = false;
        } else {
          this.disabledFlag = true;
        }
      }
      console.log('currOrgId', val);
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
    changeStatus (row) {
      let that = this;
      let tips = '';
      let rowStatus = '';
      if (row.isEnable == true) {
        tips = '停用';
        rowStatus = false;
      } else {
        tips = '启用';
        rowStatus = true;
      }
      that.$confirm('确定是否' + tips + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          id: row.id,
          isEnable: rowStatus
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': this.token},
          url: '/peps/management/user/changeEnable?t=' + (+new Date()),
          data: formData
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
    add () {
      this.dialogTitle = '添加用户';
      this.dialogVisible = true;
      this.userOption = 'add';

      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      // console.log('ruleFormDialog', this.ruleFormDialog);
      // console.log('keyName', this.keyName);
      // console.log('currOrg', this.currOrg[this.keyName]);
      this.ruleFormDialog.sex = 0;
      // this.ruleFormDialog.platformType = 0;
      this.ruleFormDialog.orgId = this.currOrg.id;
      this.ruleFormDialog.orgName = this.currOrg[this.keyName];
    },
    edit (row) {
      this.dialogTitle = '编辑用户';
      this.dialogVisible = true;
      this.userOption = 'edit';
      this.currId = row.id;
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
    },
    saveDialog () {
      let that = this;

      that.$refs.ruleFormDialog.validate((valid) => {
        if (!valid) {
          return false;
        }
        let formData = {
          nickname: that.ruleFormDialog.nickname,
          // roleId: that.ruleFormDialog.roleId,
          birthday: that.ruleFormDialog.birthday,
          duties: that.ruleFormDialog.duties,
          sex: that.ruleFormDialog.sex,
          telephone: that.ruleFormDialog.telephone,
          platformType: that.platformType,
          orgId: (that.platformType === 0 ? 0 : that.ruleFormDialog.orgId),
          orgName: (that.platformType === 0 ? 0 : that.ruleFormDialog.orgName)

        };
        if (that.platformType === 2) {
          formData.orgCode = that.currOrg.hospitalCode;
        }
        if (that.userOption === 'add') {
          that.saveUrl = '/peps/management/user/platformAddAdminUser?t=' + (+new Date());
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
      this.$refs.ruleFormDialog.clearValidate();
      this.dialogVisible = false;
    },
    handleNodeClick (data) {
      this.currOrg = data;
      this.currOrgId = data.id;
      this.ruleForm.name = '';
      this.search();
    },
    handleClick (item) {
      let that = this;
      this.ruleForm.name = '';
      switch (item.name) {
        case 'hospital':
          that.treeRequestUrl = '/management/hospital/getAllHospitalInfo';
          that.platformType = 2;
          break;
        case 'regulator':
          that.treeRequestUrl = '/management/regulator/search/list';
          that.platformType = 1;
          break;
        case 'platformManager':
          that.treeRequestUrl = '';
          that.platformType = 0;
          break;
        case 'drugstoreCompany':
          that.treeRequestUrl = '/management/drugstore/getDrugstoreCompanyInfo';
          that.platformType = 3;
          break;
        default:
      }
      that.currOrgId = '';
      that.currOrg = {};
      that.dataList.content = [];
      that.emptyText = '点击左侧选择组织机构';
      console.log(that.platformType + ' : ' + that.disabledFlag);
      if (item.name == 'platformManager') {
        that.search();
      } else {
        that.getTreeList();
      }
    },
    initPage () {
      this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
      this.token = this.userLogin.data;
      this.search();
      this.getTreeList();
    },
    getTreeList () {
      let that = this;
      that.treeList = [];
      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps' + that.treeRequestUrl + '?t=' + (+new Date())
      }).then((response) => {
        let data = response.data;
        if (data.code == '0') {
          data.data.map(function (item) {
            item.labelName = item[that.keyName];
            that.treeList.push(item);
          });
        } else {
          that.$warning();
        }
      }).catch((error) => {
        that.loading = false;
        console.log(error);
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
      if (that.platformType === 0 || that.currOrgId !== '') {
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.loading = true;
        that.emptyText = emptyText;
        let formData = {
          'pageIndex': pageNo,
          'itemCountPerPage': pageSize,
          args: {
            'nickname': that.params_ruleForm.name,
            'selectOrgId': that.platformType === 0 ? 0 : that.currOrgId
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
  .addButton {
    margin: 0 8px 20px;
  }

  .box {
    display: flex;
  }

  .box .nav-1 {
    width: 15%;
    overflow: auto;
  }

  .box .nav-2 {
    width: 85%;
  }

  .unaccesshover {
  }

  .edithover {

  }
</style>

<style>

</style>
