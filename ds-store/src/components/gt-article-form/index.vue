<template>
  <section>
    <div :key="item.id" v-for="(item, index) in article">
      <gt-article-title  v-if="item.type==='TITLE'" @changeTitle="(value) => changeContent(value, index)" :value="item.content">
        <span @click="() => onAdd('IMAGE', index)"><icon-svg name="pic" class="theme-color middle"></icon-svg></span>
        <span @click="() => onAdd('CONTENT', index)"><icon-svg name="font" class="theme-color middle"></icon-svg></span>
        <span @click="() => onAdd('DELETE', index)"><icon-svg name="20" class="theme-color middle"></icon-svg></span>
      </gt-article-title>
      <gt-article-detail  v-if="item.type==='CONTENT'" @changeDetail="value => changeContent(value, index)" :value="item.content">
        <span @click="() => onAdd('IMAGE', index)"><icon-svg name="pic" class="theme-color middle"></icon-svg></span>
        <span @click="() => onAdd('CONTENT', index)"><icon-svg name="font" class="theme-color middle"></icon-svg></span>
        <span @click="() => onAdd('DELETE', index)"><icon-svg name="20" class="theme-color middle"></icon-svg></span>
      </gt-article-detail>
      <gt-article-pic  v-if="item.type==='IMAGE'" :tag="item.id" @changePic="value => changeContent(value, index)" :value="item.content">
        <span @click="() => onAdd('IMAGE', index)"><icon-svg name="pic" class="theme-color middle"></icon-svg></span>
        <span @click="() => onAdd('CONTENT', index)"><icon-svg name="font" class="theme-color middle"></icon-svg></span>
        <span @click="() => onAdd('DELETE', index)"><icon-svg name="20" class="theme-color middle"></icon-svg></span>
      </gt-article-pic>
    </div>
  </section>
</template>
<script>
import gtArticleTitle from './gt-article-title'
import gtArticleDetail from './gt-article-detail'
import gtArticlePic from './gt-article-pic'
import _ from 'lodash'
export default {
  name: 'gt-article-form',
  props: {
    array: Array
  },
  components: {
    gtArticleTitle,
    gtArticleDetail,
    gtArticlePic
  },
  computed: {
    article() {
      return this.array.map(item => {
        return {
          id: _.uniqueId(),
          ...item,
        }
      })
    }
  },
  methods: {
    changeContent(value, index) {
      let temp = _.cloneDeep(this.article)
      temp[index].content = value
      this.$emit('changeArray', temp)
    },
    onAdd(type, index) {
      let temp = _.cloneDeep(this.article)
      if (type !== 'DELETE') {
        temp.splice(index + 1, 0, {
          id: _.uniqueId(),
          type,
          content: ''
        })
      } else {
        temp.splice(index, 1)
      }
      this.$emit('changeArray', temp)
    }
  }
}
</script>
<style>
.middle {
  font-size: 22px;vertical-align: middle;
}
</style>
