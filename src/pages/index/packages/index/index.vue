 <template>
    <div class="page">
        我是首页
    </div>
</template>

<script type="text/javascript">
    export default {
      name: 'index',
      mixins: [],
      data () {
        return {};
      },
      components: {},
      watch: {

      },
      computed: {

      },
      created () {
        let platformType = JSON.parse(sessionStorage.getItem('userInfo')).platformType;
        if (platformType == 1) {
          this.$router.push({
            name: this.$parent.menuList[0].path
          });
        } else {
          this.$router.push({
            name: this.$parent.menuList[0].children[0].path.replace('/', '')
          });
        }
      },
      mounted () {

      },
      methods: {},
      beforeRouteEnter (to, from, next) {
        next();
      },
      beforeRouteLeave (to, from, next) {
        next();
      }
    };
</script>

<style scoped>

</style>
