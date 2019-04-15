  <template>
  <!--<div>快捷取药 quickMedicine</div>-->
  <div class="cloud-component quickMedicine">
    <!--搜索区域-->
    <div class="searchTitle">
      <span>快捷取药</span>
    </div>
    <div class="searchMid">
      <el-form :inline="true" :model="ruleForm" ref="ruleForm" @submit.native.prevent>
        <el-form-item>
          <el-input v-model.trim="ruleForm.condition"
                    placeholder="请输入手机号或者处方单号" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchButton" type="primary" @click="search(1)" :loading="loading"></el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--搜索结果-->
    <div class="cloud-search-list">
      <echarts-contain containType="big" :parentHeight="routerViewHeight" :heightRatio="1">
        <div class="nodata-contain" v-if="!hasSearch">
          <img src="../../images/quickMedicine.jpg" width="372">
        </div>
        <el-table v-else :height="(dataList.content && dataList.content.length>0)?(routerViewHeight*1-40):(routerViewHeight*1-5)"
                  :data="dataList.content" style="width: 100%" v-loading="loading"
                  :empty-text="emptyText" :element-loading-text="elementLoadingText" stripe highlight-current-row>
          <el-table-column prop="createDate" label="时间" min-width="12%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="id" label="处方单号" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="doctorName" label="医生姓名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="patientName" label="患者姓名" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="patientTelephone" label="患者手机" min-width="16%" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="isTake" label="状态" min-width="12%" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.isTake == "0" ? "未取药" : "已取药"}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="view('check',scope.row.id)">
                <i class="icon-view" title="查看明细"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination :data="dataList" @change="getDataList"></pagination>
      </echarts-contain>
    </div>

  </div>


</template>
<script type="text/javascript">
  import utils from 'components/utils';
  import echartsContain from 'components/packages/echartsContain/echartsContain';
  import {pageSize, pageNo, emptyText, elementLoadingText} from 'components/utils/constant';
  import pagination from 'components/packages/pagination/pagination';

  export default {
    name: 'quickMedicine',
    mixins: [],
    data () {
      return {
        ruleForm: {
          condition: ''
        },
        params_ruleForm: {
          condition: ''
        },
        dataList: {},
        loading: false,
        pageNo: '',
        pageSize: '',
        currentPageNo: '',
        currentPageSize: '',
        emptyText: '',
        hasSearch: false,
        elementLoadingText: ''
      };
    },
    components: {
      pagination,
      echartsContain
    },
    watch: {},
    computed: {},
    created () {
      this.initPage();
    },
    mounted () {},
    methods: {
      initPage () {
        this.$emit('handlePageHeight');// 初始化的时候首先调用调整窗口
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.emptyText = emptyText;
        this.elementLoadingText = elementLoadingText;
        this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        this.token = this.userLogin.data;
        this.search(false);
      },
      search (boo) {
        this.params_ruleForm = utils.deepClone(this.ruleForm);
        if (boo) {
          // if(!this.params_ruleForm.condition){
          //   this.$notice('请输入手机号或者处方单号')
          //   return false
          // }
          this.hasSearch = true;
          this.$nextTick(() => {
            this.getDataList();
          });
        }
      },
      getDataList (pageNo = this.pageNo, pageSize = this.pageSize) {
        let that = this;
        that.currentPageNo = pageNo;
        that.currentPageSize = pageSize;
        that.loading = true;
        let formData = {
          pageNumber: pageNo,
          pageSize: pageSize,
          condition: that.params_ruleForm.condition
        };
        that.$axios({
          method: 'get',
          headers: {'Authorization': that.token},
          url: '/peps/presc/drugstroe/search/list/presc?&t=' + (+new Date()),
          params: formData
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
      view (option, id) {
        this.$router.push({
          name: 'quickMedicineDetail',
          query: {
            id: id || '',
            option: option
          }
        });
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
  .quickMedicine .cloud-search-list{position: relative;}
  .quickMedicine .nodata-contain{
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .quickMedicine .el-input {width: 360px;height: 38px;}

  .quickMedicine .searchMid{margin-top: 50px;width:500px;margin-left:auto; margin-right:auto;}
  .quickMedicine .searchButton{width:80px;height:38px;font-size: 14px;position:relative;left:-15px;background: #3C9DFB url('./../../images/search.png') no-repeat center;}

</style>
<style>
  .quickMedicine .bigContain{position: relative;}
  .quickMedicine .el-button{border-radius: 0 4px 4px 0;}
  .quickMedicine .searchMid .el-input .el-input__inner{height: 100% !important;}
</style>
