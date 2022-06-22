import Vue from 'vue'
const calcHeight = (el, bottomHeight) => {
  let element = null
  if (el.children && el.children.length >= 3) {
    element = el.children[2]
  }
  if (element) {
    let topTableHearder = el.children[1].offsetHeight>0?el.children[1].offsetHeight:41
    let bottomPage = el.parentNode.nextElementSibling?el.parentNode.nextElementSibling.offsetHeight:0
    let bottomPage2 = el.nextElementSibling?el.nextElementSibling.offsetHeight:0
    elobjPP = topTableHearder+bottomPage+bottomPage2+20
    var iTop = getWindowTop(el)
    if (document.body.clientHeight-elobjPP - iTop > 300) {
      element.style.height = `${document.body.clientHeight-elobjPP - iTop}px`
    } else {
      element.style.height = '300px'
    }
    element.style['overflow-y'] = 'auto'
    return el.children[1].offsetHeight
  }
}

export function getWindowTop(obj) {
  var iTop = 0
  while (obj != window.document.body && obj != null) {
    iTop += obj.offsetTop //循环取每一层父元素的相对偏移量
    obj = obj.offsetParent //设置当前元素的父元素=当前元素，用以获取再上层的offsetTop
  }
  return iTop
}

let tt,states,elObj,elobjPP
Vue.directive('table-height', {
  inserted: function (el, binding) {
    elObj = el
    tt = null
    elobjPP=null
    states = 1
    const { value = {} } = binding
    const { bottomHeight = 0 } = value
    calcHeight(el, bottomHeight)
  },
  componentUpdated: function(el, binding) {
    states = 2
    if(tt)return
    const { value = {} } = binding
    const { bottomHeight = 0 } = value
    Vue.nextTick(() => {
      tt= calcHeight(el, bottomHeight)
    })

    // var scrollbar = new Vue.$geminiScrollbar({
    //   element: document.getElementsByClassName('el-table__body-wrapper')[0]
    // }).create()
  }
})

Vue.directive('html-height', {
  componentUpdated: function(el, binding) {
    if(states=2&&tt){
      let element = null
      if (elObj.children && elObj.children.length >= 3) {
        element = elObj.children[2]
      }
      if(element){
        var iTop = getWindowTop(elObj)
        // element.style.height= `${document.body.clientHeight-elobjPP - iTop}px`
        if (document.body.clientHeight-elobjPP - iTop > 300) {
          element.style.height = `${document.body.clientHeight-elobjPP - iTop}px`
        } else {
          element.style.height = '300px'
        }
      }
    }
  },
})
