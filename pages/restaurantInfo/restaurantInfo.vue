<template>
	<view class="container">
		<view class="page">
			<u-toast ref="uToast" />
			<!-- 顶部组件 -->
			<!-- <CustomNavbar :title="restaurantInfo.name" text="诚挚缘分 成就梦想"/> -->
			<view class="image">
				<image :src="restaurantInfo.imageUrl" mode=""></image>
				<!-- 返回按钮 -->
				<view class="back-button" @click="Back">
					<u-icon name="arrow-left" color="white"></u-icon>
				</view>
			</view>
			<view class="top">
				<view class="title-container">
					<view class="title">{{restaurantInfo.name}}</view>
					<view class="content-container">
						<view><u-icon color="#ff8000" size="24rpx" name="star-fill"></u-icon></view>
						<view><text class="rating">{{restaurantInfo.rating}}</text></view>
						<view><text class="content">配送约45分钟</text></view>
					</view>
				</view>
				<view class="avator">
					<image :src="restaurantInfo.imageUrl" mode=""></image>
				</view>
			</view>
			<view style="background: white;">
				<img src="https://tse3-mm.cn.bing.net/th/id/OIP-C.2twk3Vp_8MYILDj6gcCeVAHaHa?w=165&h=180&c=7&r=0&o=5&dpr=1.7&pid=1.7"
					alt="" style="width: 45rpx;height: 45rpx;" />
				<text style="color: red; font-size: 30rpx; font-weight: bold; font-family: '宋体';">近期热卖
				</text>
			</view>
			<view class="swiper">
				<u-swiper :list="swiperList" previousMargin="200" nextMargin="200" circular autoplay="true" radius="15"
					bgColor="#ffffff"></u-swiper>
				<u-notice-bar font-size="24rpx" icon=" " :text="restaurantInfo.description"></u-notice-bar>
			</view>

			<view class="list">
				<view class="head-nav">
					<view :class="navIndex==1?'activite':''" @click="checkIndex(1)">点餐</view>
					<view :class="navIndex==2?'activite':''" @click="checkIndex(2)">评价</view>
					<view :class="navIndex==3?'activite':''" @click="checkIndex(3)">商家</view>
				</view>
				<!-- 导航栏 -->
				<!-- 内容切换 -->
				<!-- 左侧导航栏 -->
				<view class="order" v-if="navIndex==1">
					<view class="left-list">
						<view v-for="(item,index) in typeList" :key="index" :class="index===typeIndex?'current':''"
							@click="selectTab(index,restaurantId)">
							<view>{{item.name}}</view>
						</view>
					</view>
					<!-- 右侧列表 -->
					<view class="right-list">
						<view v-for="(dish,index) in dishs" :key="index" class="item">
							<view class="dishImgView">
								<image class="dishImg" :src="dish.imageUrl" mode=""></image>
							</view>
							<view style="width: 350rpx; margin-left: 25rpx;">
								<view class="" style="display: flex;justify-content: space-between;">
									<view class="title1">{{dish.name}}</view>
									<view>
										<span class="tag1" v-show="dish.isAvailable!=1">暂停售</span>
									</view>
								</view>
								<view class="desc">
									<span class="tag">{{dish.description}}</span>
								</view>
								<view style="display: flex; margin-top: 20rpx;">
									<view class="price"><text style="font-size: 30rpx;">￥</text>{{dish.price}}<text
											style="font-size: 24rpx; color: black;">/{{dish.unit}}</text></view>
									<view class="numberBox" v-show="dish.isAvailable==1">
										<u-number-box slot="right-icon" v-model="dish.quantity" step="1" :min="0"
											:showMinus="dish.quantity > 0" @change="addCart($event,dish)">
											<view slot="minus" class="minus">
												<u-icon name="minus" size="12"></u-icon>
											</view>
											<text slot="input" style="width: 50px;text-align: center;"
												v-show="dish.quantity>0" class="input">{{dish.quantity}}</text>
											<view slot="plus" class="plus">
												<u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
											</view>
										</u-number-box>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="cart">
						<image v-show="totalPrice>0" class="circle" src="../../static/image/logo.png" mode=""></image>
						<image v-show="totalPrice<=0" class="circle" src="../../static/image/logo1.png" mode=""></image>
						<!-- 占位 -->
						<view class="" style="color: #222426;">
							111
						</view>
						<view class="cartin">
							<view class="price1">
								<text class="unit">￥</text>
								<text>{{totalPrice.toFixed(2)}}</text>
								<view class="info1" v-show="totalPrice>0">
									请前往餐车完成下单
								</view>
								<view class="info1" v-show="totalPrice<=0">
									暂未选购商品
								</view>
							</view>
							<view class="info" v-show="totalPrice>0" @click="goToCart(restaurantId)">
								<text style="padding: 0 auto; padding-left: 30rpx;">前往餐车</text>
							</view>
						</view>
					</view>

				</view>

				<view class="appraise" v-if="navIndex==2">

					<view class="review-top">
						<view class="review-top-left">{{restaurantInfo.rating}}</view>
						<view class="review-top-right">
							<view class="review-top-right-top">商家评分</view>
							<view class="review-top-right-botton"><u-rate count="5" allowHalf
									v-model="restaurantInfo.rating" activeColor="#FFD21E" gutter="1" size="40rpx"
									readonly="true"></u-rate></view>
						</view>
					</view>

					<scroll-view scroll-y class="scroll-container">
						<view class="review" v-for="(review,index) in reviews" :key="index">
							<view class="review-list">
								<view class="review-list-left">
									<image class="review-list-left-img" :src="review.user.avatar" mode=""></image>
								</view>
								<view class="review-list-right">
									<view class="review-list-right-top">
										<view class="review-list-right-top-left">{{review.user.nickname}}</view>
										<view class="review-list-right-top-right">
											{{review.commenttime.replace("T"," ")}}</view>
									</view>
									<view class="review-list-right-bottom">
										<u-rate count="5" allowHalf v-model="review.rating" activeColor="#FFD21E"
											gutter="1rpx" size="30rpx" readonly="true"></u-rate>
									</view>
								</view>
							</view>
							<view class="review-list-main">
								{{review.commentcontent}}
							</view>
						</view>
					</scroll-view>


				</view>
				<view class="business" v-if="navIndex==3">
					<view class="infoItem">
						<view class="infoItem-icon"><u-icon name="map"></u-icon></view>
						<view>{{restaurantInfo.address}}</view>
					</view>
					<view class="infoItem">
						<view class="infoItem-icon"><u-icon name="phone"></u-icon></view>
						<view>联系电话: {{restaurantInfo.contactPhone}}</view>
					</view>
					<view class="infoItem">
						<view class="infoItem-icon"><u-icon name="clock"></u-icon></view>
						<view>营业时间: {{restaurantInfo.openingHours}}</view>
					</view>
					<view class="infoItem">
						<view class="infoItem-icon"><u-icon name="email"></u-icon></view>
						<view>邮箱: {{restaurantInfo.email}}</view>
					</view>
					<view class="infoItem">
						<view class="infoItem-icon"><u-icon name="attach"></u-icon></view>
						<view>官方网址: {{restaurantInfo.website}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '../../components/CustomNavbar/CustomNavbar.vue'

	import {
		getCategoryListByRestaurantId,
		getRestaurantInfoById,
		getDish,
		getSwiperListByRestaurantId,
		batchAddToCart,
		getReview
	} from '@/static/network/api.js'

	export default {
		components: {
			CustomNavbar
		},

		data() {
			return {
				restaurantId: 0, //当前商家id

				safeAreaInsetsTop: 0, // 初始化安全区距离顶部的高度
				restaurantInfo: [], //商家信息
				typeList: [], //菜品分类
				dishs: [], //菜品

				swiperList: [], //轮播图列表

				navIndex: 1, //水平选项卡索引
				typeIndex: 0, //餐品分类选项卡索引 

				totalPrice: 0, //加入购物车的总单价
				cartItem: [],

				reviews: [], //评论列表

			};
		},
		onLoad: function(option) { //页面传参(商家id)
			this.restaurantId = option.id
			this.getSwiper(option.id)
			this.getCategoryList(option.id)
			this.getRestaurantInfo(option.id)

			this.getReviews(option.id)

			//开始调用一次,初始显示第一个分类菜品
			this.getDishs(option.id, 0)
		},
		async mounted() {
			await this.getSystemInfo(); // 在组件挂载后获取系统信息

		},
		computed: {

		},
		methods: {
			//获取该商家的所有评论
			getReviews(restaurantId) {
				getReview({
					restaurantId: restaurantId
				}).then(res => {
					console.log(res.data.data);
					this.reviews = res.data.data
					console.log(this.reviews);
				})
			},

			//添加购物车,跳转购物车
			goToCart(restaurantId) {
				// 过滤出被选中的菜品（即quantity大于0的）
				const selectedDishes = this.dishs
					.filter(dish => dish.quantity > 0)
					.map(dish => {
						// 过滤保留id,restaurantId,quantity字段
						const {
							categoryId,
							name,
							unit,
							description,
							imageUrl,
							isAvailable,
							...keptFields
						} = dish;
						return keptFields;
					});
				console.log(selectedDishes);
				if (!selectedDishes) {
					uni.showToast({
						title: '失败',
						content: '请先选择商品',
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				batchAddToCart(selectedDishes).then(() => {
					uni.navigateTo({
						url: `/pages/cart/cart?restaurantId=${restaurantId}`,
					})
				}).catch(() => {
					uni.showToast({
						title: '失败',
						content: '批量添加购物车失败，请重试',
						duration: 2000,
						icon: 'none'
					});
				})
				// 清空当前页面的购物车数据，根据业务需求决定是否需要这一步
				this.dishs.forEach(dish => {
					dish.quantity = 0;
				});
				this.totalPrice = 0
			},

			addCart(event, dish) {
				const newValue = event.value; // 从事件回调参数中直接获取新值
				const oldValue = dish.quantity;

				// 更新dish的quantity
				dish.quantity = newValue;

				if (oldValue > newValue) {
					// 数量减少
					this.totalPrice -= (oldValue - newValue) * dish.price;
				} else {
					// 数量增加
					this.totalPrice += (newValue - oldValue) * dish.price;
				}

				// 将总价存入localStorage
				uni.setStorageSync('totalPrice', JSON.stringify(this.totalPrice))

			},
			checkIndex(index) { //选项卡
				this.navIndex = index;
			},
			async getSystemInfo() {
				const systemInfo = uni.getSystemInfoSync();
				this.safeAreaInsetsTop = systemInfo.safeAreaInsets.top;
			},
			Back() {
				//uni.navigateBack()//默认delta:1
				uni.navigateBack({
					delta: 1, //返回层数，2则上上页
				})
			},
			// 获取商家信息
			getRestaurantInfo(id) {
				getRestaurantInfoById({
					restaurantId: id
				}).then(res => {
					if (res.data.code == 200) {
						console.log(res.data.data)
						this.restaurantInfo = res.data.data
					} else {
						this.$refs.uToast.show({
							type: 'error',
							icon: false,
							message: '未获取到商家信息~',
						})
					}
				}).catch(() => {
					this.$refs.uToast.show({
						type: 'error',
						icon: false,
						message: '未知错误~',
					})
				})
			},
			//获取商家菜品分类列表
			getCategoryList(id) {
				getCategoryListByRestaurantId({
					restaurantId: id
				}).then(res => {
					console.log(res.data.data)
					this.typeList = res.data.data
				}).catch(err => {
					console.log(err)
				})
			},
			//获取菜品
			getDishs(restaurantId, categoryId) {
				getDish(restaurantId, categoryId + 1).then(res => {
					if (res.data.code == 200) {
						this.dishs = res.data.data
					} else {
						this.$refs.uToast.show({
							type: 'error',
							icon: false,
							message: '未获取到菜品信息~',
						})
					}
				}).catch(() => {
					this.$refs.uToast.show({
						type: 'error',
						icon: false,
						message: '未获取到菜品信息~',
					})
				})
			},
			//根据商家id查询轮播图列表
			getSwiper(restaurantId) {
				getSwiperListByRestaurantId({
					restaurantId: restaurantId
				}).then(res => {
					this.swiperList = [];
					res.data.data.forEach(item => {
						this.swiperList.push(item.imageUrl);
					});
					console.log(this.swiperList)
				})
			},
			//切换不同的分类
			selectTab(categoryId, restaurantId) {
				this.typeIndex = categoryId
				this.getDishs(restaurantId, categoryId)
			},

		}
	}
</script>

<style>
	.container {
		width: 100%;
		margin: 0 auto;
		/* text-align: center; */
	}

	.page {
		width: 100%;
		display: flex;
		flex-direction: column;
		/* 设置flex布局方向为垂直 */
		height: 100vh;
		/* 设置页面高度为视口高度 */
		overflow: hidden;
	}

	.image {
		width: 100%;
		/* 设置image区域的高度 */
		height: 11%;
		background-size: cover;
		background-position: center;
		object-fit: cover;
	}

	.back-button {
		position: absolute;
		/* 绝对定位 */
		top: 6%;
		/* 根据需要调整距离顶部的距离 */
		/* transform: translateY(10%); */
		left: 3%;
		/* 根据需要调整距离左侧的距离 */
		z-index: 10;
		/* 确保按钮在图片之上 */
	}

	.top {
		/* 设置top区域的高度 */
		height: 10%;
		background: #fff;
		border-radius: 20rpx 20rpx 0 0;
		/* 弹性盒模型布局 */
		display: flex;
		/* 设置主轴的对其方式 X */
		justify-content: space-between;
		padding: 15rpx 30rpx;
		/* box-sizing: border-box; */
		/* 设置交叉轴 Y */
		/* align-content: center; */
	}

	/* .top image {
		
	} */
	.avator image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 20rpx;
		margin-top: -25rpx;
	}

	.swiper {
		height: 20%;
		background: white;
		padding: 20rpx;
	}

	.list {
		height: 70%;
		background: white;
	}

	.title {
		/* width: 100rpx; */
		font-size: 42rpx;
		font-weight: 900;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "宋体", sans-serif;
	}

	.rating {
		color: #ff8000;
		font-size: 26rpx;
		margin-top: 8rpx;
	}

	.content {
		font-size: 24rpx;
		color: #858687;
		margin-top: 8rpx;
		margin-left: 16rpx;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
	}

	.title-container {
		/* display: flex; */
		/* align-items: center; */
		/* 垂直居中 */
	}

	.content-container {
		display: flex;
		align-items: center;
		/* 垂直居中 */
		/* margin-top: 20rpx; */
		/* margin-left: -535rpx; */
		/* 根据需要调整间距 */
	}


	.head-nav {
		width: 55%;
		margin: 10rpx auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 25rpx;
		font-size: 35rpx;
		font-family: '宋体';
	}

	.activite {
		font-weight: bold;
		border-bottom: 6rpx solid rgb(254, 211, 6);
	}

	.head-nav>view {
		padding-bottom: 10rpx;
	}

	.order {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: space-between;

	}

	.order .left-list {
		width: 150rpx;
		height: 100%;
		background: #f5f5f5;
		line-height: 100%;
		align-self: center;
	}

	.order .right-list {
		width: 575rpx;
		height: 100%;
		background: white;
		overflow: auto;
	}

	.left-list>view {
		background: #f5f5f5;
		height: 130rpx;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.left-list view {
		text-align: center;
		padding-top: 10rpx;
		font-size: 30rpx;
		font-family: '宋体';
	}

	.current {
		background: #fff !important;
		color: rgb(255, 190, 123);
	}
</style>

<style>
	.right-list>view {
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
		margin-bottom: 25rpx;
	}

	.right-list>view:last-child {
		margin-bottom: 160rpx;
	}

	.order .right-list>view:last-child {
		/* 你想要应用的样式 */
		padding-bottom: 250rpx;
	}

	.dishImgView {
		width: 30%;
	}

	.dishImg {
		width: 180rpx;
		height: 180rpx;
	}

	.title1 {
		font-size: 35rpx;
		font-weight: bold;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "宋体", sans-serif;
	}

	.number {
		font-size: 25rpx;
		color: #6f6f70;
		margin-top: 8rpx;
		margin-left: 16rpx;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
	}

	.price {
		font-size: 35rpx;
		color: #ff572e;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
		width: 150rpx;
	}

	.desc {
		/* margin-top: -12rpx; */
	}

	.tag {
		background-color: #fff5e2;
		color: #ffa84e;
		padding: 6rpx 10rpx;
		border-radius: 4rpx;
		margin-right: 8rpx;
		margin-top: 15rpx;
		margin-bottom: 4rpx;
		font-size: 21rpx;
		font-weight: bold;
	}

	.tag1 {
		background-color: #ff473d;
		color: white;
		padding: 6rpx 10rpx;
		border-radius: 10rpx;
		margin-right: 8rpx;
		margin-top: 15rpx;
		margin-bottom: 4rpx;
		font-size: 21rpx;
		font-weight: bold;
	}

	.numberBox {
		width: 35rpx;
		height: 35rpx;
		padding-left: 65rpx;

	}

	.minus {
		width: 45rpx;
		height: 35rpx;
		border-width: 1px;
		border: 1rpx solid #ece751;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input {
		font-size: 30rpx;
		padding: 0 10px;
		font-weight: bold;
	}

	.plus {
		width: 45rpx;
		height: 35rpx;
		background-color: #fecc32;
		border-radius: 20rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
	}

	.cart {
		width: 93%;
		height: 110rpx;
		background-color: #222426;
		position: fixed;
		margin-bottom: 20rpx;
		margin-left: 30rpx;
		bottom: 0;
		z-index: 1;
		border-radius: 50rpx;
		display: flex;
	}

	.cart .circle {
		width: 200rpx;
		height: 200rpx;
		/* border-radius: 50%; */
		z-index: 2;
		left: 20rpx;
		top: -35rpx;
		margin-left: -20rpx;
		margin-top: -30rpx;
		position: relative;
	}


	.cart .cartin {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		margin-top: -50rpx;
	}

	.price1 {
		width: 70rpx;
		height: 80rpx;
		color: #fff;
		margin-left: -70rpx;
		margin-top: 50rpx;
	}

	.price1 .unit {
		font-size: 25rpx;
	}

	.info {
		margin-left: 268rpx;
		margin-top: 51rpx;
		width: 200rpx;
		color: #222426;
		font-size: 30rpx;
		border-radius: 0 50rpx 50rpx 0;
		background-color: #ffce33;
		line-height: 110rpx;
		height: 110rpx;
	}

	.info1 {
		width: 220rpx;
		font-size: 24rpx;
		color: #858687;
		/* margin-top: 8rpx; */
		margin-left: 16rpx;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
	}
</style>

<style lang="scss" scoped>
	.infoItem {
		height: 60rpx;
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		font-size: 30rpx;
		color: #333333;
		border-bottom: 2rpx solid #efefef;
	}


	.infoItem-icon {
		padding-right: 30rpx;
	}

	.review-top {
		padding: 30rpx 40rpx;
		display: flex;
		border-bottom: 15rpx solid #f4f4f4;

		.review-top-left {
			font-size: 60rpx;
			color: #ff8000;
			padding-top: 8rpx;
		}

		.review-top-right {
			flex: 1;
			margin-left: 20rpx;

			.review-top-right-top {
				font-size: 27rpx;
				color: #858687;
				padding-top: -20rpx;
			}

			.review-top-right-botton {
				margin-top: 10rpx;
				margin-left: -8rpx;
			}
		}
	}

	.scroll-container {
		height: calc(100vh - 850rpx);
		width: 100%;
	}

	.review {
		padding: 20rpx 40rpx;

		.review-list {
			display: flex;

			// justify-content: space-between;
			.review-list-left {
				.review-list-left-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}

			}

			.review-list-right {
				flex: 1;
				margin-left: 15rpx;

				.review-list-right-top {
					display: flex;
					justify-content: space-between;

					.review-list-right-top-left {
						font-size: 30rpx;
					}

					.review-list-right-top-right {
						font-size: 24rpx;
						color: #858687;
					}
				}

				.review-list-right-bottom {
					margin-top: 10rpx;
					margin-left: -3rpx;
				}
			}
		}
	}

	.review-list-main {
		margin-top: 10rpx;
		font-size: 30rpx;
		color: #2f2f2f;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f4f4f4;
	}
</style>