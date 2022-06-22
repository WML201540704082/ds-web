<template>
  <el-dialog :title="type === 'view' ? '采购单详情' : '确认收货'" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="80%" class="shoppingview">
    <el-form ref="shopping-form" class="form-show" label-width="110px">
      <el-row>
        <el-col>
          <el-form-item label="采购单号">
            <span class="itemInput">{{details.orderNo || '--'}}</span>
          </el-form-item>
          <el-form-item label="采购时间" v-show="type === 'view'">
            <span class="itemInput">{{details.createDate || '--'}}</span>
          </el-form-item>
          <el-form-item label="供货商">
            <span class="itemInput">{{details.consignorCompanyName || '--'}}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="联系人">
            <span class="itemInput">{{details.ordererName || '--'}}/{{details.ordererPhone || '--'}}</span>
          </el-form-item>
          <el-form-item label="操作人">
            <span class="itemInput">{{details.createUserName || '--'}}</span>
          </el-form-item>
          <el-form-item label="备注" v-if="details.remark.indexOf('\n') < 0">
            <span class="itemInput">{{details.remark || '--'}}</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="采购备注" v-if="details.remark.indexOf('\n') >= 0" style="width:50% !important">
            <span class="itemInput">{{details.remark.split(/[\n]/)[0] || '--'}}</span>
          </el-form-item>
          <el-form-item label="审核备注" v-if="details.remark.indexOf('\n') >= 0" style="width:50% !important">
            <span class="itemInput">{{details.remark.split(/[\n]/)[2].substr(5) || '--'}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" :stripe="true" class="all-count-table" max-height="360" style="width: 100%; min-height: 300px;">
      <el-table-column prop="index" min-width="60" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="spuName" min-width="120" :show-overflow-tooltip="true" label="商品名称">
      </el-table-column>
      <el-table-column prop="barcode" min-width="120" :show-overflow-tooltip="true" label="商品条码">
      </el-table-column>
      <el-table-column prop="skuSpec" min-width="100" :show-overflow-tooltip="true" label="规格">
      </el-table-column>
      <el-table-column prop="brandName" min-width="120" label="商品品牌">
      </el-table-column>
      <el-table-column prop="spuPackageName" min-width="120" label="包装单位">
      </el-table-column>
      <el-table-column prop="purchasePrice" min-width="120" :show-overflow-tooltip="true" label="进货价">
      </el-table-column>
      <el-table-column prop="purchaseNum" min-width="100" label="采购数量">
      </el-table-column>
      <el-table-column v-if="details.status !== 'TODO'" prop="giveNum" min-width="100" label="赠送数量">
      </el-table-column>
    </el-table>
    <div class="toptitle">
      <span class="tip">合计采购数量：{{(details.skuTotalNum-oldDetails.giveTotalNum) || '--'}}</span>
      <span class="tip" v-if="details.status !== 'TODO'">合计赠送数量：{{oldDetails.giveTotalNum || '--'}}</span>
      <span class="tip">合计进货价：{{details.totalAmount || '--'}}元</span>
      <span class="tip" v-if="details.status !== 'TODO'">订单金额：{{details.actualAmount || '--'}}元
        <span style="color:red">（优惠后金额）</span>
      </span>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button v-show="type === 'confirm'" @click="cancel()">取消</el-button> -->
      <el-button :loading="confirmLoading" type="primary" v-show="type === 'confirm'" @click="confirmReceipt()">确认收货</el-button>
    </span>
  </el-dialog>
</template>
<script>
import * as api from "@/service/stock";
import NP from "number-precision";
export default {
  name: "stockManagement-shopping-shoppingList",
  data() {
    return {
      type: "",
      dataList: [],
      details: {},
      oldDetails: {},
      dataListLoading: false,
      visible: false,
      id: null,
      confirmLoading: false
    };
  },
  // computed:{
  //   totalSellPrice() {
  //     let total = 0
  //     if (this.dataList && this.dataList.length > 0) {
  //       this.dataList.forEach(item => {
  //         if (item.purchaseNum) {
  //           total = NP.plus(NP.times(Math.abs(item.purchaseNum || 0), (item.sellPrice || 0)), total)
  //         }
  //       })
  //     }
  //     return total
  //   },
  // },
  methods: {
    init(row, type) {
      this.visible = true;
      this.details = row;
      this.id = row.id;
      this.type = type;
      this.getDataList();
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getShoppingDetail(this.id);
      this.dataListLoading = false;
      if (data && data.code === 0) {
        this.oldDetails = data.data;
        this.dataList = data.data.orderDetailList;
      } else {
        this.dataList = [];
        this.$message.warning(data.msg);
      }
    },
    //取消
    // cancel(){
    //   this.visible = false
    // },
    // 确认收货提示
    async handleTrue() {
      this.confirmLoading = true;
      this.$easyAlert.show({
        title: "提示",
        content: `本次采购包含新品，请及时设置新品的配送价、零售价、商品分类等信息，以免影响您的正常销售`,
        confirm: async () => {
          this.$easyConfirm.hide();
          this.$emit("refreshDataList");
        }
      });
      this.confirmLoading = false;
    },
    // 确认收货
    async confirmReceipt() {
      if (this.dataList && this.dataList.length > 0) {
        let form = {
          loginType: "COMPANY",
          orderId: this.id,
          userId: this.details.userId,
          userName: this.details.userName,
          companyId: this.details.ordererId,
          status: "RECEIVED"
        };
        const { data } = await api.purchaseOrderConfirm(form);
        if (data.data && data.code === 0) {
          if (data.data.existNewProduct) {
            this.handleTrue();
            this.visible = false;
            this.$emit("refreshDataList");
            this.$router.push({
              name: "stockManagement-shopping-shoppingList"
            });
          } else {
            this.visible = false;
            this.$emit("refreshDataList");
            this.$router.push({
              name: "stockManagement-shopping-shoppingList"
            });
          }
        } else {
          this.$message.error(data.msg);
        }
      } else {
        this.$message.error("无商品数据");
      }
    }
  }
};
</script>

<style lang="scss">
.shoppingview {
  .inputs1 input {
    width: 100px;
  }
  .el-table__row .inputs1 {
    padding-left: 0 !important;
  }
  .confirm {
    float: right;
    margin-right: 20px;
  }
  .toptitle {
    margin: 15px 0;
    color: #72716f;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
    width: 100%;
  }
  .tip {
    display: inline;
    margin-right: 50px;
  }
}
</style>
