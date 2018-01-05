//简单的界面绑定( 该功能暂时不能使用 )
import Enum from '../../Libs/Configs/inGlobal_Enum'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Part_uiBinding extends cc.Component{
    _dict_comps : {}
    _isOnLoad : Boolean                               //是否正在加载预制体

    // @property
    // list_parents : Array<cc.Node> = null;

    // @property
    // list_uiPrefabs : Array<cc.Prefab> = null;

    onLoad () {
        this._dict_comps = {};
        this._doBinding();
    }
    //将对应的uiprefab绑定在对应的父节点上
    _doBinding (){
        // let parent, uiNode;
        // for(let i = 0; i < this.list_parents.length; i ++){
        //     parent = this.list_parents[i];
        //     if(this.list_uiPrefabs[i]){
        //         uiNode = cc.instantiate(this.list_uiPrefabs[i]);
        //         this._bindOne(parent, uiNode);

        //         this._dict_comps[uiNode.name] = uiNode.getComponent(uiNode.name);
        //     }
        // }
    }
    _bindOne (parent, uiNode){
        uiNode.parent = parent;
    }

    //获取某个ui对象的操作脚本
    getUIPrefabComp (compName){
        return this._dict_comps[compName];
    }

    //============================动态添加UI元素

    addUI (uiName, parent, callBack){
        if (this._isOnLoad) return;
        if (!uiName) {
            //错误的ui名称
            if (callBack) {
                callBack(null);
                callBack = null;
            }
            return
        }
        let uiComp = this._dict_comps[uiName];
        if (!uiComp) {
            //创建窗口
            let prefabName = uiName;
            this._isOnLoad = true;
            cc.loader.loadRes(Enum.localUrl.prefab_uiObject + prefabName, (err, prefab)=> {
                this._isOnLoad = false;
                let uiNode = cc.instantiate(prefab);
                uiNode.parent = parent;
                uiNode.position = cc.p(0,0);
                uiComp = uiNode.getComponent(uiName);
                if (uiComp.bindContainer) uiComp.bindContainer(parent);
                this._dict_comps[uiName] = uiComp;
                uiNode.active = false;
                if (callBack) {
                    callBack(uiComp);
                    callBack = null;
                }
            });
        } else {
            //已经创建过该ui
            if (callBack) {
                callBack(uiComp);
                callBack = null;
            }
        }
    }

    // update (dt) {},
}