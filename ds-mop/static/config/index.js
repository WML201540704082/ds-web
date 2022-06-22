/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'https://preds.mengbaige.com'
  // window.SITE_CONFIG['baseUrl'] = 'https://ds.gateon.cn'
  // dmp
  window.SITE_CONFIG['mmqzdUrl'] = 'https://gdmpdev.gateon.cn'
  // 富有接口地址
  window.SITE_CONFIG['fuyouUrl'] = 'https://productcodetest.gateon.cn'
  // 帮助文档
  window.SITE_CONFIG['helpUrl'] = 'https://gateon-ds.oss-cn-shanghai.aliyuncs.com/%E6%A8%A1%E6%9D%BF/%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C%EF%BC%88%E4%BC%81%E4%B8%9A%EF%BC%89.pdf'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain
})()
