//顶层界面处理
import Enum from '../Libs/Configs/inGlobal_Enum'
import Tools from './inGlobal_Tools'
import layer_loadingAni from '../Modules/Layer_Common/layer_loadingAni';

const {ccclass, property} = cc._decorator;
// const loadAniName = Enum.prefabName.loadingAni;
const tipFrameName = 'prefab_page_tipFrame';
const BASEURL = Enum.localUrl.prefab_uiObject;

@ccclass
export default class TopMgr{
    _netAni : layer_loadingAni
    _netAniShow : Boolean
    init (){

    }

    showNetRequest (callBack?:Function){
        this._netAniShow = true;
        let root:cc.Node = cc.find("Canvas");
        if(root){
            if(this._netAni){
                this._netAni.showLayer();
            }else{
                this._addPrefabUI(Enum.prefabName.loadingAni, root, (comp)=>{
                    if(comp){
                        this._netAni = comp;
                        comp.node.zIndex = Enum.topZIndex.top3;
                        if(callBack){
                            callBack(comp);
                            callBack = null;
                        }
                        if(this._netAniShow) this._netAni.showLayer();
                        else this._netAni.hideLayer();
                    }
                });
            }
        }
    }
    hideNetRequest (){
        this._netAniShow = false;
        if(this._netAni){
            this._netAni.hideLayer();
        }
    }
    //单选
    showTipConfirm (content, callBack){
        this._addTipFrame((uiComp)=>{
            uiComp.showConfirm(content, callBack);
        });
    }
    //多选
    showTipChoose (content, callBack){
        this._addTipFrame((uiComp)=>{
            uiComp.showChoose(content, callBack);
        });
    }
    //窗口提示
    _addTipFrame (callBack){
        let root:cc.Node = cc.find("Canvas");
        if(root){
            let uiComp = this._getPrefabUI(tipFrameName, root);
            if(uiComp){
                uiComp.node.active = true;
                if(callBack){
                    callBack(uiComp);
                    callBack = null;
                }
            }else{
                this._addPrefabUI(tipFrameName, root, (comp)=>{
                    if(comp){
                        comp.node.zIndex = Enum.topZIndex.top2;
                        comp.node.active = true;
                        if(callBack){
                            callBack(comp);
                            callBack = null;
                        }
                    }
                });
            }
        }
    }

    //直接在代码中增加prefabUI对象
    _addPrefabUI (prefabName:string, parent:cc.Node, callBack:Function){
        if (Tools.getInstance().isString(prefabName)) {
            let uiName = "_UI_"+prefabName;
            let uiComp = parent[uiName];
            if (!uiComp) {
                //创建窗口
                parent[uiName] = 11;
                cc.loader.loadRes(BASEURL + prefabName, (err, prefab)=> {
                    if(err){
                        cc.error(err)
                        parent[uiName] = null;
                    }else{
                        let uiNode = cc.instantiate(prefab);
                        uiNode.parent = parent;
                        let nameList = prefabName.split('/');
                        let compName = nameList[nameList.length -1];
                        parent[uiName] = uiNode.getComponent(compName);
                    }
                    if (callBack) {
                        callBack(parent[uiName]);
                        callBack = null;
                    }
                });
            } else {
                //已经创建过该ui
                if (callBack) {
                    callBack(uiComp == 11 ? null : uiComp);
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
    _getPrefabUI (prefabName, parent){
        let uiName = "_UI_"+prefabName;
        let uiComp = parent[uiName];
        return uiComp
    }

    clearTop (){
        this._netAni = null;
    }
    
    //单例处理
    private static _instance : TopMgr;
    public static getInstance (){
        if(!this._instance){
            this._instance = new TopMgr();
            this._instance.init();
        }
        return this._instance;
    }

    // update (dt) {},
}