<template>
  <div class="footer">{{footerTxt}}</div>
</template>

<script>
  export default {
    name: 'appFooter',
    data () {
      return {};
    },
    props: {
      footerTxt: {
        type: String,
        default: '© 2018 深圳中兴网信科技有限公司 版权所有'
      }
    }
  };
</script>
<style scoped>
  .footer {
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    text-align: center;
  }
</style>
