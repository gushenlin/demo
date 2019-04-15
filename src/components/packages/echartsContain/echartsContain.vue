<template>
  <div class="echartsContain clear">
    <div class="leftContain" v-if="containType==='left'" :style="{ height: parentHeight*heightRatio + 'px',width:widthRatio*100+'%' }">
      <slot></slot>
    </div>
    <div class="rightContain" v-if="containType==='right'" :style="{ height: parentHeight*heightRatio + 'px',width:'calc('+widthRatio*100+'% - '+10+'px)' }">
      <slot></slot>
    </div>
    <div class="bigContain" v-if="containType==='big'" :style="{ height: parentHeight*heightRatio + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'echartsContain',
    mixins: [],
    data () {
      return {};
    },
    props: {
      containType: {
        type: String,
        default: 'left'
      },
      parentHeight: {
        type: Number,
        required: true
      },
      heightRatio: {
        type: Number,
        default: 0.45
      },
      widthRatio: {
        type: Number,
        default: 0.7
      }
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
  .echartsContain{
    position: relative;
  }
  .leftContain {
    /*border: 1px solid #d8dde3;*/
    float: left;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    overflow: hidden;
  }

  .rightContain {
    /*border: 1px solid #d8dde3;*/
    float: right;
    margin-bottom: 10px;
    padding: 5px;
    overflow: hidden;
  }

  .bigContain {
    width: 100%;
    /*border: 1px solid #d8dde3;*/
    margin-bottom: 10px;
    float: left;
    padding: 5px 5px 5px 0;
    overflow: hidden;
  }
  .clear:after {
    clear: both;
  }
  .furthurDetail .bigContain {
    padding-left: 62px;
  }
</style>
