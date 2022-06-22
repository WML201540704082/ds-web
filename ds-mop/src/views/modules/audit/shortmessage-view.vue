<template>
  <section v-loading="$store.state.loading.global">
    <el-form label-width="135px" :rules="dataFormRules" :model="shortmessage" ref="shortmessage">
      <el-card>
        <gt-subtitle title="短信信息"/>
        <div class="status-container">
          审核状态： <span :class="filterColor(filterStatus(shortmessage.sendStatus, shortMessageStatus))">
            {{filterStatus(shortmessage.sendStatus, shortMessageStatus)}}
          </span></div>
        <el-form-item label="创建时间">
          <span class="itemInput">{{moment(shortmessage.createDate).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </el-form-item>
        <el-form-item label="企业名称">
          <span class="itemInput">{{shortmessage.companyName}}</span>
        </el-form-item>
        <el-form-item label="短信内容">
          <span class="itemInput">{{shortmessage.content}}</span>
        </el-form-item>
        <el-form-item label="发送人数">
          <span class="itemInput">{{shortmessage.sendNum}}</span>
        </el-form-item>
      </el-card>
      <el-card style="margin-top: 10px">
        <gt-subtitle title="审核信息"/>
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="shortmessage.status" v-if="shortmessage.sendStatus === 'CHECK'">
            <el-radio label="SUCCESS">通过</el-radio>
            <el-radio label="REJECT">拒绝</el-radio>
          </el-radio-group>
          <span v-else class="itemInput">{{shortmessage.sendStatus === 'REJECT' ? '驳回' : '通过'}}</span>
        </el-form-item>
        <el-form-item label="审核说明" prop="explain">
          <el-input type="textarea" rows="5" v-model="shortmessage.checkExplain" v-if="shortmessage.sendStatus === 'CHECK'"/>
          <span v-else class="itemInput">{{shortmessage.checkExplain}}</span>
        </el-form-item>
      </el-card>
    </el-form>
    <div class="gt-form-bottom-submit" v-if="shortmessage.sendStatus === 'CHECK'">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消"/>
      <gt-button size="large" :loading="$store.state.loading.global"  @click.native="handleUpdate" txt="提交"/>
    </div>
    <div class="gt-form-bottom-submit" v-else>
      <gt-button size="large" @click.native="$router.go(-1)" txt="确定"/>
    </div>
  </section>
</template>
<script>
import { filterStatus, filterColor } from '@/utils'
import moment from 'moment'
import { shortMessageStatus } from '@/utils/dict'
import gtSubtitle from '@/components/gt-sub-title'
export default {
  name:'shortmessage-view',
  data() {
    return {
      shortmessage: {},
      filterStatus,
      filterColor,
      moment,
      shortMessageStatus,
      dataFormRules:{
        status:[{required: true, message: '请选择审核结果'}]
      }
    }
  },
  components: {
    gtSubtitle
  },
  async created() {
    const { id } = this.$route.query
    const { data } = await this.$http({
      url: this.$http.adornUrl(`/smsMarketing/detail?id=${id}`, true),
      method: 'get'
    })
    if(data.code == 0){
      this.shortmessage = data.data
    }

  },
  methods:{
    handleUpdate() {
      this.$refs['shortmessage'].validate(async (valid) => {
        if (valid) {
          const { data } = await this.$http({
            url: this.$http.adornUrl('/smsMarketing/check', true),
            method: 'post',
            data: this.$http.adornData({
              id: this.shortmessage.id,
              status: this.shortmessage.status,
              checkExplain: this.shortmessage.checkExplain
            })
          })
          if (data.code === 0 ) {
            this.$router.push({name: 'audit-shortmessage'})
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.serverTime {
  .el-col.serverOne {
    width: 200px;
  }
}
.status-container{
  float: right;
  margin-top: 20px;
  margin-right: 20px;
  font-size: 16px;
}
</style>

