<template>
   <el-dialog
    title="礼品卡详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    class="cardDia"
    append-to-body>
    <el-form ref="countcardObj" label-width="100px" class="baseInfo">
      <gt-subtitle title="基本信息" style="display: block;"/>  
      <el-form-item label="礼品卡名称">
        <span class="itemInput">{{countcardObj.cardName}}</span>
      </el-form-item>
      <el-form-item label="卡号">
        <span class="itemInput">{{countcardObj.cardNo}}</span>
      </el-form-item>
      
      <el-form-item label="计项内容">
      <el-table
        :data="countcardObj.items"
        border
        v-loading="dataListLoading"
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="200"
          :show-overflow-tooltip="true"
          label="服务项目">
        </el-table-column>
        <el-table-column
          prop="total"
          min-width="150"
          :show-overflow-tooltip="true"
          label="总次数">
        </el-table-column>
        <el-table-column
          prop="count"
          :show-overflow-tooltip="true"
          min-width="180"
          label="剩余次数">
        </el-table-column>
      </el-table>
      </el-form-item>

      <el-form-item label="有效期">
        <span class="itemInput">{{countcardObj.startTime}}-{{countcardObj.endTime}}</span>
      </el-form-item>
      <el-form-item label="适用门店">
        <span class="itemInput">{{countcardObj.storeName.join(',')}}</span>
      </el-form-item>
      <gt-subtitle title="消费明细" style="display: block;margin-bottom:10px"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="200"
          :show-overflow-tooltip="true"
          label="消费时间">
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          :show-overflow-tooltip="true"
          min-width="180"
          label="消费门店">
        </el-table-column>
        <el-table-column
          prop="productName"
          :show-overflow-tooltip="true"
          min-width="180"
          label="消费服务">
        </el-table-column>
        <el-table-column
          prop="counta"
          min-width="200"
          :show-overflow-tooltip="true"
          label="扣余次数">
          <template slot-scope="scope">
            <span>{{scope.row.counta}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="left"
          min-width="380"
          :show-overflow-tooltip="true"
          label="剩余次数">
        </el-table-column>
      </el-table>
    </el-form>
  </el-dialog>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { statCardDetail } from '@/service/mycustomer'
export default {
  data(){
    return{
      countcardObj: {},
      dataListLoading: false,
      dataList: [],
      visible: false,
    }
  },
  created(){
  },
  methods:{
    init(id,obj){
      this.visible = true
      this.countcardObj = obj
      this.getDataList(id)
    },

    async getDataList(id){
      const {data} = await statCardDetail(id)
      if(data.code == 0){
        var dataList = data.data
        dataList.map(o=>{
          if(o.count >0){
            o.counta = '+'+o.count
          }else{
            o.counta = o.count
          }
        })
        this.dataList = dataList
      }else{
        this.dataList = []
        this.$message.error(data.msg)
      }

    },
  }
}
</script>


