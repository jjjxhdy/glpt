import axios from 'axios'

// 封装axios
const http = axios.create({
  baseURL:'/api',//通用请求地址/前缀
  timeout:10000,//超时时间
})

//添加请求拦截器
http.interceptors.request.use(function(config){
  //在发送请求之前做些什么
  return config;
},function (error){
  //请求错误做些什么
  return Promise.reject(error);});

  //添加响应拦截器
http.interceptors.response.use(function(response){
    //响应数据做点什么
    return response;
  },function(error){
    //对响应错误做点什么
    return Promise.reject(error);
  });
  

  export default http