<template>
  <el-dialog
    title="引用入库单"
    :close-on-click-modal="false"
    width="80%"
    class="select-goods-dailog"
    :visible.sync="visible"
    append-to-body
  >
    <el-form
      :inline="true"
      class="mode-form-line1"
      ref="filterForm"
      label-width="80px"
      :model="filterForm"
      @keyup.enter.native="resetForm('search')"
    >
      <el-form-item label="入库单号" prop="orderNo">
        <el-input v-model="filterForm.orderNo" placeholder="请输入入库单号"></el-input>
      </el-form-item>
      <el-form-item label="入库时间" prop="brandId">
        <gt-time-range
          start-time-prop="beginInStockTime"
          :start-time-value="filterForm.beginInStockTime"
          :end-time-value="filterForm.endInStockTime"
          end-time-prop="endInStockTime"
          @changeStartValue="value => filterForm.beginInStockTime = value"
          @changeEndValue="value => filterForm.endInStockTime = value"
        ></gt-time-range>
      </el-form-item>
      <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:stock:list')">
        <gt-button type="search" @click.native="resetForm('search',isStock)" />
        <gt-button type="reset" @click.native="resetForm('reset',isStock)" />
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      v-table-height
      :selectable="(row, index) => {return row.settlement !== 'FINISH' && row.status === 'FINISH' }"
      ref="goodsTableList"
      style="width: 100%;">
      <!-- 单选 -->
      <el-table-column width="60" label="选择">
        <template slot-scope="scope">
          <el-radio :label="scope.$index" v-model="templateRadio"  @change.native="getTemplateRow(scope.$index,scope.row)"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="index" width="60" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="inStockTime"
        min-width="180"
        :show-overflow-tooltip="true"
        label="入库时间"
      ></el-table-column>
      <el-table-column 
        prop="orderNo" 
        min-width="160" 
        :show-overflow-tooltip="true" 
        label="入库单号">
      </el-table-column>
      <el-table-column 
        prop="species" 
        min-width="100" 
        :show-overflow-tooltip="true" 
        label="商品种类">
      </el-table-column>
      <el-table-column 
        prop="amount" 
        min-width="120" 
        :show-overflow-tooltip="true" 
        label="商品数量"
        v-if="newStore == 'false'">
      </el-table-column>
      <el-table-column 
        prop="inStockUser" 
        min-width="180" 
        :show-overflow-tooltip="true" 
        label="操作人">
        <template slot-scope="scope">
          <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
        </template>
      </el-table-column>
    </el-table>
    <gt-pagination
      :total="total"
      :currentPage="currentPage"
      :pageSize="pageSize"
      @updatePagination="pagination_event"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import gtTimeRange from "@/components/gt-time-range";
import gtSubtitle from "@/components/gt-sub-title";
import * as api from "@/service/stock";
import { filterStatus, fileDownload } from "@/utils";
import { inStockstatus, setStatus, inStockType } from "@/utils/dict";
import { getMainCategory, getSubCategory } from "@/service/goods";
import gtPagination from "@/components/gt-pagination";
import { brandsList } from "@/service/goods";
import NP from "number-precision";
import _ from "lodash";
import { getStore } from '@/utils/storage'
export default {
  data() {
    return {
      templateRadio:false,
      setStatus,
      inStockstatus,
      filterStatus,
      visible: false,
      dataList: [],
      dataListLoading: false,
      isStock: true,
      filterForm: {
        orderNo: null,
        beginInStockTime: null,
        endInStockTime: null
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      brands: [],
      selectedList: [],
      changePage: true
    };
  },
  components: {
    gtPagination,
    gtSubtitle,
    gtTimeRange
  },
  // props:['goodsAddName'],
  async created() {
    this.getDataList();
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.templateRadio=false
      this.dataListLoading = true;
      const { data } = await api.getinStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.filterForm,
        status:'FINISH',
        type:'PURCHASE',
        quoteInStock:true,
      });
      this.dataListLoading = false;
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total;
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => item.id == row.id);
              if (currentRow) {
                this.$refs.goodsTableList.toggleRowSelection(currentRow);
              }
            });
          }
          this.changePage = false;
        });
      } else {
        this.dataList = [];
        this.total = 0;
        this.$message.warning(data.msg);
      }
    },
    //多选
    // async selectionChangeHandle(pushList) {
    //   if (!this.changePage) {
    //     // 全部选中项
    //     const newList = _.cloneDeep(this.selectedList).filter(item => {
    //       return !this.dataList.some(ele => ele.id == item.id);
    //     });
    //     // console.log(pushList);
    //     let objectSelect = Object.assign(...pushList)
    //     const { data } = await api.getinStockDetail(objectSelect.id);
    //     if (data && data.code === 0) {
    //       this.details = data.data;
    //       this.detailsRow = this.details.items;
    //     }
    //     pushList = this.detailsRow
    //     const select = newList.concat(pushList);
    //     this.selectedList = select;
    //   }
    // },
    init(storeId, selectedList = [], key) {
      this.changePage = true;
      this.visible = true;
      this.selectedList = selectedList;
      // 重置搜索条件
      this.filterForm = {
        storeId,
        key,
        brandId: null
      };
      this.getDataList();
    },
    //移除一行
    deleteSign(row) {
      const { skuId } = row;
      let selectIndex = 0;
      this.selectedList.forEach((item, index) => {
        if (item.skuId === skuId) {
          selectIndex = index;
        }
      });
      const newRow = this.dataList.find(ele => ele.skuId === skuId);
      this.selectedList.splice(selectIndex, 1);
      if (newRow) {
        this.$refs.goodsTableList.toggleRowSelection(newRow);
      } else {
        // this.$emit('changeSelect', this.selectedList)
      }
    },

    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.changePage = true;
      this.getDataList();
    },
     //单选
    async getTemplateRow (index,row) {
      const { data } = await api.getinStockDetail(row.id);
      if (data && data.code === 0) {
        this.details = data.data;
        this.detailsRow = this.details.items.map(item => {
          return{
            ...item,
            useQuantity: item.productType == 'BULK' ? item.stockQuantity / 1000 : item.stockQuantity,//可用库存
            quantity: item.productType == 'BULK' ? item.buyQuantity / 1000 : item.buyQuantity,//出库数量
          }
        });
      }
      this.selectedList = this.detailsRow;
      this.$refs.goodsTableList.toggleRowSelection(row);
    },
    //双击填入
    // async doubleClick(index,row) {
      // debugger
      // this.templateRadio=true
      // const { data } = await api.getinStockDetail(row.id);
      // if (data && data.code === 0) {
      //   this.details = data.data;
      //   this.detailsRow = this.details.items;
      // }
      // let originalList = _.cloneDeep(this.selectedList);
      // originalList.push(this.detailsRow);
      // originalList = Object.assign(...originalList);
    //   this.selectedList = originalList;
    //   this.$refs.goodsTableList.toggleRowSelection(row);
    // },

    // 表单提交
    dataFormSubmit() {
      console.log(this.selectedList);
      // linkOrderNo
      if (this.selectedList && this.selectedList.length > 0) {
        this.$emit("changeSelect", this.selectedList);
        this.visible = false;
      } else {
        this.visible = true;
        this.$message.warning("请先选择商品");
      }

    },
    // 重置 搜索
    resetForm(type, isStock) {
      this.currentPage = 0;
      if (type === "reset") {
        this.$refs["filterForm"].resetFields();
        this.pageSize = 20;
      }
      this.changePage = true;
      this.getDataList(!isStock);
    },
   
  }
}
</script>
<style lang="scss" scoped>
.footer_ture {
  text-align: center;
}
.inputs1 input {
  width: 100% !important;
  margin-left: -12px;
}

.el-table .cell{
  display: none;
}

</style>
