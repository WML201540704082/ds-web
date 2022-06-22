<template>
  <section class="page-campaign-add">
    <el-card>
      <el-form ref="sale-form"  label-width="150px" :model="sale" :validate-on-rule-change="false">
        <el-form-item label="销售姓名：" prop='name'>
          <span class="itemInput">{{sale.name}}</span>
        </el-form-item>
        <el-form-item label="手机号码：" prop='phone'>
          <span class="itemInput">{{sale.phone}}</span>
        </el-form-item> 
        <el-form-item label="入职角色：" prop='roleType'>
          <span class="itemInput">{{sale.roleType === 'SALESMAN' ? '销售' : ''}}</span>
        </el-form-item>
        <el-form-item label="入职时间：" prop='joinTime'>
          <span class="itemInput">{{sale.joinTime}}</span>
        </el-form-item>
        <el-form-item label="状态：">
          <span class="itemInput">{{sale.workStatusType === 'ONWORK' ? '在职' : '离职'}}</span>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <span class="itemInput">{{sale.remark}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { getSalesmanDetail } from '@/service/sale'
import * as api from '@/service/sale'
export default {
  data() {
    return {
      sale:{
        name:'',//姓名
        phone:'',//手机号
        roleType:'',//角色
        joinTime:'',//入职时间
        workStatusType:'',//状态
        remark:'',//备注
      }
    }
  }, 
  created () {
    const { id } = this.$route.query
    this.id = id
    this.init(id)
  },
  methods:{
    async init(id) {
      const { data } = await getSalesmanDetail(id)
      if (data.code === 0) {
        this.sale = {
          ...data.data
        }
      }    
    },
  }
}
</script>
