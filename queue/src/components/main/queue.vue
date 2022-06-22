<template>
  <div class="secondPage">
	<div class="allH">
			
	  <div class="left">
			<img src="../../assets/queue.png" alt="" class="service">
			<div class="lines" v-show="dataList&&dataList.length>0">
				<div class="left_top_left">服务中</div>
				<div class="left_top_right">等待中</div>
			</div>
			<div class="queue-list" v-for="item in dataList" :key="item.productId">
				<div class="left_left">
					<div class="left_left_left">{{ item.productName }}</div>
					<div class="left_left_right">
						<div class="left_left_right_top">{{ item.serveCode }}</div>
						<div class="left_left_right_bottom">已服务{{ item.serveTime }}分钟</div>
					</div>
				</div>
				<div class="left_right">
					<span class="left_right_content">{{ item.waitingQueue }}</span>
				</div>
			</div>
			
			<div class="empty" v-show="!dataList||dataList.length==0">暂无数据</div>
		</div>

		<div class="right">
			<img src="../../assets/wait.png" alt="" class="service">
			<div v-for="item in waitList" :key="item.productId">
				<div class="right_top" style="padding-top: 15px;">
					<div class="right_left">{{item.coding}}{{item.current}}</div>
					<div class="right_middle">
						<div class="right_middle_top">{{item.productName}}</div>
						<div class="right_middle_bottom">{{item.createTime}}</div>
					</div>
					<div class="right_right" v-if="!item.assessable">
						<span @click="clickevalue(true,item)">评价</span>
					</div>
				</div>
			</div>
			<div class="empty" v-show="!waitList||waitList.length==0">暂无数据</div>

			<!-- 评价弹框 -->
			<div class="evalue" v-if="isHidden">
				<div class="ShadowBox">
					<div class="top">
						<span>评价</span>
						<span @click="clickevalue(false)">X</span>
					</div>
					<div class="content">
						<div class="content_left">
							<span class="imgs">
								<img v-if="info.photo" :src="'https://'+info.photo" alt="">
								<img v-if="!info.photo&&info.gender == 'FEMALE'" src="../../assets/evalue/female.png" alt="">
								<img v-if="!info.photo&&info.gender == 'MALE'"  src="../../assets/evalue/male.png" alt="">
								<img v-if="!info.photo&&!info.gender"  src="../../assets/evalue/male.png" alt="">
							</span>
							<span class="content_leftOne">
								<div class="title">{{info.name}}</div>
								<div class="evalueLevel">
									<span class="levelName">满意评价：</span>
									<span class="levelAll">
										<span class="levelContent" v-for="(item,index) in evalList" :key="item.id" @click="evaluate(item,index)">
											<img v-if="(index+1) == 1&&!item.flag" src="@/assets/evalue/yu_ping_1.png" alt="">
											<img v-if="(index+1) == 1&&item.flag" src="@/assets/evalue/yu_ping_1_on.png" alt="">
											<img v-if="(index+1) == 2&&!item.flag" src="@/assets/evalue/yu_ping_2.png" alt="">
											<img v-if="(index+1) == 2&&item.flag" src="@/assets/evalue/yu_ping_2_on.png" alt="">
											<img v-if="(index+1) == 3&&!item.flag" src="@/assets/evalue/yu_ping_3.png" alt="">
											<img v-if="(index+1) == 3&&item.flag" src="@/assets/evalue/yu_ping_3_on.png" alt="">
											<!-- <img :src="!item.flag?('@/assets/evalue/yu_ping_'+(index+1)+'.png'):('@/assets/evalue/yu_ping_'+(index+1)+'_on.png')" alt=""> -->

											<div>{{item.name}}</div>
										</span>
									</span>
								</div>
							</span>
						</div>
						<div style="display:inline-block;width: 100%;">
							<div class="contentL">
								<span v-for="item in contentList" :class="item.flag?'active':''" :key="item.value" @click="clickItem(item.value,item)">{{item.name}}</span>
							</div>
						</div>
						

						<div class="buttons">
							<span @click="commentSubmits">发表评价</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>
<script>
import { queueList,unCommentList,getEmployeeInfoById,commentSubmit} from '@/service/queue'
export default {
	data(){
		return{
			evalList:[{id:2,name: '很好',flag: true},{id:1,name: '好',flag: false},{id:0,name: '一般',flag: false}],
			contentList:[{
        name:'热情好客',
				value: 0,
				flag: true
      },{
        name:'手法熟练',
        value: 1,
				flag: false
      },{
        name:'金牌服务',
        value: 2,
				flag: false
      },{
        name:'责任心强',
        value: 3,
				flag: false
      },{
        name:'有待提高',
        value: 4,
				flag: false
			}],
			clickitems: 0,
			isHidden: false,
			value: 2,
			dataList:[],
			waitList:[],
			info:{},
			serveId:null //服务id
		}
	},
  created() {
	  this.queueList()
		this.evalueLists()
		this.setIntervalTime()
	},
	methods:{
		// 5秒倒计时
		setIntervalTime(){
			
			var that = this;
			var time = 60
			var t = window.setInterval(()=>{
				if(time<=0){
					that.queueList()
					that.evalueLists()
					time = 60
				}else{
					time = time-1;
				}
				
			},1000)
		},
		evaluate(item,idx){
			this.value = item.id
			this.evalList.map((o,index)=>{
				if(index == idx){
					o.flag = true
				}else{
					o.flag = false
				}
			})
		},
		clickevalue(flag,item){
			this.evalList.map((o,i)=>{
				if(i==0){
					o.flag = true
					this.clickitems= 0
				}else{
					o.flag = false
				}
			})
			this.contentList.map((o,i)=>{
				if(i==0){
					o.flag = true
					this.value= 2
				}else{
					o.flag = false
				}
			})
			if(!flag){
				this.isHidden = flag
			}else{
				this.serveId = item.id || null
				this.appointmentId = item.appointmentId || null
				this.getEmployeeInfoByIds(item.technicianId)
			}
		},
		clickItem(value,item){
			item.flag = !item.flag
		},
		// 评价列表
		async evalueLists(){
			this.dataListLoading = true
			const { data } = await unCommentList({})
			this.dataListLoading = false
			if (data && data.code === 0) {
				var records = data.data
				records.map(o=>{
					var name = o.productName;
					if(name.length>15){
						o.productName = name.substring(0,15)+'...'
					}else{
						o.productName = name
					}
				})
				this.waitList = records || []
			} else {
				this.waitList = []
				this.$message.warning(data.msg)
			}
		},
		// 排队队列
		async queueList() {
			this.dataListLoading = true
			const { data } = await queueList({})
			this.dataListLoading = false
			if (data && data.code === 0) {
				var records = data.data
				records.map(o=>{
					var name = o.productName;
					if(o.waitingQueue&&o.waitingQueue.length>0){
						o.waitingQueue = o.waitingQueue.join(',')
					}else{
						o.waitingQueue = '暂无数据'
					}
					if(name.length>4){
						o.productName = name.substring(0,4)+'...'
					}else{
						o.productName = name
					}
				})
				this.dataList = records || []
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }
		},	

		// 评价信息
		async getEmployeeInfoByIds(id){
			this.isHidden = true
				const { data } = await getEmployeeInfoById({
				id: id
			})
				if (data && data.code === 0) {
			this.info = data.data
				} else {
					this.info = {}
					this.$message.warning(data.msg)
				}
		},

	
		// 评价提交
		async commentSubmits(){
			this.isHidden = true
			var list = this.contentList.filter(o=>{return o.flag==true})
			var array = []
			list.map(o=>{
				array.push(o.name)
			})
			const { data } = await commentSubmit({
				apmtId: this.appointmentId,
				queueId: this.serveId,
				content: array.join(','),
				score: this.value,
				technician:this.info.name,
				technicianId:this.info.id,
				technicianPhoto: this.info.photo
			})
			if (data && data.code === 0) {
				this.$message.success('评价成功');
				this.isHidden = false
				this.queueList()
				this.evalueLists()

			} else {
				this.$message.warning(data.msg)
			}
		},
  }
}



</script>

<style>
@import '../../style/queue.css';
</style>
