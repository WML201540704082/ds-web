<template>
  <section class="page-campaign-view" v-loading="this.$store.state.loading.global">
    <el-card>
      <el-form label-width="140px">
        <el-form-item label="优惠券名称">
          <span class="itemInput">{{coupon.name}}</span>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <span class="itemInput">{{filterStatus(coupon.type, couponType)}}</span>
        </el-form-item>
        <el-form-item label="优惠价值" prop="type">
          <span class="itemInput">{{getRule(coupon.type, coupon.typeRule)}}</span>
        </el-form-item>
        <el-form-item label="适用范围">
          <div v-if=" coupon.applyToProducts && coupon.applyToProducts.length > 0" class="table-container">
            <el-table
              :data="coupon.applyToProducts"
              border
              :stripe="true"
              max-height="360"
              style="width: 100%;">
              <el-table-column
                prop="index"
                width="55"
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
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="firstCategory"
                width="100"
                :show-overflow-tooltip="true"
                label="一级分类">
              </el-table-column>
              <el-table-column
                prop="category"
                width="100"
                :show-overflow-tooltip="true"
                label="二级分类">
              </el-table-column>
              <el-table-column
                prop="retailPrice"
                :show-overflow-tooltip="true"
                label="零售价">
                <template slot-scope="scope">
                  <span v-if="scope.row.retailPrice !== null">{{number(scope.row.retailPrice/100)}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="font-size: 16px; margin-left: 10px;" v-else>全店商品</div>
        </el-form-item>
        <el-form-item label="适用渠道">
            <span class="itemInput">{{coupon.channel == 0 ? '线上+线下':coupon.channel == 2 ? '线下' : '线上'}}</span>
        </el-form-item>
        <el-form-item label="有效日期" class="gt-inline-item">
          <span class="itemInput" v-if="coupon.expiryDateType === 'DATETIME'">{{coupon.effectiveDate }}</span>
          <span class="itemInput" v-else>自发放之日起 {{coupon.effectiveDay }} 天</span>
        </el-form-item>
        <el-form-item label="是否与其他优惠共享">
          <span class="itemInput">{{coupon.isSuperposition == 0 ? '否' : '是'}}</span>
        </el-form-item>
        <el-form-item label="使用说明">
          <span class="itemInput">{{coupon.instructions || '--'}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { couponType } from '@/utils/dict'
import { getCouponDetail } from '@/service/campaign'
import { filterStatus } from '@/utils'
import { number } from '@/utils/validate'
export default {
  name:'campaign-view',
  data() {
    return {
      coupon: {},
      filterStatus,
      number,
      couponType
    }
  },
  methods: {
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
    }
  },
  async created () {
    const { id } = this.$route.query
    const data = await getCouponDetail(id)
    this.coupon = data
  }
}
</script>
