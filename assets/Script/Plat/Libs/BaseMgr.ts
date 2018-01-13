import GameNet from "../NetCenter/GameNet";
import NetNotify from "../NetCenter/NetNotify";
import ModuleMgr from "../GameMgrs/ModuleMgr";
 

//基础的管理器
export default class BaseMgr{
    routes:{} = null
    constructor (){
        NetNotify.getInstance().regNotifyListener(this);
        this.routes = {

        }
    } 
    //发送全局事件
    gemit(event,arg1,arg2) {
        G_FRAME.globalEmitter.emit(arg1,arg2);
    }   
    send_msg(route:string,msg?:any){
        GameNet.getInstance().send_msg(route,msg);
    } 
    notify_msg(route,msg){
        GameNet.getInstance().notify_msg(route,msg);
    } 
    start_sub_module(module_id:any,cb:Function = function(){}){

        ModuleMgr.getInstance().start_sub_module(module_id, cb);
    } 
    start_module(module_id:any){
        ModuleMgr.getInstance().start_module(module_id);
    } 
      
    dealResp(route,msg){ 
        let routerfun=this.routes[route]; 
        if(routerfun){
            routerfun.bind(this)(msg)
        }
    } 
   
}
