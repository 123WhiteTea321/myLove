
import { makeAutoObservable } from "mobx";
import { http } from "@/utils";
class ChannelStore {
    channelList = []
    constructor() {
        makeAutoObservable(this)
    }
    // article,publish里面都要用到，那就放到一个公共的地方layout
     fetchChannels =async()=>{
       const res=await http.get("/channels")
       console.log("res",res)
       this.channelList=res.data.channels
    }
}
export default ChannelStore