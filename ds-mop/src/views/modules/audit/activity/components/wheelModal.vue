<template>
  <div class="lefts">
    <div class="phoneTop">
      <img src="static/img/phone/meng_zhuan_title.png" alt="">
      <span>{{activeadd.title}}</span>
    </div>
    <div class="phoneCenter">
      <img style="width:100%" src="static/img/phone/meng_zhuan_title-min.png" alt="">
      <div class="prizeButton">
        <span>恭喜用户小明抽中一等奖</span>
      </div>

      <!-- 大转盘 -->
      <div class="TurntablePage" v-if="activeadd.items&&activeadd.items.length>0">
        <div class="TurntableBox">
          <div class="turnplate">
            <canvas class="item" id="wheelcanvas" width="422px" height="422px"></canvas>
            <img class="pointer" @click="pointerClick" src="static/img/phone/start.png">
          </div>
        </div>
      </div>

      <img style="width:100%;margin: 10px 0" src="static/img/phone/meng_zhuan_button.png" alt="">
      <div class="clickTab">点击转盘开始抽奖</div>
    </div>
    <!-- 抽奖说明 -->
    <div class="prizeInfo">
      <img style="width:80%" src="static/img/phone/meng_zhuan_title1-min.png" alt="">
    </div>
    <div class="prizeContent">
      <!-- 奖品说明 -->
      <div class="backgrounds">
        <div class="expand">
          <img src="static/img/phone/meng_zhuan_point-min.png" alt="">
          <span>奖品说明</span>
        </div>
        <div class="gifts colorCommon" v-for="(item,index) in activeadd.items" :key="index">{{item.level}}等奖：{{item.name}}</div>
      </div>

      <!-- 特色描述 -->
      <div class="backgrounds" v-if="activeadd.subTitle">
        <div class="expand">
          <img src="static/img/phone/meng_zhuan_point-min.png" alt="">
          <span>特色描述</span>
        </div>
        <div class="gifts colorCommon" style="line-height: 18px;">{{activeadd.subTitle}}</div>
      </div>

      <!-- 适用门店 -->
      <!-- <div class="backgrounds backgrounds1" v-if="activeadd.storeList&&activeadd.storeList.length>0">
        <div class="expand" style="margin-left: 10px;">
          <img src="static/img/phone/meng_zhuan_point-min.png" alt="">
          <span>适用门店</span>
        </div>
        <div class="stores">
          <div class="storelist" v-for="item in activeadd.storeList" :key="item.id">
            <span>
              <div class="colorCommon1">{{item.name}}</div>
              <div class="colorCommon address">1.3km | {{`${item.province || ''}${item.city || ''}${item.district || ''}${item.address || ''}` || '--'}}</div>
            </span>
            <img src="static/img/phone/meng_zhuan_phone-min.png" alt="">
          </div>
        </div>
      </div> -->

      <!-- 活动须知 -->
      <div class="backgrounds">
        <div class="expand">
          <img src="static/img/phone/meng_zhuan_point-min.png" alt="">
          <span>活动须知</span>
        </div>
        <div class="gifts colorCommon" style="line-height: 18px;">活动有效期：{{activeadd.startTime&&moment(activeadd.startTime).format('YYYY-MM-DD HH:mm:ss')}}-{{activeadd.endTime&&moment(activeadd.endTime).format('YYYY-MM-DD HH:mm:ss')}}</div>
        <div class="gifts colorCommon">参与条件：
          <span class="colorCommon">每个用户/电话号码</span>
          <span class="colorCommon" v-if="activeadd.times>0">限抽奖{{activeadd.times}}次</span>
          <span v-if="activeadd.times == 0 && activeadd.dayTimes == 0">抽奖次数不限</span>
          <span class="colorCommon" v-if="activeadd.times == 0 && activeadd.dayTimes > 0">每位顾客每天限参加{{activeadd.dayTimes}}次</span>
          <div class="colorCommon leftsTop" v-if="activeadd.times>0 || (activeadd.times == 0 && activeadd.dayTimes > 0)">成功分享一次活动给微信好友，可额外获赠抽奖{{activeadd.gift}}次</div>
          <div class="colorCommon leftsTop" v-if="activeadd.times>0 || (activeadd.times == 0 && activeadd.dayTimes > 0)">每位用户最多可获赠抽奖{{activeadd.share}}次</div>
        </div>
        <div class="gifts colorCommon">温馨提示：
          <span class="colorCommon">本活动不兑换现金，不找零;</span>
          <div class="colorCommon leftsTop">不与其他优惠叠加，不同享;</div>
          <div class="colorCommon leftsTop" style="line-height: 18px;">活动内容及图片由门店自行提供，若出现侵权或损害您的权益，请及时联系我们平台处理。</div>
        </div>

      </div>
    </div>
    <!-- 更多详情介绍 -->
    <div class="prizeInfo" v-if="activeadd.templates&&activeadd.templates.length>0">
      <img style="width:80%" src="static/img/phone/meng_zhuan_title2-min.png" alt="">
    </div>

    <div class="prizeContent prizeContent1" v-if="activeadd.templates&&activeadd.templates.length>0"> 
      <div  v-for="item in activeadd.templates" :key="item.id">
        <div class="title" v-if="item.type=='TITLE'">{{item.content}}</div>
        <img v-if="item.type=='IMAGE'" style="width: 100%;margin: 10px 0;" :src="'http://'+item.content" alt="">
        <div class="colorCommon" v-if="item.type=='CONTENT'" style="line-height: 18px;">{{item.content}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
var turnplate={
  restaraunts:[],				//大转盘奖品名称
  colors:[],					//大转盘奖品区块对应背景颜色
  outsideRadius:192,			//大转盘外圆的半径
  textRadius:150,				//大转盘奖品位置距离圆心的距离
  insideRadius:20,			//大转盘内圆的半径
  startAngle:0,				//开始角度
  bRotate:false				//false:停止;ture:旋转
}
turnplate.restaraunts = []
var colorsArr = ['#FF8A08', '#FF8A08']
export default {
  data(){
    return{
      moment
    }
  },
  props:{
    activeadd:{
      type: Object
    }
  },
  watch:{
    'activeadd.items'(val,oldval){
      turnplate.restaraunts = val
      if(turnplate.restaraunts&&turnplate.restaraunts.length>0){
        this.returnColor()
        this.drawRouletteWheel()
      }
    }
  },
  mounted(){
    turnplate.restaraunts = this.activeadd.items
    if(turnplate.restaraunts&&turnplate.restaraunts.length>0){
      this.returnColor()
      this.drawRouletteWheel()
    }
  },
  methods:{
    // 转盘颜色分配
    returnColor(){
      var a=turnplate.restaraunts.length
      var color=turnplate.restaraunts.map(function(item,index,array){
        if(a%2){
          return (index+1)==a? colorsArr[1]:colorsArr[index%2]
        }else{
          return colorsArr[index%2]
        }
      })
      turnplate.colors=color
    },
    // 点击转盘转动
    pointerClick(){
      if(turnplate.bRotate)return
      turnplate.bRotate = !turnplate.bRotate
      //获取随机数(奖品个数范围内)
      var item = this.rnd(1,turnplate.restaraunts.length)
      //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
      this.rotateFn(item, turnplate.restaraunts[item-1])
      console.log(item)
    },
    rnd(n, m){
      var random = Math.floor(Math.random()*(m-n+1)+n)
      return random
    },
    //旋转转盘 item:奖品位置; txt：提示语;
    rotateFn(item, txt){
      var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2))
      if(angles<270){
        angles = 270 - angles
      }else{
        angles = 360 - angles + 270
      }
      $('#wheelcanvas').stopRotate()
      $('#wheelcanvas').rotate({
        angle:0,
        animateTo:angles+1800,
        duration:8000,
        callback:function (){
          console.log(txt)
          turnplate.bRotate = !turnplate.bRotate
        }
      })
    },
    drawRouletteWheel() {
      var canvas = document.getElementById('wheelcanvas')
      if (canvas.getContext) {
        //根据奖品个数计算圆周角度
        var arc = Math.PI / (turnplate.restaraunts.length/2)
        var ctx = canvas.getContext('2d')
        //在给定矩形内清空一个矩形
        ctx.clearRect(0,0,422,422)
        //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式 描边加粗
        ctx.strokeStyle = '#fff'
        //font 属性设置或返回画布上文本内容的当前字体属性
        ctx.font = '20px Microsoft YaHei'
        for(var i = 0; i < turnplate.restaraunts.length; i++) {
          var angle = turnplate.startAngle + i * arc
          ctx.fillStyle = turnplate.colors[i]
          // ctx.strokeStyle = 'red'
          // ctx.lineWidth='3'
          ctx.beginPath()
          //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
          ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false)
          ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true)
          ctx.stroke()
          ctx.fill()
          //锁画布(为了保存之前的画布状态)
          ctx.save()
          //----绘制奖品开始----
          ctx.fillStyle = '#fff'
          var text = turnplate.restaraunts[i].level+'等奖'
          var line_height = 17
          //translate方法重新映射画布上的 (0,0) 位置
          ctx.translate(211 + Math.cos(angle + arc / 2) * turnplate.textRadius, 211 + Math.sin(angle + arc / 2) * turnplate.textRadius)
          //rotate方法旋转当前的绘图
          ctx.rotate(angle + arc / 2 + Math.PI / 2)
          /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
          if(text.length>6){//奖品名称长度超过一定范围
            text = text.substring(0,5)+'||'+text.substring(5)
            var texts = text.split('||')
            for(var j = 0; j<texts.length; j++){
              ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 3, j * line_height)
            }
          }else{
            //在画布上绘制填色的文本。文本的默认颜色是黑色
            //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
          }
          ctx.restore()
          //----绘制奖品结束----
        }
      }
    }
  }

}
</script>
<style lang='scss' scoped>
  .TurntablePage {
    background: url('/static/img/phone/meng_zhuan_border.png') no-repeat;
    width: 290px;
    height: 290px;
    background-size: contain;
    margin: 20px auto;
  }

 .TurntablePage .TurntableBox {
  
  text-align: center;
}
.TurntablePage .TurntableBox .turnplate {
  width: 270px;
  height: 270px;
  margin: 0 auto;
  position: relative;
  top: 10px;
}
.TurntablePage .TurntableBox .turnplate canvas {
  width: 100%;
  height: 100%;
}
.TurntablePage .TurntableBox .turnplate img {
  width: 80px;
  position: absolute;
  left: 50%;
  top: 65px;
  transform: translateX(-50%);
}

</style>

