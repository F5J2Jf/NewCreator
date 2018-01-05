//点击限制
const {ccclass, property} = cc._decorator;

@ccclass
export default class Part_touchLimit extends cc.Component{
    init (){

    }
    // use this for initialization
    onLoad () {
    
    }
    
    addTouchLimit (isGray) {
        this.node.on(cc.Node.EventType.TOUCH_START, this._touchThisLayer, this);
    }

    _touchThisLayer () {

    }
    
    cancelTouchLimit () {
        this.node.off(cc.Node.EventType.TOUCH_START, this._touchThisLayer, this);
    }

    //设置是否有置灰层
    setIsShowGray (isGray) {
        // if(!this['_grayLayer']){

        // }
    }

    // update (dt) {},
}