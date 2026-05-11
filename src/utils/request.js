import axios from 'axios'
import { useRouter } from 'vue-router'



const baseURL = 'http://localhost:8080'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = localStorage.getItem('token')
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    console.log(res);
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 200) {
      return res
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.success(res.data.errorMessage || '服务异常')
    return Promise.reject(res.data.errorMessage)
  },
  (err) => {
    console.log("error:"+err)
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      ElMessage.success('登录后操作')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    // 错误的默认情况 => 只要给提示
    else {
      ElMessage.error(err.response.data || '服务异常')
    }

    return Promise.reject(err)
  }
)

export default instance