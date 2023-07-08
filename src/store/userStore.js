import { makeAutoObservable } from "mobx"
import { http } from '../utils/http'


// 这段代码定义了一个名为 UserStore 的类，它使用了 makeAutoObservable 函数来创建可观察的属性和动作(action)。
// 在 MobX 中，你可以使用 makeAutoObservable 函数自动将类中的属性和方法转换为可观察的状态。当你执行 makeAutoObservable 函数时，
// 它会自动处理以下几个方面：
// 将类中的普通属性转换为可观察的状态；
// 将类的方法转换为动作(action)，以便你可以在方法中修改可观察状态；
// 自动管理可观察状态的依赖关系，并在需要时自动触发重新计算和更新。
// 因此，当你执行 makeAutoObservable 函数时，你无需手动调用 observable 和 action 函数来创建可观察状态和动作。
// 在这个示例中，我们先定义了一个 userInfo 属性，它用于存储用户信息。
// 然后，在类的构造函数中，我们调用了 makeAutoObservable(this) 函数，它会自动将 userInfo 属性转换为可观察状态，
// 并创建一个名为 setUserInfo 的动作(action)，以便你可以在其他方法中调用它来修改 userInfo。


class UserStore {
    userInfo = {}
    constructor() {
        // constructor里面放的都是导入的函数，this关键字在构造函数中代表当前正在创建的实例对象。
        makeAutoObservable(this)     //这一段是为了实现实例对象（this）的响应式处理
    }
    // 调用接口获取数据（能不能把下面这个函数放到constructor里面呢）
    async getUserInfo() {
        const res = await http.get("/user/profile")
        this.userInfo=res.data
        console.log("用户数据", res.data)
    }
}

export default UserStore

