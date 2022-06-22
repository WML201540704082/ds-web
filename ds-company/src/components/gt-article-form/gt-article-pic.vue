<template>
  <el-form-item label="展示图片" prop="tempValue" class="gt-article">
    <gt-image-upload @updatePicUrl="onChange" :realistStr="'mainPic'" :comp="12" :names="Number(tag)" :max="1" :reallist="tempValue" :cb="value => tempValue = value" />
    <span class="gt-article-control">
      <slot></slot>
    </span>
  </el-form-item>
</template>
<script>
import gtImageUpload from '@/components/gt-image-upload'
export default {
  name: 'gt-article-pic',
  data() {
    return {
      tempValue: null
    }
  },
  props: {
    value: null,
    onAdd: null,
    tag: null
  },
  components: {
    gtImageUpload
  },
  created () {
    this.tempValue = this.value
  },
  methods: {
    onChange(imgoBJ) {
      this.$emit('changePic', imgoBJ.value)
    },
  }
}
</script>

