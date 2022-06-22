/**
 * 开发环境
 */
;(function () {
  window.SITE_CONFIG = {}

  // api接口请求地址
   window.SITE_CONFIG['baseUrl'] = 'https://preds.mengbaige.com'
  //window.SITE_CONFIG['baseUrl'] = 'https://dstest.gateon.cn'
  // 妈咪全知道
  window.SITE_CONFIG['mmqzdUrl'] = 'https://gdmppre.gateon.cn'
  // 品牌活动dmp
  window.SITE_CONFIG['gtDmpUrl'] = 'https://gdmppre.gateon.cn'
  // 企业域名
  window.SITE_CONFIG['companyUrl'] = 'http://localhost:8001'
  // 商品模板地址
  window.SITE_CONFIG['productTemplateUrl'] = 'https://gateon-ds.oss-cn-shanghai.aliyuncs.com/%E6%A8%A1%E6%9D%BF/%E5%95%86%E5%93%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E5%9D%97%E9%97%A8%E5%BA%97%E7%AB%AF.xlsx'
  // 盘点单导入地址
  window.SITE_CONFIG['inventoryTemplateUrl'] = 'https://gateon-ds.oss-cn-shanghai.aliyuncs.com/%E6%A8%A1%E6%9D%BF/%E7%9B%98%E7%82%B9%E5%8D%95%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls'
  // 二代店盘点单导入地址
  window.SITE_CONFIG['inventoryTemplateTwoUrl'] = 'https://gateon-ds.oss-cn-shanghai.aliyuncs.com/%E6%A8%A1%E6%9D%BF/%E6%95%A3%E7%A7%B0%E5%95%86%E5%93%81%E7%9B%98%E7%82%B9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls'
  // 帮助文档
  window.SITE_CONFIG['helpUrl'] = 'https://gateon-ds.oss-cn-shanghai.aliyuncs.com/%E6%A8%A1%E6%9D%BF/%E7%B3%BB%E7%BB%9F%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C%EF%BC%88%E9%97%A8%E5%BA%97%EF%BC%89.pdf'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './' // 域名
  window.SITE_CONFIG['version'] = ''   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain
})()
