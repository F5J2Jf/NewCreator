//点击事件
import Tools from '../../GameManager/inGlobal_Tools';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Part_setClickEvent extends cc.Component{

    // use this for initialization
    onLoad (){

    }

    //注册按钮点击效果
    registerButton (node:cc.Node, callBack:Function, target, userData?:any, isNoScale?:Boolean) {
        if(!node) return;
        node['_isTouchEnabledEx'] = true;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(event.target._isTouchEnabledEx) {
                if(event.target._isTouchDelayLimit) return;
                if(!isNoScale){
                    if(!event.target.lastScale) event.target.lastScale = event.target.scale;
                    event.target.scale = event.target.lastScale * 0.9;
                }
            }
        }, target);
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if(event.target.lastScale) event.target.scale = event.target.lastScale
            if(event.target._isTouchEnabledEx && !event.target._isTouchDelayLimit) {
                callBack.call(target, event, userData);
                event.target._isTouchDelayLimit = true;
                Tools.getInstance().timeout(()=>{
                    event.target._isTouchDelayLimit = false;
                }, 500);
            }
        }, target);
        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if(event.target.lastScale) event.target.scale = event.target.lastScale
        }, target);
    }
    //设置按钮是否可用
    setBtnEnable (node, isEnable, isNoGray) {
        if(isEnable){
            node.color = cc.Color.WHITE;
        }else{
            if(!isNoGray) node.color = cc.Color.GRAY;
        }
        var btn = node.getComponent(cc.Button);
        if(btn)btn.enabled = isEnable;
        node._isTouchEnabledEx = isEnable;
    }

    //获取是否可用
    getIsBtnEnable (node) {
        return node._isTouchEnabledEx
    }

    // update (dt) {},
}