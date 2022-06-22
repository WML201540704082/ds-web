<template>
  <!-- <el-card style="width:600px"> -->
  <el-form :rules="dataFormRules" ref="form" style="width:600px">
    <el-form-item>
      <span>图文 {{tag+1}}</span>
    </el-form-item>
    <el-form-item label="图片上传" prop="infos.pic" class="gt-article">
      <gt-image-upload
        :key="infos.pic"
        @updatePicUrl="changePic"
        :realistStr="'mainPic'"
        :comp="12"
        :names="Number(tag+1)"
        :max="1"
        tip="建议尺寸建议600px*600px,大小不超过1M"
        :reallist="infos.pic"
        :cb="value => infos.pic = value"
      />
      <span class="gt-article-control">
        <slot></slot>
      </span>
    </el-form-item>
    <el-form-item label="文字描述" prop="infos.description" class="gt-article">
      <el-input
        type="textarea"
        :rows="4"
        :maxlength="150"
        placeholder="请输入文本内容 最多支持150字"
        class="gt-article"
        @change="changeDetail"
        v-model="infos.description"
      ></el-input>
      <span class="gt-article-control">
        <slot></slot>
      </span>
    </el-form-item>
    <div style="width:600px">
      <el-button class="pos_right" type="default" @click="delCompo">删除</el-button>
    </div>
  </el-form>

  <!-- </el-card> -->
</template>
<script>
import gtImageUpload from "@/components/gt-image-upload";
export default {
  name: "goods-tea-infos",
  props: ["infos", "tag"],
  data() {
    return {
      description: null,
      pic: null,
      dataFormRules: {
        description: [
          {
            required: true,
            message: "请保留小数点后两位",
            pattern: /^.{3,20}$/,
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {
    gtImageUpload,
  },
  async created() {
    // console.log(this.tag);
    // this.$set(this.infos,"pic","")
  },
  methods: {
    changePic(value) {
      console.log(value);
      this.$emit("changePic", value);
    },
    changeDetail(data) {
      this.$emit("changeDetail", data);
    },
    delCompo() {
      this.$emit("deleteDetail");
    },
  },
};
</script>
<style lang="scss">
.pos_right {
  position: relative;
  left: 540px;
  top: 8px;
}
</style>