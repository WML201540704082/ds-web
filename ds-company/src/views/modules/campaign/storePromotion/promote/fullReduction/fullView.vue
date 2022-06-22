<template>
  <section class="page-campaign-view" v-loading="$store.state.loading.global">
    <el-card>
      <el-form label-width="150px">
        <el-form-item label="活动类型">
          <span class="itemInput">{{filterStatus(promote.promotionType, promotionType)}}</span>
        </el-form-item>
        <el-form-item label="促销名称">
          <span class="itemInput">{{promote.name}}</span>
        </el-form-item>
        <el-form-item label="促销时间">
          <span class="itemInput">{{moment(promote.startTime).format('YYYY-MM-DD') + ' - ' + moment(promote.endTime).format('YYYY-MM-DD')}}</span>
        </el-form-item>
        <el-form-item label="活动门店">
          <span class="itemInput">{{storeNames}}</span>
        </el-form-item>
        <el-form-item label="活动规则">
          <span class="itemInput">{{getContent(promote)}}</span>
        </el-form-item>
        <el-form-item label="商品">
          <div v-if="promote.products && promote.products.length > 0" class="table-container">
            <el-table
              :data="promote.products"
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
                prop="name"
                min-width="180"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="barcodes"
                min-width="150"
                label="商品条码">
              </el-table-column>
             <el-table-column
              prop="brandName"
              min-width="180"
              label="品牌">
            </el-table-column>
            <el-table-column
              prop="retailPrice"
              :show-overflow-tooltip="true"
              min-width="120"
              label="零售价">
              <template slot-scope="scope">
                <span>￥ {{priceNum(scope.row.retailPrice)}}</span>
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
import { getfullDetail } from '@/service/campaign'
import { promotionType } from '@/utils/dict'
import moment from 'moment'
import { filterStatus } from '@/utils'
import { getStoreList } from '@/service/systore'
export default {
  name:'full-view',
  data() {
    return {
      promotionType,
      moment,
      filterStatus,
      storeNames: '',
      storeList:[],
      stores:[],
      promote: {
          
      },
    }
  },
  async created () {
    // 获取门店列表
    this.getStores()
    const { id } = this.$route.query
    if (id) {
      const { data } = await getfullDetail(id)
      if (data.code === 0) {
        this.promote = data.data
      } else {
        this.$message.error(this.data.msg)
      }
    } else {
      this.$message.error('无法查询！')
    }
    var storeVal = []
    for (let i = 0; i < this.promote.storeIds.length; i++) {
      const item = this.promote.storeIds[i]
      const storeNames = this.stores.find(ele => ele.id == item).name
      storeVal.push(storeNames)
    }
    this.storeNames=storeVal.join(',')
  },
  methods:{
    // 获取促销内容
    getContent(item) {
      let str = ''
      if (item.remitType === 'DISCOUNT') {//打折
        str = `满${this.priceNum(item.condition)}元打${this.priceNum(item.remit)}折`
      } else {//REMIT满减
        if (item.every) {
          str = `满${this.priceNum(item.condition)}元满减${this.priceNum(item.remit)}元(每满减)`
        }else{
          str = `满${this.priceNum(item.condition)}元满减${this.priceNum(item.remit)}元`
        }
      }
      return str
    },
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.stores = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
  },
}
</script>
