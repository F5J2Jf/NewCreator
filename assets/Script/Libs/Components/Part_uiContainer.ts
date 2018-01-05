//界面管理
const {ccclass, property} = cc._decorator;
import inGlobal_Enum from "../Configs/inGlobal_Enum";
import ResLoadMgr from "../../GameManager/inGlobal_ResLoadMgr";

@ccclass
export default class Part_uiContainer extends cc.Component{
    _dict_ui: {}                                                                                                             //ui整理的字典
    _isOnLoad: Boolean                                                                                                       //是否正在加载中
    
    @property(cc.Node)
    node_grayLayer = null;

    // use this for initialization
    onLoad () {
        this._dict_ui = {};
        this._isOnLoad = false;

    }

    //获取一个可以显示的ui
    showUI (uiName, callBack) {
        if (this._isOnLoad) return;
        if (!uiName) {
            //错误的ui名称
            if (callBack) {
                callBack(null);
                callBack = null;
            }
            return
        }
        let uiComp = this._dict_ui[uiName];
        if (!uiComp) {
            //创建窗口
            let prefabName = uiName;
            let self = this;
            this._isOnLoad = true;
            ResLoadMgr.getInstance().getPrefab(prefabName, this.node, function (uiComp) {
                if(uiComp){
                    self._isOnLoad = false;
                    uiComp.setUIName(uiName);
                    if (uiComp.bindContainer) uiComp.bindContainer(self);
                    self._dict_ui[uiName] = uiComp;
                }
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

    //增加一个额外的ui到ui管理字典
    addUIEx (uiName, uiComp) {
        if (!uiComp) return;
        uiComp.setUIName(uiName);
        this._dict_ui[uiName] = uiComp;
    }

    //关闭一个ui
    closeUI (uiName) {
        if (!this._dict_ui[uiName]) return;
        this._dict_ui[uiName].hideLayer();
    }

    //获取一个UI的操作脚本
    getUIComp (uiName) {
        return this._dict_ui[uiName];
    }

    //关闭所有的窗口显示
    closeAllUI () {
        for (let uiName in this._dict_ui) {
            this.closeUI(uiName);
        }
    }

    _getDialogPos () {
        //let designSize = cc.view.getDesignResolutionSize();
        return cc.p(0,0);
    }

    //设置置灰层的显隐
    setGrayLayerIsShow (isShow) {
        if (this.node_grayLayer) this.node_grayLayer.active = isShow;
    }

    // update (dt) {},
}