<template>
	<view class="navbar" :style="[baseStyles, gradientStyles]">
		<view class="logo">
			<u-icon name="arrow-left" @click="handleBack"></u-icon>
			<!-- <image class="logo-image" src="@/static/images/logo.jpg"></image> -->
			<text class="logo-title">{{title}}</text>
			<text class="logo-text">{{text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["title", "text", "startColor", "endColor", "backHandler"],
		data() {
			return {
				safeAreaInsetsTop: 0, // 初始化安全区距离顶部的高度
			};
		},
		mounted() {
			this.getSystemInfo(); // 在组件挂载后获取系统信息
		},
		methods: {
			async getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				this.safeAreaInsetsTop = systemInfo.safeAreaInsets.top;
			},
			defaultBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			handleBack() {
				if (typeof this.backHandler === 'function') {
					this.backHandler();
				} else {
					this.defaultBack();
				}
			},
		},
		computed: {
			baseStyles() {
				return {
					paddingTop: this.safeAreaInsetsTop + 'px'
				};
			},
			gradientStyles() {
				if (this.startColor && this.endColor) {
					return {
						'background-image': `linear-gradient(${this.startColor}, ${this.endColor})`
					};
				}
				return {}; // 返回空对象以避免覆盖其他样式
			}
		},
	};
</script>

<style lang="scss">
	.navbar {
		background-image: linear-gradient(#ffcc33, #fff);
		background-size: cover;
		display: flex;

		.logo {
			display: flex;
			align-items: center;
			height: 86rpx;
			padding: 20rpx;

			.logo-image {
				width: 40rpx;
				height: 40rpx;
			}

			.logo-title {
				font-size: 32rpx;
				color: #565656;
				font-weight: bold;
				margin-left: 20rpx;
			}

			.logo-text {
				flex: 1;
				line-height: 28rpx;
				color: #565656;
				margin: 2rpx 160rpx 0 20rpx;
				padding-left: 20rpx;
				border-left: 1rpx solid #8d8d8d;
				font-weight: bold;
				font-size: 29rpx;
			}
		}
	}
</style>