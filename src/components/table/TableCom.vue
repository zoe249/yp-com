<!--
 * @Description: 封装穿梭框
 * @Version: 1.5.1
 * @Author: Yuchuan
 * @Date: 2020-10-29 17:20:07
-->
<template>
  <div>
    <div>
      <el-table :data="list" border ref="selectionTable">
        <el-row v-for="(item, index) in propArr" :key="index">
          <el-table-column v-if="item.type === 'img'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              <img style="width:50px;height:50px" :src="scope.row.icon" alt="" />
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'index'" type="index" align="center" :label="item.label" width="60px"></el-table-column>
          <el-table-column v-else-if="item.type === 'select'" type="selection" width="50"> </el-table-column>
          <el-table-column v-else-if="item.type === 'trueOrFalse'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row[item.props]" @change="servicePublishChange(scope.row)"> </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column v-else-if="item.type === 'operation'" :label="item.label" align="center">
            <template slot-scope="scope">
              <span style="padding-right:5px;padding-left:5px;" v-for="(btn, indexs) in item.operationList" :key="indexs">
                <el-link :type="btn.type" :icon="btn.icon" :size="btn.size" @click="handleButton(btn.methods, scope.row)"> {{ btn.label }}</el-link>
              </span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column v-else-if="item.type === 'status'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ item.render(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'time'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope"> {{ item.formatter(scope.row) | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'user'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ item.userChange(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column v-else :prop="item.props" :label="item.label" align="center"></el-table-column>
        </el-row>
      </el-table>
    </div>
  </div>
</template>
<script>
import { parseTime } from '@/filters/format.js'
export default {
  computed: {},
  props: {
    //  数据信息
    listInfo: {
      type: Array
    },
    // 展示的列表
    propArr: {
      type: Array
    },
    trueOrFalse: {
      type: Boolean
    }
  },
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  created() {
    parseTime()
  },

  data() {
    return {
      list: [], // 接受的信息
      nowStatus: true,
      trueStatus: true,
      falseStatus: false,
      ddd: {}
    }
  },
  methods: {
    //   滑块事件
    servicePublishChange(row) {
      console.log(row)
      this.$emit('swichChange', row)
    },
    // 增加删除事件
    handleButton(methods, row) {
      if (methods === 'delete') {
        this.$emit('deleteEvent', row)
      } else if (methods === 'detail') {
        // console.log('1111')
        this.$emit('editEvent', row)
      }
    }
  },
  watch: {
    listInfo: function(val) {
      this.list = val
    }
  }
}
</script>
<style lang="scss" scoped></style>
