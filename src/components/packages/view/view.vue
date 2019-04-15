<template>
  <div class="cloud-container">
    <div class="hideScrollCon" :class="{'onclick':isDislpayArrow}">
      <div class="logoleftt">
        <!--<img src="./images/logoleftt.png" width="73">-->
        <!--<img src="./images/logotext.png" width="144">-->
        <img :src="'./static/img/yunpai.png'" width="127"/>
        <img :src="'./static/img/yunpai-title.png'"  width="127"/>
      </div>
      <div class="el-menu-box">
        <el-menu router class="el-menu-vertical-demo" :unique-opened="true" :default-active="'/' + getRoute.meta.flag" v-if="platformType === 1">
            <el-menu-item v-for="(item, index) in menuList" :index="item.path" :key="item.path">
              <template slot="title">
                <i :class="item.ico"></i>
                <span>{{item.name}}</span>
              </template>
            </el-menu-item>
        </el-menu>
        <el-menu router class="el-menu-vertical-demo" :unique-opened="true" :default-active="'/' + getRoute.meta.flag" v-else>
          <el-submenu v-for="(item, index) in menuList" :index="index.toString()" :key="index">
            <template slot="title">
              <i :class="item.ico"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(itemChildren, index2) in item.children" :index="itemChildren.path"
                            :key="itemChildren.path">{{itemChildren.name}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <div class="dislpayArrow" :class="{'onclick':isDislpayArrow}" @click="dislpayArrow"
         :title="isDislpayArrow?'展开菜单':'收起菜单'">
    </div>
    <transition-group v-if="0" name="list-complete" tag="div" class="route-menu clearfix"
                      :class="{'onclick':isDislpayArrow}">
      <div class="route-menu-box" key="box">
        <!--<div class="el-tag" key="/" :class="{on:indexFlag}" style="min-width:70px;padding:0 10px">-->
        <!--<label @click="routeTo('/')">首页</label>-->
        <!--</div>-->
        <div @click="routeTo(item.historyPath[0].fullPath)" v-for="(item,i) in getRouteArr" :key="item.route.fullPath"
             class="el-tag"
             :class="{on:getRoute.meta.flag == item.route.meta.flag}">
          <label>{{item.route.meta.txt}}</label>
          <i class="el-tag__close el-icon-close" @click.stop="routeClose(i)" title="关闭"
             v-if="!(item.route.name=='index' || item.route.name=='/')"></i>
        </div>
        <div class="el-tag" key="more" :class="{on:moreMenuFlag}" v-if="showMoreMenu.length >0"
             style="padding:0;width:107px">
          <el-dropdown>
            <label class="el-dropdown-link">更多菜单</label>
            <el-dropdown-menu slot="dropdown" class="el-tag-more">
              <el-dropdown-item v-for="(item,i) in showMoreMenu" :key="item.route.fullPath"
                                :class="{on:getRoute.meta.flag == item.route.meta.flag}"
                                v-if="item.route.meta.txt != '首页'">
                <label @click="routeTo(item.historyPath[0].fullPath)">{{item.route.meta.txt}}</label>
                <i class="el-tag__close el-icon-close" @click.stop="routeClose(getRouteArr.length+i)" title="关闭"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div key="button" style="float:right;margin-right:11px;">
          <el-button-group>
            <el-button type="primary" class="route-menu-button-left"
                       :class="{'disabled':(getRouteArr.length+showMoreMenu.length)==1 || getRouteArrFirst}"
                       @click.native="nextRouteEvent('left')"><i class="el-icon-arrow-left el-icon--left"
                                                                 title="向左移动标签"></i></el-button>
            <el-button type="primary" class="route-menu-button-close"
                       :class="{'disabled':(getRouteArr.length+showMoreMenu.length)==1}" @click.native="routeCloseAll">
              <i
                class="el-icon-close" title="关闭所有标签"></i></el-button>
            <el-button type="primary" class="route-menu-button-right"
                       :class="{'disabled':(getRouteArr.length+showMoreMenu.length==1) || (getRouteArr==undefined || getRouteArr=='' || getRouteArr==null) ? true : (showMoreMenu.length==0?($route.name == getRouteArr[getRouteArr.length-1].route.name):($route.name == showMoreMenu[showMoreMenu.length-1].route.name))}"
                       @click.native="nextRouteEvent('right')"><i class="el-icon-arrow-right el-icon--right"
                                                                  title="向右移动标签"></i>
            </el-button>
          </el-button-group>
        </div>
      </div>
    </transition-group>
    <div class="el-router-view" :class="{'onclick':isDislpayArrow}">
      <div class="el-router-container">
        <transition name="el-fade-in-linear" mode="out-in">
          <keep-alive>
            <router-view v-if="$route.meta.isKeepAlive" ref="routercomponent"
                         @handlePageHeight="handlePageHeight"></router-view>
          </keep-alive>
        </transition>
        <transition name="el-fade-in-linear" mode="out-in">
          <router-view v-if="!$route.meta.isKeepAlive" ref="routercomponent"
                       @handlePageHeight="handlePageHeight"></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  import './view.css';
  import appFooter from 'components/packages/footer/footer';

  export default {
    name: 'appView',
    data () {
      return {
        data: [],
        isDislpayArrow: false,
        defaultActive: '',
        hospitaleItem: {
          label: '医院端',
          children: [{
            label: '基础信息维护',
            icon: 'icon-basics',
            children: [{
              label: '药品目录',
              router: '/drugCatalogue',
              children: []
            }, {
              label: '医生登记',
              router: '/doctorRegistration',
              children: []
            }, {
              label: '科室管理',
              router: '/departmentMgt',
              children: []
            }]
          },
          {
            label: '处方管理',
            icon: 'icon-prescription',
            children: [{
              label: '历史处方查询',
              router: '/hosHistoricalPrescription',
              children: []
            }]
          },
          {
            label: '数据统计',
            icon: 'icon-tongji',
            children: [{
              label: '外延处方统计',
              router: '/eitaxyPrescription',
              children: []
            },
            {
              label: '医生处方统计',
              router: '/prescriptionStatistics',
              children: []
            }]
          }]
        },
        platformItem: {
          label: '平台端',
          children: [{
            label: '基础信息维护',
            icon: 'icon-setting',
            children: [{
              label: '医院管理',
              router: '/platformHospital',
              children: []
            }, {
              label: '药企管理',
              router: '/platformDrug',
              children: []
            },
            {
              label: '用户管理',
              router: '/platformUser',
              children: []
            },
            {
              label: '监管机构管理',
              router: '/platformOrganization',
              children: []
            }]
          }]
        },
        superviseItem: {
          label: '监管端',
          children: [{
            label: '平台业务监管',
            icon: 'icon-platform',
            router: '/visualizationIndex',
            children: []
          }, {
            label: '实时处方监管',
            icon: 'icon-prescription',
            router: '/prescriptionOverviewIndex',
            children: []
          }, {
            label: '接入机构监管',
            icon: 'icon-hospital',
            router: '/hospitalStatisticsIndex',
            children: []
          }, {
            label: '注册医生监管',
            icon: 'icon-doctor',
            router: '/doctorStatisticsIndex',
            children: []
          }, {
            label: '处方患者监管',
            icon: 'icon-patient',
            router: '/patientsStatisticsIndex',
            children: []
          }, {
            label: '处方药店监管',
            router: '/pharmacyStatisticsIndex',
            children: []
          }]
        },
        drugStoreItem: {
          label: '药店端',
          children: [{
            label: '处方取药',
            icon: 'icon-shape',
            children: [{
              label: '快捷取药',
              router: '/quickMedicine',
              children: []
            }]
          },
          {
            label: '药品管理',
            icon: 'icon-drug',
            children: [{
              label: '医院药品目录',
              router: '/hospitalDrugDirectory',
              children: []
            },
            {
              label: '药店通用目录',
              router: '/drugstoreDirectory',
              children: []
            },
            {
              label: '药品对照',
              router: '/drugContrast',
              children: []
            }]
          },
          {
            label: '处方管理',
            icon: 'icon-prescription',
            children: [{
              label: '历史处方查询',
              router: '/historyPrescription',
              children: []
            }]
          },
          {
            label: '数据统计',
            icon: 'icon-tongji',
            children: [{
              label: '外延处方统计',
              router: '/extensionPrescription',
              children: []
            },
            {
              label: '医生处方统计',
              router: '/doctorPrescription',
              children: []
            }]
          },
          {
            label: '系统管理',
            icon: 'icon-setting',
            children: [{
              label: '角色管理',
              router: '/drugRole',
              children: []
            },
            {
              label: '用户管理',
              router: '/drugUser',
              children: []
            },
            {
              label: '药店管理',
              router: '/drugPharmacy',
              children: []
            }]
          }
          ]
        }
      };
    },
    components: {
      appFooter
    },
    computed: {
      platformType () {
        return JSON.parse(sessionStorage.getItem('userInfo')).platformType;
      },
      menuList () {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (!userInfo) {
          return false;
        } else {
          return this.$store.state.user.menuList;
        }
      },
      defaultOpeneds () {
        let defaultOpeneds = [];
        this.$store.state.user.menuList.forEach((item) => {
          if (item.level == 2) {
            defaultOpeneds.push(item.id);
          }
        });
        return defaultOpeneds;
      },
      getRoute () {
        return this.$route;
      },
      getRouteArr () {
        let position = this.getRect(document.querySelector('.route-menu'));
        let num = parseInt((position.right - position.left - 218) / 218); // 最长的顶部tag的width为218px
        // console.log(this.$store.state.user.routeArr.slice(0, num))
        return this.$store.state.user.routeArr.slice(0, num);
      },
      getRouteArrFirst () {
        return (this.getRouteArr.length + this.showMoreMenu.length) == 0 ? true : (this.getRouteArr.length == 0 ? this.showMoreMenu[0].route.path == this.$route.path : this.getRouteArr[0].route.path == this.$route.path);
      },
      moreMenuFlag () {
        for (var i = 0; i < this.showMoreMenu.length; i++) {
          if (this.$route.fullPath == this.showMoreMenu[i].route.fullPath) {
            break;
          }
        }
        if (i == this.showMoreMenu.length) {
          return false;
        } else {
          return true;
        }
      },
      showMoreMenu () {
        let position = this.getRect(document.querySelector('.route-menu'));
        let num = parseInt((position.right - position.left - 218) / 218); // 最长的顶部tag的width为218px
        return this.$store.state.user.routeArr.slice(num);
      }
    },
    created () {
    },
    mounted () {
      this.initPage();
    },
    watch: {
      $route (to, from) {
        this.$nextTick(() => {
          this.handlePageHeight();
          if (from.meta.flag == undefined) { // 刷新的时候
            setTimeout(() => {
              this.defaultActive = '/' + to.meta.flag;
            },
            600);
          } else { // 跳转的时候
            this.defaultActive = '/' + to.meta.flag;
          }
        });
      }
    },
    methods: {
      initPage () {
        window.onresize = this.handlePageHeight; // 高度自适应处理
        let Global = JSON.parse(sessionStorage.getItem('Global'));
        let sessionIsDislpayArrow = sessionStorage.getItem(Global.iam_clientid + '_ISDISPLAYARROW');
        this.$nextTick(() => {
          if (sessionIsDislpayArrow == 'false') {
            this.isDislpayArrow = false;
          } else if (sessionIsDislpayArrow == 'true') {
            this.isDislpayArrow = true;
          } else {
            this.isDislpayArrow = false;
          }
          this.$store.commit({
            type: 'saveSession_isDislpayArrow',
            isDislpayArrow: this.isDislpayArrow
          });
        });
      },
      handlePageHeight () { // 高度自适应处理
        setTimeout(() => {
          this.$nextTick(() => {
            let routerViewHeight = document.querySelector('.el-router-view').clientHeight;
            let searchHeight = document.querySelector('.el-router-container').clientHeight;
            // console.log(this.$refs.routercomponent)
            if (this.$refs.routercomponent && this.$refs.routercomponent.routerViewHeight) {
              this.$refs.routercomponent.routerViewHeight = Number(routerViewHeight - searchHeight - 50) < 360 ? 360 : Number(routerViewHeight - searchHeight - 50);
              this.$nextTick(() => {
                if (this.$refs.routercomponent.resize) {
                  this.$refs.routercomponent.resize();
                }
              });
            }
          });
        },
        400);
      },
      getRect (element) {
        if (!element) {
          return false;
        }
        var rect = element.getBoundingClientRect();
        var top = document.documentElement.clientTop;
        var left = document.documentElement.clientLeft;
        return {
          top: rect.top - top,
          bottom: rect.bottom - top,
          left: rect.left - left,
          right: rect.right - left
        };
      },
      dislpayArrow () {
        let that = this;
        that.isDislpayArrow = !that.isDislpayArrow;
        this.$store.commit({
          type: 'saveSession_isDislpayArrow',
          isDislpayArrow: that.isDislpayArrow
        });
        sessionStorage.setItem(JSON.parse(sessionStorage.getItem('Global')).iam_clientid + '_ISDISPLAYARROW', that.isDislpayArrow);
        setTimeout(() => { // 隐藏左侧菜单后执行路由组件的resize方法，使图表自适应
          if (that.$refs.routercomponent.resize) {
            that.$refs.routercomponent.resize();
          }
        },
        200);
      },
      routeTo (path) {
        this.$router.push({
          path: path
        });
      },
      routeClose (index) {
        var that = this;
        that.$store.commit({
          type: 'reduceRoute',
          paras: {
            index: index,
            vueParent: that
          }
        });
      },
      routeCloseAll () {
        let that = this;
        //        console.log(that.getRouteArr);
        //        console.log(that.$route.fullPath);
        //        console.log(that.$route.name);
        if ((that.getRouteArr.length + that.showMoreMenu.length) == 1) {
          return false;
        }
        that.$confirm('您确定要关闭所有标签吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$store.commit({
            type: 'closeAllRoute',
            paras: {
              vueParent: that
            }
          });
        }).catch((errors) => {
          console.log(errors);
        });
      },
      nextRouteEvent (option) {
        let that = this;
        //        console.log(that.getRouteArr);
        //        console.log(that.showMoreMenu);
        //        console.log(that.$route.fullPath);
        //        console.log(that.$route.name);
        if (option == 'left') {
          if (that.getRouteArr.length + that.showMoreMenu.length == 1) {
            return false;
          } else {
            //            console.warn(that.getRouteArr);
            //            console.warn(that.showMoreMenu);
            //            console.warn(that.$route.fullPath);
            //            console.warn(that.$route.name);
            let runFlag = false;
            for (let i = 0; i < that.getRouteArr.length; i++) {
              if (that.$route.name == that.getRouteArr[i].route.name) {
                runFlag = true;
                if (i == 0) { // 向左在正常菜单第一个
                  return false;
                } else { // 向左在正常菜单不是第一个
                  //                  if (that.$route.name == 'residentInfoDetail') {
                  //                    that.$store.commit({
                  //                      type: 'addRoute',
                  //                      route: that.$route
                  //                    })
                  //                  }
                  that.routeTo(that.getRouteArr[i - 1].route.fullPath);
                }
              }
            }
            if (runFlag) {
              return false;
            }
            for (let i = 0; i < that.showMoreMenu.length; i++) {
              if (that.$route.name == that.showMoreMenu[i].route.name) {
                if (i == 0) { // 向左从更多菜单进入正常菜单
                  //                  if (that.$route.name == 'residentInfoDetail') {
                  //                    that.$store.commit({
                  //                      type: 'addRoute',
                  //                      route: that.$route
                  //                    })
                  //                  }
                  that.routeTo(that.getRouteArr[that.getRouteArr.length - 1].route.fullPath);
                } else { // 向左在更多菜单不是更多菜单的第一个
                  //                  if (that.$route.name == 'residentInfoDetail') {
                  //                    that.$store.commit({
                  //                      type: 'addRoute',
                  //                      route: that.$route
                  //                    })
                  //                  }
                  that.routeTo(that.showMoreMenu[i - 1].route.fullPath);
                }
              }
            }
          }
        } else if (option == 'right') {
          //          console.warn(that.getRouteArr);
          //          console.warn(that.showMoreMenu);
          //          console.warn(that.$route.fullPath);
          //          console.warn(that.$route.name);
          if (that.getRouteArr.length + that.showMoreMenu.length == 1) {
            return false;
          } else {
            // 此标记的作用是：当执行了第一个for循环，有成立的if的时候，会跳转路由，
            // 如果从getRouteArr进入了更多菜单showMoreMenu，此时继续往下会执行第二个for循环，从而产生bug；所以用标记只执行一个for循环
            let runFlag = false;
            for (let i = that.getRouteArr.length - 1; i >= 0; i--) {
              if (that.$route.name == that.getRouteArr[i].route.name) {
                runFlag = true;
                if (that.getRouteArr.length - 1 == i && that.showMoreMenu.length > 0) { // 向右进入更多菜单
                  //                  if (that.$route.name == 'residentInfoDetail') {
                  //                    that.$store.commit({
                  //                      type: 'addRoute',
                  //                      route: that.$route
                  //                    })
                  //                  }
                  // console.log(that.showMoreMenu[0].route.fullPath);
                  that.routeTo(that.showMoreMenu[0].route.fullPath);
                } else if (that.getRouteArr.length - 1 == i && that.showMoreMenu.length == 0) {
                  return false;
                } else { // 向右还在正常菜单
                  if (that.$route.name == 'residentInfoDetail') {
                    that.$store.commit({
                      type: 'addRoute',
                      route: that.$route
                    });
                  }
                  that.routeTo(that.getRouteArr[i + 1].route.fullPath);
                }
              }
            }
            if (runFlag) {
              return false;
            }
            for (let i = that.showMoreMenu.length - 1; i >= 0; i--) {
              if (that.$route.name == that.showMoreMenu[i].route.name) {
                if (that.showMoreMenu.length - 1 == i) {
                  return false;
                } else {
                  //                  if (that.$route.name == 'residentInfoDetail') {
                  //                    that.$store.commit({
                  //                      type: 'addRoute',
                  //                      route: that.$route
                  //                    })
                  //                  }
                  that.routeTo(that.showMoreMenu[i + 1].route.fullPath);
                }
              }
            }
          }
        }
      }
    }
  };
</script>
