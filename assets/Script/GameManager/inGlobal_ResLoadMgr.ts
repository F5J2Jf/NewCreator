//动态加载资源的管理(音效和json配置文件有自己的管理器)
const {ccclass, property} = cc._decorator;

import Tools from './inGlobal_Tools'
import Enum from '../Libs/Configs/inGlobal_Enum';
import TopMgr from './inGlobal_TopMgr';

@ccclass
export default class ResLoadMgr{

    _list_prefabInScene : {}
    _list_prefabInGlobal : {}
    // onLoad () {},

    _init () {
        
    }

    //加载prefab
    getPrefab (prefabName:string, parent:cc.Node, callBack:Function, isGlobal?:Boolean){
        if (Tools.getInstance().isString(prefabName)) {
            let uiName = "_UI_"+prefabName;
            let uiComp = parent[uiName];
            if (!uiComp) {
                //创建窗口
                parent[uiName] = 1;
                TopMgr.getInstance().showNetRequest();
                console.log('show net ani')
                cc.loader.loadRes(Enum.localUrl.prefab_uiObject + prefabName, (err, prefab)=> {
                    TopMgr.getInstance().hideNetRequest();
                    console.log('hide net ani')
                    if(err){
                        cc.error(err)
                        parent[uiName] = null;
                    }else{
                        let uiNode = cc.instantiate(prefab);
                        uiNode.parent = parent;
                        let nameList = prefabName.split('/');
                        let compName = nameList[nameList.length -1];
                        parent[uiName] = uiNode.getComponent(compName);
                        if(!parent[uiName]){
                            //如果该预制体上没有脚本，则返回节点
                            parent[uiName] = uiNode;
                        }
                        if(isGlobal){
                            if(!this._list_prefabInGlobal) this._list_prefabInGlobal = {};
                            this._list_prefabInGlobal[prefabName] = prefab;
                        }else{
                            if(!this._list_prefabInScene) this._list_prefabInScene = {};
                            this._list_prefabInScene[prefabName] = prefab;
                        }
                    }
                    if (callBack) {
                        callBack(parent[uiName]);
                        callBack = null;
                    }
                });
            } else {
                //已经创建过该ui
                if (callBack) {
                    callBack(uiComp == 1 ? null : uiComp);
                    callBack = null;
                }
            }
        }else{
            //错误的ui名称
            if (callBack) {
                callBack(null);
                callBack = null;
            }
        }
    }

    //加载图集
    // getAtlas (url, ){
    //     cc.loader.loadRes("test assets/sheep", cc.SpriteAtlas, function (err, atlas) {
    //         var frame = atlas.getSpriteFrame('sheep_down_0');
    //         sprite.spriteFrame = frame;
    //     });
    // }

    //释放prefab
    releasePrefabInGlobal (){
        // cc.loader.releaseAsset();
        // cc.loader.releaseRes("test assets/image", cc.SpriteFrame);
        if(this._list_prefabInGlobal){
            let prefab;
            for(let prefabName in this._list_prefabInGlobal){
                prefab = this._list_prefabInGlobal[prefabName];
                if(prefab){
                    cc.loader.releaseAsset(prefab);
                }
            }
        }
        this._list_prefabInGlobal = null;
    }

    //释放场景prefab
    releasePrefabInScene (){
        if(this._list_prefabInScene){
            let prefab;
            for(let prefabName in this._list_prefabInScene){
                prefab = this._list_prefabInScene[prefabName];
                if(prefab){
                    cc.loader.releaseAsset(prefab);
                }
            }
        }
        this._list_prefabInScene = null;
    }
    
    //释放图集
    releaseAtlas (atlas: cc.SpriteAtlas){
        var deps = cc.loader.getDependsRecursively(atlas);
        cc.loader.release(deps);
    }
    
    //单例处理
    private static _instance : ResLoadMgr;
    public static getInstance (){
        if(!this._instance){
            this._instance = new ResLoadMgr();
            this._instance._init();
        }
        return this._instance;
    }

    // update (dt) {},
}
