<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="type == 'yunHome' ? '广告设置-云店“首页”广告' : type == 'yunClassify' ? '广告设置-云店“分类”广告' : '广告设置-POS“客显”广告'"
    :visible.sync="visible"
    width="45%"
    append-to-body
    class="secondIndex">
    <el-form ref="form" label-width="120px" :model="form" :rules="dataFormRules">
      <el-form-item label="图片标题" prop="title">
        <el-input v-model="form.title" :maxlength="10"></el-input>
        <span style="padding-left:50px;">(10个汉字以内，必填)</span>
      </el-form-item>
      <el-form-item label="选择图片" prop="advertisementUrl"  class="spec-pic">
        <gt-image-upload style="display: inline-block;" :key="form.advertisementUrl" :comp="12" :realistStr="'staffHeader'" :names="0" :max="1" tip="" 
        :reallist="form.advertisementUrl" :cb="value => form.advertisementUrl = value"/>
        <span style="display:inline;padding-left:10px;">(限上传1张，上传图片格式jpg、jpeg、png，图片尺寸750px*300px)</span>
      </el-form-item>
      <el-form-item label="图片链接" prop="link" v-if="type == 'yunHome'">
        <el-input v-model="form.link"></el-input>
        <span style="padding-left:50px;">（需要IT部配合提供）</span>
      </el-form-item>
      <el-form-item label="适用门店" prop="storeNames">
        <span>{{form.storeNames}}</span>
        <el-button type="primary" @click="selectStore">选择门店</el-button>
      </el-form-item>
    </el-form>
    <gt-dialog-checkbox ref="checkboxs" @list="listBox"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { createSecondBanner,updateSecondBanner,getBannerDetails } from '@/service/advertisement'
import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import gtImageUpload from "@/components/gt-image-upload"
export default {
  name: "settings-advertisement-secondIndexAd",
  data() {
    return {
      id: '',
      visible: false,
      dataListLoading: false,
      storeList: [], // 门店列表
      form:{
        title : null,
        link: null,
        advertisementUrl : null,
        storeNames: '',
        storeIds:[]
      },
      dataFormRules: {
        title:[{required: true, message: '请填写图片标题'}],
        advertisementUrl:[{required: true, message: '请选择图片'}],
        storeNames:[{required: true, message: '请选择适用门店'}]
      }
    }
  },
  components: {
    gtImageUpload,gtDialogCheckbox
  },
  methods: {
    init(type,id) {
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        this.form.storeIds = []
      })
      this.type = type
      this.id = id
      if (id) {
        this.getDataList(id)
      }
      this.visible = true
    },
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await getBannerDetails(id)
      if (data.code === 0) {
        this.form = data.data
        this.form.storeIds = this.form.storeIds.map(item => ({id:item}))
      } else {
        this.form = {}
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 选择门店
    selectStore(){
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.form.storeIds)
        debugger
      })
    },
    // 选中门店回调函数
    listBox(obj){
      var obj1 = JSON.parse(obj)
      this.storeList = obj1
      var storeVal = []
      var storeIds = []
      for(var i in obj1){
        storeVal.push(obj1[i].name)
      }
      for(var i in obj1){
        storeIds.push(obj1[i].id)
      }
      this.form.storeNames = storeVal.join(',')
      this.form.storeIds = storeIds.map(item => ({id:item}))
      this.$refs['form'].validateField('storeNames')
    },
    // 保存
    async save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let form ={
            ...this.form,
            storeIds:this.form.storeIds.map(item=>item.id),
            advertisementType:this.type == 'yunHome' ? 0 : this.type == 'yunClassify' ? 2 : 1,
          }
          const { data } = !this.id ? await createSecondBanner(form) : await updateSecondBanner(form)
          if(data.code == 0){
            this.visible = false
            this.$emit('refreshDataList')
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .secondIndex{
    .el-input {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 150px;
    }
    .spec-pic{
      .fileCon{
        padding-left: 0 !important;
        min-height: 50px;
        .list{
          margin: 0;
          min-height: 50px;
          padding: 0 !important;
          & > div{
            width: 50px;
            height: 50px;
          }
          .el-loading-spinner{
            padding: 0 !important;
            .circular{
              margin: 10px 0 0 2px;
              width: 20px;
              height: 20px;
            }
          }
          .add{
            margin: 0;
            .close{
              padding: 0 !important;
            }
            .el-upload-card{
              width: 48px !important;
              height: 48px !important;
              line-height: 48px !important;
            }
          }
        }
      }
      & > div{
        padding: 0 !important;
      }
    }
  }
</style>
