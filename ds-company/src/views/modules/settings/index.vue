<template>
  <section class="setting-index-page">
    <gt-sub-title title="基础设置" />
    <div class="item-container">
      <pic v-if="isAuthMenu('setting_company')" icon="company" text="企业认证" tip="企业基本信息管理" @click.native="$router.push({name: 'settings-company'})"/>
      <pic v-if="isAuthMenu('setting_store')" icon="store" text="门店管理" tip="企业的连锁门店管理" @click.native="$router.push({name: 'settings-storeManagement-store'})"/>
      <!-- <pic v-if="isAuthMenu('setting_data')" icon="data" text="数据同步" tip="商品、顾客的初始化同步" @click.native="$router.push({name: 'settings-goods'})"/> -->
      <!--<pic v-if="isAuthMenu('setting_label')" icon="label" text="标签库" tip="标签管理库" @click.native="$router.push({name: 'tags-taglist'})"/> -->
    </div>
    <gt-sub-title title="系统管理"/>
    <div class="item-container">
      <pic v-if="isAuthMenu('setting_company_role')" icon="company-role" text="企业角色" tip="为企业管理平台创建角色" @click.native="$router.push({name: 'sys-role'})"/>
      <pic v-if="isAuthMenu('setting_store_role')" icon="store-role" text="门店角色" tip="为门店管理平台创建角色" @click.native="$router.push({name: 'systore-role'})"/>
      <pic v-if="isAuthMenu('setting_staff_list')"  icon="company-user" text="员工管理" tip="为企业各分支结构创建员工" @click.native="$router.push({name: 'staffManagement-staffList'})"/>
      <pic v-if="isAuthMenu('setting_commission')"  icon="commission-user" text="分级提成&新客奖励" tip="员工分级提成及新客奖励" @click.native="$router.push({name: 'settings-staff-commission'})"/>
      <pic v-if="isAuthMenu('setting_supplier')"  icon="supplier-user" text="供应商管理" tip="建立与供应商的联系" @click.native="$router.push({name: 'settings-supplier-supplierManagement'})"/>
      <!-- <pic v-if="isAuthMenu('setting_advertisement')"  icon="advertisement" text="广告设置" tip="为广告而生" @click.native="$router.push({name: 'settings-advertisement'})"/> -->
    </div>
  </section>
</template>
<script>
import gtSubTitle from '@/components/gt-sub-title'
import pic from './pic'
export default {
  components: { gtSubTitle, pic }
}
</script>
<style lang="scss">
  .setting-index-page{
    padding: 0 10px;
    .item-container{
      overflow: hidden;
    }
    .el-row{
      margin: 0 -20px;
    }
  }
</style>
