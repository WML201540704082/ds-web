<template>
  <section class="page-campaign-view" v-loading="$store.state.loading.global">
    <el-card>
      <el-form label-width="150px">
        <el-form-item label="活动名称">
          <span class="itemInput">{{coupon.name}}</span>
        </el-form-item>
        <el-form-item label="有效日期" prop="type">
          <span class="itemInput">{{this.effectiveDate}}</span>
        </el-form-item>
        <el-form-item label="用户发放限制" prop="type">
          <span class="itemInput" v-if="type=='NEW_GIFT'">注册 {{coupon.rule}}天内的新客限领一次，多个券可分多次领取！</span>
          <span class="itemInput" v-else-if="type=='ON_STORE' && coupon.ruleType == 'ON_STORE_SECOND_RULE'">每隔 {{coupon.rule}}天，所选优惠券每个发放1张，多个优惠券多个领取</span>
          <span class="itemInput" v-else>每1天，所选优惠券每个发放1张，多个优惠券多个领取</span>
        </el-form-item>
        <el-form-item label="适用门店">
          <span class="itemInput">{{this.storeRange}}</span>
        </el-form-item>
        <el-form-item label="适用范围">
          <div v-if="coupon.coupons && coupon.coupons.length > 0" class="table-container">
            <el-table
              :data="coupon.coupons"
              border
              :stripe="true"
              max-height="360"
              style="width: 100%;">
              <el-table-column
                prop="index"
                width="60"
                label="序号">
                <template slot-scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                align="center"
                width="120"
                :show-overflow-tooltip="true"
                label="优惠券名称">
              </el-table-column>
              <el-table-column
                prop="type"
                align="center"
                min-width="120"
                :show-overflow-tooltip="true"
                label="优惠券类型">
                <template slot-scope="scope">
                  <span>{{filterStatus(scope.row.type, couponType)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="rule"
                min-width="150"
                :show-overflow-tooltip="true"
                label="优惠价值">
                <template slot-scope="scope">
                <span>{{getRule(scope.row.type,scope.row.rule)}}</span>
              </template>
              </el-table-column>
              <el-table-column
                prop="storeRange"
                min-width="180"
                :show-overflow-tooltip="true"
                label="适用门店">
              </el-table-column>
              <el-table-column
                prop="effectiveBeginDate"
                min-width="360"
                :show-overflow-tooltip="true"
                label="有效日期">
                <template slot-scope="scope">
                  <span v-if="scope.row.effectiveType=='DAY'">自发放之日起 {{scope.row.effectiveDay}}天</span>
                  <span v-else>{{scope.row.effectiveBeginDate}}至{{scope.row.effectiveEndDate}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { couponType } from '@/utils/dict'
import { newPeopleDetails } from '@/service/campaign'
import { filterStatus } from '@/utils'
import { getStoreList } from '@/service/systore'
export default {
  name:'giftBag-view',
  data() {
    return {
      coupon: {},
      filterStatus,
      couponType
    }
  },
  async created () {
    this.id = this.$route.query.id
    this.storeRange = this.$route.query.storeRange
    this.effectiveDate = this.$route.query.effectiveDate
    this.type = this.$route.query.type
    if (this.id) {
      const data = await newPeopleDetails(this.id)
      this.coupon = data
      // this.storeRange = data.storeRange
      // this.storeRangeArray = this.storeRange.split(",")
      this.selectedList = data.coupons
    }
    // this.getStorelist()
  },
  methods: {
    // 获取门店列表
    // async getStorelist(){
    //   const { data } = await getStoreList({
    //     status:1
    //   })
    //   if(data && data.code ==0){
    //     this.coupon.partStoreList = data.data.filter(store => {
    //       return this.storeRangeArray.indexOf(store.id + '') > -1
    //     }).map(item => item.name).join(",")
    //   }else{
    //     this.coupon.partStoreList =''
    //   }
    // },
    getRule(type, typeRule) {
      if (type !== null && type !== '' && type !== undefined && typeRule) {
        let ruleName = ''
        switch (type) {
        case 0:
          ruleName = typeRule + '折'
          break
        case 2:
          ruleName = '--'
          break
        case 1:
          const arr = typeRule.split(',')
          if (arr && arr.length === 2) {
            ruleName = `满${arr[0]}减${arr[1]}`
          } else if (arr.length === 1) {
            ruleName = `减${arr[0]}`
          } else {
            ruleName = '--'
          }
          break
        default:
          ruleName = '--'
        }
        return ruleName
      } else {
        return '--'
      }
    },
  },
}
</script>
