<template>
  <el-form :inline="true" :model="ruleForm" ref="ruleForm" :label-width='width' :rules="rules">
    <el-form-item :label="provinceName" prop="province">
      <el-select v-model="ruleForm.province" placeholder="请选择省" clearable
                 @clear="clearInit(0)" @visible-change="clearInit(0)"  :disabled="disabled || provinceDisabled">
        <el-option
          v-for="item in provinceArr"
          :key="item.areaCode"
          :label="item.areaName"
          :value="item.areaCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item prop="city">
      <el-select v-model="ruleForm.city" placeholder="请选择市" clearable
                 @clear="clearInit(1)" @visible-change="clearInit(1)" :disabled="disabled || cityDisabled">
        <el-option
          v-for="item in ruleForm.cityArr"
          :key="item.areaCode"
          :label="item.areaName"
          :value="item.areaCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="villageIsShow" prop="village">
      <el-select v-model="ruleForm.village" placeholder="请选择区（县）" clearable
                 @clear="clearInit(2)" @visible-change="clearInit(2)" :disabled="disabled || villageDisabled">
        <el-option
          v-for="item in ruleForm.villageArr"
          :key="item.areaCode"
          :label="item.areaName"
          :value="item.areaCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="townIsShow">
      <el-select v-model="ruleForm.town" placeholder="请选择镇" clearable
                 @clear="clearInit(3)" @visible-change="clearInit(3)" :disabled="disabled || townDisabled">
        <el-option
          v-for="item in ruleForm.townArr"
          :key="item.areaCode"
          :label="item.areaName"
          :value="item.areaCode">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="communityIsShow">
      <el-select v-model="ruleForm.community" placeholder="请选择村" clearable
                 @clear="clearInit(4)" @visible-change="clearInit(4)" :disabled="disabled || communityDisabled">
        <el-option
          v-for="item in ruleForm.communityArr"
          :key="item.areaCode"
          :label="item.areaName"
          :value="item.areaCode">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'area',
    props: {
      provinceName: {// 组件的lable名字
        type: String,
        default: '区域：'
      },
      width: {// 组件的label-width
        type: String
      },
      clearOthers: {
        type: Boolean,
        default: true
      },
      checkForm: {// 是否需要校验省市区
        type: Boolean,
        default: false
      },
      disabled: {// 统一全部是否可编辑
        type: Boolean,
        default: false
      },
      provinceDisabled: {// 省是否可编辑
        type: Boolean,
        default: false
      },
      cityDisabled: {// 市是否可编辑
        type: Boolean,
        default: false
      },
      villageDisabled: {// 区是否可编辑
        type: Boolean,
        default: false
      },
      townDisabled: {// 镇是否可编辑
        type: Boolean,
        default: false
      },
      communityDisabled: {// 村是否可编辑
        type: Boolean,
        default: false
      },
      villageIsShow: {// 区是否显示
        type: Boolean,
        default: true
      },
      townIsShow: {// 镇是否显示
        type: Boolean,
        default: true
      },
      communityIsShow: {// 村是否显示
        type: Boolean,
        default: true
      }
    },
    data () {
      var provinceCheck = {};
      var cityCheck = {};
      var villageCheck = {};
      if (this.checkForm) {
        provinceCheck = {required: true, message: '请选择省', trigger: 'change'};
        cityCheck = {required: true, message: '请选择市', trigger: 'change'};
        villageCheck = {required: true, message: '请选择区', trigger: 'change'};
      }
      return {
        ruleForm: {
          province: '',
          provinceName: '',
          city: '',
          cityName: '',
          village: '',
          villageName: '',
          town: '',
          townName: '',
          community: '',
          communityName: '',
          cityArr: [],
          villageArr: [],
          townArr: [],
          communityArr: []
        },
        provinceArr: [],
        clear: true, // 为真的情况，当清空一级的时候，会清空它的所有下级；
        rules: {
          province: [
            provinceCheck
          ],
          city: [
            cityCheck
          ],
          village: [
            villageCheck
          ]
        },
        token: ''
      };
    },
    watch: {
      'ruleForm.province' (val, oldval) {
        this.getAreaNameByAreaCode(val, 'province');
        this.provinceChange(val);
      },
      'ruleForm.city' (val, oldval) {
        this.getAreaNameByAreaCode(val, 'city');
        this.cityChange(val);
      },
      'ruleForm.village' (val, oldval) {
        this.getAreaNameByAreaCode(val, 'village');
        this.villageChange(val);
      },
      'ruleForm.town' (val, oldval) {
        this.getAreaNameByAreaCode(val, 'town');
        this.townChange(val);
      },
      'ruleForm.community' (val, oldval) {
        this.getAreaNameByAreaCode(val, 'community');
        this.communityChange(val);
      }
    },
    created () {
      this.initPage();
    },
    activated () {
      this.initPage();
    },
    methods: {
      initPage () {
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        //        console.log(this.token)
        this.getArea(0, 'province');
        this.clear = this.clearOthers;
      },
      getArea (level, region, code = '') {
        let that = this;
        // ajax请求
        that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/management/regional/queryRegional?t=' + (+new Date()),
          params: {
            'areaLevel': level,
            'parentcode': code
          }
        }).then(function (response) {
          let data = response.data;
          if (data.code == '0') {
            if (region === 'province') {
              that[region + 'Arr'] = data.data;
            }
            that.ruleForm[region + 'Arr'] = data.data;
            that.$emit('select', that.ruleForm);
          } else {
            that.$warning();
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      getAreaNameByAreaCode (areaCode, option) {
        if (!areaCode) {
          this.ruleForm[option + 'Name'] = '';
        }
        if (option == 'province') {
          if (this[option + 'Arr'] && this[option + 'Arr'].length > 0) {
            this[option + 'Arr'].forEach(item => {
              if (item.regionCode === areaCode) {
                this.ruleForm[option + 'Name'] = item.areaName;
              }
            });
          }
        } else {
          if (this.ruleForm[option + 'Arr'] && this.ruleForm[option + 'Arr'].length > 0) {
            this.ruleForm[option + 'Arr'].forEach(item => {
              if (item.regionCode === areaCode) {
                this.ruleForm[option + 'Name'] = item.areaName;
              }
            });
          }
        }
      },
      provinceChange (value) {
        if (this.clear) {
          this.ruleForm.cityArr = [];
          this.ruleForm.villageArr = [];
          this.ruleForm.townArr = [];
          this.ruleForm.communityArr = [];
          this.ruleForm.city = '';
          this.ruleForm.village = '';
          this.ruleForm.town = '';
          this.ruleForm.community = '';
        }
        if (value) {
          this.getArea(1, 'city', value);
        } else {
          this.$emit('select', this.ruleForm);
        }
      },
      cityChange (value) {
        if (this.clear) {
          this.ruleForm.villageArr = [];
          this.ruleForm.townArr = [];
          this.ruleForm.communityArr = [];
          this.ruleForm.village = '';
          this.ruleForm.town = '';
          this.ruleForm.community = '';
        }
        if (value) {
          this.getArea(2, 'village', value);
        } else {
          this.$emit('select', this.ruleForm);
        }
      },
      villageChange (value) {
        if (this.clear) {
          this.ruleForm.townArr = [];
          this.ruleForm.communityArr = [];
          this.ruleForm.town = '';
          this.ruleForm.community = '';
        }
        if (value) {
          this.getArea(3, 'town', value);
        } else {
          this.$emit('select', this.ruleForm);
        }
      },
      townChange (value) {
        if (this.clear) {
          this.ruleForm.communityArr = [];
          this.ruleForm.community = '';
        }
        if (value) {
          this.getArea(4, 'community', value);
        } else {
          this.$emit('select', this.ruleForm);
        }
      },
      communityChange (value) {
        this.$emit('select', this.ruleForm);
      },
      clearInit (areaLevel) {
        this.clear = true;
        if (areaLevel === undefined) {
          return false;
        }
        // 为了配合左侧树的编辑更新，所以下拉的时候重新拉取一次数据
        if (areaLevel == 0) {
          this.getArea(0, 'province');
        } else if (areaLevel == 1) {
          this.getArea(1, 'city', this.ruleForm.province);
        } else if (areaLevel == 2) {
          this.getArea(2, 'village', this.ruleForm.city);
        } else if (areaLevel == 3) {
          this.getArea(3, 'town', this.ruleForm.village);
        } else if (areaLevel == 4) {
          this.getArea(4, 'community', this.ruleForm.town);
        }
      }
    }
  };
</script>
