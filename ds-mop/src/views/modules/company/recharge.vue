<template>
    <div class="mod-store mop_company_shortmessage">
        <!-- table列表 -->
        <el-form ref="shortmessage"  label-width="150px" :model="shortmessage" :validate-on-rule-change="false">
            <el-card class="mop-company-table">
              <span class="itemInput_package">请选择充值套餐</span>
              <div v-for="item in packagesList" :key="item.id">
                <div class="package" :class="{active: currentItem.id === item.id}" @click="() => changeItem(item)">
                  <div class="amount">{{item.amount}}条</div>
                  <div class="price">{{item.price/100}}元</div>
                </div>
              </div>
              <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
              <span>-------------------------------------------------------------------------------------------------------------------------------------------------------------</span>
              <br><br>
              <el-form-item label="企业名称：" prop="name">
                  <span class="itemInput">{{shortmessage.name}}</span>
              </el-form-item>
              <el-form-item label="法人：" prop="legalPerson">
                  <span class="itemInput">{{shortmessage.legalPerson}}</span>
              </el-form-item>
              <el-form-item label="联系电话：" prop="phone">
                  <span class="itemInput">{{shortmessage.phone}}</span>
              </el-form-item>
              <el-form-item label="上传支付凭证：">
                <div id="proof">
                  <el-form-item label="" prop="proof">
                    <gt-image-upload v-model="shortmessage.proof" @updatePicUrl="updatePicUrl" :realistStr="'proof'" :names="2"  :multiple="true" :max=1 :reallist="shortmessage.proof" :cb="value => shortmessage.proof = value" />
                  </el-form-item>
              </div>
              </el-form-item>    
            </el-card>
            <div class="gt-form-bottom-submit">
                <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
                <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
            </div>
         </el-form>  
    </div>
</template>

<script>
import gtImageUpload from '@/components/gt-image-upload'//上传照片
import { mapState } from 'vuex'
import { getAccountPackagesList, getAccountRecharge,getAccountRecordList,getCompanyDetail } from '@/service/company'
import * as api from '@/service/company'
export default {
  name:'recharge',
  data(){
    return{
      currentItem: {},
      dataList: [],
      packagesList:[],
      id: 0,
      dataListLoading: false,
      shortmessage:{
        companyId:'',
        createUser:'',
        phone:'',
        amount:'',
        proof:null,
      },
    }
  },
  created () {
    const { id } = this.$route.query
    this.id = id
    // 充值套餐
    this.getPackagesList()
    this.init(id)
  },
  components: {
    gtImageUpload
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  methods:{
    // 获取当前项
    changeItem(item) {
      this.currentItem = item
    },
    //获取套餐列表
    async getPackagesList() {
      this.dataListLoading = true
      const { data } = await api.getAccountPackagesList()
      if (data.code === 0) {
        this.packagesList = data.data
      } else {
        this.packagesList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    // 获取数据列表
    // async getDataList() {
    //   this.dataListLoading = true
    //   const { data } = await getAccountRecharge({
    //     ...this.shortmessage,
    //   })
    //   if (data.code === 0) {
    //     this.dataList = data.data
    //   } else {
    //     this.dataList = []
    //     this.$message.error(data.msg)
    //   }
    //   this.dataListLoading = false
    // },
    //获取公司信息详情
    async init(id) {
      const { data } = await getCompanyDetail({
        companyId:id
      })
      if (data.code === 0) {
        this.shortmessage = data.data
      } else {
        this.$message.error(data.msg)
      }
      
    },
    //取消
    goBack(){
      history.go(-1)
    },
    
    //上传照片
    updatePicUrl:function(imgoBJ){
      this.shortmessage[imgoBJ.str] = imgoBJ.value
    },

    // 确定
    async add() {
      console.log(this.shortmessage)
      this.$refs['shortmessage'].validate(async (valid) => {
        if (valid) {
          this.dataListLoading = true
          this.$easyConfirm.show({
            title: '提示',
            content: '确定充值？',
            confirm: async () => {
              const { data } = await api.getAccountRecharge({
                companyId: this.shortmessage.id,
                // createUser: this.shortmessage.legalPerson,
                operator: 'MOP',
                packageId: this.currentItem.id,
                phone: this.shortmessage.phone,
                proof: this.shortmessage.proof
              })
              if (data.code === 0) {
                this.$message.success('充值成功')
                this.$router.push({name: 'message-view', query: {id: this.id}})
              } else {
                this.$message.error('充值失败')
              }
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/assets/scss/_variables.scss';
  .package{
    float: left;
    text-align: center;
    line-height: 50px;
    width: 180px;
    height: 100px;
    /* border:1px yellow solid; */
    margin-right:20px;
    cursor: pointer;
    margin-top:20px;
    margin-left: 50px;
    background-color: whitesmoke;
    color: $sidebar--color-text-dark;
    &.active {
      background-color: orange;
      color: whitesmoke;
    }
  }
  .amount{
    margin-top: 15px;
    font-size: 16px;
    // color: #7F7F7F;
  }
  .price{
    margin-top: -30px;
    font-size: 14px;
    font-weight: bold;
  }
  .itemInput_package{
    line-height: 34px;
      min-width: 330px;
      height: 36px;
      border-radius: 4px;
      font-size: 15px;
      // color: #FC5A3D;
      font-weight: bold;
  }
</style>
