<template>
  <el-dialog
    title="温馨提示"
    :close-on-click-modal="false"
    width="80%"
    class="goods-tip-dailog"
    :visible.sync="visible"
    append-to-body>
    <div class="tip">以下商品正在参与其他单品促的活动，若要为商品设置新的促销，请先调整已有促销。</div>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      height="320">
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
        align="center"
        width="130"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="barcode"
        width="140"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="stores"
        align="center"
        width="130"
        :show-overflow-tooltip="true"
        label="活动门店">
      </el-table-column>
      <el-table-column
        prop="retailPrice"
        min-width="100"
        :show-overflow-tooltip="true"
        label="零售价">
        <template slot-scope="scope">
          <span>{{priceNum(scope.row.retailPrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="promotionType"
        min-width="140"
        :show-overflow-tooltip="true"
        label="参与的促销活动">
        <template slot-scope="scope">
          <span>{{scope.row.promotionType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        min-width="120"
        :show-overflow-tooltip="true"
        label="促销状态">
      </el-table-column>
      <el-table-column
        prop="stores"
        align="center"
        min-width="140"
        :show-overflow-tooltip="true"
        label="活动门店"
        v-if="promoteType=='full'">
      </el-table-column>
    </el-table>
     <span slot="footer" class="dialog-footer" v-if="pageType === 'modal'">
      <el-button @click="visible = false" v-if="promoteType!='full'">重新选择</el-button>
      <el-button type="primary" @click="dataFormSubmit">跳过以上商品</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-if="pageType === 'page'">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { filterStatus, filterColor } from '@/utils'
import { promoteStatus } from '@/utils/dict'
export default {
  data () {
    return {
      visible: false,
      promoteStatus,
      pageType: 'modal',
      dataList: [],
      productIds:[],
      dataListLoading: false,
      filterStatus,
      filterColor,
    }
  },
  methods: {
    async init (goodsList = [],productIds=[], pageType, promoteType) {
      this.visible = true
      this.dataList = goodsList
      this.productIds= productIds
      this.pageType = pageType
      this.promoteType = promoteType
      console.log(goodsList)
      console.log(productIds)
    },
    // 表单提交
    dataFormSubmit () {
      var array1 = this.dataList
      var array2 = this.productIds
      var result = []
      for(var i = 0; i < array2.length; i++){
        var obj = array2[i]
        var isExist = false
        for(var j = 0; j < array1.length; j++){
          var aj = array1[j]
          if(aj.productId == obj.id){
            isExist = true
            break
          }
        }
        if(!isExist){
          result.push(obj)
        }
      }
      this.visible = false
      this.$emit('refresh',result)
    }
  }
}
</script>
<style lang="scss">
  .goods-tip-dailog{
    .tip{
      margin-bottom: 15px;
      font-size: 16px;
    }
  }
</style>

