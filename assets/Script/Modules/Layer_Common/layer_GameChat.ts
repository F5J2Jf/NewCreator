
import Enum from "../../Libs/Configs/inGlobal_Enum";
import ResLoadMgr from "../../GameManager/inGlobal_ResLoadMgr";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import BaseControl from "../../Libs/BaseControl";
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:GameChat;
//m，数据处理
class Model {
    // _attr1 : number = null
    // _attr2 : string = null
    // _attr3 : {} = null
    // _attr4 : Array<string> = null

}
//v, 界面显示
class View {
    setShow(node:cc.Node,isShow:boolean){
        node.active = isShow;
    }
}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class GameChat extends BaseControl {
    _clickEvent : Part_setClickEvent
    @property(cc.Label)
    game_time: cc.Label = null;    
    @property(cc.Node)
    game_set: cc.Node = null;   
     @property(cc.Node)
     game_chat: cc.Node = null;
    onLoad() {
        //点击事件处理实例化
        this._clickEvent = this.getComponent(Enum.compName.clickAgent);
        //点击设置界面
        this._clickEvent.registerButton(this.game_set, this._onClick_touch.bind(this), this);
        //点击聊天界面
        this._clickEvent.registerButton(this.game_chat, this._onClick_GameChat.bind(this), this);
    }
    _onClick_touch (event){
        ResLoadMgr.getInstance().getPrefab(Enum.prefabName.gameSet, this.node, (uiGameSet)=>{
            viewObj.setShow(uiGameSet,true);
        })
     }

     _onClick_GameChat (event) : void {
        ResLoadMgr.getInstance().getPrefab(Enum.prefabName.chatNode, this.node.parent, (uiGameSet)=>{
            uiGameSet.showLayer();
        })
     }
}
