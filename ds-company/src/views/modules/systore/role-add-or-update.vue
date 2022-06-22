<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-form-item label="角色名称" v-if="dataForm.id && dataForm.isPreset === 'YES'">
        <span class="itemInput">{{dataForm.roleName}}</span>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName" v-else>
        <el-input v-model="dataForm.roleName" :maxlength="10" placeholder="角色名称最多输入10个汉字"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item  v-if="isAuth('role:store:sysMenu:list')" size="mini" label="授权">
        <el-button @click="setCheckedKeys(true)">全选</el-button>
        <el-button @click="setCheckedKeys(false)">不全选</el-button>
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree"
          :default-expand-all="false"
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
import { limitInputName} from '@/utils/validate'
export default {
  name: 'systore-role-or-update',
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
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: 0,
        roleName: null,
        remark: null
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        remark: [{validator: validateRemark, trigger: 'blur' }]
      },
      originalMenu: [],
      menuIdList:[],
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题.
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.getsysUser()
    },
    async getsysUser(){
      const originalMenu = await this.sysMenulist()
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.menuListTree.setCheckedKeys([])
      })
      this.detail(originalMenu)

    },
    async detail(originalMenu){
      if (this.dataForm.id) {
        const data = await this.$http({
          url: this.$http.adornUrl(`/sys/store/sysRole/detail/${this.dataForm.id}`),
          method: 'get',
          params: this.$http.adornParams()
        })
        this.dataForm.roleName = data.name
        this.dataForm.remark = data.remark
        this.dataForm.isPreset = data.isPreset
        // var idx = data.menuIdList.indexOf(this.tempKey)
        // if (idx !== -1) {
        //   data.menuIdList.splice(idx, data.menuIdList.length - idx)
        //   newMeunIds = data.menuIdList.splice(idx, data.menuIdList.length - idx)
        // }
        let newMeunIds = data.menuIdList
        // 主菜单id
        let pids = originalMenu.filter(o => {
          if (o.type == 0) {
            let childrenIds = originalMenu.filter(i => {
              return i.parentId === o.id
            })
            let flag = false
            childrenIds.forEach(item => {
              if (newMeunIds.indexOf(item.id) === -1) {
                flag = true
              }
            })
            return flag
          } else {
            return false
          }
        }).map(item => item.id)
        let newIds = data.menuIdList.filter(id => {
          return pids.indexOf(id) === -1
        })

        this.$refs.menuListTree.setCheckedKeys(newIds)
      }
    },
    async sysMenulist(){
      const data = await this.$http({
        url: this.$http.adornUrl('/sys/store/sysMenu/list'),
        method: 'get',
        params: this.$http.adornParams()
      })
      let dataList = []
      data.forEach(o=>{
        if(o.type!=2){
          dataList.push(o)
        }
      })
      this.menuList = treeDataTranslate(dataList, 'id')
      return dataList

    },
    setCheckedKeys(val) {
      var array = []
      if(val == true){
        this.menuList.forEach(item => {
          array.push(item.id)
        })
        this.$refs.menuListTree.setCheckedKeys(array)
      }else{
        this.$refs.menuListTree.setCheckedKeys([])
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
            selfHandleError: true,
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              // 'storeId': this.dataForm.storeId || undefined,
              'menuIdList': [].concat(this.$refs.menuListTree.getCheckedKeys(), [this.tempKey], this.$refs.menuListTree.getHalfCheckedKeys()),
              'name': this.dataForm.roleName,
              'remark': this.dataForm.remark
            })
          }).then(({data}) => {
            this.isSave = false
            if(data.code == 0){
              this.visible = false
              this.$emit('refreshDataList')
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
