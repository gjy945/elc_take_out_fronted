<template>
	<view class="my">
		<!-- 头部 -->
		<view class="my-header" :style="{ background: `url(${userInfo.backImg})`, 'background-size': 'cover' }">
			<view class=" header-main">
				<view class="header-config">
					<u-icon name="setting-fill" size="45rpx" color="#ffffff" @tap="goSetting"></u-icon>
				</view>
				<view class="header-logo">
					<image class="logo-img" :src="userInfo.avatar" mode=""></image>
					<view class="logo-name">{{userInfo.nickname}}</view>
				</view>
			</view>
		</view>
		<!-- 我的订单 -->
		<view class="order">
			<view class="order-title" @tap="goOrder">
				<view>我的订单</view>
				<view style="display: flex; justify-content: space-between;">
					<view>全部订单</view>
					<view style="margin-top: 7rpx;"><u-icon name="arrow-right"></u-icon></view>
				</view>
			</view>
			<view class="order-list">
				<view class="order-item" v-for="(item,index) in orderImg" :key="index" @tap="go(index+1)">
					<image class="order-img" :src="item.img" mode=""></image>
					<view>{{item.text}}</view>
				</view>
			</view>
		</view>

		<!-- 列表-->
		<view class="my-content">

			<view class="my-content-item" v-for="(item,index) in ContentList" :key="index" @tap="goPage(index)">
				<u-icon :name="item.iconName"></u-icon><text class="my-content-item-text">{{item.text}}</text>
				<view class="">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>

		<view class="customer">客服电话:18704749630</view>
		<view class="service">服务时间:9:00-23:00</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 用户信息
				userInfo: [],

				//我的订单项
				orderImg: [{
						img: '/static/image/order/1.png',
						text: '待付款'
					},
					{
						img: '/static/image/order/2.png',
						text: '待发货'
					},
					{
						img: '/static/image/order/3.png',
						text: '待收货'
					},
					{
						img: '/static/image/order/4.png',
						text: '待评价'
					},
					{
						img: '/static/image/order/5.png',
						text: '退款'
					},
				],

				//我的页面列表项
				ContentList: [{
						iconName: 'rmb-circle',
						text: '饿了吃红包'
					},
					{
						iconName: 'coupon',
						text: '商家代金券'
					},
					{
						iconName: 'map',
						text: '收货地址'
					},
					{
						iconName: 'star',
						text: '我的收藏'
					},
					{
						iconName: 'question-circle',
						text: '常见问题'
					},
					{
						iconName: 'file-text',
						text: '饿了吃协议与说明'
					},
					{
						iconName: 'eye',
						text: '隐私管理'
					},
					{
						iconName: 'info-circle',
						text: '退出登录'
					}
				]
			}
		},
		onShow() {
			const user = uni.getStorageSync('user')
			console.log(user);
			this.userInfo = user
		},
		methods: {
			go(index) {
				uni.setStorageSync("tabIndex", index)
				uni.switchTab({
					url: `/pages/order/order`
				})
			},
			goSetting() {
				uni.navigateTo({
					url: '/pages/setting/setting'
				})
			},
			goOrder() {
				uni.switchTab({
					url: '/pages/order/order'
				})
			},
			goPage(index) {
				if (index == 2) {
					uni.navigateTo({
						url: '/pages/address/address'
					})
				}
				if (index == 7) {
					uni.removeStorageSync('token')
					uni.removeStorageSync('user')
					uni.navigateTo({
						url: '/pages/login/login',
						success() {
							uni.showToast({
								title: '退出登录成功',
								icon: 'none',
							});
						}
					})
				}
			},
		},
	}
</script>

<style scoped lang="scss">
	.my-header {
		width: 100%;
		height: 350rpx;
	}

	.header-main {
		position: relative;
		top: 120rpx;
	}

	.header-config {
		position: absolute;
		left: 40rpx;
		top: -35rpx;
	}

	.header-logo {
		position: absolute;
		left: 50%;
		margin-left: -60rpx;
		width: 220rpx; // 确保logo-name的宽度与logo-img相同
	}

	.logo-img {
		width: 120rpx;
		height: 120rpx;
		border: 2rpx solid #cccccc;
		border-radius: 50%;
		background-color: #ffffff;
	}

	.logo-name {
		color: #33333a;
		font-weight: bold;
		// text-align: center; // 文本水平居中

	}

	.order-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		font-family: 'Microsoft Yahei';
		font-size: 35rpx;
	}

	.order-list {
		padding: 20rpx;
		display: flex;
	}

	.order-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 35rpx;
		// font-family: '宋体';
	}

	.order-img {
		width: 50rpx;
		height: 50rpx;
	}

	.my-content {
		margin: 20rpx 0;
		padding: 0 20rpx;
	}

	.my-content-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 2px solid #f0f0f0;
		font-family: 'Microsoft Yahei';
		font-size: 32rpx;
	}

	.my-content-item:last-child {
		border-bottom: none;
	}

	.my-content-item-text {
		margin-left: 20rpx;
		margin-right: auto;
	}

	.customer {
		text-align: center;
		padding: 15rpx 60rpx;
		font-family: 'Microsoft Yahei';
		color: #ffcf66;
		font-size: 32rpx;
		border-top: 40rpx solid #f0f0f0;
	}

	.service {
		padding: 10rpx 60rpx;
		background-color: #f0f0f0;
		text-align: center;
		font-family: 'Microsoft Yahei';
		font-size: 24rpx;
		color: #c6c6c6;
	}
</style>