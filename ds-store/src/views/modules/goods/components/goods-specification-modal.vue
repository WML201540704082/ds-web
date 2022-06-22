<template>
<el-dialog
  :title="!dataForm.id ? '新增' : '修改'"
  :close-on-click-modal="false"
  class="goods-specification-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label="规格名称" prop="name" class="gt-input-tip">
      <el-input maxlength="50" v-model="dataForm.name" placeholder="请输入规格名称"><span slot="prefix" style="left: 210px;">如： 颜色</span></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sequence" class="gt-input-tip">
      <el-input v-model.number="dataForm.sequence" placeholder="请输入排序"><span slot="prefix" style="left: 210px;">如：1(只能输入正整数)</span></el-input>
    </el-form-item>
    <div>
      <el-form-item label="规格值" class="operation" required>
        <span class="tip">如：红色、蓝色、黄色</span>
      </el-form-item>
      <el-form-item class="edits" style="padding-left: -10px;">
        <el-tag
          :key="tag.name"
          v-for="tag in dynamicTags"
          :closable="tag.closeable"
          size="medium"
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag.name}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="large"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" @click="showInput" v-show="isAuth('product:pSpecAttrValue:add')">添加</el-button>
      </el-form-item>
    </div>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import * as api from '@/service/goods'
export default {
  data () {
    const orderName = (rule, value, callback) => {
      var CS = /[^\u4e00-\u9fa5a-zA-Z0-9]/
      if (CS.test(value)) {
        callback(new Error('不能输入特殊字符'))
      }else{
        callback()
      }
    }
    const sequence = (rule, value, callback) => {
      var CS = /^[0-9]+$/
      if (!CS.test(value) || value === 0) {
        callback(new Error('只能输入正整数'))
      }else if(value >=128){
        callback(new Error('最大支持127'))
      }else{
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        id: null,
        name: null,
        sequence: null
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      dataRule: {
        name: [{ required: true, message: '请填写规格名称', trigger: 'blur' },
          {validator:orderName,trigger: 'blur'}],
        sequence: [{required: true, message: '请填写排序', trigger: 'blur'}, {type: 'number', message: '请填写数字',trigger: 'blur'},
          {validator:sequence,trigger: 'blur'}]
      }
    }
  },

  methods: {
    async init (data) {
      if (data) {
        this.dataForm = {
          id: data.id,
          name: data.name,
          sequence: data.sequence
        }
        await this.getSpecValue(data.id)
      } else {
        this.dataForm = {
          id: null,
          name: null,
          sequence: null
        }
        this.dynamicTags = []
        this.inputVisible = false
        this.inputValue = ''
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 获取规格值
    async getSpecValue(id) {
      const { data } = await api.getSpecValueList(id)
      if (data.code === 0) {
        this.dynamicTags = data.data.records.map(item => {
          return {
            name: item.text,
            closeable: false
          }
        })
      } else {
        this.dynamicTags = []
      }
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid && this.checkValue()) {
          if (this.dataForm.id) {
            const { data } = await api.updateSpecKey({
              id: this.dataForm.id,
              name: this.dataForm.name,
              sequence: this.dataForm.sequence
            })
            if (data.code === 0) {
              // 添加规格值
              await this.addSpecValue(this.dataForm)
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          } else {
            // 添加规格参数
            const { data } = await api.addSpecKey({
              name: this.dataForm.name,
              sequence: this.dataForm.sequence
            })
            if (data.code === 0 && data.data) {
              await this.addSpecValue(data.data)
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          }
        }
      })
    },
    // 校验规格值数据必填
    checkValue() {
      if (this.dynamicTags && this.dynamicTags.length > 0) {
        return true
      } else {
        this.$message.warning('请至少添加一个规格值！')
        return false
      }
    },
    // 请求添加规格值
    async addSpecValue(specKey) {
      const addLabel = this.dynamicTags.filter(item => {
        return item.closeable
      })
      for(let index = 0; index < addLabel.length; index++) {
        const element = addLabel[index]
        await api.addSpecValue({
          specKeyId: specKey.id,
          specKey: specKey.name,
          text: element.name,
          sequence: this.dynamicTags.length - addLabel.length + index
        })
      }
    },
    // 删除tag
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    // 展示输入控件
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let inputValue = this.inputValue.trim()
      if (inputValue) {
        this.dynamicTags.push({
          name: inputValue,
          closeable: true
        })
      } else {
        this.$message.warning('规格值不能为空')
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style lang="scss">
.goods-specification-dailog{
  .operation{
    margin-bottom: 0;
    .tip{
      font-size: 14px;
      color: #c0c4cc;
      margin-left: 5px;
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag {
    height: 36px;
    margin-bottom: 10px;
    line-height: 34px;
    font-size: 12px;
    .el-icon-close {
      font-size: 20px;
      width: 24px;
      height: 24px;
      line-height: 24px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
    margin-bottom: 10px;
    height: 36px;
    line-height: 34px;
    padding: 0 20px !important;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-bottom: 10px;
    vertical-align: bottom;
    .el-input__inner{
      height: 36px !important;
      line-height: 34px;
    }
  }

}
.edits {
  
}

</style>

