<template>
	<view class="my-setting">
		<!-- 顶部组件 -->
		<CustomNavbar title="设置" text=" " />
		
		<view class="setting-item" @tap="goAddress">
			<view>地址管理</view>
			<view><u-icon name="arrow-right"></u-icon></view>
		</view>
		
		<view class="my-logout" @tap="logout">退出登录</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				
			}
		},
		methods: {
			goAddress(){
				uni.navigateTo({
					url:'/pages/address/address'
				})
			},
			logout(){
				uni.removeStorageSync('token')
				uni.removeStorageSync('user')
				uni.navigateTo({
					url:'/pages/login/login',
					success() {
						uni.showToast({
							title: '退出登录成功',
							icon: 'none',
						});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.setting-item{
		display: flex;
		padding: 20rpx;
		justify-content: space-between;
		border-bottom: 2rpx solid #cccccc;
	}
	.my-logout{
		background-color: #ffcc33;
		width: 100%;
		line-height: 80rpx;
		color: #000000;
		text-align: center;
	}
</style>
