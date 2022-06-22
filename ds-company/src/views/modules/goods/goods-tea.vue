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
                v-for="item in mainCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="销售状态" prop="sale">
          <el-select v-model="filterForm.sale" placeholder="请选择销售状态" clearable>
            <el-option value="TRUE" label="在售中"></el-option>
            <el-option value="FALSE" label="已停售"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')" />
          <gt-button type="reset" @click.native="resetForm('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <!--  -->
    <el-card>
      <!-- <gt-border-button class="gt-table-create" type="export" txt="应用到门店" @click.native="() => addOrUpdateHandle()"/> -->
      <gt-border-button
        class="gt-table-create"
        txt="新建商品"
        type="create"
        @click.native="() => editGoods()"
      />
      <el-button type="primary" class="apply-stores" @click="applyStore">应用到门店</el-button>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        ref="goodsTableList"
        @selection-change="handleSelectionChange"
        style="width: 100%;"
      >
        <el-table-column v-if="isshow" type="selection" width="60"></el-table-column>
        <el-table-column
          prop="index"
          width="60"
          label="序号">
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
              @click="detailGoods(scope.row.id,scope.row.sale)"
            >查看</el-button>
            <span v-if="scope.row.sale==false">|</span>
            <el-button
              v-if="scope.row.sale==false"
              class="nopadding"
              type="text"
              size="small"
              @click="editGoods(scope.row.id)"
            >编辑</el-button>
            <span>|</span>
            <el-button
              class="nopadding"
              type="text"
              size="small"
              @click="changeStatus(scope.row)"
            >{{scope.row.sale==true ? '停止':'恢复' }}销售</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" min-width="60" :show-overflow-tooltip="true" label="商品名称"></el-table-column>
        <el-table-column prop="code" min-width="60" :show-overflow-tooltip="true" label="商品编码">
          <template slot-scope="scope">
            <span>{{scope.row.code ? scope.row.code: '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="className" min-width="60" :show-overflow-tooltip="true" label="商品分类"></el-table-column>
        <el-table-column prop="sequence" min-width="60" :show-overflow-tooltip="true" label="终端排序">
          <template slot-scope="scope">
            <span>{{scope.row.sequence ? scope.row.sequence: '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="salePrice"
          align="center"
          min-width="50"
          :show-overflow-tooltip="true"
          label="销售价格"
        >
        <template slot-scope="scope">
            {{scope.row.salePrice?  Number(priceNum(scope.row.salePrice)).toFixed(2): Number(priceNum(scope.row.minSalePrice)).toFixed(2)}}
          </template></el-table-column>
        <el-table-column
          prop="sale"
          align="center"
          min-width="60"
          :show-overflow-tooltip="true"
          label="销售状态"
        >
          <template slot-scope="scope">
            <span>{{scope.row.sale==true ? "在售中": '已停售'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @updatePagination="pagination_event"
      />
      <el-card v-if="isshow">
        <el-button type="primary" class="apply-stores" @click="allchekhandel">全选所有搜索结果商品</el-button>
        <el-form class="search-toolbar">
          <el-button type="primary" class="apply-stores" @click="applyAllStore">应用到所有门店</el-button>
          <el-button type="default" class="apply-stores" @click="cancelHandel">取消</el-button>
        </el-form>
      </el-card>
    </el-card>
    <!-- <add-or-update ref="addOrUpdate" @refreshBrand="getDataList"></add-or-update> -->
  </section>
</template>
<script>
import * as api from "@/service/goods";
import gtPagination from "@/components/gt-pagination";

export default {
  name: "goods-tea",
  data() {
    return {
      isshow: false,
      filterForm: {
        sale: null,
        name: null,
        classId: null,
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
      editId: null,
      mainCategory: [],
      dataList: [],
      dataListLoading: false,
      newList: [], //应用门店列表ids
      ids: [],
    };
  },
  components: {
    gtPagination,
  },
  async created() {
    this.getDataList();
    this.getTeaCategory();
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getGoodsTeaList({
        //getGoodsList getGoodsTeaList
        ...this.filterForm,
        page: this.currentPage,
        size: this.pageSize,
      });
      if (data.code === 0) {
        this.dataList = data.data.records;
        this.total = data.data.total;
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
        this.mainCategory = data.data;
        // console.log(this.mainCategory);
      }
    },

    applyStore() {
      this.isshow = true;
      console.log(this.isshow);
    },
    canSelect(row) {
      return false;
    },
    //全选
    allchekhandel() {
      this.$refs.goodsTableList.toggleAllSelection();
      this.newList = this.dataList.map((item) => item.id);
      console.log(this.newList);
    },

    //选中项
    handleSelectionChange(pushList) {
      this.newList = pushList.map((item) => item.id);
    },

    //应用到门店
    async applyAllStore() {
      this.$easyConfirm.show({
        title: "提示",
        content: "确定应用到所有门店？",
        confirm: async () => {
          const { data } = await api.applyToStore(this.newList);
          if (data.code === 0&& this.newList!=[]) {
            this.$easyConfirm.hide()
            this.$message.success("应用成功")
            this.isshow = false
            this.getDataList()
          } else {
            this.$message.error("应用到门店的商品不能为空！")
            this.isshow = false
            this.$easyConfirm.hide()
          }
        },
      });
    },

    //取消
    cancelHandel() {
      this.isshow = false;
      this.getDataList();
    },

    //是否在售
    async changeStatus(row) {
      // console.log(await api.changeSale(row))
      // const { data } = await api.changeSale(row);
      // if (data.code === 0) {
      //   this.getDataList();
      // } else {
      //   this.$message.error(data.msg);
      // }
       this.$easyConfirm.show({
        title: "提示",
        content: "确定要执行该操作？",
        confirm: async () => {
          const { data } = await api.changeSale(row);
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success("操作成功")
            this.getDataList()
          } else {
            this.$message.error(data.msg)
            this.$easyConfirm.hide()
          }
        },
      });
    },

    // 编辑
    editGoods(id) {
      this.$router.push({ name: "goods-tea-setting", query: { id } });
    },

    //查看
    detailGoods(id) {
      this.$router.push({ name: "goods-tea-view", query: { id } });
    },

    // 重置
    resetForm(type) {
      if (type === "reset") {
        this.$refs["filterForm"].resetFields();
        this.pageSize = 20;
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
.apply-stores {
  position: relative;
  top: -3px;
}
</style>