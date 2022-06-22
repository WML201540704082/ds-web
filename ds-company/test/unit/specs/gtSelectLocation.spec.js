import http from '@/utils/httpRequest'


// describe('gtImageUpload.vue', () => {
//   it('gt-image-upload', () => {
//     const Constructor = Vue.extend(gtImageUpload)
//     const vm = new Constructor().$mount()
//     expect(vm.$el.querySelector('.show-index').textContent).toEqual('显示在第0张')
//   })
// })

test('获取省列表', async () => {
  const { data } = await http({
    url: http.adornUrl('/common/district/province'),
    selfHandleError: true,
    method: 'get',
  })
  expect(data.code).toEqual('0')
})


