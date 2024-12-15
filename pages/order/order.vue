<template>
	<view style="height: 100vh; width: 100%; background-color: #f0f0f0;">
		<!-- 顶部组件 -->
		<CustomNavbar title="订单管理" text=" " />
		<view class="my-order">
			<view class="order-header">
				<view class="header-item" v-for="(tabItem,index) in tabList" :key="index"
					:class='tabIndex == index?"active":""' @tap="changeTab(index)">{{tabItem.name}}</view>
			</view>

			<view class="order-main" style="background-color: #f0f0f0;" v-if="orderAllList.length>0">
				<!-- 商品 -->
				<view class="order-goods" v-for="item in filteredOrders" :key="item.id">
					<view class="order-item-title" @tap="goRestaurant(item.restaurantId)">
						<view class="order-item-title-left">
							<view class="order-item-title-left-img"><img :src="item.imageUrl" alt="" /></view>
							<view class="order-item-title-left-name">{{item.restaurantName}}</view>
						</view>
						<view class="order-item-title-right"><u-icon name="arrow-right" size="35rpx"
								color="#999999"></u-icon></view>
					</view>
					<view class="order-item" v-for="orderItem in item.orderdetails" :key="orderItem.id">
						<view class="order-item-name">{{orderItem.dishName}}</view>
						<view class="order-item-quantity">x{{orderItem.quantity}}</view>
					</view>

					<view class="order-other">
						<view class="order-other-time">{{item.orderTime.replace('T',' ')}}</view>
						<view class="order-other-price">实付￥{{item.totalPrice}}</view>
					</view>

					<view class="order-status">
						<view class="order-item-status">订单{{item.status}}</view>
						<view class="order-item-btn">
							<view class="order-item-btn1" @click="showModal" @tap="setId(item.id)">删除</view>
							<view class="order-item-btn2">再来一单</view>
							<view class="order-item-btn3" v-show="item.status=='待支付'" @tap="goPay(item.id)">立即支付</view>
							<view class="order-item-btn3" v-show="item.status=='待发货'" @tap="expedited(item.id)">催发货
							</view>
							<view class="order-item-btn3" v-show="item.status=='待收货'" @tap="recivied(item.id)">确认收货
							</view>
							<view class="order-item-btn3" v-show="item.status=='待评价'"
								@tap="appraise(item.restaurantId)">去评价</view>
						</view>
					</view>

					<u-popup :show="popupShow" @open="" :round="20" mode="center">
						<view class="popup-remark">
							<view class="popup-remark-sel">
								<view @click="close">取消</view>
								<view @click="submitRemark(item.restaurantId,item.userId,item.id)">完成</view>
							</view>
							<view class="gjy">
								<view>评分：</view>
								<view><u-rate :count="count" v-model="value" size="40rpx" allowHalf="true"></u-rate>
								</view>
							</view>
							<view class="popup-remark-text">
								<textarea class="JTxtArea lg" :maxlength="200"
									:data-maxnum="reviewcomment.length+'/200'" auto-height @input="inputReason"
									:value="reviewcomment" placeholder="请输入评价内容"></textarea>
							</view>
							<view class="popup-remark-item">
								<view class="popup-remark-item-1">快捷评价</view>
								<view class="popup-remark-item-2" v-for="(item1,index) in popupRemarkItem" :key="index">
									<text @tap="selectRemark(item1)">{{item1}}</text>
								</view>
							</view>

						</view>
					</u-popup>

					<u-modal :show="show" showCancelButton @confirm="confirm" @cancel="cancel">确认是否删除改订单</u-modal>
				</view>



				<view class="bottom-text">没有更多了</view>
			</view>

			<view class="no-order" v-else>
				<view class=""><img style="width: 420rpx; height: 320rpx;"
						src="https://p0.meituan.net/openhfiveimages/befb3fddedc57f5f07b81ac08490d37d13704.png" alt="" />
				</view>
				<view class="no-order-go">暂无订单,快去下单吧~</view>
				<view class="no-order-gogogo" @tap="goHome">立即下单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	import {
		mapState,
		mapActions,
	} from 'vuex'
	import {
		addReview
	} from '@/static/network/api.js'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				//默认标签为第一个
				tabIndex: 0,
				//标签列表
				tabList: [{

						//全部订单
						name: "全部",
						list: []
					},
					{
						name: "待支付",
						list: []
					},
					{
						name: "待发货",
						list: []
					},
					{
						name: "待收货",
						list: []
					},
					{
						name: "待评价",
						list: []
					},
				],

				//控制是否确认删除模态框的打开与关闭
				show: false,

				//设置一个变量用于删除记录id
				deleteId: -1,

				popupShow: false,

				//评价内容
				reviewcomment: "",

				//快捷评价
				popupRemarkItem: ["饭菜量很足，价钱也非常合理，送得也很及时。",
					"味道不错很好吃，及时送达，服务态度好，下次再来"
				],


				//评分
				count: 5,
				value: 1

			}
		},

		onLoad: function() {},
		
		onShow() {
			this.loadData()
			this.tabIndex = uni.getStorageSync("tabIndex")
			uni.removeStorageSync("tabIndex")
		},
		computed: {
			...mapState({
				orderAllList: state => state.order.list,
			}),

			// 添加此计算属性来过滤订单
			filteredOrders() {
				// orderAllList中的每个订单对象都包含一个'status'字段
				if (this.tabIndex === 0) {
					// 全部订单，无需过滤直接返回
					return this.orderAllList;
				} else {
					// 根据tabIndex选择对应的订单状态进行过滤
					const statusToFilter = this.tabList[this.tabIndex].name;
					return this.orderAllList.filter(order => order.status == statusToFilter);
				}
			},
		},
		methods: {
			async submitRemark(restaurantId, userId, orderId) {
				let data = {
					userId: userId,
					restaurantId: restaurantId,
					rating: this.value,
					commentcontent: this.reviewcomment
				};

				try {
					// 提交评价
					await addReview(data);

					// 显示成功提示
					await new Promise((resolve) => {
						uni.showLoading({
							title: '提交评价中'
						});
						setTimeout(() => {
							uni.hideLoading()
						}, 2000)
						setTimeout(() => {
							uni.showToast({
								title: '评价成功',
								icon: 'success',
								duration: 1500
							});
							resolve(); // 通知Promise完成
						}, 2000);
					});

					// 隐藏弹窗
					this.popupShow = false;

					// 删除订单
					await this.deleteOrder(orderId);
				} catch (error) {
					console.error('提交评价或删除订单时出错:', error);
					// 处理错误情况，如显示错误提示等
				}
			},
			//快捷评价
			selectRemark(reviewcomment) {
				this.reviewcomment = reviewcomment
			},
			//评价 开启模态框
			appraise() {
				this.popupShow = true
			},

			//获取评价赋值
			inputReason(e) {
				this.reviewcomment = e.detail.value;
			},

			//关闭模态框
			close() {
				this.popupShow = false
			},


			//待收货 -> 待评价
			recivied(orderId) {
				let reciviedData = {
					orderId: orderId,
					status: '待评价'
				};
				let that = this;
				uni.showModal({
					title: '',
					content: '确认收货吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('点击了确认')
							that.updateOrder(reciviedData)
						} else {
							console.log('点击了取消')
						}
					}
				})
			},
			//待发货 -> 待收货
			expedited(orderId) {
				let expeditedData = {
					orderId: orderId,
					status: '待收货'
				};
				let that = this;
				uni.showModal({
					title: '',
					content: '确认发货吗？(暂时功能)',
					success: function(res) {
						if (res.confirm) {
							console.log('点击了确认')
							that.updateOrder(expeditedData)
						} else {
							console.log('点击了取消')
						}
					}
				})
			},
			//设置删除时的id
			setId(id) {
				this.deleteId = id
			},
			...mapActions(['deleteOrder', 'updateOrder']),
			//调用store初始化数据
			async loadData() {
				await this.$store.dispatch('fetchDataOrder');
				// 数据加载完成后，你可以执行其他操作，比如更新UI
			},
			cancel() {
				this.show = false
			},
			showModal() {
				this.show = true;
			},
			confirm() {
				console.log(this.deleteId);
				setTimeout(() => {
					this.deleteOrder(this.deleteId);
					// 3秒后自动关闭
					this.show = false;
				}, 1500)
			},
			goHome() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			//顶部切换
			changeTab(index) {
				this.tabIndex = index
			},
			//跳转商家页面
			goRestaurant(id) {
				uni.navigateTo({
					url: `/pages/restaurantInfo/restaurantInfo?id=${id}`
				})
			},
			//去支付页面
			goPay(id) {
				uni.navigateTo({
					url: `/pages/orderDetailPay/orderDetailPay?orderId=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.no-order {
		position: absolute;
		top: 30%;
		left: 165rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.no-order-go {
		margin-top: 20rpx;
		padding: 6rpx 60rpx;
		color: #9a9a9a;
		font-size: 30rpx;
	}

	.no-order-gogogo {
		padding: 16rpx 60rpx;
		font-size: 30rpx;
		background-color: #feda30;
		border-radius: 10rpx;
		font-family: 'Microsoft Yahei';
		margin-top: 30rpx;
	}

	.order-header {
		background-color: #f7f7f7;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 2rpx solid #f7f7f7;
	}

	.header-item {
		text-align: center;
		flex: 1;
		line-height: 100rpx;
		font-size: 35rpx;
		font-weight: bold;
		color: #686868;
		font-family: 'Microsoft Yahei';
	}

	.active {
		border-bottom: 6rpx solid #ffcc33;
		color: #000000;
	}

	.order-goods {
		padding: 10rpx 35rpx;
		background-color: #ffffff;
		border-bottom: 3rpx solid #f0f0f0;
	}

	.order-item-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #f0f0f0;
		padding-bottom: 15rpx;
	}

	.order-item-title-left {
		display: flex;
		align-items: center;
	}

	.order-item-title-left image {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
	}

	.order-item-title-left-name {
		margin-left: 20rpx;
		padding-bottom: 15rpx;
		font-size: 32rpx;
		color: rgb(71, 61, 57);
		font-family: 'Microsoft Yahei';
	}

	.order-item-title-right {}

	.order-item {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
		font-size: 30rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
	}

	.order-other {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
	}

	.order-other-time {
		font-size: 30rpx;
		color: #858687;
	}

	.order-other-price {
		font-size: 30rpx;
	}

	.order-status {
		display: flex;
		justify-content: space-between;
	}

	.order-item-status {
		font-size: 30rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
		color: #ffd46e;
	}

	.order-item-btn {
		display: flex;
		font-size: 30rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
	}

	.order-item-btn1 {
		padding: 8rpx 15rpx;
		border: 1rpx solid #e3e3e3;
		border-radius: 8rpx;
		color: #858687;
	}

	.order-item-btn2 {
		padding: 8rpx 15rpx;
		border: 1rpx solid #e3e3e3;
		border-radius: 8rpx;
		background-color: #ffd161;
		margin-left: 5rpx;
	}

	.order-item-btn3 {
		padding: 8rpx 15rpx;
		border: 1rpx solid #e3e3e3;
		border-radius: 8rpx;
		margin-left: 5rpx;
	}

	.bottom-text {
		margin-top: 40rpx;
		padding-bottom: 40rpx;
		text-align: center;
		font-size: 30rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
		color: #716f6c;
	}







	.remark {
		display: flex;
		justify-content: space-between;
		background-color: #ffffff;
		border-radius: 25rpx;
		padding: 10rpx 10rpx;
		padding-bottom: 150rpx;
		margin: 20rpx 5rpx;
	}

	.remark-text {
		font-size: 30rpx;
		color: #595959;
		border-bottom: 3rpx solid #f4f4f4;
	}

	.remark-icon {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #999999;
		margin-right: -30rpx;
		padding-right: 20rpx;
	}

	.remark-icon-1 {}

	.remark-icon-2 {
		padding-top: 3rpx;

	}

	.popup-remark {
		width: 600rpx;
		height: 600rpx;
		padding: 20rpx 40rpx;
	}

	.popup-remark-sel {
		display: flex;
		justify-content: space-between;
		font-size: 35rpx;
		color: #595959;
		padding: 10rpx 0 20rpx 0;
	}

	.gjy {
		display: flex;
		font-size: 35rpx;
		color: #595959;
		margin: 40rpx 0;
	}

	.popup-remark-text {
		font-size: 30rpx;
		color: #999999;
		border: 1rpx solid #e7e7e7;
		border-radius: 15rpx;
	}

	.JTxtArea {
		background-color: #fafafa;
		border-radius: 15rpx;
		width: 100%;
		// box-sizing: border-box;
		padding: 8rpx;
		min-height: 50px;
		line-height: 20px;
		color: #a8a8a8;
		position: relative;

		&.sm {
			min-height: 30rpx;
		}

		&.lg {
			min-height: 180rpx;
		}

		&:after {
			content: attr(data-maxnum);
			position: absolute;
			right: 0;
			bottom: 0;
			font-size: 12px;
			color: #a8a8a8;
		}
	}



	.popup-remark-item {
		font-size: 28rpx;
		padding: 10rpx 0;
	}

	.popup-remark-item-2 {
		color: #3b3b3b;
		margin: 30rpx 0;



	}

	.popup-remark-item-2 text {
		margin: 40rpx 0;
		padding: 8rpx 18rpx;
		border: 1rpx solid #e7e7e7;
		border-radius: 15rpx;

		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 260rpx; //用px单位亦可行

	}
</style>