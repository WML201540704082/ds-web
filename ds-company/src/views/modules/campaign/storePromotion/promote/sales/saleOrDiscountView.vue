<template>
  <section class="page-campaign-view" v-loading="$store.state.loading.global">
    <el-card>
      <el-form label-width="150px">
        <el-form-item label="促销类型">
          <span class="itemInput">{{filterStatus(promote.promoteDto.type, promoteType)}}</span>
        </el-form-item>
        <el-form-item label="促销名称">
          <span class="itemInput">{{promote.promoteDto.name}}</span>
        </el-form-item>
        <el-form-item label="促销渠道">
          <span class="itemInput">{{promote.promoteDto.saleChannel === 0 ? '线上，线下' : (promote.promoteDto.saleChannel === -1 ? '线上' : '线下' )}}</span>
        </el-form-item>
        <el-form-item label="促销时间">
          <span class="itemInput">{{moment(promote.promoteDto.startTime).format('YYYY-MM-DD') + ' - ' + moment(promote.promoteDto.endTime).format('YYYY-MM-DD')}}</span>
        </el-form-item>
        <el-form-item label="商品">
          <div v-if="promote.promoteDto.products && promote.promoteDto.products.length > 0" class="table-container">
            <el-table
              :data="promote.promoteDto.products"
              border>
              <el-table-column
                prop="index"
                width="60"
                label="序号">
                <template slot-scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="productName"
                min-width="180"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="barCodeList"
                min-width="150"
                label="商品条码">
              </el-table-column>
              <el-table-column
                prop="salesPrice"
                :show-overflow-tooltip="true"
                min-width="120"
                label="零售价">
                <template slot-scope="scope">
                  <span>￥ {{priceNum(scope.row.salesPrice)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="quantity"
                min-width="120"
                v-if="promote.promoteDto.type === 'COMPOSE'"
                label="数量">
                <template slot-scope="scope">
                  <span>{{scope.row.quantity || 1}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <section v-if="promote.promoteDto.type === 'COMPOSE'">
          <el-form-item label="商品价格">
            <span class="itemInput">{{priceNum(promote.total)}}元</span>
          </el-form-item>
          <el-form-item label="组合价格">
            <span class="itemInput">{{priceNum(promote.composePrice)}}元</span>
          </el-form-item>
          <el-form-item label="组合优惠">
            <span class="itemInput">{{priceNum(promote.freePrice)}}元</span>
          </el-form-item>
        </section>
        <section v-if="promote.promoteDto.type === 'DISCOUNT'">
          <el-form-item :label="getLabel(index)" :key="index" v-for="(item, index) in promote.items">
            <span class="itemInput">{{item.percent}}%</span>
          </el-form-item>
        </section>
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { getPromoteDetail } from '@/service/campaign'
import { promoteType, saleChannel } from '@/utils/dict'
import moment from 'moment'
import { filterStatus } from '@/utils'
export default {
  name:'promote-view',
  data() {
    return {
      promoteType,
      saleChannel,
      moment,
      filterStatus,
      promote: {
        items: [],
        promoteDto: {}
      },
    }
  },
  methods: {
    getLabel(index) {
      if (index < this.promote.items.length - 1 ) {
        return `第${index + 1}件折扣`
      } else {
        return `第${index + 1}件及以上折扣`
      }
    }
  },
  async created () {
    const { id } = this.$route.query
    if (id) {
      const { data } = await getPromoteDetail(id)
      if (data.code === 0) {
        this.promote = data.data
      } else {
        this.$message.error(this.data.msg)
      }
    } else {
      this.$message.error('无法查询！')
    }

  }
}
</script>
