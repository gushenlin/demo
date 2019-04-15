<template>
  <div class="card">
    <ul class="lista">
      <li>
        <div class="bc1">
          <span><em>{{dataStatistics.hospitals}}</em>家</span>
          <i class="icon-hospital"></i>
          <p>医院机构</p>
        </div>
      </li>
      <li>
        <div class="bc2">
          <span><em>{{dataStatistics.doctors}}</em>人</span>
          <i class="icon-doctor"></i>
          <p>医生数量</p>
        </div>
      </li>
      <li>
        <div class="bc3">
          <span><em>{{dataStatistics.patients}}</em>人</span>
          <i class="icon-huanzhe"></i>
          <p>处方患者</p>
        </div>
      </li>
      <li>
        <div class="bc4">
          <span><em>{{dataStatistics.prescriptions}}</em>张</span>
          <i class="icon-report"></i>
          <p>处方张数</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'card',
    mixins: [],
    data () {
      return {};
    },
    props: {
      dataStatistics: {
        type: Object,
        default () {
          return {
            hospitalNum: '0',
            doctorNum: '0',
            patientNum: '0',
            prescriptionNum: '0'
          };
        }
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

  .lista {
    margin-right: -22px;
    width: 100%;
  }

  .lista li {
    width: 24%;
    display: inline-block;
    padding-right: 22px;
  }

  .lista li > div {
    height: 136px;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    padding: 30px 25px;
    position: relative;
  }

  .bc1 {
    background:linear-gradient(150deg,rgba(251,149,97,1),rgba(248,106,94,1));
  }
  .icon-hospital{position: absolute; top: 18px; right: 18px}

  .bc2 {
    background:linear-gradient(150deg,rgba(79,175,246,1),rgba(144,109,246,1));
  }
  .icon-doctor{position: absolute; top: 18px; right: 18px}

  .bc3 {
    background:linear-gradient(150deg,rgba(68,210,251,1),rgba(70,117,246,1));
  }
  .icon-huanzhe{position: absolute; top: 18px; right: 18px}

  .bc4 {
    background:linear-gradient(150deg,rgba(157,229,121,1),rgba(61,199,135,1));
  }
  .icon-report{position: absolute; top: 18px; right: 18px}

  .lista div p {
    /*font-weight: bold;*/
    margin-top: 8px;
    font-size: 18px;
  }

  .lista div span {
    /*margin-top: 8px;*/
  }

  .lista div span em {
    font-weight: bold;
    font-size: 30px;
  }

  .icon-hospital, .icon-huanzhe, .icon-doctor, .icon-report {
    width: 59px;
    height: 60px;
    display: inline-block;
    background: url("./images/hospital.png") no-repeat center;
    background-size: cover;
    vertical-align: text-bottom;
    margin-right: 5px;
  }

  .icon-huanzhe {
    background: url("./images/huanzhe.png") no-repeat center;
    background-size: cover;
  }

  .icon-doctor {
    background: url("./images/doctor.png") no-repeat center;
    background-size: cover;
  }

  .icon-report {
    background: url("./images/report.png") no-repeat center;
    background-size: cover;
  }
</style>
