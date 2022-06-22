<template>
  <el-dialog
    :close-on-click-modal="false"
    title="关联供应商"
    :visible.sync="visible"
    width="80%"
    append-to-body
    class="relateSupplier">
    <el-form ref="relateSupplier" class="mode-form-line" label-width="120px" :model="relateSupplier" :rules="relateSupplierRules">
      <div style="margin-bottom: 15px; padding-left: 50px;">
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
        *请输入准确的供应商联系人、联系电话、联系地址所在省市区/县，进行供应商精准查找
      </div>
      <el-row>
        <!-- <el-col :lg="8" :md="12" :sm="24">
          <el-form-item label="供应商名称" prop="key">
            <el-input v-model="relateSupplier.key"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :lg="8" :md="12" :sm="24">
          <el-form-item label="联系人" prop="bossName">
            <el-input v-model="relateSupplier.bossName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :lg="8" :md="12" :sm="24">
          <el-form-item label="联系电话" prop="bossPhone">
            <el-input v-model="relateSupplier.bossPhone" :maxlength="11"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="联系地址" prop="address">
        <gt-select-location  v-if="needRefresh" ref="addressLocation" :provinceId="relateSupplier.provinceId" :cityId="relateSupplier.cityId" :districtId="relateSupplier.districtId" />
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      @row-dblclick="doubleClick"
      ref="supplierTableList"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="index"
        width="60"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        min-width="150"
        :show-overflow-tooltip="true"
        label="供应商名称">
      </el-table-column>
      <el-table-column
        prop="relatedBrand"
        min-width="150"
        :show-overflow-tooltip="true"
        label="关联品牌">
      </el-table-column>
      <el-table-column
        prop="bossName"
        min-width="120"
        :show-overflow-tooltip="true"
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="bossPhone"
        min-width="100"
        :show-overflow-tooltip="true"
        label="联系电话">
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="150"
        :show-overflow-tooltip="true"
        label="联系地址">
        <template slot-scope="scope">
          <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}${scope.row.address || ''}` || '--'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">关联所选供应商</el-button>
    </span>
    <!-- <div v-show="this.dataList.length == 0" class="showData">没有您要查找的供应商，请检查输入的供应商信息是否正确</div> -->
  </el-dialog>
</template>
<script>
import gtSelectLocation from '@/components/gt-select-location'
import { getStore } from '@/utils/storage'
import * as api from '@/service/stock'
import { locations } from '@/utils'
import _ from 'lodash'
export default {
  name: 'stting-supplier-supplierManagement-relateSupplier',
  components: {
    gtSelectLocation
  },
  data() {
    //验证手机号
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不可为空'))
      } else {
        if (value !== '') {
          var reg=/^1[1-9]\d{9}$/
          if(!reg.test(value)){
            callback(new Error('请输入有效的手机号码'))
          }
        }
        callback()
      }
    }
    return {
      needRefresh:true,
      visible: false,
      dataListLoading:false,
      changePage: false,
      dataList:[],
      dataListSelections:[],
      relateSupplier:{
        // key:null,
        bossName:null,
        bossPhone:null,
        address:null,
        provinceId:null,
        cityId:null,
        districtId:null
      },
      companyId: null,
      provinceId:'',
      cityId:'',
      districtId:'',
      address: '',
      relateSupplierRules:{
        bossName:[{required:true,message:'请输入有效的联系人',trigger:'blur'}],
        bossPhone:[{required:true,message:'请输入有效的手机号码',trigger:'blur'}, 
                  {validator: validatePhone, trigger: 'blur'}],
      },
    }
  },
  created(){
    //获取companyId
    const { companyId = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    //获取供应商
    // this.getDataList()
  },
  methods: {
    init() {
      this.visible = true
    },
    //供应商列表详情
    getDataList() {
      this.$refs['relateSupplier'].validate(async (valid) => {
        if (valid) {
          this.dataListLoading = true
          this.$nextTick(async()=>{
            var local = locations(this.$refs['addressLocation'])
            const { data } = await api.relateChoiceList({
              callSource:'SAAS',
              mbgCompanyId:this.companyId,
              currentPage:1,
              pageSize:10000,
              ...this.relateSupplier,
              ...local
            })
            this.dataListLoading = false
            if (data && data.code === 0) {
              this.dataList = data.data ? data.data.records : []
              this.total =  data.data ? data.data.total : 0
              if (this.dataListSelections && this.dataListSelections.length > 0) {
                this.dataListSelections.forEach(row => {
                  const currentRow = this.dataList.find(item => (item.id == row.id))
                  if (currentRow) {
                    this.$refs.supplierTableList.toggleRowSelection(currentRow)
                  }
                })
              }
              this.changePage = false
            } else {
              this.dataList = []
              this.total = 0
              this.$message.warning(data.msg)
            }
          })
        }
      })


    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.dataListSelections)
      originalList.push(row)
      this.dataListSelections = originalList
      this.$refs.supplierTableList.toggleRowSelection(row)
    },
    // 多选
    selectionChangeHandle (pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.dataListSelections).filter(item => {
          return !this.dataList.some(ele => (ele.id == item.id))
        })
        const select = newList.concat(pushList)
        this.dataListSelections = select
      }
    },
    //关联所选供应商
    async save() {
      if(this.dataList&&this.dataList.length>0){
        const { data } = await api.relateChoiceSave({
          mbgCompanyId:this.companyId,
          customerInfoList:this.dataListSelections.map(item=>{
            return{
              companyId:item.companyId,
              customerCompanyName:item.companyName,
              customerId:item.id,
              customerName:item.bossName,
              customerPhone:item.bossPhone
            }
          })
        })
        if(data.code == 0){
          this.visible = false
          this.$emit('refreshDataList')
          this.$message.success('关联成功')
        }else{
          this.$message.error(data.msg)
        }
      }else{
        this.$message.warning('请先选择供应商')
      }
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['relateSupplier'].resetFields()
        this.needRefresh = false
        this.$nextTick(()=>{
          this.needRefresh = true
        })
      }
      this.changePage = true
      this.dataListSelections = []
      this.getDataList()
    },
  }
}
</script>
<style lang="scss" scoped>
.relateSupplier{
  .showData{
    padding-top: 100px;
    padding-bottom: 100px;
    font-size: 18px;
    text-align:center;
  }
}
</style>