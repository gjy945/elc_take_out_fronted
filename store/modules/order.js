import {
	deleteOrders,
	getOrderAll,
	updateOrderStatus
} from '@/static/network/api.js'
export default {
	state: {
		list: []
	},
	getters: {

	},
	mutations: {
		// 添加一个新的mutation来更新list
		UPDATE_ORDERLIST(state, response) {
			state.list = response; // 假设response是直接可以赋值给list的数据
		},
		DELETE_ORDER(state, orderId) {
			// 假设list是一个对象数组，每个对象有唯一的id
			// 根据orderId从list中移除相应的订单项
			console.log(orderId);
			state.list = state.list.filter(order => order.id !== orderId);
		},
	},
	actions: {
		async fetchDataOrder(context) {
			try {
				const response = await getOrderAll().then(res => {
					console.log("订单初始数据", res.data.data);
					return res.data.data
				})
				// 请求成功后，通过mutation更新state
				context.commit('UPDATE_ORDERLIST', response);
			} catch (error) {
				console.error('获取数据时出错:', error);
			}
		},

		async deleteOrder(context, id) {
			try {
				await deleteOrders({
					orderId: id
				}).then(res => {
					console.log(res);
				})
				// 所有请求成功后，更新客户端状态
				context.commit('DELETE_ORDER', id);
				uni.showToast({
					title: '删除成功',
					icon: 'none',
				});

			} catch (error) {
				console.error('删除商品时出错:', error);
				uni.showToast({
					title: '删除失败，请重试',
					icon: 'none',
					duration: 2000,
				});
			}
		},

		//更新订单状态
		async updateOrder(context, data) {
			try {
				await updateOrderStatus(data).then(res => {
					console.log(res);
				});

				// 更新状态成功后，自动调用初始化方法重新获取订单列表
				await context.dispatch('fetchDataOrder');

				uni.showLoading({
					title: ''
				});
				setTimeout(() => {
					uni.hideLoading()
				}, 2000)

				setTimeout(() => {
					uni.showToast({
						title: null,
						icon: 'none',
					});
				}, 2000)


			} catch (error) {
				console.error(error);
				uni.showToast({
					title: '更新失败，请重试',
					icon: 'none',
					duration: 2000,
				});
			}
		}
	}
}