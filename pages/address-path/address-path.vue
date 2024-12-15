<template>
	<view class="add-address">
		<u-navbar :title="title" @rightClick="rightClick" :autoBack="true" placeholder="true"></u-navbar>
		<text style="float: right; padding-right: 40rpx; font-weight: bold; font-size: 35rpx;" @tap="save">保存</text>

		<view class="address-item">
			<view class="">收 件 人</view>
			<input type="text" value="" placeholder="请输入收件人姓名" v-model="addressObj.contactName" />
		</view>
		<view class="address-item">
			<view class="">手 机 号</view>
			<input type="text" value="" placeholder="请输入手机号" v-model="addressObj.phoneNumber" />
		</view>
		<view class="address-item">
			<view class="">所在地址</view>
			<view class="address-item-right" @tap="showCityPicker">
				<view class="address-item-right-text">{{addressObj.address}}</view>
				<view class="address-item-right-icon"><u-icon name="arrow-right"></u-icon></view>
			</view>
			<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onChange="onChange"
				@onCancel="onCancel" @onConfirm="onConfirm"></mpvue-city-picker>
		</view>
		<view class="address-item">
			<view class="">详细地址</view>
			<input type="text" value="" placeholder="请输入详细地址" v-model="addressObj.addressDetail" />
		</view>
		<view class="address-item">
			<view class="">设为默认地址</view>
			<view class="address-item-right"><u-switch v-model="addressObj.isDefault" @change=""></u-switch></view>

		</view>
		<view class="address-btn" v-show="isStatus" @tap="delAddress(addressObj.id)">删除</view>

	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/uni/mpvue-citypicker/mpvueCityPicker.vue'
	import {
		mapActions,
	} from 'vuex'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				title: "新增地址",

				//默认联级选择器
				pickerValueDefault: [0, 0, 1],

				addressObj: {
					id: "",
					userId: "",
					contactName: "",
					phoneNumber: "",
					address: "请选择",
					addressDetail: "",
					isDefault: false
				},
				//下标默认值
				i: -1,
				//是否修改的状态
				isStatus: false,
			}
		},
		onLoad(e) {
			if (e.data) {
				this.title = "修改地址"
				let result = JSON.parse(e.data);
				this.addressObj = result.item;
				this.i = result.index;
				this.isStatus = true;
			}

		},
		onShow() {

		},
		methods: {
			...mapActions(["createAddressFn", "updateAddressFn","deleteAddressFn"]),
			//保存或修改
			save() {
				if (this.isStatus) {
					//修改
					this.updateAddressFn({
						index: this.i,
						item: this.addressObj
					})
					uni.navigateBack({
						delta: 1
					})
				} else {
					//新增
					this.createAddressFn(this.addressObj)
					uni.navigateBack({
						delta: 1
					})
				}
			},
			//删除地址
			delAddress(id){
				this.deleteAddressFn(id);
				uni.navigateBack({
					delta:1
				})
			},
			showCityPicker() {
				this.$refs.mpvueCityPicker.show();
			},
			onChange(e) {
				console.log(e);
			},
			onCancel(e) {
				console.log(e);
			},
			onConfirm(e) {
				console.log(e);
				this.addressObj.address = e.label;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-address {
		padding-left: 20rpx;
	}

	.address-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;
		width: 100%;
		border-bottom: 2rpx solid #cccccc;
		font-size: 35rpx;
		font-family: "PingFangSC-Regular", "Hiragino Sans GB", Arial, Helvetica, "Microsoft Yahei", sans-serif;
		position: relative;
		/* 添加这一行，使得子元素能相对于此元素定位 */
	}

	.address-item input {
		flex: 1;
		text-align: left;
		padding-left: 30rpx;
	}

	.address-item-right {
		position: absolute;
		right: 40rpx;
		/* 根据实际情况调整右边距 */
		display: flex;
		align-items: center;
	}

	.address-btn {
		width: 50%;
		margin: 40rpx 0;
		padding: 15rpx 20rpx;
		text-align: center;
		border-radius: 50rpx;
		background-color: #ff593c;
		color: #ffffff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>