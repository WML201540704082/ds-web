<template>
  <div class="life-cyc-item">
    <div class="dot"></div>
    <div class="txt">{{txt}}</div>
    <el-tooltip v-if="type" placement="top" :content="content">
      <icon-svg class="tip-icon theme-color" name="question"></icon-svg>
    </el-tooltip>
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'cyc-item',
  props: {
    type: {
      type: String,
      default: ''
    },
    txt: {
      type: String,
      default: '顾客营销'
    },
  },
  data() {
    return{
      tips: {
        newerThree: '*每天0点，将首次消费距今3天的顾客，推送给对应的归属员工进行顾客回访任务',
        newerSeven: '*每天0点，将首次消费距今7天的顾客，推送给对应的归属员工进行顾客回访任务',
        newerTen: '*每天0点，将首次消费距今10天的顾客，推送给对应的归属员工进行顾客回访任务',
        dormancy: '*每天0点，将当天新增的休眠顾客推送给对应的归属员工，进行休眠顾客唤醒任务',
        lost: '*每天0点，将当天新增的流失顾客推送给对应的归属员工，进行流失顾客激活任务',
        consumer: '*每个任务月的1日0点，系统重新计算顾客的消费频率等级，并将等级下降的顾客推送给对应的归属员工进行顾客回访任务',
        customer: '*每个任务月的1日0点，系统重新计算顾客的客单价等级，并将等级下降的顾客推送给对应的归属员工进行顾客回访任务'
      }
    }
  },
  computed: {
    content() {
      return this.type ? this.tips[this.type] : ''
    }
  },
}
</script>
<style lang="scss">
.life-cyc-item{
  width: 100%;
  min-height: 40px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  padding: 10px;
  overflow: hidden;
  margin-top: 10px;
  cursor: pointer;
  .dot{
    width: 6px;
    height: 6px;
    float: left;
    border-radius: 6px;
    margin-top: 6px;
    margin-right: 4px;
  }
  .txt{
    float: left;
    font-size: 14px;
    line-height: 18px;
  }
  .tip-icon{
    float: left;
    font-size: 16px;
    margin: 2px 5px 0;
  }
}
</style>
