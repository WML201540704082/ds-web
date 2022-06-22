<template>
  <el-card style="width:600px">
    <el-form :rules="dataFormRules" ref="ruleForm" :model="taste">
      <el-form-item label="口味名称" prop="name">
        <el-input v-model="taste.name" placeholder="例：冰" @change="onChange"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="del-button" type="default" @click="delCompo">删除</el-button>
      </el-form-item>
      <el-form-item style="margin-top:20px">
        <el-tag
          :key="tag.name"
          v-for="tag in taste.values"
          :closable="tag.closeable"
          size="medium"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag.name}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="large"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
          placeholder="最多5个汉字"
          :maxlength="5"
        ></el-input>
        <el-button v-else class="button-new-tag" @click="showInput">添加口味</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { relativeTimeThreshold } from "moment";
import {
  isMobile,
  validatenull,
  priceRange,
  isName,
  limitInputName,
  twoDecimal,
} from "@/utils/validate";
export default {
  name: "goods-tea-feeds",
  props: ["taste"],
  data() {
    const validateName = (rule, value, callback) => {
      if (limitInputName(value, 10) == 1) {
        callback(new Error("口味名称不能超过5个汉字"));
      } else {
        callback();
      }
    };
    return {
      name: null,
      inputVisible: false,
      inputValue: "",
      dataFormRules: {
        name: [
          { required: true, message: "请填写口味名称" },
          { validator: validateName, trigger: "change" },
        ],
      },
    };
  },

  async created() {
    // 页面响应
    this.$set(this.taste, "values", []);

    var key = ["name"];
    if (this.taste.valueNames != null) {
      var valueNames = this.taste.valueNames.split(",");
      this.taste.values = valueNames.map(function (item, index) {
        var obj = {
          name: item,
          closeable: true,
        };
        return obj;
      });
    } else {
      this.taste.values = [];
    }
    console.log(this.taste);
    this.taste.name = this.taste.name;
  },
  methods: {
    handleInputConfirm() {
      let inputValue = this.inputValue.trim();
      if (inputValue) {
        this.taste.values.push({
          name: inputValue,
          closeable: true,
        });
      } else {
        this.$message.warning("口味值不能为空");
      }
      this.inputVisible = false;
      this.inputValue = "";
      this.changeArray();
    },

    //口味
    onChange(value) {
      this.$emit("changename", value);
    },

    changeArray(data) {
      debugger;
      // console.log(this.taste.values);
      this.$emit("changeList", this.taste.values);
    },

    // 删除tag
    handleClose(tag) {
      debugger;
      this.taste.values.splice(this.taste.values.indexOf(tag), 1);
      debugger;
    },
    // 展示输入控件
    showInput() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          this.inputVisible = true;
          this.$nextTick((_) => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        } else {
          this.$message.warning("请先填写口味名称");
        }
      });
    },

    //删除
    delCompo() {
      debugger;
      this.$emit("deleteindex");
      debugger;
    },
  },
};
</script>
<style lang="scss">
.del-button {
  position: absolute;
  right: 0;
  top: -80px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.el-tag {
  height: 36px;
  margin-bottom: 10px;
  line-height: 34px;
  font-size: 12px;
  // color: #fff;
  .el-icon-close {
    font-size: 20px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    //   color: #fff;
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
  width: 100px;
  margin-left: 10px;
  margin-bottom: 10px;
  vertical-align: bottom;
  .el-input__inner {
    height: 36px !important;
    line-height: 34px;
  }
}
</style>