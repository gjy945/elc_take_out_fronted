import {getCartByUserId,removeCarts} from '@/static/network/api.js'
export default {
	state: {
		list: [
			//{
			// 		id: 3,
			// 		dishId: 33,
			// 		restaurantId: 1,
			// 		quantity: 3,
			// 		price: 29.9,
			// 		checked: false,
			// 		name: "自选三人餐",
			// 		imageUrl: "https://p1.meituan.net/wmproduct/51070ad350683f3f625ca5ae63359b9298133.jpg@225w",
			// 		description: "自选三人餐",
			// 		unit: "份"
			// 	},
			// 	{
			// 		id: 4,
			// 		dishId: 26,
			// 		restaurantId: 1,
			// 		quantity: 4,
			// 		price: 29.9,
			// 		checked: false,
			// 		name: "十翅一桶",
			// 		imageUrl: "https://p0.meituan.net/wmproduct/d4b875903268ed31e938a890bbc9c4a559413.jpg@225w",
			// 		description: "十翅一桶",
			// 		unit: "份"
			// 	}
		],
		selectedList: [],
	},
	getters: {
		// 判断是否全选
		checkedAll: (state) => {
			return state.list.every(item => item.checked);
		},
		//合计+结算数量
		totalCount(state) {
			let total = {
				price: 0,
				quantity: 0
			}
			state.list.forEach(v => {
				//是否选中
				if (state.selectedList.indexOf(v.id) > -1) {
					//合计
					total.price += v.price * v.quantity;
					//结算数量
					total.quantity = state.selectedList.length;
				}
			})
			return total;
		},
		// 新增getter：筛选出选中的列表项
			selectedItems: (state) => {
				return state.list.filter(item => item.checked);
			},
	},
	mutations: {
		// 全选方法
		checkAll(state) {
			state.list.forEach(item => {
				item.checked = true;
				if (!state.selectedList.includes(item.id)) {
					state.selectedList.push(item.id);
				}
			});
		},
		// 全不选方法
		unCheckAll(state) {
			state.list.forEach(item => {
				item.checked = false;
			});
			state.selectedList = []; // 清空已选择的列表
		},
		//控制单选
		selectedItem(state, index) {
			let id = state.list[index].id;
			let i = state.selectedList.indexOf(id);
			if (i > -1) {
				state.list[index].checked = false;
				return state.selectedList.splice(i, 1);
			}
			state.list[index].checked = true;
			state.selectedList.push(id);
		},

		// 添加一个新的mutation来更新list
		UPDATE_LIST(state, newData) {
			state.list = newData; // 假设newData是直接可以赋值给list的数据
		},
		deleteCarts(state) {
			state.list = state.list.filter(v => {
				return state.selectedList.indexOf(v.id) === -1;
			})
		}
	},
	actions: {
		checkAllFn(context) {
			const allChecked = context.getters.checkedAll;
			if (allChecked) {
				context.commit('unCheckAll');
			} else {
				context.commit('checkAll');
			}
		},
		async fetchData(context) {
			try {
				const response = await getCartByUserId().then(res=>{
					return res.data.data
				})
				// 请求成功后，通过mutation更新state
				context.commit('UPDATE_LIST', response);
			} catch (error) {
				console.error('获取数据时出错:', error);
				// 可以在这里处理错误情况，比如提交一个错误状态到mutations
			}
		},
		async deleteCart(context) {
			try {
				// 获取所有选中的商品ID
				const ids = context.state.selectedList;
				if (context.state.selectedList.length === 0) {
					uni.showToast({
						title: '请先选择要删除的菜品',
						icon: 'none',
					});
					return;
				} else {
					console.log(ids);
					await removeCarts(ids).then(()=>{					
					// 所有请求成功后，更新客户端状态
					context.commit('deleteCarts');
					context.commit('unCheckAll');

					uni.showToast({
						title: '删除成功',
						icon: 'none',
					});
					})
				}
			} catch (error) {
				console.error('删除商品时出错:', error);
				uni.showToast({
					title: '删除失败，请重试',
					icon: 'none',
					duration: 2000,
				});
			}
		},
	},
};