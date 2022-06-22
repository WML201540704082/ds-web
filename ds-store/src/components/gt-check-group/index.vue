<template>
  <div class="gt-check-group">
    <gt-check-item v-for="item in newCheckList" :cancel="item.cancel" :key="item.id" :id="item.id" :select="item.select || false" :text="item.name" @change="updateGroup"/>
  </div>
</template>
<script>
import gtCheckItem from './check-item'
import _ from 'lodash'
export default {
  name: 'gt-check-group',
  data() {
    return {
      // 初始化的数组
      initSelect: [],
      // 重新选中后的数组
      newCheckList: []
    }
  },
  props: {
    baseList: {
      default: []
    },
    selectList: {
      default: []
    },
    type: {
      type: String,
      default: 'create'
    },
    cb: {
      type: Function
    }
  },
  components: { gtCheckItem },
  methods: {
    updateGroup(id) {
      let changedList = []
      if (this.selectList.indexOf(id) > -1) {
        // 取消选中
        changedList = this.selectList.filter(ele => {
          return ele !== id
        })
      } else {
        // 选中
        changedList = this.selectList
        changedList.push(id)
      }
      this.changeShow(changedList, false)
      this.$emit('change', changedList)
    },
    changeShow(arr, firstRender) {
      const newCheckList = this.baseList.map(ele => {
        if (arr.indexOf(ele.id) > -1) {
          return {
            ...ele,
            cancel: this.type === 'edit' ? (firstRender ? true : this.initSelect.indexOf(ele.id) > -1 ): false,
            select: true
          }
        } else {
          return {
            ...ele,
            cancel: this.type === 'edit' ? (firstRender ? false : this.initSelect.indexOf(ele.id) > -1 ) : false,
            select: false
          }
        }
      })
      this.newCheckList = newCheckList
    }
  },
  created() {
    this.initSelect = _.cloneDeep(this.selectList)
    this.changeShow(this.selectList, true)
    this.$emit('change', this.selectList)
  },
}

</script>
<style>
.gt-check-group{
  overflow: hidden;
}
</style>
