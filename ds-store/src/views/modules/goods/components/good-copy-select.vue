<template>
  <el-dialog
    title="克隆"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px"
    append-to-body>
    <el-form class="mode-form-line1 com-shortmessage-template" ref="copy" :rules="dataFormRules" label-width="120px" :model="copy">
			<el-form-item label="商品选择" prop="goodSelect">
				<el-radio-group v-model="copy.goodSelect">
					<el-radio
						v-for="item in goodSelect"
						:key="item.value"
						:label="item.value">
							{{item.label}}
					</el-radio>
				</el-radio-group>
			</el-form-item>
      <!-- <el-form-item label="" prop='storeId' v-if="copy.goodSelect=='STORE'" class="selectStore">
        <el-select v-model="copy.storeId" placeholder="请选择门店" clearable>
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="copyGoods()">开始克隆</el-button>
    </span>
    <span class="prompt">功能说明：商品克隆功能,可快速实现快速搬家铺货！</span>
    <span class="prompt">友情提示：再次克隆,只增加克隆企业的新增商品！</span>
  </el-dialog>
</template>
<script>
import { goodSelect } from '@/utils/dict'
import { copyGoods } from '@/service/goods'
import * as api from '@/service/goods'
import { getStoreList } from '@/service/systore'
export default {
  data(){
    return{
      visible: false,
      goodSelect,
      copy:{
        storeId: '',
        goodSelect:'COMPANY'
      },
      storeList: [],
      dataFormRules:{
        storeId:[{required:true, message: '请选择门店', trigger: 'blur' }],
      }
    }
  },
  created () {
    // 获取所属门店
    this.getStoreList()
  },
  methods:{
    // copy
    copyGoods () {
      this.$refs['copy'].validate(async (valid) => {
        if (valid ) {
          this.$easyConfirm.show({
            title: '温馨提示',
            content: '是否确定开始克隆',
            // isCopy: true,
            confirm: async () => {
              let formData = {
                targetStoreId: this.copy.storeId,
              }
              if (this.copy.goodSelect == 'COMPANY') {
                delete formData.storeId
              }
              const { data } = await api.copyGoods(formData)
              this.$easyConfirm.hide()
              this.$easyAlert.show({
                title: '温馨提示',
                content: '正在克隆...',
                confirm: () => {
                  this.$easyAlert.hide()
                  this.visible = false
                  this.$emit('refreshData')
                }
              })
              setTimeout(() => {
                if (data.code === 0) {
                  this.$easyAlert.update('content', '克隆成功')
                } else {
                  this.$easyAlert.update('content', '克隆失败')
                }
                this.$easyConfirm.update('confirmCb', () => {
                  this.$easyAlert.hide()
                  this.visible = false
                  this.$emit('refreshData')
                })
              }, 5000)

              // this.$easyConfirm.update('content', '正在克隆')
              // setTimeout(() => {
              //   if (data.code === 0) {
              //     this.$easyConfirm.update('content', '克隆成功')
              //     this.$easyConfirm.update('confirmCb', () => {
              //       this.$easyConfirm.hide()
              //       this.visible = false
              //       this.$emit('refreshData')
              //     })
              //   } else if(data.code === -1){
              //     this.$easyConfirm.update('content', '克隆失败')
              //     this.$easyConfirm.update('confirmCb', () => {
              //       this.$easyConfirm.hide()
              //       this.visible = false
              //       this.$emit('refreshData')
              //     })
              //   } else {
              //     this.$message.error(data.msg)
              //   }
              // }, 5000)
            }
          })
        }
      })
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.$message.error('获取门店列表失败')
      }
    },
    init(){
      this.visible = true
      // this.dataListLoading = true
    //   this.id = id
    //   if (id) {
    //     this.getDetail(id)
    //   } else {
    //     this.copy = {
    //       sendScene: '',
    //       title: '',
    //       content: ''
    //     }
    //     this.$nextTick(() => {
    //       this.$refs['copy'].clearValidate()
    //     })
    //   }
    },
  }
}
</script>
<style lang="scss" scoped>
.selectStore{
  margin-left: 200px;
  position: relative;
  top: -58px;
}
.prompt{
  text-align:left;
  margin-left:40px;
  display:block;
  color:red;
  font-size:14px;
}
</style>

