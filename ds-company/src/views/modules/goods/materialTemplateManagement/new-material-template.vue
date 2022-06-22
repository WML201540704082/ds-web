<template>
  <el-dialog
    :title="!id ? '新增加料模板' : '编辑加料模板'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="50%">
    <div class="toptitle">
      <el-form ref="form" label-width="120px" :model="form" :rules="materialTemplateRules">
        <el-form-item label="加料模板名称" prop="name">
          <el-input v-model="form.name" :maxlength="10" placeholder="名称限制10个汉字以内"></el-input>
        </el-form-item>
        <el-form-item label="选择加料" prop="feedIds">
          <!-- {{form.nameVal}} -->
          <el-checkbox-group @change="changeIdToName" v-model="form.feedIds">
            <el-checkbox v-for="item in materialDataList" :key="item.id" :label="item.id">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="id" label="当前应用商品" prop="drinkNames">
          <span>{{form.drinkNames || '--'}}</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button type="primary" @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { validatenull } from '@/utils/validate'
import { materialTemplateView,materialList,newMaterialTemplate,editMaterialTemplate } from '@/service/goods'
export default {
  data(){
    return{
      materialDataList: [],//加料数据列表
      feeds: null,
      formDataLoading: false,
      materialDataListLoading: false,//加料数据列表Loading
      nameList:[],
      visible: false,
      id: null,
      form:{
        // nameVal: '',
        name:null,
        feedIds:[],
        drinkNames:null,
      },
      materialTemplateRules:{
        name:[{required: true,message:'加料模板名称必填',trigger: 'blur'}],
        feedIds:[{required: true,message:'请选择加料',trigger: 'blur'}],
      }
    }
  },
  methods:{
    init(id){
      this.visible = true
      //获取加料数据
      this.getMaterialList()
      this.id = id
      if (this.id) {
        this.getDataList()
      }else{
        this.form.name = null
        this.form.feedIds = []
      }
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    // 获取数据列表
    async getDataList() {
      this.formDataLoading = true
      const { data } = await materialTemplateView(this.id)
      this.formDataLoading = false
      if (data && data.code === 0) {
        this.form = data.data
        this.feedIds = data.data.feeds.map(item => item.id)
        this.$set(this.form, 'feedIds', this.feedIds)
        this.form.nameVal = data.data.feeds.map(item => item.name).join(',')
      } else {
        this.form = {}
        this.$message.warning(data.msg)
      }
    },
    // 获取加料数据列表
    async getMaterialList(id) {
      this.materialDataListLoading = true
      const { data } = await materialList({
        size: 1000,
        page: 0
      })
      if (data.code === 0) {
        this.materialDataList = data.data.records
      } else {
        this.materialDataList = []
        this.$message.error(data.msg)
      }
      this.materialDataListLoading = false
    },
    changeIdToName(val){
      var nameList = []
      for(var i in val){
        nameList.push(this.materialDataList.find(item => item.id == val[i]).name)
      }
      this.$set(this.form, 'nameVal', nameList.join(','))
      // console.log(this.form.nameVal)
      // debugger
      // this.form.nameVal = nameList.join(',')
    },
    // 保存
    async save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const res = !this.id ? await newMaterialTemplate({
            name: this.form.name,
            feedIds: this.form.feedIds
          }) : await editMaterialTemplate({
            id: this.id,
            name: this.form.name,
            feedIds: this.form.feedIds
          })
          this.visible = false
          this.$emit('refreshDataList')
        }
      })
    }
  }
}
</script>
<style scoped>
.toptitle {
  margin-bottom: 15px;
  color: #72716F;
  font-size: 18px;
  font-weight: 700;
  display: inline-block;
  width: 100%;
}
.tip{
  display: block;
  margin-top: 20px;
}
</style>