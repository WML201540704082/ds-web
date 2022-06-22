<template>
  <el-dialog
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body>
    <el-form ref="outgoing-form" class="form-show" label-width="110px">
      <el-form-item label="盘点单号">
        <span class="itemInput">{{inventory.orderNo || '--'}}</span>
      </el-form-item>
      <!-- <el-form-item label="批次号">
        <span class="itemInput">{{inventory.batchNo || '--'}}</span>
      </el-form-item> -->
      <el-form-item label="调整人">
        <span class="itemInput">{{`${inventory.adjustEmployeeName || '--'}/${inventory.adjustUser || '--'}`}}</span>
      </el-form-item>
      <el-form-item label="调整时间">
        <span class="itemInput">{{inventory.adjustTime || '--'}}</span>
      </el-form-item>
      <el-form-item label="备注">
        <span class="itemInput">{{inventory.remark || '--'}}</span>
      </el-form-item>
    </el-form>
    <!-- table列表 -->
    <div class="mode-store-table">
      <el-table
        :data="inventory.items"
        border
        v-loading="dataListLoading"
        :stripe="true"
        max-height="360"
        style="width: 100%; min-height: 300px;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          width="180"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          width="180"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="spec"
          width="120"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="category1Name"
          min-width="100"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          min-width="100"
          :show-overflow-tooltip="true"
          label="二级分类">
        </el-table-column>
        <el-table-column
          prop="brandName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          :show-overflow-tooltip="true"
          label="零售价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="库存数量">
          <template slot-scope="scope">
            <span>
              {{scope.row.stockQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="盘点数量">
        </el-table-column>
        <el-table-column
          prop="adjustQuantity"
          :show-overflow-tooltip="true"
          label="盈亏数量">
          <template slot-scope="scope">
            <span>
              {{scope.row.adjustQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="profitlossMoney"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盈亏金额(售价)"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span v-if="scope.row.profitlossMoney !== null">{{Number(priceNum(scope.row.profitlossMoney)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkMoney"
          min-width="120"
          :show-overflow-tooltip="true"
          label="盘点金额(售价)"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span v-if="scope.row.checkMoney !== null">{{Number(priceNum(scope.row.checkMoney)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getInventoryDetail } from '@/service/stock'
import inventoryAddVue from './inventory-add.vue'
import { getStore } from '@/utils/storage'
export default {
  data () {
    return {
      id: '',
      visible: false,
      dataListLoading: false,
      inventory: {
        items: []
      }
    }
  },
  created () {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods: {
    init(id){
      this.visible = true
      this.id = id
      if (this.isAuth('company:checkStock:list')) {
        this.getDataList()
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getInventoryDetail(this.id)
      if (data.code === 0) {
        this.inventory = data.data
        this.inventory.items = this.inventory.items.map(item => {
          return{
            ...item,
            stockQuantity:item.productType == 'BULK' ? item.stockQuantity / 1000 : item.stockQuantity,//库存数量
            checkQuantity: item.productType == 'BULK' ? item.checkQuantity / 1000 : item.checkQuantity,//盘点数量
            adjustQuantity: item.productType == 'BULK' ? item.adjustQuantity / 1000 : item.adjustQuantity,//盈亏数量
            profitlossMoney: item.productType == 'BULK' ? item.profitlossMoney / 1000 : item.profitlossMoney,//盈亏金额(售价)
            checkMoney: item.productType == 'BULK' ? item.checkMoney / 1000 : item.checkMoney,//盘点金额(售价)
          }
        })
      } else {
        this.inventory = {
          items: []
        }
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    }
  }
}
</script>
