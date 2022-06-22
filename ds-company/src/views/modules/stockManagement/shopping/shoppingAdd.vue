<template>
  <div class="mod-store shopping">
    <el-card>
      <el-form :model="shoppingAdd" :inline="true" class="mode-form-line1" ref="shoppingAdd" :rules="shoppingRules">
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="shoppingAdd.supplier" placeholder="请选择供应商" clearable filterable value-key="id" :remote-method="getSupplierlist" @change="getContact">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.companyName" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <span class="linkmanInput" style="display: inline-block;">{{`${shoppingAdd.name || '--'}/${shoppingAdd.phone || '--'}`}}</span>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-select v-model="shoppingAdd.operator" placeholder="请选择" clearable filterable value-key="userId" reserve-keyword>
            <el-option v-for="item in operatorList" :key="item.userId" :label="item.name" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="shoppingAdd.remark" style="width: 300px;" :maxlength="200" autosize></el-input>
        </el-form-item>
      </el-form>
      <div class="alter_input_inner">
        <el-input v-model="bindAdd" placeholder="商品名称/条码" style="display:inline" clearable @keyup.enter.native="goodsSelect"></el-input>
        <el-button type="primary" style="display:inline" @click="goodsSelect">添加</el-button>
        <span style="float:right;padding-right:20px;">
          <el-button type="primary" :loading="$store.state.loading.global" @click.native="saveBuy">提交订单</el-button>
          <el-button type="primary" @click.native="$router.go(-1)">取消</el-button>
        </span>
      </div>
      <el-table :data="selectedList" border ref="editTable" v-loading="dataListLoading" :stripe="true" class="all-count-table" v-table-height :highlight-current-row='true' style="width: 100%;margin-top:5px;">
        <el-table-column prop="index" min-width="60" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operate" min-width="60" label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index,scope.row)">移除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="spuName" min-width="120" :show-overflow-tooltip="true" label="商品名称">
        </el-table-column>
        <el-table-column prop="barcode" min-width="120" :show-overflow-tooltip="true" label="商品条码">
        </el-table-column>
        <el-table-column prop="brandName" min-width="120" :show-overflow-tooltip="true" label="商品品牌">
        </el-table-column>
        <el-table-column prop="spec" min-width="100" :show-overflow-tooltip="true" label="规格">
        </el-table-column>
        <el-table-column prop="storeId" width="180" label="出库单位">
          <template slot-scope="scope">
            <el-select class="out-select" v-model="scope.row.spuPackageId" placeholder="请选择"  @change="val => changeUnitSelect(val, scope.$index)" filterable reserve-keyword>
              <el-option v-for="item in scope.row.spuPackageList" :key="item.spuPackageId" :label="item.spuPackageName" :value="item.spuPackageId">
              </el-option>
            </el-select>

          </template>
        </el-table-column>
        <el-table-column prop="purchasePrice" min-width="100" :show-overflow-tooltip="true" label="进货价">
        </el-table-column>
        <el-table-column prop="purchaseNum" min-width="120" label="采购数量">
          <template slot-scope="scope">
            <el-input class="inputs1" v-model.number="scope.row.purchaseNum" maxlength="9"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="giveNum"
          min-width="120"
          label="赠送数量">
          <template slot-scope="scope">
            <el-input class="inputs1"  v-model.number="scope.row.giveNum" maxlength="9"></el-input>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="sum_toptitle">
        <span class="sum_tip">合计采购数量：{{totalBuyAmount}}</span>
        <span class="sum_tip">合计进货价：{{totalPurchasePrice}}</span>
      </div>
    </el-card>
    <gt-goods-add ref="shoppingAddSelect" @changeSelect="getSelect" />
  </div>
</template>
<script>
import gtSubtitle from "@/components/gt-sub-title";
import { getShoppingSupplierList } from "@/service/stock";
import { getStaffList } from "@/service/staffManagement";
import NP from "number-precision";
import { priceRange } from "@/utils/validate";
import gtGoodsAdd from "./shoppingGoodsAdd";
import * as api from "@/service/stock";
import _ from "lodash";
import { getStore } from "@/utils/storage";
export default {
  name: "stockManagement-shopping-shoppingAdd",
  data() {
    return {
      NP,
      supplierList: [],
      operatorList: [],
      dataListLoading: false,
      supplierLoading: false,
      changePage: false,
      selectedList: [],
      editTable: [],
      shoppingAdd: {
        supplier: null,
        operator: null
      },
      bindAdd: "",
      shoppingRules: {
        supplier: [{ required: true, message: "供应商必选", trigger: "blur" }],
        operator: [{ required: true, message: "操作人必填", trigger: "blur" }]
      }
    };
  },
  components: {
    gtGoodsAdd,
    gtSubtitle
  },
  computed: {
    //合计采购数量
    totalBuyAmount() {
      let total = 0;
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          total = NP.plus(total, item.purchaseNum || 0);
        });
      }
      return total;
    },
    //合计进货价
    totalPurchasePrice () {
      let total = 0;
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.forEach(item => {
          if (item.purchaseNum) {
            //进货价*采购数量
            total = NP.plus(
              NP.times(Math.abs(item.purchaseNum || 0), item.purchasePrice || 0),
              total
            );
          }
        });
      }
      return total;
    }
  },
  async created() {
    //获取companyId
    const { companyId = "" } = getStore({ name: "commenInfo" });
    this.companyId = companyId;
    //获取订单号
    this.getShoppingOrderId();
    // 获取供应商下拉列表
    this.getSupplierlist();
    //操作人
    this.getStaffList();
  },
  methods: {
    // 获取订单号
    async getShoppingOrderId() {
      this.dataListLoading = true;
      const { data } = await api.AddShoppingOrderNo();
      if (data.code === 0) {
        this.shoppingAdd.orderNo = data.data;
      } else {
        this.shoppingAdd.orderNo = null;
      }
      this.dataListLoading = false;
    },
    // 获取联系人
    getContact(val) {
      if (!val) {
        (this.shoppingAdd.name = "--"), (this.shoppingAdd.phone = "--");
      }
      const supplier = this.supplierList.find(ele => ele.id === val.id);
      if (supplier) {
        this.shoppingAdd.name = supplier.name;
        this.shoppingAdd.phone = supplier.phone;
        this.shoppingAdd.customerId = supplier.id;
        this.shoppingAdd.companyId = supplier.companyId;
        this.shoppingAdd.consignorCode = supplier.code;
        this.shoppingAdd.consignorCompanyName = supplier.companyName;
        this.shoppingAdd.consignorId = supplier.id;
        this.shoppingAdd.consignorName = supplier.name;
        this.shoppingAdd.consignorPhone = supplier.phone;
        this.shoppingAdd.ordererCode = supplier.companyCode;
        this.shoppingAdd.ordererCompanyName = supplier.companyCompanyName;
        this.shoppingAdd.ordererId = supplier.companyId;
        this.shoppingAdd.ordererName = supplier.companyPersonName;
        this.shoppingAdd.ordererPhone = supplier.companyPersonPhone;
      }
      this.$nextTick(() => {
        this.selectedList = [];
      });
      // this.selectedList= []
      // this.$refs.shoppingAddSelect.init(val.id,val.companyId)
    },
    // 获取供应商下拉列表
    async getSupplierlist(key) {
      this.supplierLoading = true;
      const { data } = await api.getBrandSupplierList({
        page: 1,
        size: 10000
      });
      if (data && data.code == 0) {
        this.supplierList = data.data.records.map(item => {
          return {
            ...item,
            consignorCode: item.code,
            consignorCompanyName: item.companyName,
            consignorId: item.id,
            consignorName: item.name,
            consignorPhone: item.phone,
            ordererCode: item.companyCode,
            ordererCompanyName: item.companyCompanyName,
            ordererId: item.companyId,
            ordererName: item.companyPersonName,
            ordererPhone: item.companyPersonPhone
          };
        });
      } else {
        this.supplierList = [];
      }
      this.supplierLoading = false;
    },
    changeUnitSelect(value,index){
      for (let i = 0; i < this.selectedList[index].spuPackageList.length; i++) {
        if(this.selectedList[index].spuPackageList[i].spuPackageId == value){
          this.selectedList[index].purchasePrice = this.selectedList[index].spuPackageList[i].packagePurchasePrice
          return true
        }
      }
    
    },
    // 监听list变化
    async getSelect(list) {
      /**
       * 数据转换
       */
      let originalList = [];
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const originalItem = this.selectedList.find(
          ele => ele.skuId === item.skuId
        );
        if (originalItem) {
          originalList.push(originalItem);
        } else {
          originalList.push({
            ...item,
            purchaseNum: 0,
            giveNum: 0
          });
        }
      }
      this.selectedList = originalList;
      this.$nextTick(() => {
        this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
      });
    },
    // 获取操作人-员工列表
    async getStaffList() {
      this.dataListLoading = true;
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
        type: "COMPANY",
        status: "ENABLE"
      });
      if (data.code === 0) {
        this.operatorList = data.data.records;
        const phone = getStore({ name: "company-userName" });
        const operator = this.operatorList.find(ele => ele.phone === phone);
        if (operator) {
          this.shoppingAdd.operator = operator;
          this.shoppingAdd.userId = operator.id;
          this.shoppingAdd.userName = operator.name + "/" + operator.phone;
        }
      } else {
        this.operatorList = [];
      }
      this.dataListLoading = false;
    },
    // 获取商品
    async goodsSelect() {
      if (!this.shoppingAdd.customerId) {
        this.$message.warning("请选择供应商");
        return;
      }
      this.dataListLoading = true;
      const { data } = await api.getCustomerSkuList({
        key: this.bindAdd,
        // companyId:this.shoppingAdd.companyId,
        customerId: this.shoppingAdd.customerId,
        size: 2,
        page: 1
      });
      if (data.code === 0 && data.data) {
        if (data.data.total === 1) {
          let oldList = [];
          oldList = data.data.records;
          const myItem = oldList[0];
          const index = _.findIndex(this.selectedList, item => {
            return item.skuId == myItem.skuId;
          });
          if (index === -1) {
            myItem.spuPackageId=myItem.spuPackageList[0].spuPackageId;
            myItem.purchasePrice =myItem.spuPackageList[0].packagePurchasePrice
            myItem.purchaseNum=0
            myItem.giveNum=0
            this.selectedList.push(myItem);
            this.$nextTick(() => {
              this.$refs.editTable.bodyWrapper.scrollTop = this.$refs.editTable.bodyWrapper.scrollHeight;
            });
            this.bindAdd = "";
          } else {
            this.$message.warning("已添加过该商品！");
            this.$refs.editTable.setCurrentRow(this.selectedList[index], true);
            this.$refs.editTable.bodyWrapper.scrollTop = 49 * index;
            this.bindAdd = "";
          }
        } else if (data.data.total === 0) {
          this.$message.warning("未查询到商品");
        } else {
          this.$nextTick(() => {
            this.$refs.shoppingAddSelect.init(
              this.shoppingAdd.customerId,
              this.selectedList,
              this.bindAdd
            );
          });
        }
      } else if (data.code === 0 && !data.data) {
        this.$message.warning("未查询到商品");
      } else {
        this.$message.error(data.msg);
      }
      this.dataListLoading = false;
    },
    // 删除
    deleteStock(index, row) {
      this.selectedList.splice(index, 1);
    },
    // 校验采购、赠送数量
    checkNum(type) {
      let reg = /^[0-9]+$/;
      let msg = `${
        type === "purchaseNum" ? "采购" : "赠送"
      }数量必填，且数量大于等于0且小于等于99999`;
      const flag = this.selectedList.some((item, index) => {
        if (reg.test(item[type])) {
          if (
            Number(item[type]) > 99999 ||
            Number(item[type]) < 0 ||
            item[type] == null
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      if (flag) {
        this.$message.warning(msg);
      }
      return flag;
    },
    //校验同时为0
    checkBothNum() {
      let msg = `采购数量和赠送数量不能同时0`;
      const flag = this.selectedList.some((item, index) => {
        if (item.purchaseNum === 0 && item.giveNum === 0) {
          return true;
        } else {
          return false;
        }
      });
      if (flag) {
        this.$message.warning(msg);
      }
      return flag;
    },
    // 提交订单
    async saveBuy() {
      if (this.selectedList && this.selectedList.length > 0) {
        if (
          !this.checkBothNum() &&
          !this.checkNum("purchaseNum")
        ) {
          this.$refs["shoppingAdd"].validate(async valid => {
            if (valid) {
              let form = {
                ...this.shoppingAdd,
                createUserId: this.shoppingAdd.operator
                  ? this.shoppingAdd.operator.id
                  : null,
                createUserName: this.shoppingAdd.operator
                  ? this.shoppingAdd.operator.name +
                    "/" +
                    this.shoppingAdd.operator.phone
                  : null,
                policyCost: 0,
                policyIntegral: 0,
                optType: "OWNER",
                orderType: "COM2CUS",
                skuList: this.selectedList.map(item => {
                  return {
                    ...item,
                    isGift: "0",
                    skuType: 0,
                    vendorSkuId: item.id,
                    skuId: item.skuId,
                    skuName: item.name,
                    skuPics: item.pics,
                    giveNum: 0,
                    purchasePrice: item.purchasePrice
                  };
                }),
                timeSku: new Date().getTime()
              };
              const { data } = await api.purchaseOrderAadd({
                ...form
              });
              if (data.code == 0) {
                this.$router.push({
                  name: "stockManagement-shopping-shoppingList"
                });
              } else if (data.code == -2) {
                this.$message.error("请勿重复提交！");
              } else {
                this.$message.error(data.msg);
              }
            }
          });
        }
      } else {
        this.$message.warning("请先选择商品");
      }
    }
  }
};
</script>
<style lang="scss">
.mod-store.shopping {
  .el-table {
    .inputs1.el-input {
      padding: 0 !important;
      .el-input__inner {
        width: 100% !important;
      }
    }
  }
    .out-select {
    margin-left: -40px;
    .el-input--medium .el-input__inner {
      height: 33px;
      line-height: 33px;
      width: 155px;
    }
  }
}
</style>
