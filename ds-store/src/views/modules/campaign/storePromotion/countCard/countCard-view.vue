<template>
  <section class="page-campaign-view" v-loading="$store.state.loading.global">
    <el-card>
      <el-form label-width="150px">
        <el-form-item label="礼品卡名称">
          <span class="itemInput">{{card.name}}</span>
        </el-form-item>
        <el-form-item label="卡项内容">
          <div v-if="card.items && card.items.length > 0" class="table-container">
            <el-table
              :data="card.items"
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
                label="服务类商品">
              </el-table-column>
              <el-table-column
                prop="retailPrice"
                min-width="140"
                label="零售价">
                <template slot-scope="scope">
                  <span>{{priceNum(scope.row.retailPrice)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="count"
                :show-overflow-tooltip="true"
                label="次数">
                <template slot-scope="scope">
                  <span>{{scope.row.count || '--'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="有效日期">
          <span class="itemInput" v-if="card.validDateEnum==='MONTH'">自购买日起{{card.validTime }}个月</span>
          <span class="itemInput" v-else>{{card.startTime.substring(0,10)}}至{{card.endTime.substring(0,10)}}</span>
        </el-form-item>
        <el-form-item label="价格">
          <span class="itemInput">{{priceNum(card.price)}}元</span>
        </el-form-item>
        <!-- <el-form-item label="适用门店">
          <span class="itemInput">{{getContent(card.stores)}}</span>
        </el-form-item> -->
        <el-form-item label="备注">
          <span class="itemInput">{{card.remark}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { getStatCardDetail } from '@/service/campaign'
import { number } from '@/utils/validate'
export default {
  name:'countCard-view',
  data() {
    return {
      card: {},
      number
    }
  },
  methods: {
    getContent(stores) {
      let str = ''
      if (stores) {
        stores.map(item => {
          str += item.name
        })
        return str
      }

    }
  },
  async created () {
    const { id } = this.$route.query
    const data = await getStatCardDetail({id})
    this.card = data
  }
}
</script>
