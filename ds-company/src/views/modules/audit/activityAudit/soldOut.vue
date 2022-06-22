<template>
<el-dialog
    title="强制下架"
    :close-on-click-modal="false"
    width="80%"
    :visible.sync="visible"
    append-to-body
    class="page-approve-modal">
<div class="page-approve-modal">
  <el-form  label-width="100px"  :rules="activeaddaddRules">
          <el-form-item label="下架说明：" prop="stopReason">
             <el-input  type="textarea" v-model="stopReason" style="width: 300px;" :maxlength="50" placeholder="最多支持50个字符" autosize></el-input>
          </el-form-item>
  </el-form>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit()">下架</el-button>
  </span>

</el-dialog>
</template>

<script>
import * as api from '@/service/activity'
export default {
  name: 'goods-specification-modal',
  data () {
    return {
      dataList: [],
      filterForm: {
        status: null,
        type: null,
        title: null,
        showStore: false,
        storeId: null,
        startTime: null,
        endTime: null,
        auditStartTime: null,
        auditEndTime: null,
      },
      stopReason: null,
      id: null,
      visible:false,
      activeaddaddRules:{
        stopReason:[{required: true,message:'下架说明为必填', trigger: 'change'}]
      }
    }
  },
  methods: {
    async init (id) {
        this.id=id
        this.visible = true
        this.stopReason = null
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getStoreActivityList({
        ...this.filterForm,
        close : true
      });
      this.dataListLoading = false;
      if (data && data.code === 0) {
        this.dataList = data.data.map(item => {
          return{
            ...item,
          }
        })
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },
    // 表单提交
    async dataFormSubmit () {
          if(this.stopReason){
            const { data } = await api.soldActivity({
            id:this.id,
            stopReason:this.stopReason
            })
            if(data.code === 0){
                this.$message.success('下架成功')
                this.visible = false
                this.$emit('refreshDataList')
            }else{
                this.$message.error(data.msg)
            }
            }else{
              this.$message.warning('请填写下架说明')
            }
    },
  }
}
</script>
<style lang="scss">
.page-approve-modal{
	.out-select{
		margin-left: -40px;
    .el-input--medium .el-input__inner {
      height: 33px;
      line-height: 33px;
      width: 155px;
    }
	}
  .toptitle {
    margin-bottom: 15px;
    color: #72716F;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
    width: 100%;
  }
  .tip{
    margin-right: 20px;
  }
  .stockview .el-dialog__body {
    padding-top: 10px!important;
  }
  .inputs1 input {
    width: 100%!important;
  }
  .el-table__row .inputs1 {
    padding-left: 0!important;
  }
}
</style>

