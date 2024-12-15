<template>
	<view>
		<CustomNavbar title="登录" text="饿了吃" />
		<view class="viewport">
			<view class="element"><u-loading-icon duration="2000" size="50rpx" :show="isLoading"></u-loading-icon>
			</view>

			<view class="logo">
				<!-- https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png -->
				<image src="@/static/image/logo.png"></image>
			</view>
			<view class="login">
				<!-- 小程序端授权登录 -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="button-privacy-wrap">
					<button class="button phone" v-if="!isAgreePrivacy" style="background-color: #999;">
						<text class="icon icon-phone"></text>
						请先阅读并勾选协议
					</button>
					<button class="button phone" v-else @click="login()">
						<text class="icon icon-phone"></text>
						微信一键登录
					</button>
				</view>
				<!-- #endif -->
				<view class="tips">
					<label class="label" @tap="togglePrivacy">
						<checkbox class="checkbox" v-model="isAgreePrivacy" />
						<text>登录/注册即视为你同意饿了吃</text>
					</label>

					<navigator class="link" hover-class="none" url="./protocal">《服务条款》</navigator>
					和
					<text class="link" @tap="onOpenPrivacyContract">《隐私协议》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	import {
		loginByWechat
	} from '@/static/network/login.js'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				isRead: false,
				isAgreePrivacy: false,

				//登录加载动画
				isLoading: false,
			}
		},
		methods: {
			login() {
				let that = this
				//显示加载动画
				this.isLoading = true,

					uni.getUserProfile({ //获取用户信息
						desc: '用于登录',
						success(user) {
							console.log(user);
							uni.login({ //获取code码 来判断这个用户在这个小程序有没有登录过
								success(lres) {
									console.log(lres);
									loginByWechat({
										code: lres.code
									}).then(res => {
										if (res.data.code !== 200) {
											console.log(res.data.code);
											uni.showToast({
												icon: "none",
												title: "登录失败"
											})
										} else {
											//存储用户数据到storage
											uni.setStorageSync("user", res.data.data.user)
											uni.setStorageSync("token", res.data.data.token)
											//跳转页面
											uni.switchTab({
												url: '/pages/home/home',
												success() {
													uni.showToast({
														icon: "none",
														title: "登录成功"
													})
													//停止加载动画
													that.isLoading = false
												}
											})
										}
									}).catch(() => {
										uni.showToast({
											icon: "none",
											title: "未知错误"
										})
										that.isLoading = false
									})
								}
							})
						}
					})
			},
			togglePrivacy() {
				this.isAgreePrivacy = !this.isAgreePrivacy; // 切换选中状态
				console.log(this.isAgreePrivacy);
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.element {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 9999;
	}

	.viewport {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 20rpx 40rpx;
	}

	.logo {
		flex: 1;
		text-align: center;

		image {
			width: 220rpx;
			height: 220rpx;
			margin-top: 15vh;
		}
	}

	.login {
		display: flex;
		flex-direction: column;
		height: 60vh;
		padding: 40rpx 20rpx 20rpx;

		.input {
			width: 100%;
			height: 80rpx;
			font-size: 28rpx;
			border-radius: 72rpx;
			border: 1px solid #ddd;
			padding-left: 30rpx;
			margin-bottom: 20rpx;
		}

		.button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 80rpx;
			font-size: 28rpx;
			border-radius: 72rpx;
			color: #fff;

			.icon {
				font-size: 40rpx;
				margin-right: 6rpx;
			}
		}

		.phone {
			background-color: #ffc439;
		}

		.wechat {
			background-color: #06c05f;
		}

		.extra {
			flex: 1;
			padding: 70rpx 70rpx 0;

			.caption {
				width: 440rpx;
				line-height: 1;
				border-top: 1rpx solid #ddd;
				font-size: 26rpx;
				color: #999;
				position: relative;

				text {
					transform: translate(-40%);
					background-color: #fff;
					position: absolute;
					top: -12rpx;
					left: 50%;
				}
			}

			.options {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 70rpx;

				button {
					padding: 0;
					background-color: transparent;

					&::after {
						border: none;
					}
				}
			}

			.icon {
				font-size: 24rpx;
				color: #444;
				display: flex;
				flex-direction: column;
				align-items: center;

				&::before {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 6rpx;
					font-size: 40rpx;
					border: 1rpx solid #444;
					border-radius: 50%;
				}
			}

			.icon-weixin::before {
				border-color: #06c05f;
				color: #06c05f;
			}
		}
	}

	@keyframes animate__shakeY {
		0% {
			transform: translate(0, 0);
		}

		50% {
			transform: translate(0, -5rpx);
		}

		100% {
			transform: translate(0, 0);
		}
	}

	.animate__shakeY {
		animation: animate__shakeY 0.2s ease-in-out 3;
	}

	.button-privacy-wrap {
		position: relative;

		.button-opacity {
			opacity: 0;
			position: absolute;
			z-index: 1;
		}
	}

	.tips {
		position: absolute;
		bottom: 80rpx;
		left: 20rpx;
		right: 20rpx;
		font-size: 22rpx;
		color: #999;
		text-align: center;

		.radio {
			transform: scale(0.6);
			margin-right: -4rpx;
			margin-top: -4rpx;
			vertical-align: middle;
		}

		.link {
			display: inline;
			color: #28bb9c;
		}
	}

	.checkbox {
		/* 设置为圆形 */
		// border-radius: 50%;
		/* 设置大小 */
		width: 20px;
		height: 20px;
		/* 设置边框样式 */
		// border: 1px solid #ccc;
		/* 设置选中时的背景颜色 */
		background-color: #fff;
		/* 设置选中时的边框颜色 */
		// border-color: #28bb9c;
		/* 设置选中时的缩放效果 */
		transform: scale(0.5);
		/* 设置选中时的边距，以调整位置 */
		margin-right: 5rpx;
		margin-top: -11rpx;
		/* 设置垂直居中 */
		vertical-align: middle;
	}

	.checkbox.checked {
		/* 选中时的样式 */
		border-radius: 50%;
		background-color: #28bb9c;
		border-color: #28bb9c;
	}
</style>