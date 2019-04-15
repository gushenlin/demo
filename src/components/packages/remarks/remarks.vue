<template>
  <div class="remarks-contain">
    <div class="iconCon">
      <slot name="icon"></slot>
    </div>
    <span class="logo">备注：</span>
    <div class="content">
      <slot class="2222"></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
  import './remarks.css';
  export default {
    name: 'remarks',
    mixins: [],
    data () {
      return {};
    },
    components: {},
    watch: {},
    computed: {},
    created () {

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
