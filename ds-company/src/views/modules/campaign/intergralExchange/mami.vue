<template>
  <div class="page-mami-partner">
    <el-form :model="mami" ref="mami" :rules="dataFormRules" label-width="100px">
      <el-card class="mami-card">
        <div class="top">
          门店合伙人，是一种全民导购的商品分销模式
          <br>商户吸引普通客户成为门店合伙人，
          合伙人分享企业统管商品至自己的社交圈，通过分享链接达成购买后，
          分享的合伙人及归属员工(或分享的合伙人及购买的合伙人)可获得相应的分销佣金
        </div>
      </el-card>
      <el-card class="mami-card">
        <div class="basic-title">
          资格获取方式设置
          <span class="tip">* (若多项被勾选，顾客满足其中一项即可升级为门店合伙人)</span>
        </div>
        <div class="default-card">
          <div class="sub-title">
            <el-checkbox v-show="isEdit" v-model="check">付费购买</el-checkbox>
            <span v-show="!isEdit" class="package-name">付费购买</span>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" @click="prompt_message('qualifications')">
          </div>

          <el-form-item label="付费价格" class="gt-input-tip" prop="buyPartnerPrice">
            <el-input v-show="isEdit" v-model="mami.buyPartnerPrice" placeholder="只能填写数字，可支持两位小数">
              <span slot="prefix" ><span class="unit">元</span></span>
            </el-input>
            <span v-show="!isEdit" class="itemInput">{{mami.buyPartnerPrice || '--'}} 元</span>
          </el-form-item>
        </div>
        <!-- 编辑商品包 -->
        <div v-show="isEdit">
          <div v-for="(item, index) in mami.productPackageList" :key="index" class="default-card">
            <div class="sub-title">
              <el-checkbox v-model="item.isCheck">
                购买
              </el-checkbox>
               <!-- v-show="!item.isItemEdit" -->
              <span>
                <span class="package-name">{{item.packName}}</span>
                <span @click="editNames(index)"><icon-svg class="edit" name="edit"></icon-svg></span>
              </span>
              <span v-show="item.isItemEdit">
                <el-input class="name-input" v-model="item.packName" @blur="ensureName(index)"></el-input>
              </span>
              <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" @click="prompt_message('goods')">
              <span class="tip-delete" v-if="index != 0 && !item.isCheck" @click="deleteGoods(index)"><icon-svg name="20" class="theme-color middle" /></span>
            </div>
            <div class="item-operation">
              <el-button type="primary" @click="selectGoods(index, item.items)">选择商品</el-button>
              <el-button type="primary" @click="addGoods">新增商品</el-button>
            </div>
            <div>
              <el-table
                :data="item.items"
                border
                v-loading="dataListLoading"
                :stripe="true"
                style="width: 100%;">
                <el-table-column
                  prop="index"
                  width="60"
                  label="序号">
                  <template slot-scope="scope">
                      <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="120"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index,index)">删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount"
                  min-width="150"
                  label="数量">
                  <template slot-scope="scope">
                    <el-input class="inputs1"  v-model.number="scope.row.amount" maxlength="4"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="barcode"
                  width="220"
                  :show-overflow-tooltip="true"
                  label="商品条码">
                </el-table-column>
                <el-table-column
                  prop="productName"
                  width="250"
                  :show-overflow-tooltip="true"
                  label="商品名称">
                </el-table-column>
                <el-table-column
                  prop="spec"
                  min-width="120"
                  :show-overflow-tooltip="true"
                  label="规格">
                </el-table-column>
                <el-table-column
                  prop="retailPrice"
                  min-width="120"
                  :show-overflow-tooltip="true"
                  label="零售价">
                  <template slot-scope="scope">
                      <span>{{priceNum(scope.row.retailPrice)}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form-item label="商品总价">
              <span class="itemInput">{{getTotal(item.items)}}</span>
            </el-form-item>
            <el-form-item label="商品包价格" class="gt-input-tip large" prop="packPrice">
              <el-input v-model="item.packPrice" placeholder="只能填写数字，可支持两位小数">
                <span slot="prefix" ><span class="unit">元</span></span>
              </el-input>
            </el-form-item>
          </div>
          <div style="text-align:center; background: #eaeaea;" @click="addGoodspackage()">
            <div class="add-icon">+</div>
            <div class="add-text">添加商品包选项</div>
          </div>
        </div>

        <!-- 展示商品包 -->
        <div v-show="!isEdit">
          <div v-for="(item, index) in mami.filterPackages" :key="index" class="default-card">
            <div class="sub-title">
              <span class="package-name">{{item.packName}}</span>
              <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" @click="prompt_message('goods')">
            </div>
            <div>
              <el-table
                :data="item.items"
                border
                v-loading="dataListLoading"
                :stripe="true"
                style="width: 100%;">
                <el-table-column
                  prop="index"
                  width="60"
                  label="序号">
                  <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="amount"
                  min-width="150"
                  label="数量">
                </el-table-column>
                <el-table-column
                  prop="barcode"
                  width="220"
                  :show-overflow-tooltip="true"
                  label="商品条码">
                </el-table-column>
                <el-table-column
                  prop="productName"
                  width="250"
                  :show-overflow-tooltip="true"
                  label="商品名称">
                </el-table-column>
                <el-table-column
                  prop="spec"
                  min-width="120"
                  :show-overflow-tooltip="true"
                  label="规格">
                </el-table-column>
                <el-table-column
                  prop="retailPrice"
                  min-width="120"
                  :show-overflow-tooltip="true"
                  label="零售价">
                  <template slot-scope="scope">
                    <span>{{priceNum(scope.row.retailPrice)}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-form-item label="商品总价">
              <span class="itemInput">{{getTotal(item.items)}} 元</span>
            </el-form-item>
            <el-form-item label="商品包价格">
              <span class="itemInput">{{item.packPrice}} 元</span>
            </el-form-item>
          </div>
        </div>
        <gt-select-goods ref="selectgoods" @refreshData="changeGoods"/>
      </el-card>
      <el-card class="mami-card">
        <div class="basic-title">
          分销佣金设置
        </div>
        <div class="commission-container">
          <div class="commission-item">
            <div class="commission-title">一级分销佣金：</div>
            <el-form-item label="分享商品实收金额的" label-width="120px" class="gt-input-tip" prop="firstCommissionPercent">
              <el-input v-show="isEdit" v-model="mami.firstCommissionPercent" placeholder="一级佣金">
                <span slot="prefix" ><span class="unit">%</span></span>
              </el-input>
              <span v-show="!isEdit" class="itemInput">{{mami.firstCommissionPercent}} %</span>
            </el-form-item>
            <span class="commission-tip">0 &lt;= 输入数字 &lt;= 100，支持小数点后两位</span>
          </div>
          <div class="commission-item">
            <div class="commission-title">二级分销佣金：</div>
            <el-form-item label="分享商品实收金额的" label-width="120px" class="gt-input-tip" prop="secondaryCommissionPercent">
              <el-input v-show="isEdit" v-model="mami.secondaryCommissionPercent" placeholder="二级佣金">
                <span slot="prefix" ><span class="unit">%</span></span>
              </el-input>
              <span v-show="!isEdit" class="itemInput">{{mami.secondaryCommissionPercent}} %</span>
            </el-form-item>
            <span class="commission-tip">0 &lt;= 输入数字 &lt;= 100，支持小数点后两位</span>
          </div>
        </div>
        <div class="bottom-title">
            <img class="bottom-icon" src="static/img/campaign/wenhao.png" alt="提示">
            什么是一级、二级分销
        </div>
        <div class="bottom-tip">门店合伙人A分享企业统管商品，门店合伙人B通过A的分享链接成功购买，则A为一级分销，B为二级分销；<br>
        门店合伙人A分享企业统管商品，普通顾客C通过A的分享链接成功购买，则A的归属员工D为一级分销，A为二级分销；<br>
        门店合伙人A自购（包括A分享商品给自己）企业统管商品，A的归属员工D为一级分销，A自己为二级分销；</div>
      </el-card>
      <div v-show="isEdit" class="gt-form-bottom-submit">
        <gt-button size="large" is-default @click.native="cancel()" txt="取消" />
        <gt-button size="large" @click.native="save()" :loading="$store.state.loading.global" txt="保存"/>
      </div>
      <div v-show="!isEdit" class="gt-form-bottom-submit">
        <gt-button size="large" @click.native="toEdit()" :loading="$store.state.loading.global" txt="编辑"/>
      </div>
    </el-form>
    <tags-name ref="tag" @refreshDataList = "changeName"></tags-name>
  </div>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import gtSelectGoods from '@/views/modules/stockManagement/inventoryStock/select-goods-modal'
import tagsName from '../components/tagsName'
import { saveMami, getMamiDetail, editMami } from '@/service/campaign'
import { isRepeat } from '@/utils'
import { priceRange,validatenull, commissionRange } from '@/utils/validate'
import NP from 'number-precision'
export default {
  name:'campaign-intergralExchange-mami',
  data() {
    const validatePrice = (rule, value, callback) => {
      if (this.check) {
        if (value) {
          if (!priceRange(value, 20000)) {
            callback(new Error('请输入0.01-20000的价格数字，最多保留小数点后两位'))
          } else {
            callback()
          }
        } else {
          callback(new Error('付费价格必填'))
        }
      } else {
        callback()
      }
    }
    const validateCommission = (rule, value, callback) => {
      if (value) {
        if(value>=0){
          if (!commissionRange(value, 100,'normal')) {
            callback(new Error('请输入0-100的佣金数字，最多保留小数点后两位'))
          } else {
            callback()
          }
        }else{
          callback(new Error('佣金要大于0'))
        }
      } else {
        this.mami.firstCommissionPercent= 0
        this.mami.secondaryCommissionPercent= 0
        callback()
      }
    }
    return {
      dataListLoading: false,
      isEdit: false,
      check: true, // 是否资格购买
      index: 0, // 当前编辑商品包的下标
      mami:{
        buyPartnerPrice: 0,
        productPackageList:[{
          packName: '门店合伙人指定商品包',
          isItemEdit: false,
          totalPrice: 0,
          packPrice: null,
          isCheck: false,
          items: []
        }],
        firstCommissionPercent: 0,
        secondaryCommissionPercent: 0
      },
      dataFormRules: {
        buyPartnerPrice:[{validator: validatePrice, trigger: 'blur' }],
        firstCommissionPercent:[{validator: validateCommission, trigger: 'blur' }],
        secondaryCommissionPercent:[{validator: validateCommission, trigger: 'blur' }]
      }
    }
  },
  components:{
    gtSelectGoods,
    tagsName
  },
  created () {
    this.init()
  },
  methods:{
    async init() {
      const { data } = await getMamiDetail()
      if (data.code === 0) {
        if (data.data) {
          const { productPackageList = [] } = data.data
          const packages = productPackageList.map(item => {
            return {
              ...item,
              packPrice: this.priceNum(item.packPrice),
              isItemEdit: false,
              isCheck: item.status === 'YES'
            }
          })
          const filterPackages = packages.filter(item => {
            return item.status === 'YES'
          })
          this.mami = {
            ...data.data,
            buyPartnerPrice: this.priceNum(data.data.buyPartnerPrice),
            filterPackages,
            productPackageList: packages
          }
          this.check = data.data.status==='YES'?true:false
        } else {
          this.isEdit = true
        }
      } else {
        this.$message.error('获取合伙人详情失败')
      }
    },
    //提示信息
    prompt_message(type){
      let content = null
      if (type === 'qualifications') {
        content = '<div class="inner-content">1. 普通顾客支付成功后，自动获得一年门店合伙人权益；</div><div class="inner-content">2. 门店合伙人支付成功后，自动增加一年门店合伙人权益；</div>'
      } else {
        content = '<div class="inner-content">1. 您需要添加商品至商品包，并设置商品包的价格；</div><div class="inner-content">2. 普通顾客成功购买商品包，自动获得一年门店合伙人权益；</div><div class="inner-content">3. 门店合伙人成功购买商品包，自动增加一年门店合伙人权益；</div>'
      }
      this.$easyAlert.show({
        title: '付费购买',
        content: content,
        confirm: () => {
          this.$easyAlert.hide()
        }
      })
    },

    editNames(index){
      this.$nextTick(() => {
        this.$refs.tag.init(this.mami.productPackageList,index)
      })
    },
    changeName(obj){
      this.mami.productPackageList[obj.index].packName = obj.packName
    },
    // 计算商品总价
    getTotal(goods) {
      let total = 0
      if (goods && goods.length > 0) {
        goods.forEach(item => {
          if (item.retailPrice) {
            total = NP.plus(NP.times(Number(item.retailPrice), (item.amount || 0)), total)
          }
        })
      }
      return total / 100
    },

    // 获取选中商品的列表
    changeGoods(list) {
      if (list && list.length > 0) {
        list.map(o=>{
          o.pic = o.cover
        })
        this.mami.productPackageList[this.index].items = list
      }
    },
    // 选择商品
    selectGoods(index, goodsList){
      this.index = index
      this.$nextTick(() => {
        this.$refs.selectgoods.init(goodsList, true)
      })
    },
    // 新增商品
    addGoods(){
      this.$router.push({name: 'goods-add-or-update', query: {type: 'company'}})
    },
    // 删除
    deleteStock(index,parentIndex){
      this.mami.productPackageList[parentIndex].items.splice(index,1)
    },
    // 删除商品包
    deleteGoods(index) {
      this.mami.productPackageList.splice(index, 1)
    },
    // 新增一组商品包--删除一组商品包
    addGoodspackage() {
      this.mami.productPackageList.push({
        packName: '门店合伙人指定商品包',
        isItemEdit: false,
        items: []
      })
    },
    // 去编辑
    toEdit() {
      this.isEdit = true
    },
    // 取消
    async cancel() {
      this.$refs['mami'].clearValidate()
      await this.init()
      this.isEdit = false
    },
    isCheck(){
      const packages = this.mami.productPackageList.filter(item => item.isCheck)
      var flag = false
      // 判断是否有重复的商品报包名
      if (packages && packages.length > 1) {
        if (isRepeat(packages.map(ele => ele.packName))) {
          this.$message.warning('商品包名称不能重复，请先修改商品包名称')
          flag = true
        }
      }
      for(var j in packages){
        var items = packages[j].items
        if (!priceRange(packages[j].packPrice, 20000)) {
          this.$message.warning('请输入0.01-20000的商品包价格，最多保留小数点后两位')
          flag = true
          break
        }
        if(items.length == 0){
          this.$message.warning('每个商品包下至少添加一个商品')
          flag = true
          break
        }else{
          for(var i in items){
            if(!validatenull(items[i].amount)){
              if (items[i].amount<1 || items[i].amount>9999) {
                this.$message.warning('每个商品的数量必须在1-9999(含)')
                flag = true
                break
              }
            }else{
              this.$message.warning('选中的商品包中的商品数量不能为空')
              flag = true
              break
            }
          }
        }

      }
      if (!this.check && packages.length === 0) {
        flag = true
        this.$message.warning('付费购买和商品包购买至少选择一种！')
      }
      return flag
    },
    // 保存门店合伙人
    async save() {
      this.$refs['mami'].validate(async (valid) => {
        if (valid) {
          if(!this.isCheck()){
            const packages = this.mami.productPackageList.map(item => {
              return {
                ...item,
                packPrice: this.priceNum(item.packPrice, 'out'),
                status: item.isCheck ? 'YES' : 'NO'
              }
            })
            delete this.mami.filterPackages
            const formData = {
              ...this.mami,
              status: this.check ? 'YES' : 'NO',
              buyPartnerPrice: this.priceNum(Math.abs(this.mami.buyPartnerPrice), 'out'),
              productPackageList: packages
            }
            console.log(formData)
            let res = null
            // 编辑
            if (this.mami.id) {
              res = await editMami(formData)
            } else {
              res = await saveMami(formData)
            }
            const { data } = res
            if (data.code === 0) {
              await this.init()
              this.isEdit = false
            } else {
              this.$message.error(data.msg)
            }
          }

        }
      })
    },
  }
}
</script>
<style lang="scss">
.page-mami-partner{
  .top {
    line-height: 30px;
  }
  .basic-title{
    font-size: 20px;
    .tip {
      font-size:12px;
      color: #737373;
    }
  }
  .mami-card{
    margin-bottom: 20px;
    padding-bottom: 20px;
  }
  .default-card{
    background: #eaeaea;
    padding: 10px;
    margin: 15px 0;
  }
  .sub-title{
    margin-bottom: 10px;
    position: relative;
    .tip-icon{
      width: 18px;
      position: relative;
      top: -3px;
      cursor: pointer;
    }
    .package-name {
      font-size: 16px;
    }
    .edit {
      font-size: 16px;
      position: relative;
      top: 3px;
      cursor: pointer;
      margin: 0 5px;
    }
    .name-input{
      display: inline-block;
      width: 200px;
    }
    .tip-delete{
      position: absolute;
      right: 15px;
      top: 5px;
      cursor: pointer;
      .middle{
        font-size: 20px;
      }
    }
  }
  .item-operation{
    margin-bottom: 10px;
  }
  .inputs1{
    padding: 0 !important;
    .el-input__inner{
      width: 100%;
    }
  }
  .add-icon{
    font-size: 30px;
    padding-top: 5px;
  }
  .add-text{
    font-size:15px;
    padding-bottom: 15px;
  }
  .commission-container{
    overflow: hidden;
    margin-top: 15px;
    .commission-item {
      padding: 20px 50px 20px 20px;
      background: #eaeaea;
      width: fit-content;
      float: left;
      margin-right: 20px;
      .commission-title{
        font-size: 14px;
        margin-bottom: 10px;
      }
      .commission-tip{
        font-size: 12px;
        color: #737373;
      }
    }
    .el-form-item  {
      margin-bottom: 32px!important;
    }
  }
  .bottom-title{
    margin-top: 15px;
    .bottom-icon {
      margin-right: 5px;
    }
  }
  .bottom-tip{
    padding-left: 28px;
    line-height: 20px;
  }

}

</style>
