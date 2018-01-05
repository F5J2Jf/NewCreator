import inGlobal_Enum from "./Configs/inGlobal_Enum";

//基础界面，带有界面的一些基础功能
const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseControl extends cc.Component {

    _isRelease : Boolean                                                                                                //是否在关闭的时候释放
    _uiName : string
    _parentComp : any
    _touchLimitComp : any

    // onLoad () {},

    start () {

    }

    bindContainer (comp) {
        this._parentComp = comp;
    }

    showLayer () {
        this.node.active = true;
        this.addTouchLimit();
        //在父节点上，是否有界面共用的灰色隔离层
        if(this._parentComp && this._parentComp.setGrayLayerIsShow) this._parentComp.setGrayLayerIsShow(true);
    }
    hideLayer () {
        this.cancelTouchLimit();
        if(this._isRelease) this.node.destroy();
        else this.node.active = false;
        //在父节点上，是否有界面共用的灰色隔离层
        if(this._parentComp && this._parentComp.setGrayLayerIsShow) this._parentComp.setGrayLayerIsShow(false);
    }
    //如果界面上有限制点击到界面下层的脚本，则执行他
    addTouchLimit () {
        var comp = this._getTouchLimitComp();
        
        if(comp) comp.addTouchLimit();
    }
    cancelTouchLimit () {
        var comp = this._getTouchLimitComp();
        if(comp) comp.cancelTouchLimit();
    }
    _getTouchLimitComp () {
        if(!this._touchLimitComp) {
            this._touchLimitComp = this.node.parent.getComponent(inGlobal_Enum.compName.touchLimit)
            if(!this._touchLimitComp){
                this._touchLimitComp = this.node.getComponent(inGlobal_Enum.compName.touchLimit)
            }
        }
        return this._touchLimitComp
    }
    //在界面关闭时候，是否及时释放。如果不设置，则在场景切换时候才会释放
    setIsRelease (isRelease) {
        this._isRelease = isRelease;
    }
    setUIName (uiName) {
        this._uiName = uiName;
    }
    getUIName () {
        return this._uiName
    }

    // update (dt) {},
}
