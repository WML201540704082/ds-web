import ConfirmModal from '@/components/gt-confirm-modal'
let confirm = {}
let $vm
confirm.install = function (Vue, options) {
  const ConfirmPlugin = Vue.extend(ConfirmModal)

  $vm = new ConfirmPlugin({
    el: document.createElement('div')
  })

  document.body.appendChild($vm.$el)

  Vue.prototype.$easyConfirm = {
    show: (options) => {
      $vm.show({...options, type: 'confirm'} || {})
    },
    hide: () => {
      $vm.hide()
    },
    update: (name, value) => {
      $vm.update(name, value)
    }
  }
  Vue.prototype.$easyAlert = {
    show: (options) => {
      $vm.show({...options, type: 'alert'} || {})
    },
    hide: () => {
      $vm.hide()
    },
    update: (name, value) => {
      $vm.update(name, value)
    }
  }
}

export default confirm
