<template>
  <el-table
    :data="list"
    stripe
    border
    :default-expand-all="expand"
    :height="height"
    class="scoll"
    :row-key="id"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    :tree-props="{ children: children }"
  >
    <!-- 循环表格标签以及类型 -->
    <el-row v-for="(item, index) in propArr" :key="index">
      <!-- 当父组件的type值等于'img'表示此列显示图片 -->
      <el-table-column v-if="item.type === 'img'" :prop="item.props" :label="item.label" align="center">
        <template slot-scope="scope">
          <img style="width:50px;height:50px" :src="scope.row[item.props] ? scope.row[item.props] : noAvatar" alt="" />
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="item.type === 'selection'" type="selection" :reserve-selection="true" width="50" :prop="item.props"> </el-table-column> -->
      <!-- 当父组件的type值等于'date'表示此列显示时间格式化 -->
      <el-table-column v-else-if="item.type === 'date'" :prop="item.props" :label="item.label" align="center" :width="item.width">
        <template slot-scope="scope"> {{ scope.row[item.props] | parseTime('{y}-{m}-{d}') }} </template>
      </el-table-column>
      <!-- 当父组件的type值等于'icon'表示此列显示图标 -->
      <el-table-column v-else-if="item.type === 'icon'" :prop="item.props" :label="item.label" align="center">
        <template slot-scope="scope">
          <i :class="scope.row[item.props]"></i>
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'select'表示此列显示checkbox -->
      <el-table-column v-else-if="item.type === 'select'" width="50" align="center">
        <template slot-scope="scope">
          <el-checkbox @change="changeStatus(scope.row, $event)" :disabled="valueChecked"></el-checkbox>
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'checkedAll'表示此列显示checkbox  update by qiaokun 2021-01-16-->
      <el-table-column v-else-if="item.type === 'checkedAll'" width="80" align="center" :label="item.label">
        <template slot="header">
          <!-- <slot name="checkedAll" :scope="scope.row"></slot> -->
          <el-checkbox v-model="item.isCheckedAll" @change="handleCheckAll($event)" :disabled="item.disabled">全选</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row[item.props]" @change="changeMethod(item.method, $event)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column v-else-if="item.type === 'checked'" width="90" align="center" :label="item.label">
        <template slot-scope="scope">
          <el-checkbox @change="changeStatus(scope.row, $event)" v-model="scope.row[item.props]"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column v-else-if="item.type === 'customChecked'" width="90" align="center" :label="item.label">
        <template slot="header">
          <el-checkbox v-model="checkValue" @change="customCheckedEvent($event)"></el-checkbox>
          <span>全选</span>
        </template>
        <template slot-scope="scope">
          <el-checkbox @change="changeStatus(scope.row, $event)" v-model="scope.row[item.props]" :checked="isCheckedValue"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column v-else-if="item.type === 'selecttwo'" width="100"> </el-table-column>
      <!-- 当父组件的type值等于'switch'表示此列显示开关 -->
      <el-table-column v-else-if="item.type === 'switch'" :prop="item.props" :label="item.label" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row[item.props]" :disabled="item.disabled ? true : false" @change="switchMethod(item.method, scope.row)"> </el-switch>
          <!-- @change="servicePublishChange(scope.row)"  -->
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'operation'表示此列显示操作以及按钮相关 -->
      <el-table-column v-else-if="item.type === 'operation'" fixed="right" :label="item.label" align="center" :width="item.width ? item.width : '300'">
        <template slot-scope="scope">
          <slot name="button" :scope="scope.row"></slot>
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'status'表示此列显示在父组件经过判断转化之后的值 -->
      <el-table-column v-else-if="item.type === 'status'" :prop="item.props" :label="item.label" align="center" :width="item.width">
        <template slot-scope="scope">
          {{ item.render(scope.row) }}
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'array'表示此列显示在父组件经过判断转化之后的code-name，功能同上 -->
      <el-table-column v-else-if="item.type === 'array'" :prop="item.props" :label="item.label" align="center">
        <template slot-scope="scope">
          {{ item.render(scope.row) }}
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'codeName'表示此列显示在父组件经过判断转化之后的code-name，功能同上 -->
      <el-table-column v-else-if="item.type === 'codeName'" :prop="item.props" :label="item.label" align="center">
        <template slot-scope="scope">
          {{ item.render(scope.row) }}
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'tag'表示此列显示在父组件经过判断转化之后的tag标签，功能同上 -->
      <el-table-column v-else-if="item.type === 'tag'" :prop="item.props" :label="item.label" align="center">
        <template slot-scope="scope">
          <el-tag effect="plain" :type="item.renderStyle(scope.row)">{{ item.render(scope.row) }}</el-tag>
        </template>
      </el-table-column>
      <!-- 当父组件的type值等于'time'表示此列显示时间格式化 -->
      <el-table-column v-else-if="item.type === 'time'" :prop="item.props" :label="item.label" align="center" :width="item.width">
        <template slot-scope="scope"> {{ scope.row[item.props] | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </template>
      </el-table-column>

      <!-- 当父组件的type值等于'index'表示此列显示索引值 -->
      <el-table-column v-else-if="item.type === 'index'" width="70px" type="index" align="center" :label="item.label"></el-table-column>
      <!-- 显示默认值 -->
      <el-table-column v-else-if="item.type === 'right'" :width="item.width" :prop="item.props" :label="item.label" :align="item.position ? item.position : 'right'"></el-table-column>
      <el-table-column v-else-if="item.type === 'slot'" :width="item.width" :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'">
        <template slot-scope="scope">
          <slot name="tableItem" :scope="scope.row"></slot>
        </template>
      </el-table-column>
      <el-table-column v-else :width="item.width" :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'">
        <template slot-scope="scope"> {{ scope.row[item.props] === null || scope.row[item.props] === '' ? '-' : scope.row[item.props] }} </template>
      </el-table-column>
    </el-row>
  </el-table>
</template>
<script>
// import permisson from '../../directive/permission.js'
import { parseTime } from '@/filters/format.js'
// import func from '../../../vue-temp/vue-editor-bridge'
export default {
  // directives: { permisson },
  computed: {},
  props: {
    height: {
      type: String,
      default: () => {
        // console.log(this.height)
        return '500px'
      }
    },
    id: {
      type: String,
      default: 'id'
    },
    //  父组件传递过来的表格数据
    listInfo: {
      type: Array
    },
    //
    checked: {
      type: Array
    },
    // 父组件传递过来的表格头部以及type类型值
    propArr: {
      type: Array
    },
    // 控制全选按钮
    valueChecked: {
      type: Boolean
    },
    // 是否是树形结构，父组件不传，默认是普通表格而不是树表格
    children: {
      type: String,
      default: ''
    },
    // 树形表格是否展开，默认为'不展开'
    expand: {
      type: Boolean,
      default: false
    },
    isCheckedValue: {
      type: Boolean,
      default: false
    },
    isCheckedAll: {
      type: Boolean,
      default: false
    }
  },
  // 时间格式过滤器
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
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg',
      list: [], // 父组件传递过来的表格数据
      checkValue: false
    }
  },
  methods: {
    //
    changeHeight(val) {
      console.log('dddd', val)
    },
    handleCheckAll(e) {
      console.log(e)
      this.$emit('handleCheckAll', e)
    },
    //   滑块事件
    servicePublishChange(row) {
      this.$emit('swichChange', row)
    },
    // 全选按钮事件
    customCheckedEvent(e) {
      this.$emit('customCheckedEvent', e)
    },
    // 全选按钮事件   add by qiaokun 2021-01-16
    changeMethod(method, row) {
      this.$emit(method, row)
    },
    // 全选按钮
    changeStatus(item, $event) {
      this.$emit('changeStatus', item, $event)
    },
    switchMethod(method, row) {
      console.log(method)
      // console.log(row)
      this.$emit(method, row)
    },
    // 增加删除事件
    handleButton(methods, row) {
      // 删除按钮
      if (methods === 'delete') {
        this.$emit('deleteEvent', row)
      } else if (methods === 'edit') {
        // 编辑按钮
        this.$emit('editEvent', row)
      } else if (methods === 'addChild') {
        // 添加子功能按钮
        this.$emit('addChildEvent', row)
      } else {
        // 查看详情按钮
        this.$emit('detail', row)
      }
    }
  },
  watch: {
    listInfo: function(val) {
      this.list = val
    },
    isCheckedValue: function(val) {
      this.checkValue = val
    }
  }
}
</script>
