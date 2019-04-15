<template>
  <div id="app">
    <app-header></app-header>
    <app-view></app-view>
    <!-- <app-footer></app-footer>  -->
  </div>
</template>

<script>
  import header from 'components/packages/header/header';
  import view from 'components/packages/view/view';
  // import footer from 'components/packages/footer/footer';
  import 'assets/css/base.css';
  import 'assets/css/reset.css';
  import './index.css';

  export default {
    name: 'app',
    components: {
      'app-header': header,
      'app-view': view
    },
    computed: {
      getRouteArr () {
        return this.$store.state.user.routeArr.slice(0);
      }
    },
    watch: {
      $route () {
        if (this.$route.fullPath === '/visualizationIndex' && this.getRouteArr.length === 1) {
          if (document.querySelector('.route-menu .el-tag__close')) {
            document.querySelector('.route-menu .el-tag__close').style.display = 'none';
          }
        } else {
          if (document.querySelector('.route-menu .el-tag__close')) {
            document.querySelector('.route-menu .el-tag__close').style.display = 'inline-block';
          }
        }
      },
      getRouteArr () {
        if (this.getRouteArr.length) {
          if (this.getRouteArr[0].route.fullPath === '/visualizationIndex' && this.getRouteArr.length === 1) {
            this.$nextTick(() => {
              if (document.querySelector('.route-menu .el-tag__close')) {
                var closeEls = document.querySelectorAll('.route-menu .el-tag__close');
                if (closeEls) {
                  Array.prototype.forEach.call(closeEls, function (close) {
                    close.style.display = 'none';
                  });
                }
              }
            });
          } else {
            this.$nextTick(() => {
              var closeEls = document.querySelectorAll('.route-menu .el-tag__close');
              if (closeEls) {
                Array.prototype.forEach.call(closeEls, function (close) {
                  close.style.display = 'inline-block';
                });
              }
            });
          }
        }
      }
    }
  };
</script>
<style>
</style>
