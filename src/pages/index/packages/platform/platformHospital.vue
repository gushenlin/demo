<!--<template>医院管理 platformHospital</template>-->
<template>
  <div class="cloud-component platformHospital">
    <div class="searchTitle">
      <span>医院管理</span>
    </div>
    <!-- 搜索区域 -->
    <div class="cloud-search el-form-item-small">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item label="医院名称：">
          <el-input v-model.trim="ruleForm.hospitalName"
                    placeholder="请输入医院名称" :clearable="true"></el-input>
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
        <el-table :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
                  :data="dataList.content" style="width: 100%" v-loading="loading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="hospitalCode" label="医院编码" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalName" label="医院名称" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="address" label="所在地址" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="telephone" label="联系电话" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="linkman" label="负责人" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="hospitalLevel" label="医院级别" min-width="10%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="isEnable" label="状态" min-width="10%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class='redStatus' v-if="scope.row.isEnable == false">停用</span>
              <span class='greenStatus' v-else>启用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="changeStatus(scope.row)">
                <template>
                  <i class="icon-access" title="启用" v-if="scope.row.isEnable == false"></i>
                  <i class="icon-unaccess" title="停用" v-else></i>
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
    <!--新增/编辑医院弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" :inline="true"
               width="560px" @close="closeHospitalDialog" class="dialogHasArea">
      <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules"
               label-width="95px" class="el-dialog--center systemDirectoryDialog" @submit.native.prevent>
        <el-form-item label="医院编码：" prop="hospitalCode">
          <el-input v-model.trim="ruleFormDialog.hospitalCode" placeholder="请输入医院编码" :maxlength="40" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="医院名称：" prop="hospitalName">
          <el-input v-model.trim="ruleFormDialog.hospitalName" placeholder="请输入医院全称" :maxlength="40" :clearable="true"></el-input>
        </el-form-item>
        <el-area @select="areaSelect" class="el-area clearfix" provinceName ="地址：" :checkForm="true" ref="area"></el-area>
        <el-form-item prop="address">
          <el-input v-model.trim="ruleFormDialog.address" placeholder="请输入详细地址"
                    type="textarea" class="textarea" :maxlength="200" :clearable="true" resize="none"></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名：" >
          <el-input v-model.trim="ruleFormDialog.linkman" placeholder="请输入负责人姓名" :maxlength="20" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model.trim="ruleFormDialog.telephone" placeholder="请输入联系电话" :maxlength="20" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="医院级别：">
          <el-select v-model.trim="ruleFormDialog.hospitalLevel" placeholder="请选择医院级别">
            <el-option v-for="(item,index) in hospitalLevelList" :key="item.code" :label="item.desc" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <div class="el-dialog--center">
          <el-button @click="closeHospitalDialog" size="mini">取消</el-button>
          <el-button type="primary" @click="saveDrugDialog" size="mini">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import utils from 'components/utils';
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import {pageSize, pageNo, emptyText, elementLoadingText} from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';
  import dictionary from 'components/utils/dictionary';
  import area from 'components/packages/area/area';
  // import validation from 'components/utils/validation'
  export default {
    name: 'platformHospital',
    mixins: [],
    data () {
      return {
        ruleForm: {
          hospitalName: ''
        },
        params_ruleForm: {
          hospitalName: ''
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
        hospitalOption: '',
        saveUrl: '',
        hospitalLevelList: [], // 字典 医院级别列表
        ruleFormDialog: {
          hospitalName: '', // 医院名称
          address: '', // 医院详细地址
          linkman: '', // 负责人姓名
          telephone: '', // 联系电话
          hospitalLevel: '', // 医院级别
          areaForm: {}
        },
        dialogRules: {
          hospitalCode: [
            {required: true, message: '医院编码不能为空！', trigger: 'blur'}
          ],
          hospitalName: [
            {required: true, message: '医院全称不能为空！', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '医院详细地址不能为空！', trigger: 'blur'}
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
      echartsContain,
      'el-area': area
    },
    methods: {
      initPage () {
        this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.hospitalLevelList = dictionary.options('H_LEVEL');
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
        this.$refs.ruleForm.resetFields(); // model+prop 生效
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
            'hospitalName': that.params_ruleForm.hospitalName
          }
        };
        that.$axios({
          method: 'post',
          headers: {'Authorization': that.token},
          url: '/peps/management/hospital/queryHospitalByNamePage?t=' + (+new Date()),
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
      areaSelect (data) {
        this.ruleFormDialog.areaForm = data;
      },
      add () {
        this.dialogTitle = '添加医院';
        this.dialogVisible = true;
        this.hospitalOption = 'add';
        for (let key in this.ruleFormDialog) {
          this.ruleFormDialog[key] = '';
        }
        this.$nextTick(() => {
          this.$refs.area.clear = true;
          for (let p in this.$refs.area.ruleForm) {
            this.$refs.area.ruleForm[p] = '';
          }
          this.$refs.area.$refs.ruleForm.clearValidate();
        });
        this.ruleFormDialog.hospitalLevel = '三级甲等';
      },
      edit (row) {
        this.dialogTitle = '编辑医院';
        this.dialogVisible = true;
        this.hospitalOption = 'edit';
        this.ruleFormDialog.hospitalCode = row.hospitalCode;
        this.ruleFormDialog.hospitalName = row.hospitalName;
        this.ruleFormDialog.id = row.id;// 医院ID
        this.ruleFormDialog.linkman = row.linkman;
        this.ruleFormDialog.telephone = row.telephone;
        this.ruleFormDialog.hospitalLevel = row.hospitalLevel;
        this.ruleFormDialog.address = row.address;

        this.$nextTick(() => {
          this.$refs.area.clear = false;
          this.$refs.area.ruleForm.provinceName = row.provinceName;// 省
          this.$refs.area.ruleForm.province = row.provinceCode;
          this.$refs.area.ruleForm.cityName = row.cityName;// 市
          this.$refs.area.ruleForm.city = row.cityCode;
          this.$refs.area.ruleForm.villageName = row.countyName;// 区县
          this.$refs.area.ruleForm.village = row.countyCode;
          this.$refs.area.ruleForm.townName = row.townName;// 镇
          this.$refs.area.ruleForm.town = row.townCode;
          this.$refs.area.ruleForm.communityName = row.villageName;// 村
          this.$refs.area.ruleForm.community = row.villageCode;
        });
      },
      saveDrugDialog () {
        let that = this;
        let formData = {
          hospitalCode: that.ruleFormDialog.hospitalCode, // 医院编码
          hospitalName: that.ruleFormDialog.hospitalName, // 医院名称
          provinceName: that.ruleFormDialog.areaForm.provinceName, // 省
          provinceCode: that.ruleFormDialog.areaForm.province,
          cityName: that.ruleFormDialog.areaForm.cityName, // 市
          cityCode: that.ruleFormDialog.areaForm.city,
          countyName: that.ruleFormDialog.areaForm.villageName, // 区县
          countyCode: that.ruleFormDialog.areaForm.village,
          townName: that.ruleFormDialog.areaForm.townName, // 镇
          townCode: that.ruleFormDialog.areaForm.town,
          villageName: that.ruleFormDialog.areaForm.communityName, // 村
          villageCode: that.ruleFormDialog.areaForm.community,
          address: that.ruleFormDialog.address, // 医院地址
          linkman: that.ruleFormDialog.linkman, // 负责人姓名
          telephone: that.ruleFormDialog.telephone, // 联系电话
          hospitalLevel: that.ruleFormDialog.hospitalLevel// 医院级别
        };
        that.$refs.ruleFormDialog.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (that.hospitalOption === 'add') {
            formData = Object.assign(formData, {isEnable: true});
            that.saveUrl = '/peps/management/hospital/addHospital?t=' + (+new Date());
          } else {
            formData = Object.assign(formData, {id: this.ruleFormDialog.id});
            that.saveUrl = '/peps/management/hospital/updateHospitalInfo?t=' + (+new Date());
          }
          that.$axios({
            method: 'post',
            headers: {'Authorization': that.token},
            url: that.saveUrl,
            data: formData
          }).then((response) => {
            let data = response.data;
            if (data.code == '0') {
              that.closeHospitalDialog();
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
      closeHospitalDialog () {
        this.dialogVisible = false;
        for (let key in this.ruleFormDialog) {
          this.ruleFormDialog[key] = '';
        }
        for (let p in this.$refs.area.ruleForm) {
          this.$refs.area.ruleForm[p] = '';
        }
        this.$refs.ruleFormDialog.clearValidate();
        this.$refs.area.$refs.ruleForm.clearValidate();
      },
      changeStatus (row) {
        let that = this;
        let tips = '';
        let rowStatus = '';
        if (row.isEnable == true) {
          tips = '停用';
          rowStatus = 0;
        } else {
          tips = '启用';
          rowStatus = 1;
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
            url: '/peps/management/hospital/changeEnable?t=' + (+new Date()),
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
      deleteItem (row) {
        let that = this;
        that.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let formData = {
            hospitalId: row.id
          };
          that.$axios({
            method: 'get',
            headers: {'Authorization': this.token},
            url: '/peps/management/hospital/delete?t=' + (+new Date()),
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
  .platformHospital .el-form .el-form-item .el-input{
    width:220px
  }
</style>
<style>
  .dialogClass .el-dialog .el-form .el-form-item .el-input{
    width:220px
  }
  .dialogClass .el-dialog .el-form.el-area .el-form-item .el-input{
    width:130px
  }
</style>
