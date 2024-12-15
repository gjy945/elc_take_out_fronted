import url from '@/static/network/config.js';

// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
    // 初始化请求配置
    uni.$u.http.setConfig((config) => {
        config.baseURL = url.baseApi;
        
        // 正确设置token头
        const token = uni.getStorageSync('token');
        if (token) {
            config.header.token = token;
        }
        
        return config;
    });

    // 请求拦截
    // uni.$u.http.interceptors.request.use(async (config) => {
    //     // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
    //     config.data = config.data || {};

    //     // 根据custom参数中配置的是否需要token，添加对应的请求头
    //     if (config.custom && config.custom.auth) {
    //         // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
    //         config.header.token = vm.$store.state.userInfo.token;
    //     }
    //     return config;
    // });

    // 响应拦截
    uni.$u.http.interceptors.response.use(async (response) => {
        const data = response.data;
        
        // 处理特定状态码，如504代表未授权或token失效
        if(data.code === 504){
            uni.redirectTo({
                url: '/pages/login/login' // 重定向到登录页面
            });
            return response;
        }
        
        // 非200状态码处理
        if (data.code !== 200) {
            uni.$u.toast(data.message); // 显示错误信息
            return response; // 保持响应对象供外部处理
        }
        
        // 成功处理，提取data.data
        response.resData = data.data;
        return response;
    }, (error) => {
        // 错误处理逻辑，可根据需要细化
        uni.$u.toast('请求失败'); // 显示失败提示
        return Promise.reject(error); // 返回已拒绝的Promise
    });
}