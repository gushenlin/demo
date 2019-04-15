<template>
  <div class="cloud-pagination clearfix" style="width:100%" v-show="data[listName] && data[listName].length > 0">
    <div style="float:right;position: relative;">
      <div class="cloud-pagination__page">
        显示{{(data[pageNoName] - 1) * data[pageSizeName] + 1}}到{{data[pageSizeName] * data[pageNoName] > data[totalNumName] ? data[totalNumName] : data[pageSizeName] * data[pageNoName]}},共{{data[totalNumName]}}记录
      </div>
      <el-pagination ref="pagination" @size-change="sizeChange"
                     @current-change="currentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="pageSizesConfig"
                     :page-size.sync="currentSize"
                     :layout="config"
                     :total="data[totalNumName]"
                     prev-text=" "
                     next-text=" ">
      </el-pagination>
      <el-button @click="currentChange(currentPage)" size="mini" class="pagination-button">
      </el-button>
      <el-button type="text" class="btn-first btn-custom" @click="firstOrLastPage(1)"
                 :class="{'disabled': data[pageNoName] === 1}"></el-button>
      <el-button type="text" class="btn-last btn-custom" @click="firstOrLastPage(data[totalPageName])"
                 :class="{'disabled': data[pageNoName] === data[totalPageName]}"></el-button>
      <el-button type="text" class="btn-refresh btn-custom" @click="currentChange(currentPage)"></el-button>
    </div>
  </div>
</template>
<script>
  import {on} from 'components/utils/dom';

  export default {
    name: 'pagination',
    props: {
      data: {// data对象下面有content、totalCount、totalPage、pageSize、pageNo这些属性，如果不是这些属性，可以传入对应的属性名
        type: Object,
        required: true
      },
      listName: {// data对象下列表list的key名字
        type: String,
        default: 'content'
      },
      totalNumName: {// 默认 总条数 的名字
        type: String,
        default: 'totalCount'
      },
      totalPageName: {// 默认 总页数 的名字
        type: String,
        default: 'totalPage'
      },
      pageNoName: {// 默认 当前为第几页 的名字
        type: String,
        default: 'pageNo'
      },
      pageSizeName: {// 默认 每页多少条 的名字
        type: String,
        default: 'pageSize'
      },
      totalPage: {
        type: Boolean,
        default: true
      },
      config: {
        type: String,
        default: 'sizes,prev, pager, next, jumper'
      },
      pageSizesConfig: {// Props with type Object/Array must use a factory function to return the default value.
        type: Array,
        default () {
          return [10, 15, 20, 30];
        }
      }
    },
    data () {
      return {
        currentPage: 1, // 当前第几页
        currentSize: 10// 当前每页多少条
      };
    },
    computed: {
      pageNo () {
        return this.data[this.pageNoName];
      },
      pageSizeInit () {
        return this.data[this.pageSizeName];
      }
    },
    watch: {
      pageSizeInit () {
        this.currentSize = this.pageSizeInit;
      },
      pageSizesConfig (newValue, oldValue) {
        this.currentSize = newValue[0];
      },
      pageNo (newValue, oldValue) {
        if (newValue === 1) { // 直接进入第一次的时候，才给当前页赋初始值
          this.currentPage = newValue;
        }
      }
    },
    created () {
    },
    updated () {
      let that = this;
      let el;
      that.$nextTick(() => { // 修改页码输入框输入不符合规则的数字
        el = document.querySelector('.el-pagination__editor .el-input__inner');
        on(el, 'blur', () => { // 绑定失焦事件
          that.$nextTick(() => {
            if (el && !(/(^[1-9]\d*$)/.test(el.value))) {
              el.value = 1;
            }
          });
        });
        if (el && !(/(^[1-9]\d*$)/.test(el.value))) { // 更新数据时候触发
          el.value = 1;
        }
      });
    },
    methods: {
      sizeChange (size) {
        this.currentSize = size;
        if (this.currentPage === 1) {
          this.$emit('change', 1, size);
        } else {
          this.currentPage = 1;// 赋值后页面变化触发currentChange事件，所以不用写事件，elementui已经封装了事件
        }
        let el = document.querySelector('.el-pagination__editor .el-input__inner');
        el.focus();// 解决显示页数的输入框显示上一次 的bug
        this.$nextTick(() => {
          if (el) {
            el.value = this.currentPage;
          }
          el.blur();
        });
      },
      currentChange (page) {
        if (!(/(^[1-9]\d*$)/.test(page))) { // 检测正整数
          page = 1;
        }
        if (!this.currentSize) {
          this.currentSize = 10;
        }
        this.$emit('change', page, this.currentSize);
      },
      firstOrLastPage (page) {
        if (this.$refs.pagination.internalCurrentPage === page && page === 1) {
          return false;
        }
        if (this.$refs.pagination.internalCurrentPage === this.data[this.totalPageName] && page === this.$refs.pagination.internalCurrentPage) {
          return false;
        }
        this.currentPage = page;
      }
    },
    mounted () {
    }
  };
</script>


<style>
  .cloud-pagination .pagination-button {
    margin-bottom: 2px;
    margin-right: 0;
    border: 1px solid #d1dce6;
    width: 30px;
    height: 26px;
    background: url("./images/go.png") no-repeat center;
    position: absolute;
    right: 30px;
    top: 4px;
  }

  .cloud-pagination .el-pagination .el-icon-arrow-left:before {
    content: "\E605";
    color: #50759e;
  }

  .cloud-pagination .el-pagination .el-icon-arrow-right:before {
    content: "\E606";
    color: #50759e;
  }

  .cloud-pagination .el-pagination .el-select .el-input {
    width: 90px;
  }

  /*新分页样式*/
  .cloud-pagination .pageSize {
    width: 47px;
    height: 19px;
    margin-right: 15px;
  }

  .cloud-pagination .pages {
    width: 27px;
    height: 19px;
    display: inline-block;
  }

  .cloud-pagination .pages .el-input__inner {
    text-align: center;
    padding: 0;
  }

  .cloud-pagination .btn {
    width: 8px;
    height: 20px;
    background: center no-repeat;
    margin: 0 4px;
  }

  .cloud-pagination .first {
    background-image: url('./images/first.png')
  }

  .cloud-pagination .prev {
    background-image: url('./images/prev.png')
  }

  .cloud-pagination .next {
    background-image: url('./images/next.png')
  }

  .cloud-pagination .last {
    background-image: url('./images/last.png')
  }

  .cloud-pagination .go {
    width: 20px;
    background-image: url('./images/go.png')
  }

  .cloud-pagination .refresh {
    width: 20px;
    background-image: url('./images/refresh.png')
  }

  .cloud-pagination .pageSize .el-input__inner {
    padding: 3px
  }

  .cloud-pagination .el-pagination {
    position: relative;
    width: 283px;
  }

  .cloud-pagination .el-pager {
    display: none;
  }

  .cloud-pagination .btn-prev {
    position: absolute;
    left: 99px;
    top: 3px;
    background: transparent url('./images/prev.png') no-repeat center !important;
    background-size: auto !important;
    border: none !important;
  }

  .cloud-pagination .btn-next {
    position: absolute;
    left: 187px;
    top: 3px;
    background: transparent url('./images/next.png') no-repeat center !important;
    background-size: auto !important;
    border: none !important;
  }

  .cloud-pagination .el-pagination__editor {
    position: relative;
    left: -85px;
    top: 0;
    width: 45px !important;
    border: none;
  }

  .cloud-pagination .el-pagination__editor .el-input__inner {
    padding: 0;
    text-align: center;
  }

  .cloud-pagination .el-pagination .btn-next {
    position: relative;
    left: 45px;
    top: 1px;
  }

  .cloud-pagination .el-pagination button.disabled {
    background-color: transparent;
  }

  .cloud-pagination .el-pagination__jump {
    color: transparent;
  }

  .cloud-pagination .btn-custom {
    background: transparent no-repeat center;
    background-size: auto;
    width: 16px;
    height: 28px;
    position: absolute;
    top: 3px;
    margin-right: 0;
  }

  .cloud-pagination .btn-first {
    background-image: url('./images/first.png');
    right: 165px;
  }

  .cloud-pagination .btn-last {
    background-image: url('./images/last.png');
    right: 72px;
  }

  .cloud-pagination .btn-refresh {
    background-image: url('./images/refresh.png');
    right: 5px;
  }

  .cloud-pagination .el-pagination {
    display: inline-block;
  }

  .cloud-pagination .disabled {
    cursor: not-allowed;
  }

</style>
