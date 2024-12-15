<template>
	<view>
		<!-- 顶部组件 -->
		<CustomNavbar title="地址管理" text=" " />
		<view class="my-address-list">
			<view class="address-list" v-for="(item,index) in list" :key="index" @tap="toAddressPath(index)">
				<view class="">
					<view class="address-item" @tap="goCart(item)">
						<view class="item-info-up">
							<view class="active" v-if="item.isDefault">默认</view>
							<view class="item-info-address">{{item.address}} {{item.addressDetail}}</view>
						</view>
						<view class="item-info-down">
							<view class="item-name">{{item.contactName}}</view>
							<view class="item-phone">{{item.phoneNumber}}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="address">
				<view class="add-btn" @tap="goAddressPath">新增地址</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CustomNavbar from '@/components/CustomNavbar/CustomNavbar.vue'
	import {
		mapState,
		mapGetters
	} from 'vuex'

	export default {
		components: {
			CustomNavbar
		},
		data() {
			return {
				isSelectedAddress: false,
			}
		},
		computed: {
			...mapState({
				list: state => state.address.list,
			}),
			...mapGetters(['allAddress']),
		},
		onShow() {
			this.loadData()
			this.list = this.allAddress
			console.log(this.list);
		},
		onLoad(option) {
			//说明是从购物车也页面跳转过来的,是要选择地址,而不是管理地址
			if (option.type == 'selctedAddress') {
				console.log("选择地址");
				this.isSelectedAddress = true
			}
		},
		methods: {
			async loadData() {
				await this.$store.dispatch('fetchDataAddress');
				// 数据加载完成后，你可以执行其他操作，比如更新UI
			},
			//修改地址
			toAddressPath(index) {
				if (!this.isSelectedAddress) {
					let addressObj = JSON.stringify({
						index: index,
						item: this.list[index]
					})
					uni.navigateTo({
						url: "/pages/address-path/address-path?data=" + addressObj + ""
					})
				}

			},
			//新增地址
			goAddressPath() {
				uni.navigateTo({
					url: '/pages/address-path/address-path'
				})
			},
			//选择完地址返回购物车页面
			goCart(item) {
				//自定义事件,页面通讯,将选择的地址对象传回到购物车地址处
				uni.$emit("selectAddressItem", item);
				if (this.isSelectedAddress) {
					uni.navigateBack({
						delta: 1
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.address {
		padding: 20rpx 0;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.add-btn {
		border: 2rpx solid #ffcc33;
		color: #ffcc33;
		border-radius: 30rpx;
		padding: 6rpx 60rpx;
	}

	.address-list {
		padding-left: 20rpx;
	}

	.address-item {
		padding: 20rpx 10rpx;
		border-bottom: 2rpx solid #e3e3e3;
	}

	.item-info-up {
		display: flex;
		align-items: center;
		font-size: 35rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
		color: #3e3e3e;
		padding-bottom: 15rpx;

	}

	.item-info-address {
		overflow: hidden;
		text-overflow: ellipsis; //超出部分以省略号显示
		white-space: nowrap;
		width: 500rpx; //用px单位亦可行
	}

	.item-info-down {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
		color: #3e3e3e;
	}

	.item-name {
		padding-right: 10rpx;
	}

	.item-phone {
		margin-left: 20rpx;
	}

	.active {
		padding: 5rpx 10rpx;
		background-color: #ffcc33;
		color: #ffffff;
		border-radius: 26rpx;
		font-size: 24rpx;
		text-align: center;
	}
</style>