import {
	getAddressAll,
	addAddress,
	delAddress,
	editAddress
} from '@/static/network/api.js'
export default {
	state: {
		list: []
	},
	getters: {
		//筛选地址为默认的
		defaultAddress(state) {
			return state.list.filter(v => v.isDefault)
		},
		allAddress(state) {
			return state.list
		},
	},
	mutations: {
		//新增地址
		createAddress(state, obj) {
			state.list.unshift(obj);
		},
		//修改地址  解构表达式
		updateAddress(state, {
			index,
			item
		}) {
			for (let key in item) {
				state.list[index][key] = item[key]
			}
		},
		// 删除地址的mutation
		deleteAddress(state, id) {
			// 寻找匹配id的地址索引
			const index = state.list.findIndex(item => item.id === id);
			if (index !== -1) {
				// 如果找到了匹配的项，则从数组中移除
				state.list.splice(index, 1);
			}
		},

		// 添加一个新的mutation来更新list
		UPDATE_ADDRESSLIST(state, newData) {
			state.list = newData; // 假设newData是直接可以赋值给list的数据
		},
	},
	actions: {
		async createAddressFn({
			commit
		}, obj) {
			//新增
			await addAddress(obj).then(() => {
				uni.showToast({
					title: '添加成功',
					icon: 'none',
				});
			})
			commit('createAddress', obj);


		},
		async updateAddressFn({
			commit
		}, obj) {
			await editAddress(obj.item).then(()=>{
				uni.showToast({
					title: '修改成功',
					icon: 'none',
				});
			})
			commit('updateAddress', obj);
		},
		async deleteAddressFn({
			commit
		}, id) {
			// console.log(id);
			await delAddress({addressId:id}).then(() => {
				uni.showToast({
					title: '删除成功',
					icon: 'none',
				});
				commit('deleteAddress', id)
			})
		},

		async fetchDataAddress(context) {
			try {
				// 使用uni.request发起网络请求
				const response = await getAddressAll().then((res) => {
					return res.data.data
				})
				// 请求成功后，通过mutation更新state
				context.commit('UPDATE_ADDRESSLIST', response);
			} catch (error) {
				console.error('获取数据时出错:', error);
			}
		},
	}
}