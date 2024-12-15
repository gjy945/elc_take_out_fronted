<template>
	<view class="confirm-order">
		<view class="navbar-fixed">
			<!-- 顶部组件 -->
			<CustomNavbar title="餐车" text=" " />

			<view @tap="goAddressList">
				<template v-if="address">
					<view class="order-map">
						<view class="map-address">
							<view class="map-address-name">
								<view><u-icon name="map"></u-icon></view>
								<view class="map-address-text">{{address.address}} {{address.addressDetail}}</view>
							</view>
							<view class="map-address-icon"><u-icon name="arrow-right" size="24rpx"></u-icon></view>
						</view>
						<view class="map-info">
							<view class="map-info-name">{{address.contactName}}</view>
							<view>{{address.phoneNumber}}</view>
						</view>
						<view class="map-tip">为降低风险,推荐使用无接触配送</view>
					</view>
				</template>
				<template v-else>
					<view class="order-map">
						<view class="map-address">
							<view class="map-address-name">
								<view><u-icon name="map"></u-icon></view>
								<view class="map-address-text">请选择收货地址</view>
							</view>
							<view class="map-address-icon"><u-icon name="arrow-right" size="24rpx"></u-icon></view>
						</view>
						<view class="map-info">
							<view class="map-info-name"> </view>
							<view> </view>
						</view>
						<view class="map-tip">为降低风险,推荐使用无接触配送</view>
					</view>
				</template>
			</view>

			<view class="restaurant">
				<view class="restaurantInfo">
					<view class="restaurantImg"><img :src="restaurantInfo.imageUrl" alt="" /></view>
					<view class="restaurantName">{{restaurantInfo.name}}</view>
					<view class="mode">商家自配</view>
				</view>
				<view class="edit-finish-btns" style="background-color: #f4f4f4; margin-bottom: 15rpx;">
					<text v-show="isNavBar"
						style="float: right; padding-right: 40rpx; font-weight: bold; font-size: 32rpx;"
						@click="isNavBar=!isNavBar">编辑</text>
					<text v-show="!isNavBar"
						style="float: right; padding-right: 40rpx; font-weight: bold; font-size: 32rpx;"
						@click="isNavBar=!isNavBar">完成</text>
				</view>
			</view>
		</view>
		<template v-if="list.length>0">
			<view style="padding: 20rpx 20rpx; border-radius: 25rpx; margin: 20rpx 10rpx;">
				<scroll-view scroll-y="true" class="scroll-view-container">
					<view class="shop-list">
						<view class="shop-item" v-for="(item,index) in list" :key="index">
							<label class="radio" @tap="selectedItem(index)">
								<radio style="transform: scale(0.8);" value="" color="#ff3333"
									:checked="item.checked" />
								<text></text>
							</label>
							<image class="shop-img" :src="item.imageUrl" mode=""></image>
							<view class="shop-text">
								<view class="shop-name">{{item.name}}</view>
								<view class="shop-info">{{item.description}}</view>
								<view class="shop-price">
									<view style="width: 150rpx;"><span
											style="color: #ff572e; font-size: 35rpx;">￥{{item.price}}</span><span
											style="font-size: 25rpx;">/{{item.unit}}</span></view>
									<view class="numberBox">
										<u-number-box slot="right-icon" v-model="item.quantity" step="1" :min="0"
											:showMinus="item.quantity > 0">
											<view slot="minus" class="minus">
												<u-icon name="minus" size="17" color="#000000"></u-icon>
											</view>
											<text slot="input" style="width: 50px;text-align: center;"
												v-show="item.quantity>0" class="input">{{item.quantity}}</text>
											<view slot="plus" class="plus">
												<u-icon name="plus" color="#000000" size="17"></u-icon>
											</view>
										</u-number-box>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="remark">
						<view class="remark-text">备注</view>
						<view class="remark-icon" @click="show = true">
							<view class="remark-icon-1">{{remarkInfo}}</view>
							<view class="remark-icon-2"><u-icon name="arrow-right" color="#999999"></u-icon></view>
						</view>
					</view>
					<u-popup :show="show" @open="open" mode="bottom">
						<view class="popup-remark">
							<view class="popup-remark-sel">
								<view @click="close">取消</view>
								<view @click="submitRemark">完成</view>
							</view>
							<view class="popup-remark-text">

								<textarea class="JTxtArea lg" :maxlength="88" :data-maxnum="remark.length+'/88'"
									auto-height @input="inputReason" :value="remark"
									:placeholder="remarkInit"></textarea>
							</view>
							<view class="popup-remark-item">
								<view class="popup-remark-item-1">快捷备注</view>
								<view class="popup-remark-item-2" v-for="(item,index) in popupRemarkItem" :key="index">
									<text @tap="selectRemark(item)">{{item}}</text>
								</view>
							</view>

						</view>
					</u-popup>
				</scroll-view>
			</view>
			<view class="shop-foot">
				<label class="radio foot-radio" @tap="checkAllFn">
					<radio value="" style="transform: scale(0.8);" color="#ff3333" :checked="checkedAll" />
					<text style="font-size: 35rpx; font-weight: bold; color: #3e3e3e;">全选</text>
				</label>

				<template v-if="isNavBar">
					<view class="foot-total">
						<view class="foot-count">合计<text
								style="color: #fb4e44; font-weight: bold;">￥{{Math.floor(totalCount.price * 100) / 100}}</text>
						</view>
						<view class="foot-num" @tap="submitOrder">提交订单</view>
					</view>
				</template>
				<template v-else>
					<view class="foot-total">
						<view class="foot-num" style="background-color: #000000; font-size: 35rpx; color: #ffffff;">
							移入收藏夹</view>
						<view class="foot-num" style="color: #000000; font-size: 35rpx;" @tap="deleteCart">删除</view>
					</view>
				</template>

			</view>
		</template>
		<template v-else>
			<view class="">
				<text style="float: right; padding-right: 40rpx; font-weight: bold; font-size: 35rpx;"></text>
			</view>
			<view class="shop-else-list">
				<text>什么都没有</text>
			</view>
		</template>
	</view>

</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	import {
		mapState,
		mapActions,
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		getRestaurantInfoById,
		addOrder
	} from '@/static/network/api.js'
	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				isNavBar: true,
				//商家id
				restaurantId: 0,

				//商家信息
				restaurantInfo: "",

				//默认地址
				address: {},

				//备注默认显示
				remarkInfo: "推荐使用无接触配送",

				show: false,

				//备注
				remark: "",

				//备注背景字
				remarkInit: "无接触配送,将商品挂家门口或放前台,地址封闭管理时请电话联系",

				//快捷备注
				popupRemarkItem: ["【如遇缺货】,缺货时电话与我沟通", "到了打电话 我下去取"]
			}
		},
		mounted() {},
		onShow() {
			this.loadData()
		},
		onLoad: function(option) {
			this.restaurantId = option.restaurantId
			this.getRestaurantInfo(option.restaurantId)

			//默认地址赋值
			if (this.defaultAddress.length) {
				this.address = this.defaultAddress[0]
			}

			//触发自定义事件, on接收 地址选择
			uni.$on("selectAddressItem", (res) => {
				console.log(res);
				this.address = res
			})
		},
		onUnload() {
			//将自定义事件移除
			uni.$off("selectAddressItem", () => {
				console.log("移除自定义事件selectAddressItem");
			})
		},
		methods: {
			//跳转地址管理
			goAddressList() {
				uni.navigateTo({
					url: '/pages/address/address?type=selctedAddress'
				})
			},
			//快捷备注
			selectRemark(remark) {
				this.remark = remark
			},
			//获取备注赋值
			inputReason(e) {
				this.remark = e.detail.value;
			},
			//打开弹出层
			open() {
				console.log('open');
			},
			//关闭弹出层
			close() {
				this.show = false
			},
			//提交备注,赋值
			submitRemark() {
				this.close()
				this.remarkInfo = this.remark
			},
			...mapActions(['checkAllFn', 'deleteCart']),
			...mapMutations(['selectedItem']),
			async loadData() {
				await this.$store.dispatch('fetchData');
				// 数据加载完成后，你可以执行其他操作，比如更新UI
			},

			//获得商家信息
			getRestaurantInfo(restaurantId) {
				getRestaurantInfoById({
					restaurantId: restaurantId
				}).then(res => {
					this.restaurantInfo = res.data.data
				})
			},
			//提交订单
			submitOrder() {
				let selectedItemsFromStore = this.$store.getters.selectedItems
				if (selectedItemsFromStore.length < 1) {
					uni.showToast({
						title: '请先选择商品',
						content: '请先选择商品',
						duration: 1500,
						icon: 'none'
					});
					return;
				}
				// 获取当前北京时间的时间戳（单位为毫秒）
				var stamp = new Date().getTime() + 8 * 60 * 60 * 1000;
				// 格式化北京时间为"YYYY-MM-DDTHH:mm:ss"
				var beijingTime = new Date(stamp).toISOString().replace(/\..+/, '').substring(0, 19);

				// 初始化一个新的目标对象或数组
				let targetObject = [];

				// 遍历store中选中的items
				selectedItemsFromStore.forEach(selectedItem => {
					let newItem = {
						dishId: selectedItem.dishId,
						restaurantId: selectedItem.restaurantId,
						quantity: selectedItem.quantity,
						unitPrice: selectedItem.price,
						subTotal: Math.floor(selectedItem.quantity * selectedItem.price * 100) / 100,
						imageUrl: selectedItem.imageUrl
					};
					// 将新对象添加到目标对象或数组中
					targetObject.push(newItem);
				});

				//targetObject包含了从selectedItems中选取字段的新对象数组
				console.log(targetObject);

				//封装数据
				let data = {
					restaurantId: parseInt(this.restaurantId),
					addressId: this.address.id,
					remark: this.remark,
					imageUrl: this.restaurantInfo.imageUrl,
					restaurantName: this.restaurantInfo.name,
					totalPrice: Math.floor(this.totalCount.price * 100) / 100,
					orderTime: beijingTime,
					expectedDeliveryTime: new Date(new Date().getTime() + 8 * 60 * 60 * 1000 + 45 * 60000).toISOString()
					    .replace(/\..+/, '').substring(0, 19),
					actualDeliveryTime: new Date(new Date().getTime() + 8 * 60 * 60 * 1000 + 2100).toISOString()
						.replace(/\..+/, '').substring(0, 19),
					orderdetails: targetObject
				}
				console.log(data);
				addOrder(data).then(res => {
					console.log(res.data.data);
					//跳转支付页(订单详情页)
					uni.navigateTo({
						url:`/pages/orderDetailPay/orderDetailPay?orderId=${res.data.data}`
					})
				}).catch(err => {
					console.log(err);
				})
			}
		},
		computed: {
			...mapState({
				list: state => state.cart.list,
			}),
			...mapGetters(['checkedAll', 'totalCount', 'defaultAddress']),

		}
	}
</script>

<style lang="scss">
	.confirm-order {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: #f4f4f4;
	}

	.scroll-view-container {
		margin-top: 220rpx;
	}

	.navbar-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 999;
		background-color: #fff;
	}

	.shop-list {
		padding-bottom: 20rpx;
		margin-top: 260rpx;
	}

	.shop-item {
		display: flex;
		padding: 20rpx;
		align-items: center;
		background-color: #F7F7F7;
		margin-bottom: 10rpx;
	}

	.shop-img {
		width: 170rpx;
		height: 170rpx;
	}

	.shop-text {
		flex: 1;
		padding-left: 20rpx;

	}

	.shop-info {
		font-size: 24rpx;
		color: #858687;
		margin-top: 8rpx;
		margin-left: 16rpx;
		font-family: Hiragino Sans GB, Arial, Helvetica, \\5B8B\4F53, sans-serif;
	}

	.shop-price {
		display: flex;
		margin-top: 10rpx;
		margin-left: 10rpx;
		// justify-content: space-around;
	}

	.shop-name {
		margin-top: -25rpx;
		font-size: 35rpx;
		font-weight: 900;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "宋体", sans-serif;
	}

	.shop-foot {
		border-top: 2rpx solid #F7F7F7;
		background-color: white;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.foot-radio {
		padding-left: 20rpx;
	}

	.foot-total {
		display: flex;
	}

	.foot-count {
		line-height: 100rpx;
		padding: 0 20rpx;
		font-size: 32rpx;
	}

	.foot-num {
		background-color: #ffce33;
		padding: 0 60rpx;
		line-height: 100rpx;
		font-weight: bold;
		font-size: 35rpx;
	}

	.shop-else-list {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #F7F7F7;
		display: flex;
		align-items: center;
		justify-content: center;
	}


	.numberBox {
		width: 35rpx;
		height: 35rpx;
		padding-left: 70rpx;
		// background-color: #fecc32;
		// margin-left: 60rpx;

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

	.order-map {
		background-color: #ffffff;
		line-height: 40rpx;
		padding: 20rpx 20rpx;
		margin: 25rpx 20rpx;
		border-radius: 20rpx;
		border-bottom: 15rpx solid #f4f4f4;
	}

	.map-address {
		display: flex;
		justify-content: space-between;
		padding: 8rpx 0;
		margin-left: -20rpx;
		color: #3b3b3b;
		font-family: '宋体';
		font-weight: bold;
	}

	.map-info {
		display: flex;
		// justify-content: space-between;
		padding: 8rpx 20rpx;
		font-size: 30rpx;
		color: #6c6c6c;

	}

	.map-tip {
		color: #ff8000;
		padding: 8rpx 20rpx;
		font-size: 30rpx;
	}

	.map-info-name {
		margin-right: 30rpx;
	}

	.map-address-name {
		display: flex;
	}

	.map-address-text {
		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 600rpx; //用px单位亦可行
	}

	.map-address-icon {
		margin-top: 5rpx;
	}

	.restaurant {
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		// margin-top: 100rpx;
		// border-top: 20rpx solid #f4f4f4;
	}

	.restaurantInfo {
		display: flex;
	}

	.restaurantImg image {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}

	.restaurantName {
		padding: 0 20rpx;
		padding-top: 7rpx;
		font-size: 30rpx;
		color: #595959;
	}

	.mode {
		margin-top: 7rpx;
		height: 35rpx;
		font-size: 24rpx;
		border: 1rpx solid #5f5f5f;
		border-radius: 10rpx;
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

	.remark-icon-1 {
		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 260rpx; //用px单位亦可行
	}

	.remark-icon-2 {
		padding-top: 3rpx;

	}

	.popup-remark {
		padding: 20rpx 40rpx;
	}

	.popup-remark-sel {
		display: flex;
		justify-content: space-between;
		font-size: 35rpx;
		color: #595959;
		padding: 10rpx 0 20rpx 0;
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
		min-height: 60px;
		line-height: 20px;
		color: #a8a8a8;
		position: relative;

		&.sm {
			min-height: 30rpx;
		}

		&.lg {
			min-height: 150rpx;
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
		font-size: 32rpx;
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
	}
</style>