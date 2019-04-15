<template>
<div class="cloud-component drugPharmacy">
  <div class="searchTitle">
    <span>药店管理</span>
  </div>
  <!-- 搜索区域 -->
  <div class="cloud-search el-form-item-small">
    <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
      <el-form-item label="药店名称：">
        <el-input v-model.trim="ruleForm.drugstoreName" placeholder="请输入药店名称" :clearable="true"></el-input>
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
      <el-table :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)" :data="dataList.content" style="width: 100%" v-loading="loading" :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe
        highlight-current-row>
        <el-table-column prop="drugstoreName" label="药店名称" min-width="12%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="所在地址" min-width="16%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telephone" label="联系电话" min-width="16%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="linkman" label="负责人" min-width="10%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="hospitalMapForTable" label="对应医院" min-width="16%" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="10%" show-overflow-tooltip>
          <template slot-scope="scope">
              <span class='greenStatus' v-if="scope.row.isEnable">启用</span>
              <span class='redStatus' v-else>停用</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
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
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :append-to-body="true" :inline="true" width="560px" @close="closeDialog" class="dialogHasArea">
    <el-form :model="ruleFormDialog" ref="ruleFormDialog" :rules="dialogRules" label-width="95px" class="el-dialog--center systemDirectoryDialog" @submit.native.prevent>
      <el-form-item label="药店名称：" prop="drugstoreName">
        <el-input v-model.trim="ruleFormDialog.drugstoreName" placeholder="请输入药店名称" :maxlength="20" :clearable="true"></el-input>
      </el-form-item>
      <el-area @select="areaSelect" class="el-area clearfix" provinceName="地址：" :checkForm="true" ref="area"></el-area>
      <el-form-item prop="address">
        <el-input v-model.trim="ruleFormDialog.address" placeholder="请输入详细地址" type="textarea" class="textarea" :maxlength="200" :clearable="true" resize="none"></el-input>
      </el-form-item>
      <el-form-item label="负责人姓名：" prop="linkman">
        <el-input v-model.trim="ruleFormDialog.linkman" placeholder="请输入负责人姓名" :maxlength="30" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话：" prop="telephone">
        <el-input v-model.trim="ruleFormDialog.telephone" placeholder="请输入负责人电话" :maxlength="20" :clearable="true"></el-input>
      </el-form-item>
      <el-form-item label="对应医院：" prop="hospitalMap">
        <span class="showMutipleHospitalMap" v-if="ruleFormDialog.hospitalMap.length > 0">
            <span class="example">{{sliceHospitalMap(ruleFormDialog.hospitalMap[0])}}</span>
        <span class="count" v-if="ruleFormDialog.hospitalMap.length > 1">{{'+' + (ruleFormDialog.hospitalMap.length - 1)}}</span>
        </span>
        <el-select v-model.trim="ruleFormDialog.hospitalMap" placeholder="请选择医院" multiple @change="hospitalSelect" @click.native="getHospitalList">
          <el-option v-for="(item,index) in hospitalList" :key="item.id" :label="item.hospitalName" :value="item.id+':'+item.hospitalName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="isEnable">
        <template>
            <el-radio v-model="ruleFormDialog.isEnable" :label="true">启用</el-radio>
            <el-radio v-model="ruleFormDialog.isEnable" :label="false">停用</el-radio>
          </template>
      </el-form-item>
      <div class="el-dialog--center">
        <el-button @click="closeDialog" size="mini">取消</el-button>
        <!-- <el-button @click="getHospitalList" size="mini">取消</el-button> -->
        <el-button type="primary" @click="saveDialog" size="mini">确定</el-button>
        <!-- <el-button type="primary" @click="getHospitalList" size="mini">确定</el-button> -->
      </div>
    </el-form>
  </el-dialog>
</div>
</template>

<script>
import utils from 'components/utils';
import echartsContain from 'components/packages/echartsContain/echartsContain';
import {
  pageSize,
  pageNo,
  emptyText,
  elementLoadingText
} from 'components/utils/constant';
import pagination from 'components/packages/pagination/pagination';
import area from 'components/packages/area/area';
// import validation from 'components/utils/validation'

export default {
  name: 'drugPharmacy',
  mixins: [],
  data () {
    return {
      ruleForm: {
        drugstoreName: ''
      },
      params_ruleForm: {
        drugstoreName: ''
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
      drugstoreOption: '',
      saveUrl: '',
      ruleFormDialog: {
        drugstoreName: '',
        linkman: '',
        telephone: '',
        isEnable: true,
        province: '',
        city: '',
        address: '',
        hospitalMap: [],
        areaForm: {}
      },
      dialogRules: {
        drugstoreName: [{
          required: true,
          message: '药店名称不能为空！',
          trigger: 'blur'
        }],
        linkman: [{
          required: true,
          message: '负责人姓名不能为空！',
          trigger: 'blur'
        }],
        telephone: [{
          required: true,
          message: '负责人电话不能为空！',
          trigger: 'blur'
        }],
        isEnable: [{
          required: true,
          message: '状态不能为空！',
          trigger: 'blur',
          type: 'boolean'
        }],
        hospitalMap: [{
          required: true,
          message: '对应医院不能为空！',
          trigger: 'blur',
          type: 'array'
        }]
      },
      hospitalList: [],
      currTarget: {},
      hospitalMapForSubmit: {},
      readyFlag: false
    };
  },
  watch: {
  },
  computed: {
  },
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
    sliceHospitalMap (str) {
      let index = str.indexOf(':');
      return str.slice(index + 1);
    },
    hospitalSelect (selected) {
      console.log('selected', selected);
      let itemArr = [];
      this.hospitalMapForSubmit = {};
      selected.map(item => {
        itemArr = item.split(':');
        this.hospitalMapForSubmit[itemArr[0] + ''] = itemArr[1];
      });
    },
    areaSelect (data) {
      this.ruleFormDialog.areaForm = data;
      console.log(this.readyFlag);
      if (this.readyFlag) {
        this.ruleFormDialog.hospitalMap = [];
      }
    },
    getHospitalList () {
      let that = this;
      if (that.$refs.area.ruleForm.province == '') {
        that.$notice('请先选择省市');
      } else if (that.$refs.area.ruleForm.city == '') {
        that.$notice('请先选择市');
      } else {
        that.$axios({
          method: 'post',
          headers: {
            'Authorization': that.token
          },
          url: '/peps/management/hospital/getHospitalByZone?t=' + (+new Date()),
          data: {
            'cityCode': that.$refs.area.ruleForm.city,
            'countyCode': that.$refs.area.ruleForm.village,
            'provinceCode': that.$refs.area.ruleForm.province,
            'townCode': that.$refs.area.ruleForm.town,
            'villageCode': that.$refs.area.ruleForm.community
          }
        }).then((response) => {
          let data = response.data;
          that.loading = false;
          if (data.code == '0') {
            that.hospitalList = data.data;
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      }
    },
    initPage () {
      this.$emit('handlePageHeight'); // 初始化的时候首先调用调整窗口
      this.pageNo = pageNo;
      this.pageSize = pageSize;
      this.emptyText = emptyText;
      this.elementLoadingText = elementLoadingText;
      this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
      this.token = this.userLogin.data;
      this.search();
      // this.getHospitalList();
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
          'drugstoreName': that.params_ruleForm.drugstoreName
        }
      };
      that.$axios({
        method: 'post',
        headers: {
          'Authorization': that.token
        },
        url: '/peps/management/drugstore/queryDrugstoreByNamePage?t=' + (+new Date()),
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

          that.dataList.content.map(item => {
            // console.log('hospitalMapForTable');
            that.$axios({
              method: 'get',
              headers: {
                'Authorization': that.token
              },
              url: '/peps/management/hospital/getHospitalByCurrentDrugstoreId?t=' + (+new Date()),
              params: {
                'drugstoreId': item.id
              }
            }).then((response) => {
              let data = response.data;
              that.loading = false;
              if (data.code == '0') {
                console.log(data);
                let hospitalNameStr = '';
                if (data.data.length === 1) {
                  data.data.forEach(innerItem => {
                    hospitalNameStr += innerItem.hospitalName;
                  });
                } else if (data.data.length > 1) {
                  data.data.forEach(innerItem => {
                    hospitalNameStr = hospitalNameStr + '，' + innerItem.hospitalName;
                  });
                  hospitalNameStr = hospitalNameStr.slice(1);
                }
                that.$set(item, 'hospitalMapForTable', hospitalNameStr);
              } else {
                that.$warning(data.message);
              }
            }).catch((error) => {
              that.loading = false;
              console.log(error);
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
    add () {
      this.dialogTitle = '添加药店';
      this.dialogVisible = true;
      this.drugstoreOption = 'add';
      for (let key in this.ruleFormDialog) {
        if (typeof this.ruleFormDialog[key] === 'string') {
          this.ruleFormDialog[key] = '';
        }
      }
      this.ruleFormDialog.isEnable = true;
      this.ruleFormDialog.hospitalMap = [];
      this.ruleFormDialog.areaForm = {};

      this.$nextTick(() => {
        this.$refs.area.clear = true;
        for (let p in this.$refs.area.ruleForm) {
          this.$refs.area.ruleForm[p] = '';
        }
        this.$refs.area.$refs.ruleForm.clearValidate();
      });
    },
    edit (row) {
      let that = this;
      that.dialogTitle = '编辑药店';
      that.dialogVisible = true;
      that.drugstoreOption = 'edit';
      that.readyFlag = false;
      that.currTarget = row;
      for (let key in row) {
        that.ruleFormDialog[key] = row[key];
      }
      that.ruleFormDialog.hospitalMap = [];
      that.$nextTick(() => {
        that.$refs.area.clear = false;
        that.$refs.area.ruleForm.provinceName = row.provinceName;// 省
        that.$refs.area.ruleForm.province = row.provinceCode;
        that.$refs.area.ruleForm.cityName = row.cityName;// 市
        that.$refs.area.ruleForm.city = row.cityCode;
        that.$refs.area.ruleForm.villageName = row.countyName;// 区县
        that.$refs.area.ruleForm.village = row.countyCode;
        that.$refs.area.ruleForm.townName = row.townName;// 镇
        that.$refs.area.ruleForm.town = row.townCode;
        that.$refs.area.ruleForm.communityName = row.villageName;// 村
        that.$refs.area.ruleForm.community = row.villageCode;
      });
      console.log(that.readyFlag);

      setTimeout(function () {
        that.$axios({
          method: 'get',
          headers: {
            'Authorization': that.token
          },
          url: '/peps/management/hospital/getHospitalByCurrentDrugstoreId?t=' + (+new Date()),
          params: {
            'drugstoreId': row.id
          }
        }).then((response) => {
          let data = response.data;
          that.loading = false;
          if (data.code == '0') {
            data.data.map(function (item) {
              that.ruleFormDialog.hospitalMap.push(item.id + ':' + item.hospitalName);
              that.hospitalMapForSubmit[item.id] = item.hospitalName;
            });

            that.readyFlag = true;
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      }, 200);
    },
    saveDialog () {
      let that = this;
      let formData = {};
      that.$refs.ruleFormDialog.validate((valid) => {
        if (!valid) {
          return false;
        }
        formData = {
          drugstoreName: that.ruleFormDialog.drugstoreName,
          linkman: that.ruleFormDialog.linkman,
          telephone: that.ruleFormDialog.telephone,
          isEnable: that.ruleFormDialog.isEnable,
          address: that.ruleFormDialog.address,
          hospitalMap: that.hospitalMapForSubmit,
          provinceName: that.ruleFormDialog.areaForm.provinceName, // 省
          provinceCode: that.ruleFormDialog.areaForm.province,
          cityName: that.ruleFormDialog.areaForm.cityName, // 市
          cityCode: that.ruleFormDialog.areaForm.city,
          countyName: that.ruleFormDialog.areaForm.villageName, // 区县
          countyCode: that.ruleFormDialog.areaForm.village,
          townName: that.ruleFormDialog.areaForm.townName, // 镇
          townCode: that.ruleFormDialog.areaForm.town,
          villageName: that.ruleFormDialog.areaForm.communityName, // 村
          villageCode: that.ruleFormDialog.areaForm.community
        };
        if (that.drugstoreOption === 'add') {
          that.saveUrl = '/peps/management/drugstore/addDrugstore?t=' + (+new Date());
        } else {
          formData.id = that.currTarget.id;
          that.saveUrl = '/peps/management/drugstore/updateDrugstoreInfo?t=' + (+new Date());
        }
        console.log('formData', formData);

        that.$axios({
          method: 'post',
          headers: {
            'Authorization': that.token
          },
          url: that.saveUrl,
          data: formData
        }).then((response) => {
          let data = response.data;
          if (data.code == '0') {
            that.closeDialog();
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
    closeDialog () {
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
          headers: {
            'Authorization': this.token
          },
          url: '/peps/management/drugstore/changeEnable?t=' + (+new Date()),
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
      }).catch(() => {});
    },
    deleteItem (row) {
      let that = this;
      that.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let formData = {
          drugstoreId: row.id
        };
        that.$axios({
          method: 'get',
          headers: {
            'Authorization': this.token
          },
          url: '/peps/management/drugstore/delete?t=' + (+new Date()),
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
        }).catch(() => {});
      }).catch(() => {});
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
/* .drugPharmacy .el-form .el-form-item .el-input{
    width:220px
  }
  .el-dialog .el-form .el-form-item .el-input{
    width:220px
  } */

.showMutipleHospitalMap {
  position: absolute;
  left: 0;
  right: 60px;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.showMutipleHospitalMap>span {
  display: inline-block;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: #909399;
  border-radius: 4px;
  padding: 0 8px;
  box-sizing: border-box;
  white-space: nowrap;
}

.showMutipleHospitalMap .example {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.showMutipleHospitalMap .count {
  background-color: #f0f2f5;
  position: absolute;
  height: 24px;
  line-height: 24px;
  right: 0;
  top: 3px;
}
</style>

<style>
.el-select__tags {
  display: none;
}
</style>
