import utils from 'components/utils';
const mixins = {
  data () {
    return {
      routerViewHeight: 1
    };
  },
  created () {
    if (this.$route != undefined) {
      if (this.$route.name && this.$route.name !== 'notFind') {
        this.$store.commit({
          type: 'addRoute',
          route: this.$route
        });
      }
    }
  },
  activated () { // 由于keep-alive的组件，再次进入的时候只执行这个生命周期，所以添加此生命周期解决再次进入的时候，顶部tab标签不增加的bug
    if (this.$route != undefined) {
      if (this.$route.name && this.$route.name !== 'notFind') {
        this.$store.commit({
          type: 'addRoute',
          route: this.$route
        });
      }
    }

    let that = this;
    that.$nextTick(() => {
      // 多个图表的自适应 添加监听器
      if (window.addEventListener && that.resize && typeof that.resize == 'function') { // 所有主流浏览器，除了 IE 8 及更早版本
        window.addEventListener('resize', that.resize);
      } else if (window.attachEvent && that.resize && typeof that.resize == 'function') { // IE 8 及更早版本
        window.attachEvent('onresize', that.resize);
      }
      // 切换路由进的时候执行一次resize
      if (that.resize && typeof that.resize == 'function') {
        that.resize();
      }
      if (that.doLayout) {
        that.doLayout();
      }
    });
  },
  computed: {
    getRouteArr () {
      if (this.$store && this.$store.state) {
        return this.$store.state.user.routeArr.slice(0);
      }
    }
  },
  methods: {
    isDate () {
      let result = true;
      let startDate = new Date(utils.formateDate(this.params_ruleForm.startTime)).getTime();
      let endDate = new Date(utils.formateDate(this.params_ruleForm.endTime)).getTime();
      if (!startDate) {
        this.$notice('开始业务日期不能为空！');
        result = false;
      } else if (!endDate) {
        this.$notice('结束业务日期不能为空！');
        result = false;
      } else if (startDate > endDate) {
        this.$notice('开始业务日期不能晚于结束业务日期！');
        result = false;
      }
      return result;
    }
  },
  beforeRouteEnter (to, from, next) {
    // 为了解决关闭顶部tab标签页以后，重新打开此菜单的tab标签缓存了上次关闭时的内容，为了不缓存上次的内容，所以清空表单并重新请求
    next(vm => {
      let flag = false;
      for (let i = 0, len = vm.getRouteArr.length; i < len; i++) {
        if (vm.getRouteArr[i].route.name === to.name || vm.getRouteArr[i].route.name + 'Add' === to.name || vm.getRouteArr[i].route.name === to.name + 'Add') {
          flag = true;
          break;
        }
      }
      if (!flag && vm.initPage) {
        if (vm.ruleForm) {
          Object.keys(vm.ruleForm).forEach(key => (vm.ruleForm[key] = ''));
        }
        vm.initPage();
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    let that = this;
    that.$nextTick(() => { // 切换到别的路由的时候移除监听器
      if (window.removeEventListener && that.resize && typeof that.resize == 'function') { // 所有主流浏览器，除了 IE 8 及更早版本
        window.removeEventListener('resize', that.resize);
      } else if (window.detachEvent && that.resize && typeof that.resize == 'function') { // IE 8 及更早版本
        window.detachEvent('onresize', that.resize);
      }
    });
    next();
  }
};

export default mixins;
