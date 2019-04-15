<template>
  <div class="cloud-component">
    <div class="searchTitle">
      <span>角色管理</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="角色名称：">
          <el-input v-model.trim="ruleForm.name"
                    placeholder="请输入角色名称" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item class="ml30">
          <el-button type="primary" @click="search" size="mini" :loading="loading">查询</el-button>
          <el-button @click="reset" size="mini">重置</el-button>
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
          <el-table-column prop="code" label="角色编码" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="name" label="角色名称" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="description" label="角色描述" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="isEnable" label="角色状态" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class='greenStatus' v-if="scope.row.isEnable">有效</span>
              <span class='redStatus' v-else>无效</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="assign(scope.row)" style="margin-left: 8px">
                <i class="icon-fenpeiquanxian" title="分配权限"></i>
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
    <!--新增/编辑角色弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" width="380px"
               @close="closeRoleDialog" class="systemDirectoryDialog">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules" label-width="90px"
               class="el-dialog--center" @submit.native.prevent>
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model.trim="ruleFormDialog.name" placeholder="请输入角色名称" :maxlength="20"
                    :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="有效性：" prop="isEnable">
          <template>
            <el-radio v-model="ruleFormDialog.isEnable" :label="true">有效</el-radio>
            <el-radio v-model="ruleFormDialog.isEnable" :label="false">无效</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="角色描述：" prop="description">
          <el-input v-model.trim="ruleFormDialog.description" placeholder="请输入角色描述(不超过50个字)" :rows="4" :maxlength="50"
                    :clearable="true" type="textarea" resize="none"></el-input>
        </el-form-item>

        <div class="el-dialog--center">
          <el-button @click="closeRoleDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveRoleDialog" size="mini">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 分配权限弹框 -->
    <el-dialog title="设置角色权限" :visible.sync="permissionDialogVisible" :append-to-body="true" width="380px"
               @close="closePermissionDialog">
      <el-tree :data="permissionList" :props="permissionProps" node-key="id" show-checkbox class="branchTree"
               ref="permissionTree" default-expand-all></el-tree>
      <div class="el-dialog--center">
        <el-button @click="closePermissionDialog" size="mini">取消</el-button>
        <el-button type="primary" @click="savePermission" size="mini">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from 'components/utils';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import { pageSize, pageNo, emptyText, elementLoadingText } from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';

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
      roleOption: '',
      saveUrl: '',
      ruleFormDialog: {
        name: '', // 药品编码
        isEnable: '', // 药品通用名
        description: ''// 药品名称
      },
      dialogRules: {
        name: [
          {required: true, message: '角色名称不能为空！', trigger: 'blur'}
        ],
        isEnable: [
          {required: true, message: '有效性不能为空！', trigger: 'blur', type: 'boolean'}
        ],
        description: [
          {required: true, message: '角色描述不能为空！', trigger: 'blur'}
        ]
      },
      permissionDialogVisible: false,
      permissionList: [],
      permissionProps: {
        children: 'children',
        label: 'name'
      },
      currTarget: {},
      currRoleId: ''
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
    assign (row) {
      let that = this;
      that.currTarget = row;
      this.permissionDialogVisible = true;

      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/management/menu/queryMenuByRoleId?t=' + (+new Date()),
        params: {
          roleId: that.currTarget.id
        }
      }).then((response) => {
        let data = response.data;

        if (data.code == '0') {
          let selectedKeys = data.data.map(function (item) {
            if (item.level === 3) {
              return item.id;
            }
          });
          this.$refs.permissionTree.setCheckedKeys(selectedKeys);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    closePermissionDialog () {
      this.permissionDialogVisible = false;
      this.$refs.permissionTree.setCheckedKeys([]);
    },
    savePermission () {
      let that = this;
      let menuIds = [];
      menuIds = this.$refs.permissionTree.getCheckedKeys();
      if (this.$refs.permissionTree.getCheckedNodes().length > 0) {
        this.$refs.permissionTree.getCheckedNodes().forEach(item => {
          menuIds.push(item.parentId);
          menuIds = Array.from(new Set(menuIds));
        });
      } else {
        that.$notice('请选择至少选择一个菜单');
        return false;
      }

      let formData = {
        description: that.currTarget.description,
        id: that.currTarget.id,
        isEnable: that.currTarget.isEnable,
        menuIds: menuIds.join(','),
        name: that.currTarget.name
      };

      that.$axios({
        method: 'post',
        headers: {'Authorization': that.token},
        url: '/peps/management/role/permissionAssignment?t=' + (+new Date()),
        data: formData
      }).then((response) => {
        let data = response.data;
        if (data.code == '0') {
          that.$notice(data.message);
          that.closePermissionDialog();
        } else {
          that.$warning(data.message);
        }
      }).catch((error) => {
        that.loading = false;
        console.log(error);
      });
    },
    getPermissionTree () {
      let that = this;
      that.$axios({
        method: 'get',
        headers: {'Authorization': that.token},
        url: '/peps/management/menu/queryMenuByRole?t=' + (+new Date())

      }).then((response) => {
        let data = response.data;

        if (data.code == '0') {
          let tempList = [];
          data.data.map(item => {
            if (item.level === 2) {
              item.children = [];
              that.permissionList.push(item);
            } else {
              tempList.push(item);
            }
          });

          tempList.forEach(child => {
            that.permissionList.forEach(parent => {
              if (child.level === 3) {
                if (child.parentId === parent.id) {
                  parent.children.push(child);
                }
              }
            });
          });
        } else {
          that.$warning(data.message);
        }
      }).catch((error) => {
        that.loading = false;
        console.log(error);
      });
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
      this.getPermissionTree();
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
        url: '/peps/management/role/queryRoleByNamePage?t=' + (+new Date()),
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
    add (row) {
      this.dialogTitle = '添加角色';
      this.dialogVisible = true;
      this.roleOption = 'add';

      for (let key in row) {
        this.ruleFormDialog[key] = '';
      }
      this.ruleFormDialog.isEnable = true;
    },
    edit (row) {
      this.dialogTitle = '编辑角色';
      this.dialogVisible = true;
      this.roleOption = 'edit';
      this.currRoleId = row.id;
      for (let key in row) {
        this.ruleFormDialog[key] = row[key];
      }
    },
    saveRoleDialog () {
      let that = this;
      let formData = {};
      that.$refs.ruleFormDialog.validate((valid) => {
        if (!valid) {
          return false;
        }

        if (that.roleOption === 'add') {
          formData = {
            name: that.ruleFormDialog.name,
            isEnable: that.ruleFormDialog.isEnable,
            description: that.ruleFormDialog.description
          };
          that.saveUrl = '/peps/management/role/addDrugstoreRole?t=' + (+new Date());
        } else {
          formData = {
            name: that.ruleFormDialog.name,
            isEnable: that.ruleFormDialog.isEnable,
            description: that.ruleFormDialog.description,
            id: that.currRoleId
          };
          that.saveUrl = '/peps/management/role/updateRole?t=' + (+new Date());
        }

        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: that.saveUrl,
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.closeRoleDialog();
            that.$message({
              message: data.message,
              type: 'notice'
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
    closeRoleDialog () {
      for (let key in this.ruleFormDialog) {
        this.ruleFormDialog[key] = '';
      }
      this.$refs.ruleFormDialog.clearValidate();
      this.dialogVisible = false;
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
          method: 'post',
          headers: {'Authorization': this.token},
          url: '/peps/management/role/deleteRole?t=' + (+new Date()),
          data: formData
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
      }).catch(() => { });
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

  .el-tree {
    height: 300px;
    margin-bottom: 15px;
    overflow: auto;
  }
</style>

<style>

</style>
