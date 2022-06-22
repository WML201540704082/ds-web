<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    class="goods-specification-dailog"
    :visible.sync="visible"
    append-to-body
  >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="分类名称" prop="name" class="gt-input-tip">
        <el-input maxlength="5" v-model="dataForm.name" placeholder="请输入分类名称">
          <span slot="prefix" style="left: 210px;">最多5个汉字</span>
        </el-input>
      </el-form-item>
      <el-form-item label="终端排序" prop="sequence" class="gt-input-tip">
        <el-input v-model.number="dataForm.sequence" placeholder="请输入终端排序">
          <span slot="prefix" style="left: 210px;">输入正整数,数值越小排序越靠前</span>
        </el-input>
      </el-form-item>
      <el-form-item label="分类图片" prop="pic">
        <gt-image-upload
          :key="dataForm.pic"
          :comp="12"
          :realistStr="'staffHeader'"
          :names="0"
          :max="1"
          tip="请上传56*56px的png格式图片"
          :reallist="dataForm.pic"
          :cb="value => dataForm.pic = value"
        />
      </el-form-item>
      <el-form-item label="分类标记" class="gt-input-tip">
        <el-radio-group v-model="dataForm.mark">
          <el-radio label="EMPTY">无</el-radio>
          <el-radio label="HOT">Hot</el-radio>
          <el-radio label="NEW">New</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from "@/service/goods";
import gtImageUpload from "@/components/gt-image-upload";

export default {
  name: "goods-tea-category-modal",
  components: {
    gtImageUpload,
  },
  data() {
    const orderName = (rule, value, callback) => {
      var CS = /[^\u4e00-\u9fa5a-zA-Z0-9]/;
      if (CS.test(value)) {
        callback(new Error("不能输入特殊字符"));
      } else {
        callback();
      }
    };
    const sequence = (rule, value, callback) => {
      var CS = /^[0-9]+$/;
      if (!CS.test(value) || value === 0) {
        callback(new Error("只能输入正整数"));
      } else if (value >= 10000) {
        callback(new Error("最大支持9999"));
      } else {
        callback();
      }
    };
    return {
      // markNum: "",
      visible: false,
      dataForm: {
        id: null,
        name: null,
        sequence: null,
        mark: "EMPTY",
        pic: null,
      },
      dataRule: {
        name: [
          { required: true, message: "请填写分类名称", trigger: "blur" },
          { validator: orderName, trigger: "blur" },
        ],
        sequence: [
          { required: true, message: "请填写分类排序", trigger: "blur" },
          { type: "number", message: "请填写数字", trigger: "blur" },
          { validator: sequence, trigger: "blur" },
        ],
      },
    };
  },
  async created(){
    debugger
  },
  methods: {
    async init(data) {
      debugger
      if (data) {
        this.dataForm = {
          id: data.id,
          name: data.name,
          sequence: data.sequence,
          mark: data.mark,
          pic: data.pic
        };
      } else {
        this.dataForm = {
          id: null,
          name: null,
          sequence: null,
          mark: "EMPTY",
          pic: null
        };
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          // Todo
          let result = null;
          if (this.dataForm.id) {
            result = await api.updateTea(this.dataForm);
          } else {
            result = await api.addTea({
              name: this.dataForm.name,
              sequence: this.dataForm.sequence,
              mark: this.dataForm.mark,
              pic: this.dataForm.pic,
            });
          }
          const { data } = result;
          if (data.code === 0) {
            this.visible = false;
            this.$emit("refreshBrand");
          } else {
            this.$message.error(data.msg);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.goods-specification-dailog {
  .operation {
    margin-bottom: 0;
    .tip {
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
    color: #fff;
    .el-icon-close {
      font-size: 20px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      color: #fff;
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
    .el-input__inner {
      height: 36px !important;
      line-height: 34px;
    }
  }
}
</style>

