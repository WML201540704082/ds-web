<!-- 商品新增-规格设置组件 -->
<template>
  <section class="goods-spec">
    <div class="sku-edit" v-if="!this.id">
      <!-- 规格1 -->
      <el-select v-model="specItemOne" placeholder="请选择规格1" clearable value-key="id" @change="changeSpecOne">
        <el-option
          v-for="selectSpec in specSelect"
          :key="selectSpec.id"
          :value="selectSpec"
          :label="selectSpec.name"
        ></el-option>
        <span class="goods-spec-create" @click="addSpecOption">
          <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
          新增规格
        </span>
      </el-select>
      <!-- 规格2 -->
      <el-select v-model="specItemTwo" placeholder="请选择规格2" clearable value-key="id" @change="changeSpecTwo">
        <el-option
          v-for="selectSpec in specSelect"
          :key="selectSpec.id"
          :value="selectSpec"
          :label="selectSpec.name"
          :disabled="specItemOne ? selectSpec.id === specItemOne.id : false"
        ></el-option>
        <span class="goods-spec-create" @click="addSpecOption">
          <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
          新增规格
        </span>
      </el-select>
      <div style="margin-left: 10px;">* 商品规格一经保存不可修改</div>
    </div>
    <div class="sku-info">
      <div class="info-title">规格信息</div>
      <div class="sku-edit spec-table">
        <el-table
          :data="barList"
          border>
          <el-table-column
            prop="specOne"
            :label="specItemOne ? specItemOne.name: '规格1'"
            min-width="200"
            v-if="specItemOne">
            <template slot="header" slot-scope="scope">
              <span><span style="color: red;">*</span> {{specItemOne ? specItemOne.name: '规格1'}}</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isView">{{scope.row.specOneText}}</span>
              <el-select v-else v-model="scope.row.specOne" @change="value => changeSpecSelect(value, scope.row, 'one', scope.$index)" placeholder="选择规格值">
                <el-option
                  v-for="item in specValueListOne"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
                <span class="goods-spec-create" @click="() => addSpecOption('one')">
                  <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
                  新增规格
                </span>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="specTwo"
            :label="specItemTwo ? specItemTwo.name: '规格2'"
            min-width="200"
            v-if="specItemTwo">
            <template slot="header" slot-scope="scope">
              <span><span style="color: red;">*</span> {{specItemTwo ? specItemTwo.name: '规格2'}}</span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isView">{{scope.row.specTwoText}}</span>
              <el-select v-else v-model="scope.row.specTwo" @change="value => changeSpecSelect(value, scope.row, 'two', scope.$index)" placeholder="选择规格值">
                <el-option
                  v-for="item in specValueListTwo"
                  :key="item.id"
                  :label="item.text"
                  :value="item.id">
                </el-option>
                <span class="goods-spec-create" @click="() => addSpecOption('two')">
                  <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
                  新增规格
                </span>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="barcode"
            min-width="240"
            label="商品条码">
            <template slot="header" slot-scope="scope">
              <span><span style="color: red;">*</span> 商品条码</span>
            </template>
            <template slot-scope="scope">
              <el-input class="barcode-input" @blur="e => checkCode(e, scope.$index)" :class="{'active': !scope.row.barcode}" v-model="scope.row.barcode"></el-input>
              <el-button type="primary" :loading="scope.row.loading" v-show="!scope.row.barcode" @click="getCode(scope.$index)">生成</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="newCode"
            min-width="200"
            label="自编码">
            <template slot="header" slot-scope="scope">
              <span>自编码</span>
            </template>
            <template slot-scope="scope">
              <el-input v-if="edit=='edit' || !scope.row.isView" v-model="scope.row.newCode" :maxlength="10"></el-input>
              <span v-else>{{scope.row.newCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="jdyCode"
            min-width="200"
            label="精斗云编码"
            v-if="newStore == 'true'">
            <template slot="header" slot-scope="scope">
              <span style="color: red;">*</span> 
              <span>精斗云编码</span>
            </template>
            <template slot-scope="scope">
              <el-input v-if="edit=='edit' || !scope.row.isView" v-model="scope.row.jdyCode" :maxlength="8"></el-input>
              <span v-else>{{scope.row.jdyCode}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="stock"
            min-width="200"
            :label="food ? '库存(单位：千克)' : '库存'">
            <template slot="header" slot-scope="scope">
              <span>
                <span style="color: red;">*</span> 
                <span v-if="food">库存(单位：千克)</span>
                <span v-else>库存</span>
              </span>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.isView && !food">{{scope.row.stock}}</span>
              <span v-else-if="scope.row.isView && food">{{scope.row.stock / 1000}}</span>
              <el-input v-else v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="pic"
            min-width="100"
            label="规格图片">
            <template slot-scope="scope">
              <span class="spec-pic">
                <gt-image-upload tip="" :realistStr="'pic'" :comp="12" :names="'spec' + scope.$index" :max="1" :reallist="scope.row.pic" :cb="value => barList[scope.$index].pic = value" />
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            min-width="80"
            v-if="barList.length > 1"
            label="操作">
            <template slot-scope="scope">
              <span v-if="!scope.row.isView" @click="removeSpec(scope.$index)" style="cursor: pointer;"><icon-svg name="20" class="theme-color" style="font-size: 20px;vertical-align: middle;"></icon-svg></span>
            </template>
          </el-table-column>
        </el-table>
         <el-button type="primary" v-if="specItemOne" @click="addSpec" style="margin: 20px 0 10px 0;">
          <img class="gt-icon-add" src="static/img/goods/add.png"/> 新增一组SKU
        </el-button>
      </div>
    </div>
  </section>
</template>
<script>
import * as api from '@/service/goods'
import _ from 'lodash'
import gtImageUpload from '@/components/gt-image-upload'
import { getStore } from '@/utils/storage'
export default {
  name: 'goods-spec',
  props: ['id', 'food', 'tableList', 'specSelect', 'edit', 'addOption'],
  data() {
    return {
      copyBarList: [],
      // 规格信息
      barList: [{
        specOne: null,
        specTwo: null,
        barcode: null,
        stock: 0,
        newCode: null,
        jdyCode: null,
        pic: null,
        loading: false
      }],
      // 规格1
      specItemOne: null,
      // 规格1的选项
      specValueListOne: [],
      // 规格2
      specItemTwo: null,
      // 规格2的选项
      specValueListTwo: []
    }
  },
  components: { gtImageUpload},
  methods: {
    // 编辑规格1
    changeSpecOne(val) {
      if (val) {
        this.getSpecValueList(val.id, 'one')
      }
      // 重置
      this.barList = [{
        specOne: null,
        specTwo: null,
        barcode: null,
        stock: 0,
        newCode: null,
        jdyCode: null,
        pic: null,
        loading: false
      }]
      this.specItemTwo = null
    },
    // 编辑规格2
    changeSpecTwo(val) {
      if (!this.specItemOne) {
        this.$message.warning('请选择先选择规格1')
        this.specItemTwo = null
      } else {
        this.barList = [{
          specOne: null,
          specTwo: null,
          barcode: null,
          stock: 0,
          newCode: null,
          jdyCode: null,
          pic: null,
          loading: false
        }]
        this.getSpecValueList(val.id, 'two')
      }
    },

    // 检查条码是否重复
    async checkCode(e, index) {
      const originValue = this.copyBarList[index] ? this.copyBarList[index].barcode : null
      if (e.target.value && e.target.value !== originValue) {
        const { data } = await api.checkRepeat(e.target.value)
        if (data.code == 0) {
          if (data.data === 'true') {
            this.$message.error('条码已存在： ' + e.target.value)
          }
        } else {
          this.$message.error(data.msg)
        }
      }
    },

    // 获取商品条码
    async getCode(index) {
      this.barList[index].loading = true
      const { data } = await api.getBarcode()
      if (data.code === 0) {
        this.barList[index].barcode = data.data
      } else {
        this.$message.error(data.msg)
      }

      this.barList[index].loading = false
    },

    // 添加规格参数
    addSpecOption(type) {
      if (type === 'one') {
        this.addOption(this.specItemOne, () => {
          this.getSpecValueList(this.specItemOne.id, 'one')
        })
      } else if (type === 'two') {
        this.addOption(this.specItemTwo, () => {
          this.getSpecValueList(this.specItemTwo.id, 'two')
        })
      } else {
        this.addOption(null)
      }
    },

    // 删除商品规格
    removeSpec(index) {
      this.barList.splice(index, 1)
    },
    // 添加商品规格
    addSpec() {
      if (this.barList.length>=20) {
        this.$message.warning('规格最多填写20个！')
        return
      }
      if (this.specItemOne) {
        // 判断是否有重复的规格
        let flag = true
        const lastItem = this.barList.length > 0 ? this.barList[this.barList.length - 1] : null
        if (this.specItemOne && lastItem) {
          if (!lastItem.specOne) {
            flag = false
          }
        }
        if (this.specItemTwo && lastItem) {
          if (!lastItem.specTwo) {
            flag = false
          }
        }
        if (flag) {
          this.barList.push({
            specOne: null,
            specTwo: null,
            barcode: null,
            stock: 0,
            newCode: null,
            jdyCode: null,
            pic: null,
            loading: false
          })
        } else {
          this.$message.warning('请将已有规格填写完整！')
        }
      } else {
        this.$message.warning('请先选择规格')
      }
    },
    // 改变规格属性
    async changeSpecSelect(value, item, type, index ) {
      // 校验是否有重复的规格
      const tempList = this.barList.map(ele => {
        return `${ele.specOne || ''}-${ele.specTwo || ''}`
      })
      const currentItem = type === 'one' ? `${value || ''}-${item.specTwo || ''}` : `${item.specOne || ''}-${value || ''}`
      if (tempList.indexOf(currentItem) !== tempList.lastIndexOf(currentItem)) {
        if (type === 'one') {
          this.barList[index].specOne = null
        } else {
          this.barList[index].specTwo = null
        }
        this.$message.warning('已有重复的规格，请重新选择')
      }
    },
    // 获取规格值列表
    async getSpecValueList(specId, type) {
      const { data } = await api.getSpecValueList(specId)
      if (data.code == 0 && data.data.records) {
        if (type === 'one') {
          this.specValueListOne = data.data.records
        } else {
          this.specValueListTwo = data.data.records
        }
      }
    },
  },


  // 初始化
  async created() {
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取企业商品规格配置
    if (this.id) {
      // 初始化规格列表
      this.barList = this.tableList.map(item => {
        const specInfo = item.specInfo ? JSON.parse(item.specInfo) : []
        if (specInfo.length > 0) {
          this.specItemOne = {
            id: specInfo[0].specKeyId,
            name: specInfo[0].specKey
          }
          this.getSpecValueList(specInfo[0].specKeyId, 'one')
        }

        if (specInfo.length > 1) {
          this.specItemTwo = {
            id: specInfo[1].specKeyId,
            name: specInfo[1].specKey
          }
          this.getSpecValueList(specInfo[1].specKeyId, 'two')
        }

        return {
          specOne: specInfo.length > 0 ? specInfo[0].id: null,
          specTwo: specInfo.length > 1 ? specInfo[1].id: null,
          specOneText: specInfo.length > 0 ? specInfo[0].text: null,
          specTwoText: specInfo.length > 1 ? specInfo[1].text: null,
          barcode: item.barcode,
          stock: item.stock,
          newCode: item.newCode,
          jdyCode: item.jdyCode,
          loading: false,
          pic: item.pic,
          isView: true
        }
      })
      this.copyBarList = _.cloneDeep(this.barList)
    }
  },
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
@import '~@/assets/scss/goods/index.scss';
.goods-spec-create{
  width: 100%;
  display: block;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  .create-img{
    width: 20px;
    margin-right: 5px;
  }

}
.goods-spec{
  .barcode-input{
    width: 100% !important;
    &.active{
      width: calc(100% - 90px) !important;
    }
  }

  .sku-info{
    .spec-pic{
      .fileCon{
        padding-left: 0 !important;
        min-height: 50px;
        .list{
          margin: 0;
          min-height: 50px;
          padding: 0 !important;
          & > div{
            width: 50px;
            height: 50px;
          }
          .el-loading-spinner{
            padding: 0 !important;
            .circular{
              margin: 10px 0 0 2px;
              width: 20px;
              height: 20px;
            }
          }
          .add{
            margin: 0;
            .close{
              padding: 0 !important;
            }
            .el-upload-card{
              width: 48px !important;
              height: 48px !important;
              line-height: 48px !important;
            }
          }
        }
      }
      & > div{
        padding: 0 !important;
      }

    }
  }
  .sku-edit{
    .delete{
      width: 24px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .spec-show{
  margin-bottom: 10px;
    .spec-arg{
      font-size: 16px;
      vertical-align: baseline;
    }
  }
  .table-required{
    color: #f56c6c;
  }
}
</style>
