<template>
	<view>
		<CustomNavbar title="支付" text=" " startColor="#ededed" endColor="#ededed" />
		<view class="page">
			<view class="title-top">
				饿了吃订单-{{orderInfo.id}}
			</view>

			<view class="price">
				￥{{orderInfo.totalPrice}}
			</view>

			<view class="payee">
				<view class="payee-left">收款方</view>
				<view class="payee-right">饿了吃平台商户</view>
			</view>

			<view class="paybtn" @tap="pay(JSON.stringify(orderInfo))">
				立即支付
			</view>

			<view class="bottom-text">
				支付安全由冯晨轩承保
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	import {
		updateOrderStatus
	} from '@/static/network/api.js'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				orderInfo: {}
			}
		},
		onLoad(option) {
			this.orderInfo = JSON.parse(option.orderInfo)
			console.log(this.orderInfo);
		},
		methods: {
			pay(orderInfo) {
				uni.showLoading({
					title: '支付中'
				});
				setTimeout(() => {
					uni.hideLoading()
				}, 2000)
				let data = {
					orderId: this.orderInfo.id,
					status: '待发货'
				}
				updateOrderStatus(data).then((res) => {
					console.log(res);
					setTimeout(() => {
						uni.showToast({
							title: '支付成功',
							icon: 'success',
							duration: 1500
						})
					}, 2000)
					setTimeout(() => {
						uni.switchTab({
							url:'/pages/order/order'
						})
					}, 2000)
				}).catch(() => {
					uni.showToast({
						title: '支付失败',
						icon: 'fail',
						duration: 1500
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
		padding: 20rpx 0;

		.title-top {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			font-weight: bold;
		}

		.price {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 60rpx;
			font-weight: bold;
		}

		.payee {
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			margin: 40rpx 0;
			padding: 20rpx 20rpx;
			border-top: 1rpx solid #e5e5e5;
			border-bottom: 1rpx solid #e5e5e5;
			background-color: #ffffff;

			.payee-left {
				color: #a0a0a0;
			}

			.payee-right {}
		}

		.paybtn {
			display: flex;
			justify-content: center;
			padding: 20rpx 0;
			border-radius: 8rpx;
			background-color: #08c163;
			color: #ffffff;
			margin: 0 auto;
			width: 95%;
		}

		.bottom-text {
			position: absolute;
			font-size: 24rpx;
			color: #a0a0a0;
			bottom: 0;
			left: 270rpx;
			padding-bottom: 30rpx;
		}
	}
</style>