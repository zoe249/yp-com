<!--
 * @Author: your name
 * @Date: 2020-12-02 10:35:47
 * @LastEditTime: 2020-12-03 11:22:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \double-bass-web-project\src\components\pagination\YpPagination.vue
-->
<template>
  <div class="showPage">
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-show="total > 1"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  // 子组件给父组件传值用props
  props: {
    currentPage: {
      type: Number,
      default: () => {}
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 40, 60, 100]
      }
    },
    pageSize: {
      type: Number,
      default: () => {
        return 20
      }
    },
    total: {
      type: Number,
      default: () => {}
    }
  },
  methods: {
    //   改变每页显示多少条数据时发射时间并传递修改后每页显示条数给父组件
    handleSizeChange(val) {
      // 父组件给子组件传值用$emit
      this.$emit('sizeChange', val)
    },
    // 改变当前第几页时间时发射事件并传递修改后第几页参数给父组件
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    }
  }
}
</script>
