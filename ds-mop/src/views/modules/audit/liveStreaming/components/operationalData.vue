<template>
  <el-dialog
    title="运营数据"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="30%"
    class="operationalData">
    <div>
      <el-form :inline="true" class="mode-form-line1" ref="operationalData" label-width="100px" :model="operationalData" :rules="dataFormRules">
        <el-form-item label="直播时长" class="gt-input-tip">
          <el-input maxlength="2" class="input1" v-model.number="operationalData.liveOfHour"></el-input><span class="input_span">时</span>
          <el-input maxlength="2" class="input1" v-model.number="operationalData.liveOfMinute"></el-input><span class="input_span">分</span>
          <el-input maxlength="2" class="input1" v-model.number="operationalData.liveOfSecond"></el-input><span class="input_span">秒</span>
        </el-form-item>
        <el-form-item label="观看人数" prop="audienceNum" class="gt-input-tip">
          <el-input maxlength="8" class="input2" v-model.number="operationalData.audienceNum" placeholder="请输入观看人数"></el-input><span class="input_span">人</span>
        </el-form-item>
        <el-form-item label="观看次数" prop="watchTimes" class="gt-input-tip">
          <el-input maxlength="8" class="input2" v-model.number="operationalData.watchTimes" placeholder="请输入观看次数"></el-input><span class="input_span">人</span>
        </el-form-item>
        <el-form-item label="平均观看时长" class="gt-input-tip">
          <el-input maxlength="2" class="input1" v-model.number="operationalData.avgWatchOfMinute"></el-input><span class="input_span">分</span>
          <el-input maxlength="2" class="input1" v-model.number="operationalData.avgWatchOfSecond"></el-input><span class="input_span">秒</span>
        </el-form-item>
        <el-form-item label="商品访问量" prop="productViewNum" class="gt-input-tip">
          <el-input maxlength="8" class="input2" v-model.number="operationalData.productViewNum" placeholder="请输入商品访问量"></el-input><span class="input_span">次</span>
        </el-form-item>
        <el-form-item label="交易量" prop="orderNum" class="gt-input-tip">
          <el-input class="input2" v-model.number="operationalData.orderNum" placeholder="请输入交易量"></el-input><span class="input_span">单</span>
        </el-form-item>
        <el-form-item label="成交易额" prop="totalAmount" class="gt-input-tip">
          <el-input maxlength="11" class="input2" v-model.number="operationalData.totalAmount" placeholder="请输入成交易额"></el-input><span class="input_span">元</span>
        </el-form-item>
        <el-form-item label="在bm直播计划显示运营数据" prop="hasData" label-width="190px" style="display:block">
          <el-radio-group v-model="operationalData.hasData">
            <el-radio v-for="item in hasDataType" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="萌百小店显示直播回放" prop="hasReplay" label-width="190px" style="display:block">
          <el-radio-group v-model="operationalData.hasReplay">
            <el-radio v-for="item in hasReplayType" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span style="display:block;text-align:center">
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit">确定</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
import { priceRange } from '@/utils/validate'
import { hasDataType,hasReplayType } from '@/utils/dict'
export default {
  name:'audit-liveStreaming-live-operationalData',
  data(){
    const validateTime = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('请输入0-60的正整数！'))
        } else if (value < 0 || value > 30){
          callback(new Error('请输入0-60的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateAudienceNum = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('请输入0-10000000的正整数！'))
        } else if (value < 0 || value > 10000000){
          callback(new Error('请输入0-10000000的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 10000000)) {
          callback(new Error('请输入0.01-10000000的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return{
      hasDataType,//在bm直播计划显示运营数据
      hasReplayType,//萌百小店显示直播回放
      dataListLoading:false,
      visible: false,
      operationalData:{
        liveOfHour: null,
        liveOfMinute: null,
        liveOfSecond: null,
        audienceNum: null,
        watchTimes: null,
        avgWatchOfMinute: null,
        avgWatchOfSecond: null,
        productViewNum: null,
        orderNum: null,
        totalAmount: null,
        hasData:1,
        hasReplay:1
      },
      dataFormRules: {
        liveOfMinute:[{validator: validateTime, trigger: 'blur' }],
        audienceNum:[{validator: validateAudienceNum, trigger: 'blur' }],
        watchTimes:[{validator: validateAudienceNum, trigger: 'blur' }],
        productViewNum:[{validator: validateAudienceNum, trigger: 'blur' }],
        orderNum:[{validator: validateAudienceNum, trigger: 'blur' }],
        totalAmount:[{validator: validatePrice, trigger: 'blur' }],
      }
    }
  },
  methods:{
    init(id){
      this.visible = true
      this.id = id
      if (id) {
        this.getDataList()
      }
      this.$nextTick(() => {
        this.$refs['operationalData'].resetFields()
        this.operationalData.liveOfHour = null
        this.operationalData.liveOfMinute = null
        this.operationalData.liveOfSecond = null
        this.operationalData.avgWatchOfMinute = null
        this.operationalData.avgWatchOfSecond = null
      })
    },
    // 获取数据列表
    async getDataList() {
      const data = await this.$http({
        url: this.$http.adornUrl('/live/data/'+this.id,true),
        method: 'get',
        params: this.$http.adornParams()
      })
      if(data.data.data&&data.data.code == 0){
        this.operationalData = data.data.data
        this.operationalData.totalAmount = this.priceNum(data.data.data.totalAmount)
        this.ids = data.data.data.id
      }else{
        this.$message.error(data.msg)
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['operationalData'].validate(async (valid) => {
        if (valid) {
          this.operationalData.id = this.ids
          this.operationalData.liveId = this.id
          this.operationalData.totalAmount = this.priceNum(this.operationalData.totalAmount,'out')
          let form = {
            id:this.id,
            liveData:this.operationalData
          }
          const { data } = await this.$http({
            url: this.$http.adornUrl('/live/update',true),
            method: 'post',
            data: this.$http.adornData(form)
          })
          if(data.code == 0){
            this.visible = false
            this.$emit('refreshDataList')
            this.$message.success('操作成功')
          }else{
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.operationalData{
  .input1{
    display: inline-block;
    padding: 0 !important;
    width: 66px;
    .el-input__inner{
      width: 66px !important;
    }
  }
  .input2{
    display: inline-block;
    padding: 0 !important;
    width: 200px;
    .el-input__inner{
      width: 200px !important;
    }
  }
  .input_span{
    margin-left: 4px;
  }
}
</style>
