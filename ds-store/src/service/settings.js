import httpRequest from '@/utils/httpRequest'

// 编辑卡片信息
export const updateCard = card => {
  return httpRequest({
    url: httpRequest.adornUrl('/settings/company/card'),
    method: 'post',
    data: httpRequest.adornData(card)
  })
}

// 获取结算历史列表
export const getSettlementHistoryList = data => {
  return httpRequest({
    url: httpRequest.adornUrl('/settings/company/history'),
    method: 'post',
    selfHandleError: true,
    data: httpRequest.adornData(data)
  })
  // return {
  //   code: 0,
  //   data: {
  //     total: 20,
  //     records: [{
  //       time: '2018-02-20',
  //       money: 298,
  //       account: '6222600110029247231',
  //       status: 1,
  //       payType: 0
  //     }]
  //   }
  // }
}

