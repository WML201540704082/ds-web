import Mock from 'mockjs'
import * as common from './modules/common'
import * as jobSchedule from './modules/job-schedule'
import * as oss from './modules/oss'
import * as sysConfig from './modules/sys-config'
import * as sysLog from './modules/sys-log'
import * as sysMenu from './modules/sys-menu'
import * as sysRole from './modules/sys-role'
import * as sysUser from './modules/sys-user'
import * as settings from './modules/settings'
import * as stock from './modules/stock'

// 统一开启/关闭mock拦截
const mockFlag = false

// tips
// 1. 开启/关闭[业务模块]拦截, 通过调用fnCreate方法[isOpen参数]设置.
// 2. 开启/关闭[业务模块中某个请求]拦截, 通过函数返回对象中的[isOpen属性]设置.
fnCreate(common, mockFlag)
fnCreate(jobSchedule, mockFlag)
fnCreate(oss, mockFlag)
fnCreate(sysConfig, mockFlag)
fnCreate(sysLog, mockFlag)
fnCreate(sysMenu, mockFlag)
fnCreate(sysRole, mockFlag)
fnCreate(sysUser, mockFlag)
fnCreate(settings, mockFlag)
fnCreate(stock, mockFlag)

/**
 * 创建mock模拟数据
 * @param {*} mod 模块
 * @param {*} isOpen 是否开启?
 */
function fnCreate (mod, isOpen) {
  if (isOpen) {
    for (var key in mod) {
      ((res) => {
        if (res.isOpen !== false) {
          Mock.mock(new RegExp(res.url), res.type, (opts) => {
            opts['data'] = opts.body ? JSON.parse(opts.body) : null
            const paramsArr = opts.url.split('/')
            const result = res.callBack(opts.data, paramsArr[paramsArr.length - 1])
            return result.data
          })
        }
      })(mod[key] || {})
    }
  }
}
