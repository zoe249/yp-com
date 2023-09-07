<template>
  <el-main>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column v-for="(item, index) in tableLabel" :key="index" :prop="item.prop" :label="item.label"> </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
export default {
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 表格头部文字
    tableLabel: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  created() {}
}
</script>

<style lang="scss" scoped></style>
