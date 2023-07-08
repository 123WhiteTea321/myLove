// login module
import { makeAutoObservable } from "mobx"
import { getToken, setToken, clearToken } from "../utils"
import { http } from '../utils/http'

//为什么这里不用hook来写:useState,useEffect
class loginStore {
    // 进来先判断token取值
    token = getToken() || ""          //token持久化设置1
    constructor() {
        // 响应式
        makeAutoObservable(this)
        console.log("111111", this)     //打印不出来
    }
    getToken = async ({ mobile, code }) => {
        // 调用登录接口
        const res = await http.post('http://geek.itheima.net/v1_0/authorizations',
            {
                mobile,
                code
            })
        // 内存里面存入token
        console.log("22222", res.data)
        this.token = res.data.token  //这里是什么用法，为什么不是用localstorage.setItem去存？？？
        console.log("333", this.token)

        // 存入本地存储
        setToken(this.token)       //token持久化设置2
    }
    // clearToken=()=>{       //参数呢？
    //     this.token=''
    //     removeToken()
    // }

    // 退出登录,利用清除token函数封装成一个退出登录的模块
    loginOut = () => {
        this.token = ''  //这行又是干什么的，跟下面有什么不同
        clearToken()   
    }





}

export default loginStore