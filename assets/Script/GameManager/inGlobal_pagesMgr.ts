import ResLoadMgr from "./inGlobal_ResLoadMgr";

//界面管理器,单例

export default class PagesMgr {
    _dict_ui: {}                                                                                                             //ui整理的字典
    _isOnLoad: Boolean                                                                                                       //是否正在加载中
    _node_grayLayer : cc.Node
    _container : cc.Node
    _init (){
        this._dict_ui = {};
        this._isOnLoad = false;
    }

    initContainer (containerNode:cc.Node){
        this._container = containerNode;
        this._node_grayLayer = this._container.children[0];
    }

    //获取一个可以显示的ui
    showPage (uiName, callBack) {
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
            ResLoadMgr.getInstance().getPrefab(prefabName, this._container, function (uiComp) {
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
        if (this._node_grayLayer) this._node_grayLayer.active = isShow;
    }

    //清理所有页面缓存
    clearAllPages (){
        for(let key in this._dict_ui){
            delete this._dict_ui[key];
        }
    }

    //单例处理
    private static _instance : PagesMgr;
    public static getInstance (){
        if(!this._instance){
            this._instance = new PagesMgr();
            this._instance._init();
        }
        return this._instance;
    }
}