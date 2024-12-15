const http = uni.$u.http

//微信登录
export const loginByWechat = (params, config = {
	header: {
		'content-type': 'application/x-www-form-urlencoded'
	}
}) => http.post('/auth/wLogin',params,config)