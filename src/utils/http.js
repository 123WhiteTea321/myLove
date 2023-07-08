// 封装axios
// 实例化 请求拦截器
import { getToken } from './token'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { clearToken } from './token'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {

  // 请求拦截器注入token:为防止每次发送请求都要验证一次token，这里一次配置，以后多次生效
  const token = getToken()
  if (token) {               //token不对，就会发送请求
    // 这句代码的作用是将 Bearer ${token} 这个认证凭据赋值给请求头中的 Authorization 字段，以便身份验证和授权操作。
    config.headers.Authorization = `Bearer ${token}`    //config.headers 可能是一个配置对象，用于存储请求头信息。
  }
  return config



}, (error) => {

  // const navigate = useNavigate()

  console.dir(error)     //以树状结构呈现对象的属性和值
  //  如果401，token对应不上，就执行相应代码
  if (error.response.status === 401) {
    // 删除token
    clearToken()
    // 跳转到登录页
    // navigate('/login')
    window.location.href = '/login'    //history那个，先放着吧

  }


  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // const navigate = useNavigate()

  console.dir(error)     //以树状结构呈现对象的属性和值
  //  如果401，token对应不上，就执行相应代码
  if (error.response.status === 401) {
    // 删除token
    clearToken()
    // 跳转到登录页
    // navigate('/login')
    window.location.href = '/login'    //history那个，先放着吧
    console.log("schjkahlcasbcw.")
  }



  return Promise.reject(error)
})

export { http }