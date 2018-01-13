import WM_Emitter from "../Libs/WM_Emitter";
import BaseMgr from "../Libs/BaseMgr";
import Prefab_MsgBoxCtrl from "../Modules/MsgBox/Prefab_MsgBoxCtrl";
import ModuleMgr from "./ModuleMgr";

 

var G_FRAME={}
G_FRAME['globalEmitter']=new WM_Emitter('全局事件分发器')
G_FRAME['netEmitter']=new WM_Emitter('网络事件分发器')
window['G_FRAME']=G_FRAME 

//基础的管理器
export default class FrameMgr{ 
    //单例处理 
    private static _instance:FrameMgr;
    public static getInstance ():FrameMgr{
        if(!this._instance){
            this._instance = new FrameMgr();
        }
        return this._instance;
    }
    /**
     * 
     * @param title 标题
     * @param content 内容
     * @param okcb 确定后的回调
     */
    showMsgBox(content:string, okcb?:Function, title?:string)
    {
        ModuleMgr.getInstance().start_sub_module(G_MODULE.MsgBox, (prefabComp:Prefab_MsgBoxCtrl)=>{
            prefabComp.showMsg(content, okcb, true, title)
        })
    }
    public showDialog(content:string, okcb?:Function, title?:string){
        ModuleMgr.getInstance().start_sub_module(G_MODULE.MsgBox, (prefabComp:Prefab_MsgBoxCtrl)=>{
            prefabComp.showMsg(content, okcb, false, title)
        })
    }
}
