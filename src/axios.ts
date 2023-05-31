import axios from "axios";

const initAxios = axios.create({
    timeout: 1800000//数据响应过期时间
})

//请求拦截器
initAxios.interceptors.request.use((config) => {
    //在发送之前做点什么
    return config
}, (error) => {
    //对请求错误做点什么
    console.log(error);
    return error
})

//响应拦截器
initAxios.interceptors.response.use((response) => {
    console.log("Fetch response");
    console.log(response.data.length);
    console.log(response.status);
    if (response.status === 200 ) {
        return response
    } else {
        return {resultCode: -1}
    }
})
//导出
export default () => initAxios