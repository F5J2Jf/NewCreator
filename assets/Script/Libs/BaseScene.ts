//基础的场景类
import PagesMgr from '../GameManager/inGlobal_pagesMgr';
import ResLoadMgr from '../GameManager/inGlobal_ResLoadMgr';
import TopMgr from '../GameManager/inGlobal_TopMgr';
import Tools from '../GameManager/inGlobal_Tools';
import Listener from './NotifyEvent/inGlobal_Listener';

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseScene extends cc.Component{
    _list_global_listener : Array<any>                                           //场景中的全局监听

    onLoad () {
        //G_WEB().initSceneSize();
    }

    addSceneListener (patchType, callBack){
        if(!this._list_global_listener) this._list_global_listener = [];
        let curListener = Listener.getInstance();
        let listenerName = curListener.registerFunc(patchType, callBack)
        let listenerData = curListener.getTypeObj(patchType, listenerName);
        this._list_global_listener.push(listenerData);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onDestroy (){
        let curTools = Tools.getInstance();
        curTools.clearNodeTimeout();
        curTools.clearNodeInterval();
        TopMgr.getInstance().clearTop();
        ResLoadMgr.getInstance().releasePrefabInScene();
        PagesMgr.getInstance().clearAllPages();
        //场景退出，清理所有在场景上的监听
        if(this._list_global_listener){
            for(let i = 0; i < this._list_global_listener.length; i ++){
                Listener.getInstance().delListen(this._list_global_listener[i].patchType, this._list_global_listener[i].listenerName);
            }
            this._list_global_listener = null;
        }
    }
}