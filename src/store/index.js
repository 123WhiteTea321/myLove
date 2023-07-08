//把store文件夹下的js做统一管理
// 导出一个统一的方法 useStore
import React from "react"
import LoginStore from './login.Store'
import UserStore from "./userStore"
import ChannelStore from "./channel.Store"
class RootStore {
  // 组合模块
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore =new UserStore()
    this.ChannelStore=new ChannelStore()
  }
}



// 导入useStore方法供组件使用数据,这里是mobx的模块化导出方法
const StoresContext = React.createContext(new RootStore())
export const useStore = () => React.useContext(StoresContext)