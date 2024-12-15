<template>
	<view class="page">
		<!-- 顶部组件 -->
		<CustomNavbar title="订单详情" text=" " startColor="white" endColor="white" :backHandler="myCustomBackHandler" />
		<template v-if="orderInfo.id">
			<view class="item-1">
				<view class="order-expriedTime">
					<text>等待支付，剩余</text>
					<text class="timeRemaining" :left_time_int="left_time_int">
						{{ formattedTime(left_time_int) }}
					</text>
				</view>
				<view class="order-expriedTime-icon"><u-icon bold name="arrow-right"></u-icon></view>
			</view>


			<scroll-view scroll-y class="scroll-container">
				<view class="page-up">


					<view class="item-2">
						<u-notice-bar :text="noticeInfo" font-size="24rpx" bgColor="#fcf7f0"></u-notice-bar>
					</view>

					<view class="item-3">
						<view class="item-3-text">预计<text class="item-3-time">
								{{orderInfo.expectedDeliveryTime.split("T")[1].split(":")[0] + ":" +orderInfo.expectedDeliveryTime.split("T")[1].split(":")[1]}}
							</text>送达</view>
						<view class="mode">商家自配</view>
					</view>

					<view class="item-4">
						由商家提供配送服务
					</view>

					<view class="item-5">
						<view class="item-5-item" @tap="cancelOrder(orderId)">
							<view><u-icon name="close-circle" color="#000000" size="48"></u-icon></view>
							<view class="item-5-item-text1">取消订单</view>
						</view>
						<view class="item-5-item" @tap="goPay(JSON.stringify(orderInfo))">
							<view><u-icon name="rmb-circle" color="#ff840a" size="48"></u-icon></view>
							<view class="item-5-item-text2">立即支付</view>
						</view>
					</view>
				</view>


				<view class="page-centre">
					<view class="item-6">
						<view class="item-6-name">{{orderInfo.restaurantName}}</view>
						<view class="item-6-icon"><u-icon name="arrow-right" bold size="30" color="#000000"></u-icon>
						</view>
					</view>

					<view class="item-7" v-for="(item,index) in orderInfo.orderdetails" :key="index">
						<view class="item-7-img"><img :src="item.imageUrl" alt="" /></view>
						<view class="item-7-item">
							<view class="item-7-item-info">
								<view class="item-7-item-name">{{item.dishName}}</view>
								<view class="item-7-item-price">￥{{item.unitPrice}}</view>
							</view>
							<view class="item-7-item-quantity">x{{item.quantity}}</view>
						</view>
					</view>

					<view class="item-8">
						<view class="item-8-item">
							<view>打包费</view>
							<view>￥0</view>
						</view>
						<view class="item-8-item">
							<view>配送费</view>
							<view>￥3</view>
						</view>
						<view class="item-8-item">
							<view>放心吃(商家赠送)</view>
							<view>￥0</view>
						</view>
					</view>

					<view class="item-9">
						<view style="padding: 20rpx 20rpx 0 0;">已优惠 <text class="item-9-redprice">￥0.00 </text></view>
						<view>合计 ￥ <text class="item-9-text">{{orderInfo.totalPrice}}</text></view>

					</view>
				</view>


				<view class="page-bottom">
					<view class="item-10">
						配送信息
					</view>

					<view class="item-11">
						<view class="item-key">配送地址</view>
						<view class="item-11-value">
							<view class="item-11-value1">{{addressInfo.address}} {{addressInfo.addressDetail}}</view>
							<view class="item-11-value2">{{addressInfo.contactName}}先生 {{addressInfo.phoneNumber}}
							</view>
						</view>
					</view>

					<view class="item-12">
						<view class="item-key">配送服务</view>
						<view class="item-value">由 商家 提供配送服务</view>
					</view>

					<view class="item-13">
						<view class="item-key">订单编号</view>
						<view class="item-value">{{orderInfo.id}}</view>
					</view>

					<view class="item-14">
						<view class="item-key">下单时间</view>
						<view class="item-value">{{orderInfo.orderTime.replace("T"," ")}}</view>
					</view>

					<view class="item-15">
						<view class="item-key">备注</view>
						<view class="item-value">{{orderInfo.remark}}</view>
					</view>
				</view>

				<view class="servicePhone">
					客服电话：18704749630
				</view>

			</scroll-view>
		</template>
		<template v-else>
			<view style="display: flex; justify-content: center; color: red;">订单不存在!</view>
		</template>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	import {
		getOrderDetailById,
		deleteOrders,
		getAddressById
	} from '@/static/network/api.js'

	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				orderId: null,
				orderInfo: {},
				left_time_int: null,
				timer: null, // 定时器引用

				//滚动内容文字信息
				noticeInfo: "请在15分钟内完成支付,超时将自动取消",

				addressInfo: {}
			}
		},
		async onLoad(option) {
			this.orderId = option.orderId

			await this.fetchOrders()
			//获取地址信息
			this.getAddressInfo(this.orderInfo.addressId)
		},


		methods: {
			//跳转支付页面
			goPay(orderInf) {
				uni.showLoading({
					title: ''
				});
				setTimeout(() => {
					uni.hideLoading()
				}, 2000)
				setTimeout(() => {
					uni.navigateTo({
						url: `/pages/pay/pay?orderInfo=${orderInf}`
					})
				}, 2000)


			},
			//获取地址信息
			getAddressInfo(addressId) {
				getAddressById({
					addressId: addressId
				}).then(res => {
					this.addressInfo = res.data.data
				})
			},
			//自定义返回order页面
			myCustomBackHandler() {
				uni.switchTab({
					url: '/pages/order/order'
				})
			},
			//取消订单
			cancelOrder(id) {
				deleteOrders({
					orderId: id
				}).then(() => {
					uni.showToast({
						title: '订单已取消',
						icon: 'none',
					});
					this.refreshData(); // 取消订单后刷新数据
					uni.switchTab({
						url: '/pages/order/order'
					})
				}).catch(err => {
					console.error('Cancel order failed:', err)
				});
			},
			//刷新数据
			refreshData() {
				this.fetchOrders();
			},
			//获取订单数据
			async fetchOrders() {
				try {
					const res = await getOrderDetailById({
						orderId: this.orderId
					});
					if (res.data.data.code == 400) {
						uni.showToast({
							title: '订单不存在',
							icon: 'none',
						});
						return;
					}
					this.orderInfo = res.data.data.order;
					this.left_time_int = res.data.data.remainingSecondsUntilExpiration;
					// 订单有效时启动倒计时
					if (this.left_time_int > 0 && !this.timer) {
						this.startTimer();
					}
				} catch (error) {
					console.error('Fetch order details failed:', error);
					uni.showToast({
						title: '获取订单详情失败',
						icon: 'none',
					});
				}
			},
			//开始倒计时
			startTimer() {
				this.timer = setInterval(() => {
					if (this.left_time_int > 0) {
						this.left_time_int -= 1;
					} else {
						this.cancelOrder(this.orderInfo.id);
						this.stopTimer();
					}
				}, 1000);
			},
			//停止倒计时
			stopTimer() {
				clearInterval(this.timer);
				this.timer = null;
			},
		},
		computed: {
			formattedTime() {
				return (seconds) => {
					if (seconds <= 0) return '00:00';

					let minutes = Math.floor(seconds / 60);
					seconds %= 60;

					// 补零处理
					const padZero = (num) => num < 10 ? '0' + num : num;

					return `${padZero(minutes)}:${padZero(seconds)}`;
				};
			},
		},
		beforeDestroy() {
			this.stopTimer();
		},
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #f5f5f6;
		width: 100%;
		height: 100vh;
	}

	.scroll-container {
		height: calc(100vh - 270rpx);
		width: 100%;
	}

	.item-1 {
		background-color: #f1f1f2;
		display: flex;
		align-items: center;
		padding-bottom: 25rpx;

		padding: 20rpx 20rpx 10rpx 20rpx;
		margin: 0rpx 10rpx;
		background-color: #ffffff;
		border-radius: 25rpx;

		.order-expriedTime {
			font-size: 45rpx;

			.timeRemaining {
				color: #fd8400;
			}
		}

		.order-expriedTime-icon {
			margin-left: 10rpx;
		}
	}

	.page-up {
		padding: 0 20rpx;
		margin: 20rpx 10rpx;
		background-color: #ffffff;
		border-radius: 25rpx;



		.item-2 {}

		.item-3 {
			display: flex;
			justify-content: space-between;
			margin: 30rpx 0;

			.item-3-text {
				font-size: 45rpx;
				font-weight: bold;

				.item-3-time {
					color: #ff8401;
				}
			}

			.mode {
				height: 35rpx;
				font-size: 24rpx;
				border: 1rpx solid #d1d1d1;
				border-radius: 10rpx;
			}
		}

		.item-4 {
			font-size: 28rpx;
			color: #a5a5a5;
		}

		.item-5 {
			display: flex;
			justify-content: space-around;
			margin: 40rpx 0;

			.item-5-item {
				display: flex;
				flex-flow: column;
				align-items: center;

				.item-5-item-text1 {
					font-size: 24rpx;
					margin-top: 8rpx;
				}

				.item-5-item-text2 {
					font-size: 24rpx;
					color: #ff8204;
					margin-top: 8rpx;
				}
			}
		}
	}



	.page-centre {
		padding: 20rpx 20rpx;
		margin: 20rpx 10rpx;
		background-color: #ffffff;
		border-radius: 25rpx;

		.item-6 {
			display: flex;
			align-items: center;

			.item-6-name {
				font-size: 38rpx;
				font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
			}

			.item-6-icon {
				margin-left: 20rpx;
			}
		}

		.item-7 {
			display: flex;
			margin: 40rpx 0 20rpx 0;

			.item-7-img image {
				width: 110rpx;
				height: 110rpx;
				border-radius: 15rpx;
			}

			.item-7-item {
				flex: 1;
				margin-left: 15rpx;

				.item-7-item-info {
					display: flex;
					justify-content: space-between;

					.item-7-item-name {
						font-size: 35rpx;
						font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Times New Roman SC", sans-serif;
					}

					.item-7-item-price {
						font-size: 35rpx;
						font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Times New Roman SC", sans-serif;
						// font-weight: bold;
					}
				}

				.item-7-item-quantity {
					font-size: 24rpx;
					color: #a5a5a5;
					margin-top: 15rpx;
				}
			}
		}

		.item-8 {
			.item-8-item {
				margin-top: 25rpx;
				display: flex;
				justify-content: space-between;
				font-size: 35rpx;
				color: #4e4e4f;
				font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Times New Roman SC", sans-serif;
			}
		}

		.item-9 {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin: 40rpx 0;
			font-size: 30rpx;

			.item-9-redprice {
				color: #fb5144;
			}

			.item-9-text {
				font-size: 45rpx;
			}
		}
	}



	.page-bottom {
		padding: 20rpx 20rpx;
		margin: 20rpx 10rpx;
		background-color: #ffffff;
		border-radius: 25rpx;

		.item-10 {
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 40rpx;
		}

		.item-key {
			font-size: 35rpx;
			color: #8d8e8f;
		}

		.item-value {
			font-size: 35rpx;

		}

		.item-11 {
			display: flex;
			justify-content: space-between;
			padding: 10rpx 0;

			.item-11-value {
				font-size: 35rpx;
				display: flex;
				justify-content: flex-end;
				flex-flow: column;

				.item-11-value1 {
					display: flex;
					justify-content: flex-end;
				}
			}
		}

		.item-12 {
			display: flex;
			justify-content: space-between;
			padding: 10rpx 0;
		}

		.item-13 {
			display: flex;
			justify-content: space-between;
			padding: 10rpx 0;
		}

		.item-14 {
			display: flex;
			justify-content: space-between;
			padding: 10rpx 0;
		}

		.item-15 {
			display: flex;
			justify-content: space-between;
			padding: 10rpx 0;
		}
	}

	.servicePhone {
		text-align: center;
		font-size: 35rpx;
		color: #fc962f;
		padding: 70rpx 0;
		background-color: #f1f1f2;
	}
</style>