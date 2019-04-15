<template>
  <div class="cloud-component cloud-component-detail">
    <div class="cloud-search  el-form-item-small">
        <div class="searchTitle">
          <span>医生处方统计</span>
          <el-button @click="historyGoBack('/prescriptionStatisticsList')" type="text" style="margin-left: 15px">
            &lt&lt返回上一级
          </el-button>
        </div>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight+30" :heightRatio="1">
          <div class="contentRegion" v-loading="loading">
            <div class="lineStyle">
             <div class="el-col-5">
                <label>医生姓名：</label>
                <span>{{allDataList.doctorName}}</span>
              </div>
              <div class="el-col-5">
                <label>处方单号：</label>
                <span>{{id}}</span>
              </div>
              <div class="el-col-5">
                <label>处方时间：</label>
                <span>{{createDateFormat }}</span>
              </div>
            </div>
            <div class="drugStatus">
               <span>{{allDataList.isTake == "0" ? "未取药" : "已取药"}}</span>
            </div>
            <div class="lineStyle">
              <div class="el-col-5">
                <label>患者姓名：</label>
                <span>{{allDataList.patientName}}</span>
              </div>
              <div class="el-col-5">
               <label>性别：</label>
                <span>{{allDataList.patientSex}}</span>
                <label style="padding-left:50px">年龄：</label>
                <span>{{allDataList.patientAge}} {{allDataList.ageUnit}}</span>
              </div>
              <div class="el-col-5">
                <label>患者手机：</label>
                <span>{{allDataList.patientTelephone}}</span>
              </div>
            </div>
            <div class="lineStyle">
              <div class="el-col-6">
                <label>诊断：</label>
                <span>{{allDataList.diagnosis}}</span>
              </div>
            </div>
          </div>
        <table class="detail-charge">
          <tr>
            <td>消费类型 </td> <td>费用(元) </td>
            </tr>
            <tr>
            <td>诊疗费</td> <td>{{allDataList.diagnosisCharge}} </td>
            </tr>
            </table>
        <el-table :height="routerViewHeight*1-280" :data="dataList.content" style="width: 100%" v-loading="loading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="commonName" label="通用名" min-width="15%">
          </el-table-column>
          <el-table-column prop="name" label="商品名" min-width="15%">
          </el-table-column>
          <el-table-column prop="spec" label="药品规格" min-width="15%">
          </el-table-column>
          <el-table-column prop="type" label="剂型" min-width="10%">
          </el-table-column>
          <el-table-column prop="manufacturer" label="生产厂家" min-width="20%">
          </el-table-column>
          <el-table-column prop="method" label="用法用量" min-width="20%">
          </el-table-column>
          <el-table-column prop="amount" label="数量" min-width="8%">
          <template slot-scope="scope">
              <span>{{scope.row.amount}}{{scope.row.unit}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="单位" min-width="8%">
          </el-table-column>
          <el-table-column prop="total" label="费用(元)" min-width="10%">
          </el-table-column>
        </el-table>
        <div class="total-price">
            <label>总费用：</label>
            <span>{{allDataList.total}}</span>元
        </div>
      </echarts-contain>
    </div>
    <!--打印处方笺弹框-->
    <el-dialog :title="prescriptionDialogTitle" :visible.sync="prescriptionDialogVisible" class="blueHeader "
               :append-to-body="true" width="600px" :show-close="false" :before-close="handleClose">
      <div class="content-printing" style="padding-top:3px;border-top: #DCDCDC 1px solid;">
        <div class="print-title" style="text-align:center;padding:30px 0px 20px;border-top: #DCDCDC 4px solid;">
        <h2>{{userInfo.orgName}}</h2>
        <h3>处方笺</h3>
        </div>
        <table width="100%">
          <tr>
            <td>
              <span>处方单号</span>
              <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{id}}</span>
            </td>
            <td>
              <span>科别</span>
              <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.department}}</span>
            </td>
            <td>
              <span>开具日期</span>
             <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{createDateFormat}}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>姓名</span>
             <span style="border-bottom:1px solid #333;font-weight: bold;width:144px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.patientName}}</span>
            </td>
            <td>
              <span>性别</span>
             <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.patientSex}}</span>
            </td>
            <td>
              <span>年龄</span>
             <span style="border-bottom:1px solid #333;font-weight: bold;width:144px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.patientAge}} {{allDataList.ageUnit}}</span>
            </td>
          </tr>
          <tr>
            <td class="fullAline">
              <span>临床诊断</span>
              <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.diagnosis}}</span>
            </td>
          </tr>
          </table>
          <div style="padding:10px 0 40px;border-top:2px solid #000;border-bottom:2px solid #000;margin-top:30px ">
            <h3 style="font-size:18px;padding-bottom:10px">Rp.</h3>
            <el-table :data="dataList.content" style="width: 100%" v-loading="loading"
                      :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
              <el-table-column prop="name" label="药品名称" min-width="15%">
              </el-table-column>
              <el-table-column prop="type" label="剂型" min-width="10%">
              </el-table-column>
              <el-table-column prop="spec" label="规格" min-width="15%">
              </el-table-column>
              <el-table-column prop="amount" label="数量" min-width="10%">
              </el-table-column>
              <el-table-column prop="method" label="用法用量" min-width="15%">
              </el-table-column>
            </el-table>
         </div>
         <table  width="100%" style="padding:20px">
          <tr style="margin:20px 0;">
            <td>
              <span>医师</span>
               <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.doctorName}}</span>
            </td>
            <td>
              <span>金额</span>
               <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{allDataList.total}} 元</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>药师（审核、调配、发药）</span>
              <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{userInfo.nickname}}</span>
            </td>
            <td>
              <span>调配</span>
               <span style="border-bottom:1px solid #333;font-weight: bold;width:120px;text-align:center;display:inline-block;line-height:21px;margin-bottom:7px">{{userInfo.nickname}}</span>
            </td>
          </tr>
        </table>

      </div>
      <div style="text-align:center;margin: 20px auto;">
        <el-button type="primary" @click="doPrint">打 印</el-button>
        <el-button @click="prescriptionDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
  import {emptyText, elementLoadingText} from 'components/utils/constant';
  import echartsContain from 'components/packages/echartsContain/echartsContain';

  export default {
    name: 'prescriptionStatisticsDetail',
    mixins: [],
    data () {
      return {
        id: '', // query传参
        allDataList: {}, // query传参 列表页数据
        option: '', // query传参
        ruleForm: {
          id: '' // 处方ID
        },
        ruleFormResult: {},
        dataList: {}, // 列表数据
        loading: false,
        emptyText: '',
        elementLoadingText: '',
        userInfo: {},
        createDateFormat: '',

        // 处方笺弹窗
        prescriptionDialogVisible: false,
        prescriptionDialogTitle: ''

      };
    },
    components: {
      echartsContain
    },
    computed: {},
    created () {
      this.initPage();
    },
    mounted () {},
    methods: {
      initPage () {
        this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
        this.option = this.$route.query.option;
        this.id = this.$route.query.id;
        if (!this.id) {
          return false;
        }
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.userInfo = this.$getUserInfo();
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        this.search();
      },
      search () {
        this.$nextTick(() => {
          this.getDataList();
        });
      },
      getDataList () {
        let that = this;
        that.loading = true;
        that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/presc/hospital/search?&t=' + (+new Date()),
          params: {
            id: that.id
          }
        }).then((response) => {
          let data = response.data;
          that.loading = false;
          if (data.code == '0') {
            let obj = {};
            that.createDateFormat = that.$dateFormat(new Date(data.data.createDate));
            console.log(data);
            obj.content = data.data.list;
            that.allDataList = data.data;
            that.dataList = obj;
            if (that.allDataList.patientSex == 1) {
              that.allDataList.patientSex = '男';
            } else {
              that.allDataList.patientSex = '女';
            }
          } else {
            that.$warning(data.message);
          }
        }).catch((error) => {
          that.loading = false;
          console.log(error);
        });
      },
      printPrescription () {
        this.prescriptionDialogVisible = true;
        this.prescriptionDialogTitle = 'NO.' + this.id;
        document.querySelector('.blueHeader .el-dialog').style.marginTop = '15px';
        document.querySelector('.blueHeader .el-dialog__header').style.margin = '0';
        document.querySelector('.blueHeader .el-dialog__header').style.paddingRight = '26px';
        document.querySelector('.blueHeader .el-dialog__header').style.height = '15px';
        document.querySelector('.blueHeader .el-dialog__header').style.paddingBottom = '0';
        document.querySelector('.blueHeader .el-dialog__header').style.background = '#ffffff';
        document.querySelector('.blueHeader .el-dialog__header').style.textAlign = 'right';
      },
      doPrint () {
        let subOutputRankPrint = document.querySelector('.blueHeader ');
        let contentPrinting = document.querySelector('.content-printing');
        contentPrinting.parentNode.removeChild(contentPrinting.nextElementSibling);
        let newContent = subOutputRankPrint.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
      },
      confirmMedicine () {
        let that = this;
        this.$prompt('请输入取药码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d{4}$/,
          inputErrorMessage: '取药码为4位数字'
        }).then(({ value }) => {
          that.$axios({
            method: 'get',
            headers: {'Authorization': that.token},
            url: '/peps/presc/drugstroe/take?t=' + (+new Date()),
            params: {
              id: that.id,
              takeCode: value
            }
          }).then((response) => {
            let data = response.data;
            if (data.code == '0') {
              that.allDataList.isTake = 1;
              that.$notice('取药成功');
            } else {
              that.$warning(data.message);
            }
          }).catch((error) => {
            console.log(error);
          });
        }).catch(() => {

        });
      },
      handleClose () {}

    },
    beforeRouteEnter (to, from, next) {
      next();
    },
    beforeRouteLeave (to, from, next) {
      next();
    }
  };
</script>

