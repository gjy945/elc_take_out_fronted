<template>
	<view class="container">
		<view class="" style="background-color: #ffcc33;">
			<view :style="{ height: statusBarHeight + 'rpx'}"></view>
		</view>
		<view class="">
			<u-toast ref="uToast" />
		</view>

		<!-- 头部 -->
		<view class="header" @tap="goAddress">
			<u-icon name="map"></u-icon>
			<view class="text">天津渤海职业技术学院</view>
			<u-icon name="arrow-right"></u-icon>
		</view>
		<!-- 主要内容 -->
		<view class="search-wrapper" @tap="goSearch">
			<u-search v-model="value1" :show-action="false" :input-style="inputStyle" bgColor="#ffffff"
				searchIconSize="35rpx" height="60rpx" placeholder="输入商家或者商品名称"></u-search>
		</view>
		<view class="" style="height: 40rpx; margin-top: -50rpx; margin-bottom: 40rpx;">
			<uni-section title="文字滚动" subTitle="使用 scrollable 属性使通告滚动,此时 single 属性将失效,始终单行显示" type="line">
				<uni-notice-bar show-icon scrollable font-size="11"
					text="限时抢购！今日推荐：满100减20，仅限今日！快来抢购你最爱的美食，享受美味的同时，还能省下一笔！" />
			</uni-section>
		</view>

		<view class="">
			<scroll-view scroll-y="true" class="scroll-view-custom" :style="{height: scrollViewHeight + 'px'}"
				:refresher-enabled="freshing" :refresher-triggered="triggered" :refresher-threshold="100"
				refresher-background="#f1f1f1" @refresherpulling="onPulling" @refresherrefresh="onRefresh"
				@refresherrestore="onRestore" @refresherabort="onAbort" @scrolltolower="pullUp">
				<z-swiper v-model="swiperImageList" :options="options">
					<z-swiper-item v-for="(item,index) in swiperImageList" :key="index">
						<image class="swiperImage" :src="item" mode="aspectFill">
						</image>
					</z-swiper-item>
				</z-swiper>
				<view v-if="restaurants.length>0">
					<view class="restaurant-item" v-for="item in restaurants" :key="item.id"
						@click.stop="goToMerchantInfor(item.id)">
						<img :src="item.imageUrl" :alt="item.name" class="restaurant-img" />
						<view class="restaurant-details">
							<view class="restaurant-header">
								<view class="title">
									{{ item.name }}
								</view>
								<view class="rating">
									<u-rate count="5" allowHalf v-model="item.rating" activeColor="#FFD21E" gutter="1"
										size="25rpx" eadonly></u-rate>
								</view>
							</view>
							<view class="meta1">
								<view>
									<span class="ratingInfo">{{item.rating}}分</span>
									<span>月售1000+</span>
									<span style="margin-left: 15rpx;">人均￥20</span>
								</view>


							</view>
							<view class="meta2">
								<span>起送&nbsp;￥<span style="margin-left: -9rpx;">12</span></span>
								<span style="margin-left: 15rpx;">配送<span style="margin-left: 10rpx;">约</span><span
										style="margin-left: -5rpx; margin-right: -5rpx;">￥</span>{{item.deliveryFees}}</span>
							</view>
							<view class="tags">
								<span class="tag">{{ item.description }}</span>
							</view>
						</view>
					</view>
				</view>
				<view class="notexist" v-else>暂无商家数据</view>

				<uni-load-more :status="status" :content-text="contentText" />
			</scroll-view>
		</view>

	</view>
</template>

<script>
	import {
		getSwiperList,
		getRestaurantPageList
	} from '@/static/network/api.js'
	export default {
		data() {
			return {
				inputStyle: {
					fontSize: '29rpx', //修改搜索框里面的文字大小
				},

				// 轮播图配置
				options: {
					loop: true,
					autoplay: true,
					effect: 'panorama',
					slidesPerView: 1.5,
					centeredSlides: true,
					panorama: {
						depth: 150,
						rotate: 45,
					},
				},
				// 轮播图数据
				swiperImageList: [],

				restaurants: [], // 存储商家数据
				pageNum: 1, // 当前页码
				pageSize: 10, // 每页数量


				freshing: true, //商家列表下拉刷新默认为true 开启
				onLoad() {
					this._freshing = false; //用于防止在下拉刷新过程中重复触发刷新逻辑 为true时阻止下拉刷新
				},

				triggered: false, //设置当前下拉刷新的状态
				isPullingUp: false, // 标志变量，用于控制触底加载的防抖动


				status: '', //触底加载状态
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中~',
					contentnomore: '没有更多了~'
				},


				windowHeight: 0, // 设备窗口高度
				nonScrollElementsHeight: 0, // 非滚动元素总高度
				scrollViewHeight: 0, // 计算后的scroll-view高度

				statusBarHeight: 0,

			}
		},
		onShow() {
			this.loadData()
		},
		onLoad() {
			this.getSwiperImageList();
			this.loadData();
		},
		mounted() {
			//获取手机型号
			const info = uni.getSystemInfoSync()
			//设置状态栏高度
			this.statusBarHeight = info.statusBarHeight
			console.log(info.statusBarHeight)

			//设置scrollview的适应
			this.calculateScrollViewHeight();
			// 监听窗口大小变化，重新计算高度
			uni.onWindowResize(this.calculateScrollViewHeight);
		},
		beforeDestroy() {
			uni.offWindowResize(this.calculateScrollViewHeight);
		},
		methods: {
			calculateScrollViewHeight() {
				const systemInfo = uni.getSystemInfoSync();
				this.windowHeight = systemInfo.windowHeight;
				console.log(systemInfo.model)
				// 假设已知头部高度为80px，底部导航高度为50px，根据实际情况调整
				// 正则表达式匹配iPhone后面跟随的数字部分
				const match = systemInfo.model.match(/iPhone (\d+|X)/i);
				if (match || systemInfo.model.includes('X')) {
					const iphoneNumber = parseInt(match[1], 10); // 解析匹配到的数字
					console.log(iphoneNumber)
					if (systemInfo.model.substring(7, 9) >= 14 || systemInfo.model.includes("Pro Max")) {
						console.log("数子" + systemInfo.model.substring(7, 9))
						this.nonScrollElementsHeight = 185
					}
					if (systemInfo.model == "iPhone 12/13 (Pro)") {
						this.nonScrollElementsHeight = 162
					}
					if (systemInfo.model.includes("mini") || systemInfo.model.includes('X')) {
						this.nonScrollElementsHeight = 160
					}
					if (systemInfo.model.includes("XR") || systemInfo.model.includes('XS')) {
						this.nonScrollElementsHeight = 175
					}
					if (systemInfo.model == "iPhone 6/7/8 Plus") {
						this.nonScrollElementsHeight = 160;
					}
					if (systemInfo.model == "iPhone 6/7/8") {
						this.nonScrollElementsHeight = 145
					}
					if (systemInfo.model == "iPhone 5") {
						this.nonScrollElementsHeight = 125
					}
				}
				// 计算scroll-view高度
				this.scrollViewHeight = this.windowHeight - this.nonScrollElementsHeight;
			},
			getSwiperImageList() {
				getSwiperList().then(res => {
					if (res.data.code == 200) {
						this.swiperImageList = [];
						res.data.data.swiperImageList.forEach(item => {
							this.swiperImageList.push(item.imageUrl);
						});
					} else {
						this.swiperImageList = null;
					}
				})
			},
			loadData() {
				getRestaurantPageList({
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}).then(res => {
					if (res.data.code === 200) {
						// 判断是否还有更多数据
						if (res.data.data.records.length <= 0) {
							this.status = 'noMore'; // 没有更多数据
							return
						} else {
							this.status = 'loading'; // 还有更多数据,加载动画
							this.restaurants = res.data.data.records;
							this.value = res.data.data.records.rating
						}
					} else {
						this.$refs.uToast.show({
							type: 'error',
							icon:false,
							message: '出错了~',
						});
					}
				})
			},
			goToMerchantInfor(id) {
				// 导航至商家详情逻辑
				// uni.showToast({
				// 	title: String(id)
				// });
				//api路由跳转
				//官方文档
				uni.navigateTo({
					url: '../../pages/restaurantInfo/restaurantInfo?id=' + id,
					success: res => {
						console.log(res);
					},
					fail: err => {
						console.error('页面跳转失败:', err);
						this.$refs.uToast.show({
							type: 'error',
							message: '出错了~',
						})
					},
				});
			},
			goAddress(){
				uni.navigateTo({
					url:'/pages/address/address'
				})
			},
			goSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			onPulling(e) {
				console.log(e, '11')
				if (e.detail.deltaY < 0) {
					return
				}
				this.triggered = true
			},

			onRefresh() {
				if (this._freshing) return;
				this._freshing = true;
				this.pageNum = 1; // 重置页码
				this.loadData()
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 500)
			},

			onRestore() {
				console.log("onRestore");
			},
			onAbort() {
				console.log("onAbort");
			},
			pullUp() {
				if (this.isPullingUp) return;
				if (this.status == 'noMore') return;
				this.isPullingUp = true;
				// 使用setTimeout实现防抖动
				setTimeout(() => {
					// 增加页码
					this.pageNum++;
					this.loadData();
					this.isPullingUp = false;
				}, 1000); // 设置一个延迟时间，例如300毫秒
			},
		},
	}
</script>
<!-- scoped表示css样式只在当前页面生效 -->
<style lang="less" scoped>
	.swiper-item {
		height: 100%;
	}

	.swiper-item image {
		width: 100%;
		height: 100%;
	}

	.header {
		background-image: linear-gradient(rgb(255, 204, 51), #fff);
		display: flex;
		// justify-content: space-between;
		align-items: center;
		padding: 55rpx 20rpx 75rpx 20rpx;

		.text {
			font-size: 30rpx;
			font-weight: bold;
			color: rgb(0, 0, 0);
			font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "宋体", sans-serif;
			
			overflow: hidden;
			text-overflow: ellipsis; //超出部分以省略号显示
			white-space: nowrap;
			width: 250rpx; //用px单位亦可行
		}
	}

	.container {
		width: 100%;
		margin: 0 auto;
		/* 使容器水平居中 */
		text-align: center;
		/* 使容器内的内容水平居中 */
	}

	.search-wrapper {
		width: 80%;
		/* 或者其他百分比，根据需要调整 */
		margin: 0 auto;
		/* 使搜索框水平居中 */
		margin-top: -35rpx;
		margin-bottom: 45rpx;

	}

	.swiperImage {
		height: 250rpx;
		border-radius: 20rpx;
		width: 100%;
	}


	.scroll-view-custom {
		overflow-y: auto;
		background-color: #fff;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "宋体", sans-serif;
	}

	.restaurant-item {
		height: 200rpx;
		display: flex;
		padding: 16rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	}

	.restaurant-img {
		width: 190rpx;
		height: 190rpx;
		border-radius: 18rpx;
		object-fit: cover;
		margin-left: 15rpx;
		margin-right: 23rpx;
	}

	.restaurant-details {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.restaurant-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.title {
		font-size: 35rpx;
		line-height: 1.2;
		color: rgb(34, 36, 38);
		font-weight: 700;
		color: #222426;
		text-align: left;
		
		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 360rpx; //用px单位亦可行
	}

	.rating {
		display: flex;
		align-items: center;
	}

	.ratingInfo {
		color: rgb(255, 153, 90);
		margin-right: 15rpx;
	}

	.meta1 {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #858687;
		margin-top: 8rpx;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
	}

	.meta2 {
		display: flex;
		// justify-content: space-between;
		font-size: 24rpx;
		color: #858687;
		margin-top: 8rpx;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		margin-top: 8rpx;
		
		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 500rpx; //用px单位亦可行
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
		text-align: left;
		

	}

	.notexist {
		text-align: center;
		padding: 200rpx 0;
		font-size: 28rpx;
		color: #999999;
	}
</style>