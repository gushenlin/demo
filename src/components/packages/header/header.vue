<template>
  <div class="cloud-header clearfix" :class="{'onclick':isDislpayArrow}">

    <router-link :to="{ name: 'index'}" class="cloud-header-logo">
      <!--zteictlogo-->
      <!--<img :src="'./static/img/'+logo" />-->
      <span class="head-title">{{platformName}}</span>
    </router-link>

    <div class="cloud-header-info">
      <!-- <div v-if="username">
        <div class="welcomeText">您好，{{username}}</div>
        <div class="logout" @click="logout">退出</div>
      </div> -->
      <div class="welcomeText">您好，{{username}}</div>
      <div class="logout changpass" @click="dialogFormVisible=true">修改密码</div>
      <div class="logout" @click="logout">退出</div>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="ruleForm" :rules="rules" label-width="90px" style="padding-right:20px " ref="ruleForm"
               class="el-dialog--center">
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-input v-model.trim="ruleForm.oldPassword" placeholder="请输入旧密码" type="password"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model.trim="ruleForm.newPassword" placeholder="请输入新密码" type="password"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword">
          <el-input v-model.trim="ruleForm.confirmPassword" placeholder="请输入确认密码" type="password"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer el-dialog--center">
        <el-button @click="cancelSubmit">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import './header.css';
import utils from 'components/utils';

export default {
  name: 'appHeader',
  data () {
    /*eslint-disable*/
    let oldPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else if (/[·【】；”“‘’，。、！￥……（）——{}：“《》？]/g.test(value) || /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
        callback(new Error('旧密码不能包含中文符号'));
      } else if (/\s/g.test(value)) {
        callback(new Error('旧密码不能包含空格'));
      } else {
        callback();
      }
    };
    let newPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (/[·【】；”“‘’，。、！￥……（）——{}：“《》？]/g.test(value) || /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
        callback(new Error('新密码不能包含中文符号'));
      } else if (/\s/g.test(value)) {
        callback(new Error('新密码不能包含空格'));
      } else if (value === this.ruleForm.userName) {
        callback(new Error('新密码与用户账号不能相同'));
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error('新密码与旧密码不能相同'));
      } else if (value.length > 20) {
        callback(new Error('新密码长度不能超过20个字符'));
      } else if (value.length < this.passwordStrategy.atLeastLen) {
        callback(new Error('新密码长度不能少于' + this.passwordStrategy.atLeastLen + '个字符'));
      } else if (this.passwordStrategy.capitalLetter === 'Y' && !/[A-Z]/g.test(value)) {
        callback(new Error('新密码格式必须包含大写字母'));
      } else if (this.passwordStrategy.lowercaseLetter === 'Y' && !/[a-z]/g.test(value)) {
        callback(new Error('新密码格式必须包含小写字母'));
      } else if (this.passwordStrategy.numberLetter === 'Y' && !/\d/g.test(value)) {
        callback(new Error('新密码格式必须包含数字'));
      } else if (this.passwordStrategy.specialLetter === 'Y' && !/[\`\!\@\#\$\%\^\&\*\(\)\-\=\_\+\[\]\\\|\;\'\"\:\,\.\/\<\>\?\~\{\}]/g.test(value)) {
        callback(new Error('新密码格式必须包含特殊字符'));
      } else {
        callback();
      }
    };
    let confirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('新密码和确认密码不一致'));
      } else if (/[·【】；”“‘’，。、！￥%……（）——{}：“《》？]/g.test(value) || /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g.test(value)) {
        callback(new Error('确认密码不能包含中文符号'));
      } else if (/\s/g.test(value)) {
        callback(new Error('确认密码不能包含空格'));
      } else if (value.length > 20) {
        callback(new Error('确认密码长度不能超过20个字符'));
      } else if (value.length < this.passwordStrategy.atLeastLen) {
        callback(new Error('确认密码长度不能少于' + this.passwordStrategy.atLeastLen + '个字符'));
      } else if (this.passwordStrategy.capitalLetter === 'Y' && !/[A-Z]/g.test(value)) {
        callback(new Error('确认密码格式必须包含大写字母'));
      } else if (this.passwordStrategy.lowercaseLetter === 'Y' && !/[a-z]/g.test(value)) {
        callback(new Error('确认密码格式必须包含小写字母'));
      } else if (this.passwordStrategy.numberLetter === 'Y' && !/\d/g.test(value)) {
        callback(new Error('确认密码格式必须包含数字'));
      } else if (this.passwordStrategy.specialLetter === 'Y' && !/[\`\!\@\#\$\%\^\&\*\(\)\-\=\_\+\[\]\\\|\;\'\"\:\,\.\/\<\>\?\~\{\}]/g.test(value)) {
        callback(new Error('确认密码格式必须包含特殊字符'));
      } else {
        callback();
      }
    };
    return {
      platformName: '',
      username: '',
      dialogFormVisible: false,
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      rules: {
        oldPassword: [
          {required: true, validator: oldPassword, trigger: 'blur'},
        ],
        newPassword: [
          {required: true, validator: newPassword, trigger: 'blur'},
        ],
        confirmPassword: [
          {required: true, validator: confirmPassword, trigger: 'blur'},
        ],
      },
      token:'',
      userId:'',
      passwordStrategy: {
        atLeastLen: 6,
        capitalLetter: 'N',
        lowercaseLetter: 'N',
        numberLetter: 'N',
        specialLetter: 'N'
      }
    };
  },
  computed: {
    isDislpayArrow () {
      return this.$store.state.user.session_isDislpayArrow;
    },
  },
  watch: {},
  created () {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.token = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin.data;
    this.userId = userInfo.id;
    if (!userInfo) {
      this.$store.commit('USER_SIGNOUT');
      window.location.href = './login.html';
      return false;
    }
    this.username = userInfo.nickname;
    let whichclient = [
      {id: 2, name: '医院端'},
      {id: 3, name: '药店端'},
      {id: 0, name: '平台端'},
      {id: 1, name: '监管端'},
    ];
    for (let i = 0; i < whichclient.length; i++) {
      if (whichclient[i].id == userInfo.platformType) {
        this.platformName = whichclient[i].name;
        break;
      }
    }
  },
  methods: {
    submit () {
      var that = this;
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        that.$axios({  // 获取旧密码
          method: 'get',
          url: '/peps/management/user/getPassword?v=' + new Date(),
          headers: {'Authorization': that.token}
        }).then(function (response1) {
          let code = response1.data.code;
          let oldAes = that.$aes.encrypt(that.ruleForm.oldPassword, '3276544ab4347b6d24a024aa132d3913');
          if (code !== 0) {
            that.$notice('获取用户信息失败');
            return false;
          } 
          if (oldAes !== response1.data.data) {
            that.$notice('旧密码输入不正确');
            return false;
          }
          that.$axios({ //提交新密码
            method: 'post', 
            url: '/peps/management/user/changePassword?v=' + (+new Date()),
            headers: {'Authorization': that.token},
            data: {
              id: that.userId,
              password: that.ruleForm.newPassword
            },
          }).then(function (response) {
            let code = response.data.code;
            if (code === 0) {
              that.$notice('密码修改成功');
              utils.ssoLogout();
            } else {
              that.$warning();
            }
            that.$refs.ruleForm.resetFields();
          }).catch(function (error) {
            console.log(error);
          });
        }).catch(function (error) {
          console.log(error);
        });
      });
    },
    cancelSubmit () {
      for (let key in this.ruleForm) {
        this.ruleForm[key] = '';
      }
      this.$refs.ruleForm.resetFields();
      this.dialogFormVisible = false;
    },
    logout () {
      var that = this;
      that.$confirm('您确定退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        utils.ssoLogout();
      }).catch((errors) => {
        console.log(errors);
      });
    },
  },
};
</script>
<style scoped>

</style>
