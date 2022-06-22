<template>
  <section class="page-goods-tea mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form
        :inline="true"
        class="mode-form-line"
        label-width="60px"
        ref="filterForm"
        :model="filterForm"
        @keyup.enter.native="resetForm('search')"
      >
        <el-form-item label="商品分类">
          <el-form-item prop="classId">
            <el-select v-model="filterForm.classId" placeholder="请选择商品分类" clearable>
              <el-option label="全部" value></el-option>
              <el-option
                v-for="item in goodsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="销售状态" prop="sale">
          <el-select v-model="filterForm.sale" placeholder="请选择销售状态" clearable>
            <el-option value="true" label="在售"></el-option>
            <el-option value="false" label="停售"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-form-item prop="storeId">
            <el-select v-model="filterForm.storeId" placeholder="请选择门店" clearable>
              <!-- <el-option label="全部" value></el-option> -->
              <el-option
                v-for="item in storeName"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <!-- <el-form-item label="商品名称" prop="key">
          <el-input v-model="filterForm.key" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>-->
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')" />
          <gt-button type="reset" @click.native="resetForm('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <!--  -->
    <el-card>
      <!-- <gt-border-button class="gt-table-create" txt="新建商品" type="create" @click.native="() => addOrUpdateHandle()"/> -->
      <!-- <gt-border-button class="gt-table-create" type="export" txt="应用到门店" @click.native="() => addOrUpdateHandle()"/> -->
      <!-- <el-button type="primary" @click="editStatus">编辑</el-button> -->
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        ref="goodsTableList"
        style="width: 100%"
      >
        <!-- <el-table-column prop="apply" min-width="60" label="应用状态">
          <template slot-scope="scope">
            <el-checkbox v-model="ischecked" @change.native="changeChecked(scope.$index,scope.row)"></el-checkbox>
          </template>
        </el-table-column>-->
        <el-table-column prop="index" width="60" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="60" :show-overflow-tooltip="true" label="操作">
          <template slot-scope="scope">
            <el-button
              class="nopadding"
              type="text"
              size="small"
              @click="detailGoods(scope.row.id)"
            >查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="drink.name"
          min-width="60"
          :show-overflow-tooltip="true"
          label="商品名称"
        ></el-table-column>
        <el-table-column
          prop="drink.code"
          min-width="60"
          :show-overflow-tooltip="true"
          label="商品编码"
        >
          <template slot-scope="scope">
            <span>{{scope.row.drink.code ? scope.row.drink.code: '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="drink.className"
          min-width="60"
          :show-overflow-tooltip="true"
          label="商品分类"
        ></el-table-column>
        <el-table-column
          prop="drink.sequence"
          min-width="60"
          :show-overflow-tooltip="true"
          label="终端排序"
        >
          <template slot-scope="scope">
            <span>{{scope.row.drink.sequence ? scope.row.drink.sequence: '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="drink.salePrice"
          align="center"
          min-width="50"
          :show-overflow-tooltip="true"
          label="销售价格"
        >
          <template slot-scope="scope">
            <span
            >{{scope.row.drink.salePrice ? Number(priceNum(scope.row.drink.salePrice)).toFixed(2) : Number(priceNum(scope.row.drink.minSalePrice)).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale"
          align="center"
          min-width="60"
          :show-overflow-tooltip="true"
          label="销售状态"
        >
          <template slot-scope="scope">
            <span>{{scope.row.sale == true ? '在售': '停售'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <gt-pagination
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @updatePagination="pagination_event"
      />-->
    </el-card>
  </section>
</template>
<script>
import * as api from "@/service/goods";
import gtPagination from "@/components/gt-pagination";

export default {
  name: "goods-storetea-view",
  data() {
    return {
      ischecked: true,
      disabled: true,
      // storeId: null,
      filterForm: {
        key: null,
        storeId: null,
        classId: null,
      },
      total: 0,
      pageSize: 1000,
      currentPage: 0,
      editId: null,
      goodsList: [], //商品分类
      storeName: [], //门店名称
      dataListdrink: [],
      dataList: [
        {
          drink: {},
        },
      ],
      dataListLoading: false,
    };
  },
  components: {
    gtPagination,
  },
  async created() {
    const { id } = this.$route.query;
    let pramsStoreid = localStorage.getItem('pramsStoreid')
    if(!this.filterForm.storeId){
      this.filterForm.storeId = id || pramsStoreid;
    }
    //门店显示
    this.filterForm.storeId=Number(this.filterForm.storeId)
    this.getDataList();
    this.getTeaCategory();
    this.getTeaStore();
    localStorage.setItem('pramsStoreid', '')
  },

  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getStoresTeaList({
        ...this.filterForm,
        page: this.currentPage,
        size: this.pageSize,
        // storeId: this.filterForm.storeId
          // ? this.filterForm.storeId
          // : this.storeId,
      });
      if (data.code === 0) {
        this.dataList = data.data.records;
        // this.total = data.data.total
      } else {
        this.$message.error(data.msg);
        this.dataList = [];
        this.total = 0;
      }
      this.dataListLoading = false;
    },

    // 获取商品分类
    async getTeaCategory() {
      const { data } = await api.getTeaCategory();
      if (data && data.data) {
        this.goodsList = data.data;
        console.log(this.goodsList);
      }
    },

    //门店下拉列表
    async getTeaStore() {
      const { data } = await api.getStoreList();
      if (data && data.data) {
        console.log(data.data);
        this.storeName = data.data;
        console.log(this.storeName);
      }
    },
    //编辑
    // editStatus(){},

    //查看
    detailGoods(id) {
      this.$router.push({ name: "goods-storetea-detail", query: { id, storeId:this.filterForm.storeId} });
    },

    //修改应用状态
    // changeChecked(index,row){
    //     console.log(index,row)
    //     this.$easyConfirm.show({
    //     title: '提示',
    //     content: '确定修改应用状态',
    //     confirm: async () => {
    //     //   const {data} = await api.deleteBrandPercent(id)
    //     }
    //   })
    // },

    // 重置
    resetForm(type) {
      if (type === "reset") {
        this.$refs["filterForm"].resetFields();
        // this.pageSize = 20;
      }
      this.currentPage = 0;
      this.getDataList();
    },
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.getDataList();
    },
  },
};
</script>
<style lang="scss">
.page-goods-tea {
  .edit-input {
    .el-input__inner {
      width: 90px;
    }
    padding: 0 !important;
  }
}
</style>