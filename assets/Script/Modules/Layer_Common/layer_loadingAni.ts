import PagesMgr from "../../GameManager/inGlobal_pagesMgr";
import BaseLayer from "../../Libs/BaseLayer";


//加载动画
const {ccclass, property} = cc._decorator;

@ccclass
export default class layer_loadingAni extends BaseLayer {
    @property(cc.Node)
    node_loading = null
    start () {
        this._runLoading(this.node_loading);
    }
    //加载动画
    _runLoading (target:cc.Node){
        target.runAction(cc.repeatForever(cc.rotateBy(1.5, 360)));
    }

    // update (dt) {},
}
