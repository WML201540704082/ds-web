<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
       <!-- v-if="dataForm.type === 1" -->
      <el-form-item label="菜单路由" v-if="dataForm.type !== 0" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === dataForm.icon }">
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
        </el-row>
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
import Icon from '@/icons'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单路由不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isSave: false,
      dataForm: {
        id: 0,
        type: 1,
        typeList: ['目录', '菜单', '按钮'],
        name: null,
        parentId: 0,
        parentName: null,
        url: null,
        perms: null,
        orderNum: 0,
        icon: null,
        iconList: []
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        url: [
          { required: true, message: '菜单路由不能为空', trigger: 'change' },
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      if(this.isAuth('sys:menu:select')){
        this.menuSelect()
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (!this.dataForm.id) {
        // 新增
        this.menuListTreeSetCurrentNode()
      }
    },
    menuSelect(){
      this.$http({
        url: this.$http.adornUrl('/sys/mop/sysMenu/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.menuList = treeDataTranslate(data.data, 'id')
      })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.id
      if(this.dataForm.parentId == 0 && this.dataForm.type != 0){
        this.$message.warning('此菜单不能选择')
        return
      }
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle (iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit () {
      if(this.dataForm.parentId == 0 && this.dataForm.type != 0){
        this.$message.warning('此菜单不能选择')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isSave = true
          this.$http({
            url: this.$http.adornUrl(`/sys/mop/sysMenu/${!this.dataForm.id ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'menuId': this.dataForm.id || undefined,
              'parentId': this.dataForm.parentId,
              'name': this.dataForm.name,
              'url': this.dataForm.url,
              'perms': this.dataForm.perms,
              'type': this.dataForm.type,
              'icon': this.dataForm.icon,
              'orderNum': this.dataForm.orderNum
            })
          }).then(({data}) => {
            this.isSave = false
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      max-width: 370px;
    }
    &__icon-list {
      max-height: 180px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
  
  .mod-menu__icon-list {
    max-height: initial;
  }
</style>
