<template>
  <el-dialog
    title="设置顾客归属"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" :rules="sendObjRule" ref="sendObj" label-width="120px">
      <el-form-item label="所属门店" prop='storeId'>
        <el-select v-model="storeId" placeholder="请选择门店" clearable @change="storeVal">
          <!-- <el-option  label="全部" value="" ></el-option> -->
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择员工" prop="employees">
        <el-select v-model="sendObj.employees" placeholder="请输入员工关键词" filterable  clearable>
          <el-option v-for="item in campaignList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { employeeSelect, getCustomerbind } from '@/service/mycustomer'
import { getStoreList } from '@/service/systore'
export default {
  data(){
    return{
      visible: false,
      campaignList:[],
      remark: null,
      customerIds:null,
      sendObj:{
        employees: null,
      },
      storeList:[],
      storeId: '',
      storeName: '',
      key: '',
      sendObjRule:{
        employees: [{required: true,message:'请先选择员工'}],
      }
    }
  },
  methods:{
    init(ids){
      this.customerIds = ids
      this.visible = true
      this.storeId = ''
      this.sendObj.employees = null
      this.key=''
      // 获取店员下拉
      this.getStoreList()
    },

    storeVal(val){
      this.sendObj.employees = null
      this.key=''
      this.storeId = val
      const storeItem = this.storeList.find(item => item.id == val)
      this.storeName = storeItem.name
      this.selectOption(val)
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
        this.selectOption('')
      } else {
        this.$message.error('获取门店列表失败')
      }
    },
    // 获取店员下拉
    async selectOption(storeId){
      const { data } = await employeeSelect({
        keyword: this.key,
        storeId: storeId,
        type: 'STORE'
      })
      if(data.code == 0){
        this.campaignList = data.data
      }else{
        this.campaignList = []
      }
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          let userName = null
          this.campaignList.map(o=>{
            if(o.id == this.sendObj.employees){
              userName = o.name
            }
          })
          var param = {
            employeeId:this.sendObj.employees,
            customerIds: this.customerIds,
            employee: userName,
            storeId: this.storeId,
            storeName: this.storeName
          }
          console.log(param)
          const data = await getCustomerbind(param)
          this.$message.success('顾客归属设置成功')
          this.visible = false
          this.$emit('refreshDataList')
        }
      })

    }
  }
}
</script>


