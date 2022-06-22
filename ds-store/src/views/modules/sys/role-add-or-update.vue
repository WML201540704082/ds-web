<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="选择门店" prop="storeId">
        <el-select v-model="dataForm.storeId" placeholder="请选择企业下的门店">
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item v-if="isAuth('sys:menu:list')" size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox>
        </el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isSave">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import * as api from '@/service/systore'
import {limitInputName } from '@/utils/validate'
export default {
  data () {
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('备注不能超过200个汉字'))
      } else{
        callback()
      }
    }
    return {
      isSave: false,
      visible: false,
      menuList: [],
      // storeList:[],//门店列表
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: 0,
        storeId: null,//门店id
        roleName: null,
        remark: null
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        remark: [{validator: validateRemark, trigger: 'blur' }]
        // storeId: [
        //   { required: true, message: '选择门店不能为空', trigger: 'blur' }
        // ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题.
    }
  },
  methods: {
    init (id,storeId) {
      this.dataForm.id = id || 0
      this.getsysUser()
    },

    getsysUser(){
      if(this.isAuth('sys:menu:list')){
        this.$http({
          url: this.$http.adornUrl('/sys/store/sysMenu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(data => {
          this.menuList = treeDataTranslate(data, 'id')
        })
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if(this.isAuth('sys:menu:list')){
          this.$refs.menuListTree.setCheckedKeys([])
        }
      })
      if (this.dataForm.id&&this.isAuth('sys:role:detail')) {
        this.$http({
          url: this.$http.adornUrl(`/sys/store/sysRole/detail/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(data => {
          this.dataForm.roleName = data.name
          this.dataForm.remark = data.remark
          var idx = data.menuIdList.indexOf(this.tempKey)
          if (idx !== -1) {
            data.menuIdList.splice(idx, data.menuIdList.length - idx)
          }
          this.$refs.menuListTree.setCheckedKeys(data.menuIdList)
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isSave = true
          this.$http({
            url: this.$http.adornUrl(`/sys/store/sysRole/${!this.dataForm.id ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              // 'storeId': this.dataForm.storeId || undefined,
              'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
              'name': this.dataForm.roleName,
              'remark': this.dataForm.remark
            })
          }).then(data => {
            this.isSave = false
            this.visible = false
            this.$emit('refreshDataList')
          })
        }
      })
    }
  }
}
</script>
