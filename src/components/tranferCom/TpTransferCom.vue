<template>
  <div>
    <div>
      <el-row>
        <el-col :span="10">
          <el-table height="250" :data="tableData" border ref="selectionTable" @select="selectProject" @selection-change="selcetProChange" style="width:100%">
            <div v-for="(item, index) in propArr" :key="index">
              <el-table-column :prop="item.props" :label="item.label" v-if="item.label !== '商品图片'"> </el-table-column>
              <el-table-column v-if="item.props === ''" type="selection" width="50"> </el-table-column>
              <el-table-column :prop="item.props" :label="item.label" v-if="item.label === '商品图片'">
                <template slot-scope="scope">
                  <span v-for="(items, index) in scope.row.pictures" :key="index">
                    <img :src="items.url" style="width:80px;height:80px" alt />
                  </span>
                </template>
              </el-table-column>
            </div>
          </el-table>
        </el-col>
        <el-col :span="2.5">
          <div class="opSetting">
            <div>
              <el-button icon="el-icon-d-arrow-right" type="primary" :disabled="nowSelectData.length ? false : true" @click="handelSelect">
                选中
              </el-button>
            </div>
            <div class="spacing">
              <el-button icon="el-icon-d-arrow-left" type="primary" :disabled="nowSelectRightData.length ? false : true" @click="handleRemoveSelect">
                取消
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <el-table height="250" :data="selectArr" border ref="selection" style="width: 100%" @selection-change="checkRightAll">
            <div v-for="(item, index) in propArr" :key="index">
              <el-table-column :prop="item.props" :label="item.label" v-if="item.label !== '商品图片'"> </el-table-column>
              <el-table-column v-if="item.props === ''" type="selection" width="50"> </el-table-column>
              <el-table-column :prop="item.props" :label="item.label" v-if="item.label === '商品图片'">
                <template slot-scope="scope">
                  <span v-for="(items, index) in scope.row.pictures" :key="index">
                    <img :src="items.url" style="width:80px;height:80px" alt />
                  </span>
                </template>
              </el-table-column>
            </div>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    leftArr: {
      type: Array
    },
    rightArr: {
      type: Array
    },
    propArry: {
      type: Array
    },
    selType: {
      type: String
    },
    promType: {
      type: String
    }
  },
  created() {
    // console.log(this.leftArr)
    // console.log(this.leftArr)
    // console.log('10110111111')
    this.propArr = this.propArry
    // console.log(this.selType)
  },
  data() {
    return {
      tableData: this.leftArr,
      selectArr: [],
      // 选中的值
      nowSelectData: [],
      nowSelectRightData: [],
      selectChange: true,
      propArr: [],
      arrBox: [],
      arrBoxs: []
    }
  },
  watch: {
    leftArr: function(val) {
      // console.log('left')
      this.tableData = val
    },
    rightArr: function(val) {
      this.selectArr = val
      // console.log('rightVal')
      // console.log(val)
    }
  },
  methods: {
    selectProject(val) {
      this.arrBox = val
      // console.log(this.arrBox)
      if (this.selType === 'store') {
        this.selectCheck()
      } else {
        this.pacePro()
      }
    },
    selcetProChange(val) {
      this.arrBoxs = val
      // console.log(this.arrBoxs)
      if (this.selType === 'store') {
        this.checkAll()
      } else {
        this.addcheckAll()
      }
    },
    pacePro() {},
    // 选择值变化
    checkAll(val) {
      if (this.selectChange) {
        // console.log('checkAll')
        this.nowSelectData = this.arrBoxs
        // console.log(this.nowSelectData)
      }
    },
    // queren
    // 选中
    handelSelect() {
      this.selectArr = this.handleConcatArr(this.selectArr, this.nowSelectData)
      this.handleRemoveTabList(this.nowSelectData, this.tableData)
      // console.log(this.selectArr)
      // console.log('selectArr')
      this.$emit('makeSure', this.selectArr)
    },
    handleConcatArr(selectArr, nowSelectData) {
      let arr = []
      arr = arr.concat(selectArr, nowSelectData)
      return arr
    },
    // 数据进行转移
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i].code === originalArr[k].code) {
              originalArr.splice(k, 1)
            }
          }
        }
      }
    },
    handleRemoveSelect() {
      this.tableData = this.handleConcatArr(this.tableData, this.nowSelectRightData)
      this.handleRemoveTabList(this.nowSelectRightData, this.selectArr)
      this.nowSelectRightData = []
      this.$emit('makeSure', this.selectArr)
    },
    checkRightAll(val) {
      this.nowSelectRightData = val
    },
    // 门店
    selectCheck() {
      // console.log('slecet')
      var selectlength = 0
      if (this.selectArr.length > 0) {
        this.selectArr.forEach(item => {
          this.arrBox.forEach(items => {
            if (item.code === items.code) {
              this.$message.error('门店已经选择，不能再次选择')
              this.selectChange = false
              this.$refs.selectionTable.clearSelection()
              this.arrBox = []
              this.nowSelectData = []
            } else {
              selectlength++
            }
          })
        })
      }
      if (selectlength === this.selectArr.length) {
        this.selectChange = true
      }
    },
    // 商品
    // 新增活动
    addcheckAll() {
      // console.log('addcheck')
      this.nowSelectData = this.arrBoxs
      // console.log(this.nowSelectData)
      this.nowSelectData = this.unique(this.nowSelectData)
      if (this.promType === 'groupBy') {
        for (var promotionSelectId = 0; promotionSelectId < this.nowSelectData.length; promotionSelectId++) {
          if (this.nowSelectData[promotionSelectId].promotionId !== null) {
            this.$message.error('这个商品已经参加活动请重新选择其他商品')
            this.$refs.selectionTable.clearSelection()
          }
          this.selectArr.forEach(itemSecond => {
            this.arrBoxs.forEach(items => {
              if (itemSecond.code === items.code) {
                this.$refs.selectionTable.clearSelection()
                // this.addnowSelectData.length === 0
                // this.addnowSelectData = []
                this.$message.error('所选商品重复，请重新选择')
              }
            })
          })
        }
      } else {
        for (let promotionSelectId = 0; promotionSelectId < this.nowSelectData.length; promotionSelectId++) {
          if (this.nowSelectData[promotionSelectId].promotionId !== null) {
            this.$message.error('这个商品已经参加活动请重新选择其他商品')
            this.$refs.selectionTable.clearSelection()
          }
          this.selectArr.forEach(itemSecond => {
            this.arrBoxs.forEach(items => {
              if (itemSecond.code === items.code) {
                this.$refs.selectionTable.clearSelection()
                // this.addnowSelectData.length === 0
                // this.addnowSelectData = []
                this.$message.error('所选商品重复，请重新选择')
              }
            })
          })
        }
      }
    },
    // 清除重复数据
    unique(arr) {
      const addnowSelectDataNum = new Map()
      return arr.filter(arr => !addnowSelectDataNum.has(arr.code) && addnowSelectDataNum.set(arr.code, 1))
    }
  }
}
</script>
<style lang="scss" scoped></style>
