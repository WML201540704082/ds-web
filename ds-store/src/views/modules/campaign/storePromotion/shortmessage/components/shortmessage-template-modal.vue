<template>
  <el-dialog
    title="短信模板"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form class="com-shortmessage-template" ref="shortmessage" :rules="dataFormRules" label-width="120px" :model="shortmessage">
      <el-form-item label="发送场景" prop="sendScene">
        <el-select v-if="!id" v-model="shortmessage.sendScene" placeholder="请选择发送场景" clearable>
          <el-option
            v-for="item in shortmessageScenes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="itemInput" v-else>{{filterStatus(shortmessage.sendScene, shortmessageScenes)}}</span>
      </el-form-item>
      <el-form-item label="短信主题" prop="title">
        <el-input v-if="!id" v-model="shortmessage.title" placeholder="请输入短信主题，如活动邀请"/>
        <span class="itemInput" v-else>{{shortmessage.title}}</span>
      </el-form-item>
      <div v-if="!id" style="overflow: hidden;"><div class="label">模板内容</div><span class="tip">提示: 短信内容不得涉及政治、宗教信仰、个人隐私或攻击等非法信息</span></div>
      <el-form-item prop="content" :label="id ? '模板内容' : ''">
        <span v-if="!id">
          <textarea
            ref="addSmsInput"
            class="my-textarea"
            :rows="8"
            placeholder="请输入模板内容"
            v-model="shortmessage.content">
          </textarea>
          <div class="num-tip">已输入{{this.shortmessage.content.length}}个字≈{{Math.ceil(this.shortmessage.content.length/70)}}条短信</div>
        </span>
        <span class="itemInput" v-else>{{shortmessage.content}}</span>
      </el-form-item>
      <div class="control" v-if="!id">
        <div class="label">插入参数</div>
        <div class="item-container"><div class="item theme-color theme-border" :key="item.id" @click="() => insert(item)" v-for="item in shortmessageParams">{{item.name}}</div></div>
      </div>
    </el-form>

    <span slot="footer" class="dialog-footer" v-if="!id">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
    <span  slot="footer" class="dialog-footer" v-else>
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTemplateDetail, addShortmessage } from '@/service/campaign'
import { shortmessageScenes, shortmessageParams } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  data(){
    return{
      dataListLoading:false,
      shortmessageScenes,
      shortmessageParams,
      filterStatus,
      shortmessage: {
        content: ''
      },
      id: null,
      currentFocus: 0,
      visible: false,
      dataFormRules:{
        sendScene:[{required: true, message: '请选择发送场景'}],
        title: [{required: true, message: '请输入活动主题'}],
        content: [{required: true, message: '请输入模板内容'}],
      }
    }
  },
  methods:{
    init(id){
      this.visible = true
      this.dataListLoading = true
      this.id = id
      if (id) {
        this.getDetail(id)
      } else {
        this.shortmessage = {
          sendScene: '',
          title: '',
          content: ''
        }
        this.$nextTick(() => {
          this.$refs['shortmessage'].clearValidate()
        })
      }
    },
    // 获取优惠券
    async getDetail(id) {
      const { data } = await getTemplateDetail({id})
      if (data.code === 0) {
        this.shortmessage = data.data
      } else {
        this.shortmessage = {}
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 更改参数
    insert(template) {
      let currentFocus = this.$refs.addSmsInput.selectionStart || this.shortmessage.content.length
      this.shortmessage.content = this.setStr(this.shortmessage.content, currentFocus, `{${template.name}}`)
    },
    setStr(str,index,value){
      let start = str.substring(0,index)
      let end = str.substring(index, str.length)
      return start+value+end
    },
    // 确定
    sure(){
      this.$refs['shortmessage'].validate(async (valid) => {
        if (valid ) {
          // 商品列表
          const res = await addShortmessage({
            ...this.shortmessage,
          })
          this.visible = false
          this.$emit('refreshData')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.com-shortmessage-template{
  .label{
    width: 120px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    font-weight: 600;
    padding-right: 12px;
    float: left;
  }
  .tip{
    font-size: 14px;
    color: red;
    height: 30px;
    line-height: 30px;
    float: left;
  }
  .num-tip{
    position: absolute;
    bottom: 10px;
    font-size: 12px;
    right: 10px;
  }
  .item-container{
    overflow: hidden;
    .item{
      float: left;
      cursor: pointer;
      margin: 0 15px 10px 0;
      padding: 5px 10px;
      font-size: 16px;
    }
  }
  .my-textarea{
    width: 100%;
    margin-top: 5px;
    border-color: #d8d8d8;
    border-radius: 5px;
    padding: 10px;
    -webkit-appearance: none;
    font-size: 16px;
    &:focus{
      outline: none;
    }
  }
  .el-form-item__content:focus{
    outline: none;
  }
}
</style>

