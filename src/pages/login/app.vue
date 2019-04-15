<template>
  <div id="app">
    <div class="login-header">
      <img :src="'./static/img/yunpai.png'" width="127" />
      <img :src="'./static/img/yunpai-title.png'" width="127" />
    </div>
    <div class="cloud-login-container">
      <div class="login-box " :class="{'login-ie9':ie}">
        <div class="select4">
          <span v-for="(item,index) in whichclient" :key="item.id" @click="chooseis(item.id,index)"
                v-bind:class="userinfomation.ischeck == item.id?'select4_selected':''">{{ item.name }}</span>
        </div>

        <h3 class="rooth3">用户登陆</h3>

        <div class="name">
          <p class="tip">用户名：</p>
          <div class="box">
            <img src="./images/name.png" width="19" class="icon">
            <el-input v-model.trim="userinfomation.userName" placeholder="请输入用户名" class="name"
                      auto-complete="off"></el-input>
          </div>
        </div>
        <div class="password">
          <p class="tip">密码：</p>
          <div class="box"><img src="./images/password.png" width="19" class="icon">
            <el-input v-model.trim="userinfomation.password" placeholder="请输入密码" @keyup.enter.native="login"
                      class="password"
                      type="password" auto-complete="off" ref="password"></el-input>
          </div>
        </div>

        <div class="checkboxs">
          <el-checkbox v-model="userinfomation.rememberme" @change="changeRememberme">记住密码</el-checkbox>
          <!--<el-checkbox style="margin-left:-30px;" v-model="userinfomation.automaticLanding" @change="changeAutomaticLanding">自动登录</el-checkbox>-->
          <span style="color:#2b9bff;"></span>
        </div>

        <!-- 错误 -->
        <div class="errorDiv">
          <el-alert class="tipError" v-if="errorText" :title="errorText" type="error" :closable="false"></el-alert>
        </div>
        <div class="login-button-box">
          <el-button @click="login" class="login-button" type="warning">登 录</el-button>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-container">深圳中兴网信科技有限公司-智慧城市解决方案提供商 版权所有 粤ICP备11108557号-17</div>
    </div>
  </div>
</template>
<script>
import utils from 'components/utils';
import { MessageBox, Loading } from 'element-ui';
import 'assets/css/base.css';
import 'assets/css/reset.css';

export default {
  name: 'login',
  components: {},
  data () {
    return {
      whichclient: [
        {id: 2, name: '医院端'},
        {id: 3, name: '药店端'},
        {id: 0, name: '平台端'},
        {id: 1, name: '监管端'}
      ],
      userinfomation: {
        ischeck: '',
        userName: '',
        password: '',
        rememberme: false,
        automaticLanding: false
      },
      errorText: '',
      ie: false,
      checked: ''
    };
  },
  beforeCreate () { // 在初始话 实例化 之前

  },
  created () {
    this.initPage();
  },
  mounted () {
  },
  methods: {
    changeAutomaticLanding (val) {
      this.userinfomation.automaticLanding = val;
    },
    changeRememberme (val) {
      this.userinfomation.rememberme = val;
    },
    chooseis (val, indexs) {
      this.userinfomation.ischeck = val;
    },
    initPage () {
      // userinfomation
      if (localStorage.getItem('userinfomation')) {
        let userinfomation = JSON.parse(localStorage.getItem('userinfomation'));
        this.userinfomation.ischeck = userinfomation.ischeck;
        this.userinfomation.userName = userinfomation.userName;
        this.userinfomation.rememberme = userinfomation.rememberme;
        this.userinfomation.automaticLanding = userinfomation.automaticLanding;
        if (this.userinfomation.rememberme) {
          this.userinfomation.password = this.$aes.decrypt(userinfomation.password, '3276544ab4347b6d24a024aa132d3913');
        }
        if (this.userinfomation.automaticLanding) {
          this.login();
        }
      }
      if (JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')) && JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin && JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin.data && JSON.parse(sessionStorage.getItem('MENULIST'))) {
        window.location.href = './index.html';
      }
    },
    login () {
      var that = this;
      // 用户名校验,暂时只做空校验
      if (!that.userinfomation.userName) {
        that.errorText = '用户名为空,请输入用户名';
        document.querySelector('.login-box .name .el-input__inner').focus();
        return false;
      }
      // 密码校验，暂时只做空校验
      if (!that.userinfomation.password) {
        that.errorText = '密码为空,请输入密码';
        document.querySelector('.login-box .password .el-input__inner').focus();
        return false;
      }
      let logindata = null;
      logindata = {
        telephone: that.userinfomation.userName,
        password: that.$aes.encrypt(that.userinfomation.password, '3276544ab4347b6d24a024aa132d3913'),
        platformType: that.userinfomation.ischeck || 0
      };

      let userinfomation = Object.assign({}, that.userinfomation);
      userinfomation.password = that.$aes.encrypt(that.userinfomation.password, '3276544ab4347b6d24a024aa132d3913');
      localStorage.setItem('userinfomation', JSON.stringify(userinfomation));

      let loadingInstance = Loading.service({text: '拼命加载中...', background: 'rgba(0, 0, 0, 0.15)'});// 在获取权限前显示loading
      that.$axios({ // 登陆
        method: 'POST',
        url: `/peps/login/ajaxLogin`,
        headers: {'content-type': 'application/json'},
        data: logindata
      }).then(function (response) {
        loadingInstance.close();// 在获取权限后关闭loading
        if (response.data.code !== 0) {
          that.errorText = response.data.message;
        } else { // 登陆成功
          that.$store.commit('USER_SIGNIN', {'userLogin': response.data});

          that.errorText = '';
          // 保存登陆 返回信息

          that.$axios({ // 登陆
            method: 'get',
            url: `/peps/login/userInfo`,
            headers: {'Authorization': response.data.data}
          }).then(function (response) {
            sessionStorage.setItem('userInfo', JSON.stringify(response.data.data));
            that.loadMenuInfo(loadingInstance).then(() => {
              loadingInstance.close();// 在获取权限后关闭loading
              window.location.href = './index.html';
            }).catch(() => {
              loadingInstance.close();// 在获取权限后关闭loading
              MessageBox.confirm('获取菜单失败，请联系系统管理员！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showCancelButton: false
              }).then(() => {

              }).catch((errors) => {

              });
              console.log(error);
            });
          }).catch(function (error) {
            loadingInstance.close();// 在获取权限后关闭loading
            that.errorText = '获取用户信息失败，请联系系统管理员！';
            console.log(error);
          });
        }
      }).catch(function (error) {
        loadingInstance.close();// 在获取权限后关闭loading
        console.log(error);
      });
    },
    // 菜单排序
    handleMenuList (menuList) {
      let handleAfrerMenuList = [];
      menuList.forEach((menuItem1) => {
        if (menuItem1.level == '2') {
          // debugger
          menuItem1.children = [];
          menuList.forEach((menuItem2) => {
            // debugger
            if (menuItem1.id === menuItem2.parentId) {
              menuItem1.children.push(menuItem2);
            }
          });
          menuItem1.children.sort(utils.compareAscending('menuOrder'));
          handleAfrerMenuList.push(menuItem1);
        }
      });
      handleAfrerMenuList.sort(utils.compareAscending('menuOrder'));
      return handleAfrerMenuList;
    },
    // 获取菜单列表
    loadMenuInfo (loadingInstance) {
      let that = this;
      return new Promise((resolve, reject) => {
        let userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
        let token = userLogin.data;
        // console.log('发送' + JSON.stringify(params));
        that.$axios({
          method: 'get',
          headers: {'Authorization': token},
          url: '/peps/management/menu/queryMenuByRole?t=' + (+new Date())
        }).then(function (response) {
          loadingInstance.close();// 在获取权限后关闭loading
          let data = response.data;
          if (data.code == '0') {
            let menuList = data.data;

            if (menuList.length > 0) {
              let handleAfrerMenuList = that.handleMenuList(menuList);
              that.$store.commit({
                type: 'saveMenuList',
                paras: handleAfrerMenuList
              });
              resolve(handleAfrerMenuList);
            } else {
              MessageBox.confirm('无访问权限，请联系系统管理员！', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                showCancelButton: false
              }).then(() => {

              }).catch((errors) => {

              });
            }
          } else {
            MessageBox.confirm('获取菜单失败，请联系系统管理员！', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).then(() => {

            }).catch((errors) => {

            });
          }
        }).catch(() => {
          loadingInstance.close();// 在获取权限后关闭loading
          MessageBox.confirm('获取菜单失败，请联系系统管理员！', '提示', {
            confirmButtonText: '确定',
            type: 'warning',
            showCancelButton: false
          }).then(() => {

          }).catch((errors) => {

          });
        });
      }).catch((errors) => {
        loadingInstance.close();// 在获取权限后关闭loading
        MessageBox.confirm('获取菜单失败，请联系系统管理员！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        }).then(() => {

        }).catch((errors) => {

        });
      });
    }
  }
};
</script>
