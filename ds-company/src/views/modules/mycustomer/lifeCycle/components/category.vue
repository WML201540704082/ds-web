<template>
  <el-dialog
    title="活跃顾客分类"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="active-customer-category">
    <el-form :model="details" :rules="dataRule" ref="details" v-loading="dataListLoading">
      <div v-if="pageType === 'detail'" class="effect-time">本次设置生效日期：{{details.lastUpdateTime || '--'}}</div>
      <div>您可以按照顾客在最近3个自然月的消费频率或者客单价，对活跃顾客进行再分类</div>
      <el-row>
        <el-col :span="12" style="padding-right: 10px;">
          <div class="sub-title">
            <div class="line"></div>消费频率等级
            <el-tooltip placement="top" content="*等级更新日期前推3个自然整月的消费次数月均值">
              <icon-svg class="tip-icon theme-color" name="question"></icon-svg>
            </el-tooltip>
          </div>
          <el-table
            :data="details.timesLevels"
            border
            :stripe="true"
            style="width: 100%;">
            <el-table-column
              prop="name"
              width="100"
              label="等级名称">
              <template slot-scope="scope">
                <span v-if="pageType === 'detail'">{{scope.row.name}}</span>
                <span v-else>
                  <input class="mini-input max-width" v-model="scope.row.name"/>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100"
              label="消费频率">
              <template slot-scope="scope">
                <span v-if="pageType === 'detail'">{{filterText(scope, 'time')}}</span>
                <span v-else>
                  <span v-if="scope.$index === 0">大于 <input class="mini-input" v-model="details.timesLevels[0].maxZone"/></span>
                  <span v-else-if="scope.$index === 1"><input class="mini-input" v-model="details.timesLevels[1].minZone"/> ~ <input class="mini-input" v-model="details.timesLevels[0].maxZone"/> </span>
                  <span v-else-if="scope.$index === 2"><input class="mini-input" v-model="details.timesLevels[2].minZone"/> ~ <input class="mini-input" v-model="details.timesLevels[1].minZone"/> </span>
                  <span v-else>小于 <input class="mini-input" v-model="details.timesLevels[2].minZone"/></span>
                  次/月
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="customerNum"
              width="100"
              v-if="pageType === 'detail'"
              label="顾客数">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <div class="sub-title">
            <div class="line"></div>客单价等级
            <el-tooltip placement="top" content="*等级更新日期前推3个自然整月的平均客单价">
              <icon-svg class="tip-icon theme-color" name="question"></icon-svg>
            </el-tooltip>
          </div>
          <el-table
            :data="details.priceLevels"
            border
            :stripe="true"
            style="width: 100%;">
            <el-table-column
              prop="name"
              width="100"
              label="等级名称">
              <template slot-scope="scope">
                <span v-if="pageType === 'detail'">{{scope.row.name}}</span>
                <span v-else>
                  <input class="mini-input max-width" v-model="scope.row.name"/>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100"
              label="客单价">
              <template slot-scope="scope">
                <span v-if="pageType === 'detail'">{{filterText(scope, 'price')}}</span>
                <span v-else>
                  <span v-if="scope.$index === 0">大于 <input class="mini-input" v-model="details.priceLevels[0].maxZone"/></span>
                  <span v-else-if="scope.$index === 1"><input class="mini-input" v-model="details.priceLevels[1].minZone"/> ~ <input class="mini-input" v-model="details.priceLevels[0].maxZone"/> </span>
                  <span v-else-if="scope.$index === 2"><input class="mini-input" v-model="details.priceLevels[2].minZone"/> ~ <input class="mini-input" v-model="details.priceLevels[1].minZone"/> </span>
                  <span v-else>小于 <input class="mini-input" v-model="details.priceLevels[2].minZone"/></span>
                  元/单
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="customerNum"
              width="100"
              v-if="pageType === 'detail'"
              label="顾客数">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <div class="sub-title"><div class="line"></div>活跃顾客任务推送周期</div>
      </el-row>
      <el-form-item prop="pushPeriod">
        <!-- <el-radio-group v-if="pageType === 'edit'" v-model="details.pushPeriod">
          <el-radio :label="1">1个月</el-radio>
          <el-radio :label="2">2个月</el-radio>
          <el-radio :label="3">3个月</el-radio>
          <el-radio :label="6">6个月</el-radio>
        </el-radio-group> -->
        <span class="itemInput">1个月</span>
      </el-form-item>
      <div class="bottom-tip">*活跃顾客任务推送时间为自然月的1日0点。</div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" v-if="pageType === 'detail'" @click="pageType = 'edit'">更改设置</el-button>
      <section v-else>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit">保存</el-button>
      </section>
    </span>
  </el-dialog>
</template>
<script>
import { getLeveLCategory, editLevelCategory } from '@/service/mycustomer'
import _ from 'lodash'
export default {
  data(){
    return{
      originDetail: null,
      details: {
        createTime: null,
        id: null,
        pushPeriod: 1,
        timesLevels: [{
          name: 'A类',
        }, {
          name: 'B类',
        }, {
          name: 'C类'
        }, {
          name: 'D类'
        }],
        priceLevels: [{
          name: 'L1'
        }, {
          name: 'L2'
        }, {
          name: 'L3'
        }, {
          name: 'L4'
        }]
      },
      pageType: 'detail',
      dataListLoading: false,
      visible: false,
      dataRule: {
        pushPeriod: [{required: true, message: '请选择等级更新周期'}]
      }
    }
  },
  methods:{
    init () {
      this.getDetail()
      this.visible = true
    },
    // 获取数据列表
    async getDetail() {
      this.dataListLoading = true
      const { data } = await getLeveLCategory()
      this.dataListLoading = false
      if (data && data.code === 0) {
        if (data.data) {
          this.details = data.data
          this.originDetail = _.cloneDeep(data.data) // 原始数据
          this.pageType = 'detail'
        } else {
          this.$message.warning('获取默认设置失败')
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    // 点击取消
    cancel() {
      this.getDetail()
      this.pageType = 'detail'
    },
    filterText(scope, type) {
      let unit = type === 'time' ? '次/月' : '元/单'
      if (scope.$index === 0) {
        return `大于${scope.row.maxZone || '--'} ${unit}`
      } else if(scope.$index === 3){
        return `小于${scope.row.minZone || '--'} ${unit}`
      } else {
        return `${scope.row.minZone || '--'} ~ ${scope.row.maxZone || '--'} ${unit}`
      }
    },

    // 检查变化
    checkChange() {
      const temp1 = JSON.stringify(this.originDetail)
      const temp2 = JSON.stringify(this.details)
      if (temp1 === temp2) {
        this.$message.warning('本次设置没有任何变更，不会重新生效')
        return false
      } else {
        return true
      }
    },

    // 数据校验
    checkData() {
      let flag = true
      const CS = /^([1-9][0-9]*)$/
      let timesLevelsName = []
      let priceLevelsName = []
      // 检查消费频率
      this.details.timesLevels.forEach((item, index) => {
        if (!item.name) {
          flag = false
        } else if (timesLevelsName.indexOf(item.name) > -1) {
          flag = false
        } else {
          timesLevelsName.push(item.name)
        }
      })
      if (!flag) {
        this.$message.warning('消费频率等级名称不能为空, 且名称不能重复！')
        return false
      }
      if (!CS.test(this.details.timesLevels[0].maxZone) || !CS.test(this.details.timesLevels[1].minZone) || !CS.test(this.details.timesLevels[2].minZone)) {
        this.$message.warning('消费频率次数请输入正整数！')
        return false
      }

      if (Number(this.details.timesLevels[0].maxZone) <= Number(this.details.timesLevels[1].minZone)) {
        this.$message.warning('消费频率次数输入有误！')
        return false
      }

      if (Number(this.details.timesLevels[1].minZone) <= Number(this.details.timesLevels[2].minZone)) {
        this.$message.warning('消费频率次数输入有误！')
        return false
      }


      // 检查客单价
      this.details.priceLevels.forEach((item, index) => {
        if (!item.name) {
          flag = false
        } else if (priceLevelsName.indexOf(item.name) > -1) {
          flag = false
        } else {
          priceLevelsName.push(item.name)
        }
      })
      if (!flag) {
        this.$message.warning('客单价等级名称不能为空, 且名称不能重复！')
        return false
      }
      if (!CS.test(this.details.priceLevels[0].maxZone) || !CS.test(this.details.priceLevels[1].minZone) || !CS.test(this.details.priceLevels[2].minZone)) {
        this.$message.warning('客单价次数请输入正整数！')
        return false
      }

      if (Number(this.details.priceLevels[0].maxZone) <= Number(this.details.priceLevels[1].minZone)) {
        this.$message.warning('客单价次数输入有误！')
        return false
      }

      if (Number(this.details.priceLevels[1].minZone) <= Number(this.details.priceLevels[2].minZone)) {
        this.$message.warning('客单价次数输入有误！')
        return false
      }
      return true
    },
    // 提交数据
    dataFormSubmit() {
      this.$refs['details'].validate(async (valid) => {
        if (valid && this.checkChange() && this.checkData()) {
          console.log(this.details)
          let priceLevels = [{
            ...this.details.priceLevels[0],
            maxZone: this.details.priceLevels[0].maxZone,
            minZone: this.details.priceLevels[0].maxZone
          }, {
            ...this.details.priceLevels[1],
            maxZone: this.details.priceLevels[0].maxZone,
            minZone: this.details.priceLevels[1].minZone
          }, {
            ...this.details.priceLevels[2],
            maxZone: this.details.priceLevels[1].minZone,
            minZone: this.details.priceLevels[2].minZone
          }, {
            ...this.details.priceLevels[3],
            maxZone: this.details.priceLevels[2].minZone,
            minZone: this.details.priceLevels[2].minZone
          }]
          let timesLevels = [{
            ...this.details.timesLevels[0],
            maxZone: this.details.timesLevels[0].maxZone,
            minZone: this.details.timesLevels[0].maxZone
          }, {
            ...this.details.timesLevels[1],
            maxZone: this.details.timesLevels[0].maxZone,
            minZone: this.details.timesLevels[1].minZone
          }, {
            ...this.details.timesLevels[2],
            maxZone: this.details.timesLevels[1].minZone,
            minZone: this.details.timesLevels[2].minZone
          }, {
            ...this.details.timesLevels[3],
            maxZone: this.details.timesLevels[2].minZone,
            minZone: this.details.timesLevels[2].minZone
          }]
          const { data } = await editLevelCategory({
            ...this.details,
            timesLevels,
            priceLevels
          })
          if (data.code === 0) {
            this.getDetail()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.active-customer-category{
  .sub-title{
    height: 40px;
    line-height: 40px;
    .line{
      height: 20px;
      margin-top: 10px;
      float: left;
      margin-right: 10px;
      width: 3px;
    }
  }
  .bottom-tip{
    font-size: 12px;
    margin: 5px 0;
  }
  .effect-time{
    position: absolute;
    top: 60px;
    right: 30px;
  }
  .mini-input{
    width: 30%;
    max-width: 80px;
    min-width: 30px;
    display: inline-block;
    &:focus{
      outline: none;
    }
    &.max-width{
      width: 100%;
    }
    .el-input__inner{
      padding: 0 6px;
    }
  }
}
</style>

