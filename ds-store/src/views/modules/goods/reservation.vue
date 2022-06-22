<template>
  <section class="page-product">
    <el-row>
      <el-col>
        <el-form v-loading="loadingData" ref="service-form" :rules="dataFormRules" label-width="140px" :model="service">
          <el-card style="margin-top: 10px" class="com-goods-edit">
            <el-form-item label="提前预约" class="gt-input-tip pre-container" prop="percentCount">
              <div>顾客最多可预约3天内的服务</div>
            </el-form-item>
            <el-form-item label="技师设置" class="gt-input-tip large" prop="goodsType">
              <gt-border-button class="gt-table-create" txt="调整技师" type="export" @click.native="Adjustment()"/>
              <!-- table -->
              <el-table
                ref="filterTable"
                :data="service.technicianList"
                style="width: 80%">
                <el-table-column
                  prop="achievementDegree"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button class="nopadding" type="text" size="small" @click="deleteHandle(scope.$index)" style="margin-bottom: 0">删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="技师名称"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="photo"
                  label="头像"
                  width="100">
                  <template slot-scope="scope">
                    <img class="header-photo" :src="getPhoto(scope.row)" alt="头像" />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="gender"
                  label="性别"
                  width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.gender === 'FEMALE' ? '女' : (scope.row.gender === 'MALE' ? '男' : '--')}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="预约时间间隔" prop="part">
              <el-radio-group v-model="service.part">
                <el-radio
                  v-for="item in timeInterval"
                  :key="item.value"
                  :label="item.value">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="service.part === 'other'" class="gt-input-tip pre-container" prop="partInput">
              <el-input v-model="service.partInput" placeholder="">
                <span slot="prefix" ><span class="unit">分钟</span></span>
              </el-input>
            </el-form-item>
            <el-form-item label="每时间段最多预约数" class="gt-input-tip pre-container" prop="max">
              <el-input v-model="service.max" placeholder="0">
                <span slot="prefix" ><span class="unit">个</span></span>
              </el-input>
            </el-form-item>
          </el-card>
        </el-form>
      </el-col>
    </el-row>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="handleUpdate" txt="确定"/>
    </div>
    <select-adjustment ref="adjustment" @refreshData="changeTech"/>
  </section>
</template>
<script>
import selectAdjustment from './components/Adjustment'
import { mapState } from 'vuex'
import { timeInterval } from '@/utils/dict'
import { getSettingsSet, getSettingsDetail } from '@/service/goods'
import { filterStatus } from '@/utils'
import _ from 'lodash'
export default {
  data() {
    const validateMax = (rule, value, callback) => {
      const reg = /^[0-9]+$/
      if (!reg.test(value) || value == 0) {
        callback(new Error('请输入小于999的正整数！'))
      } else if (value > 999) {
        callback(new Error('请输入小于999的正整数！'))
      } else {
        callback()
      }
    }
    const validatePartInput = (rule, value, callback) => {
      const reg = /^[0-9]+$/
      if (!reg.test(value) || value == 0) {
        callback(new Error('请输入正整数！'))
      } else if (value % 15 !== 0) {
        callback(new Error('请输入15的倍数！'))
      } else if (value > 180 || value < 15) {
        callback(new Error('请输入小于等于180大于等于15的数！'))
      } else {
        callback()
      }
    }
    const validateTech = (rule, value, callback) => {
      if (this.service.technicianList.length === 0) {
        this.$message.warning('请选择技师！')
      } else {
        callback()
      }
    }
    return {
      loadingData: false,
      timeInterval,
      service: {
        part: '30',
        name: null,
        max: '1',
        partInput: 90,
        technicianList: []
      },
      dataFormRules:{
        part: [{required: true, message: '请选择预约时间间隔'}],
        goodsType: [{required: true, validator: validateTech, trigger: 'blur'}],
        partInput: [{required: true, message: '请选择预约时间间隔'}, {validator: validatePartInput, trigger: 'blur'}],
        max: [{required: true, message: '请输入最大预约数'}, {validator: validateMax, trigger: 'blur'}]
      },
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  components: {
    selectAdjustment,
  },
  methods: {
    // 调整技师
    Adjustment(){
      this.$nextTick(() => {
        this.$refs.adjustment.init(this.service.technicianList)
      })
    },
    // 删除
    deleteHandle (index) {
      this.service.technicianList.splice(index,1)
    },

    getPhoto(row) {
      if (row.photo) {
        return `https://${row.photo}`
      } else if (row.gender === 'FEMALE') {
        return 'static/img/goods/female.png'
      } else{
        return 'static/img/goods/male.png'
      }
    },

    // 获取选中商品的列表
    changeTech(list) {
      this.service.technicianList = list
    },

    // 设置预约
    handleUpdate() {
      this.$refs['service-form'].validate(async (valid) => {
        if (valid) {
          this.$easyConfirm.show({
            title: '提示',
            content: '预约设置修改3天后生效， 是否确认提交？',
            confirm: async () => {
              const { data } = await getSettingsSet({
                ...this.service,
                max: Number(this.service.max),
                part: this.service.part === 'other' ? Number(this.service.partInput) :Number(this.service.part)
              })
              if (data.code === 0) {
                this.$easyConfirm.hide()
                this.$router.push({name: 'goods-goods'})
              } else {
                this.$message.error(data.msg)
              }
            }
          })

        }
      })
    },
    // 获取商品信息
    async getSettings(id) {
      this.dataListLoading = true
      const { data } = await getSettingsDetail(id)

      if (data.code === 0) {
        if (data.data) {
          let tempPart = `${data.data.part}`
          if (data.data.part !== 15 && data.data.part !== 30 && data.data.part !== 60) {
            tempPart = 'other'
          }
          this.service = {
            productId: id,
            max: data.data.max,
            part: tempPart,
            partInput: tempPart === 'other' ? `${data.data.part}` : 0,
            technicianList: data.data.technicianList
          }
        } else {
          this.service.productId = id
        }
      } else {
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

  },
  async created() {
    const { id } = this.$route.query
    await this.getSettings(id)
  },
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
@import '~@/assets/scss/goods/index.scss';
.page-product{
  .header-photo{
    width: 50px;
    height: 50px;
    border-radius: 25px;
  }
}
.category-tip{
  height: 30px;
  line-height: 30px;
  color: #c0c4cc;
  font-size: 12px;
}
.category-show{
  font-size: 14px;
  color: $info--main-font-color;
}
.com-goods-edit{
  .gt-input-tip.large{
    .el-input__inner{
      width: 300px;
    }
    .el-input__prefix{
      left: 310px;
    }
  }
}
.gt-icon-add{
  width: 18px;
  height: 18px;
  line-height: 32px;
}
.page-product{
  .el-radio__label{
    font-size: 14px;
  }
}
.pre-container{
  .pre-label{
    float: left;
    width: 120px;

  }
  .el-input{
    float: left;
    width: calc(100% - 120px);
    .el-input__inner{
      width: 100px;
    }
    .el-input__prefix{
      left: 110px;
    }
  }
}
.time{
    position: relative;
    left: 105px;
    top: -36px;
}
</style>


