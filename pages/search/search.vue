<template>
	<view class="search">
		<!-- 顶部组件 -->
		<CustomNavbar title=" " text=" " />
		<view class="search-container">
			<u-search :showAction="true" actionText="搜索" :animation="true" height="84rpx" searchIconSize="40rpx"
				v-model="keyword" @custom="search()" placeholder="请输入商家或者商品名称"></u-search>
		</view>
		<view style="margin-top: 40rpx;">
			<!-- 搜索历史 -->
			<view class="history" v-model="his">
				<view class="history-title">
					<text>历史搜索</text>
					<uni-icons type="trash" size="20" color="#C0C0C0" @click="clearHistory"></uni-icons>
				</view>
				<view class="history-content" v-if="historyList.length!=0">
					<view class="history-item" v-for="(historyItem,historyIndex) in historyList" :key="historyIndex" @tap="fast(historyItem)">
						{{historyItem}}
					</view>
				</view>
				<view class="history-none" v-else>
					<text>无搜索历史</text>
				</view>
			</view>
			<!-- 搜索发现 -->
			<view class="found">
				<view class="found-title">
					<text>搜索发现</text>
					<uni-icons type="" size="20" color="#C0C0C0"></uni-icons>
				</view>
				<view class="found-content">
					<view class="found-item" v-for="(foundItem,foundIndex) in foundList" :key="foundIndex" @tap="fast(foundItem)">
						{{foundItem}}
					</view>
				</view>
			</view>
		</view>


		<scroll-view scroll-y class="restaurant-scroll" style="height: calc(100vh - 650rpx);">
			<view v-show="restaurants.length>0">
				<view class="list-top-text">
					<text>--为您搜索到以下内容--</text>
				</view>
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

						<view class="listY" v-if="item.dishList.length!=0">
							<scroll-view class='scrollContainer' scroll-x>
								<view class='scrollitem' v-for="(dishItem, index) in item.dishList" :key="index"
									@click="getItem(item)">
									<image class="scrollimage" :src="dishItem.imageUrl"></image>
									<view class="dishName">{{dishItem.name}}</view>
									<view class="dishPrice">￥<text class="dishPrice-text">{{dishItem.price}}</text>
									</view>
								</view>
							</scroll-view>
						</view>
						<view class="EmptyData" v-else>暂无数据</view>

					</view>
				</view>
			</view>
		</scroll-view>



	</view>
</template>

<script>
	import {
		getRestaurantSearch
	} from '@/static/network/api.js'
	export default {
		data() {
			return {
				// 初始化定时器为空
				time: null,
				// 用户输入的关键词
				keyword: '',
				//搜索数据的数组初始化
				searchList: [],
				//搜索历史初始化
				historyList: [],
				// 初始化搜索发现列表
				foundList: ['炸鸡','汉堡','可乐','柠檬水'],
				//搜索内容 列表
				restaurants: [],
			};
		},
		methods: {
			fast(v){
				this.keyword = v
			},
			search(e) {
				console.log(e);
				this.saveHistory();
				//网络请求根据搜索内容获取数据
				getRestaurantSearch({
					search: e.trim()
				}).then(res => {
					console.log(res.data.data);
					this.restaurants = res.data.data
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
			//获取搜索列表的方法
			async getSearchContent() {
				if (this.keyword.length == 0) {
					this.searchList = [];
					return
				} else {
					const res = await uni.$http.get('/search')
					const {
						data,
						status
					} = res.data;
					if (status != 200) {
						alert('获取数据失败')
					} else {
						this.searchList = data
						//把搜索的关键字保存到historyList中
						this.saveHistory()
					}
				}
			},
			// 保存历史记录
			saveHistory() {
				if (this.historyList.indexOf(this.keyword.trim()) == -1 && this.keyword.trim() != "") {
					this.historyList.unshift(this.keyword.trim())
					// 把用户输入的内容保存到历史记录当中
					uni.setStorageSync('kw', JSON.stringify(this.historyList || '[]'))
				}
			},
			// 清空历史记录
			clearHistory() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
				if (his.length == 0) {
					this.his = !this.his
				}
			}
		},
		onLoad() {
			// 从缓存中读取历史记录
			this.historyList = JSON.parse(uni.getStorageSync('kw'))
		}
	}
</script>

<style lang="scss" scoped>
	* {
		margin: 0;
		padding: 0;
	}

	.search {
		width: 100%;
		height: 100vh;
		background-color: #FFF;

		.search-container {
			width: 100%;
		}

		.search-list {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			display: flex;
			border-bottom: 1px solid #eee;

			uni-icons {
				margin: 0 20rpx;
			}
		}

		.history {
			.history-title {
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 0 auto;

				text {
					font-weight: bold;
					font-size: 34rpx;
				}
			}

			.history-content {
				width: 90%;
				margin: 10rpx auto;
				display: flex;
				flex-wrap: wrap;

				.history-item {
					font-size: 35rpx;
					height: 50rpx;
					line-height: 50rpx;
					background-color: #f5f5f6;
					margin-top: 10rpx;
					margin-right: 20rpx;
					padding: 0 20rpx;
					border-radius: 20rpx;
				}
			}

			.history-none {
				font-size: 35rpx;
				width: 100%;
				height: 100rpx;
				text-align: center;
				line-height: 100rpx;
			}
		}

		.found {
			margin-top: 50rpx;

			.found-title {
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 0 auto;

				text {
					font-weight: bold;
					font-size: 34rpx;
				}
			}

			.found-content {
				width: 90%;
				margin: 10rpx auto;
				display: flex;
				flex-wrap: wrap;

				.found-item {
					font-size: 35rpx;
					height: 50rpx;
					line-height: 50rpx;
					background-color: #f5f5f6;
					margin-top: 10rpx;
					margin-right: 20rpx;
					padding: 0 20rpx;
					border-radius: 20rpx;
				}
			}
		}
	}


	.restaurant-scroll {
		/* 确保内容超出时可以滚动 */
		overflow-y: auto;
	}

	.list-top-text {
		margin: 40rpx 0;
		text-align: center;
		font-size: 24rpx;
		color: #909192;
	}

	.restaurant-item {
		height: 400rpx;
		display: flex;
		padding: 16rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 16rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	}

	.restaurant-img {
		width: 120rpx;
		height: 120rpx;
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


	.listY {
		width: 200rpx;
		height: 100rpx;
	}

	// 容器
	.scrollContainer {
		width: 600rpx;
		height: 220rpx;
		white-space: nowrap;
	}

	// 容器项
	.scrollitem {
		display: inline-block;
		padding-right: 20rpx;
		height: 190rpx;
	}

	.scrollimage {
		width: 180rpx;
		height: 140rpx;
		border-radius: 15rpx;
	}

	.dishName {
		font-size: 24rpx;
		font-family: 'Microsoft Yahei';
		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 180rpx; //用px单位亦可行
	}

	.dishPrice {
		font-size: 24rpx;
		font-family: 'Microsoft Yahei';
	}

	.dishPrice-text {
		font-size: 35rpx;
	}

	.EmptyData {
		font-size: 35rpx;
		font-family: 'Microsoft Yahei';
		text-align: center;
		margin-top: 100rpx;
		margin-left: -80rpx;
	}
</style>