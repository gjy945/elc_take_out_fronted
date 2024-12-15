const http = uni.$u.http
//主页顶部轮播图展示
export const getSwiperList = () => http.get('/swiper/getSwiperList')

//商家列表分页查询
export const getRestaurantPageList = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post('/restaurant/getRestaurantPageList', params, config)

//商家菜品分类查询
export const getCategoryListByRestaurantId = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post('/category/getCategoryListByRestaurantId', params, config)

//根据id获取商家信息
export const getRestaurantInfoById = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post("/restaurant/getRestaurantInfoById", params, config)

//根据商家id和菜品分类id查询菜品列表
export const getDish = (restaurantId, categoryId, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post(`/dish/getDish/${restaurantId}/${categoryId}`, restaurantId, categoryId, config)

//根据商家id查询轮播图列表
export const getSwiperListByRestaurantId = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post("/restaurantSwiper/getSwiperList", params, config)


//批量添加购物车
export const batchAddToCart = (items, config = {
	header: {
		'content-type': 'application/json' // 使用application/json,发送JSON数据
	}
}) => http.post('/cart/add', items, config)

//根据用户id查询购物车
export const getCartByUserId = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded',
		'token': uni.getStorageSync("token"),
	}
}) => http.post("/cart/getCart", params, config)

//根据选中的批量删除购物车
export const removeCarts = (params, config = {
	header: {
		'content-type': "application/json",
		'token': uni.getStorageSync("token"),
	}
}) => http.delete("/cart/removeCart", params, config)


//模糊查询搜索商家&菜品
export const getRestaurantSearch = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post("/restaurant/getRestaurantSearch", params, config)


//用户下单
export const addOrder = (params, config = {
	header: {
		'Content-Type': "application/json",
		'token': uni.getStorageSync("token"),
	}
}) => http.post("/order/addOrder", params, config)

//根据用户id查询所有订单
export const getOrderAll = (params, config = {
	header: {
		'token': uni.getStorageSync("token"),
	}
}) => http.post("/order/getOrder", params, config)


//根据订单id查询订单与订单详情
export const getOrderDetailById = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post("/order/getOrderDetailById", params, config)


//根据订单id删除订单
export const deleteOrders = (params, config = {
	header: {
		'token': uni.getStorageSync("token"),
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.delete("order/deleteOrder", params, config)

//根据用户id获取所有地址  因为App.vue初始化地址时出了点问题,所以url写全了
export const getAddressAll = (params, config = {
	header: {
		'token': uni.getStorageSync("token"),
	}
}) => http.post("http://localhost:9002/userAddresses/getAddress", params, config)

//根据地址id获取地址信息
export const getAddressById = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post("http://localhost:9002/userAddresses/getAddressById", params, config)

//新增地址
export const addAddress = (params, config = {
	header: {
		'Content-Type': "application/json",
	}
}) => http.post("/userAddresses/addAddress", params, config)

//根据地址id删除地址
export const delAddress = (params, config = {
	header: {
		'token': uni.getStorageSync("token"),
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.delete("/userAddresses/deleteAddress", params, config)

//修改地址
export const editAddress = (params, config = {
	header: {
		'Content-Type': "application/json",
	}
}) => http.post("/userAddresses/updateAddress", params, config)

//修改订单状态
export const updateOrderStatus = (params, config = {
	header: {
		'Content-Type': "application/json",
	}
}) => http.put("/order/updateOrder", params, config)

//添加评论
export const addReview = (params, config = {
	header: {
		'Content-Type': "application/json",
		'token': uni.getStorageSync("token")
	}
}) => http.post("/reviewcomments/addReview", params, config)

//获取评论
export const getReview = (params, config = {
	header: {
		'token': uni.getStorageSync("token"),
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post("/reviewcomments/getReview", params, config)