import Enum from "../../Libs/Configs/inGlobal_Enum";
import ResLoadMgr from "../../GameManager/inGlobal_ResLoadMgr";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import BaseControl from "../../Libs/BaseControl";

const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:MaJiangGameSettlement;
//m，数据处理
class Model {
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
export default class MaJiangGameSettlement extends BaseControl {

    @property(cc.Node)
    Button_settlement_close: cc.Node = null;
    @property(cc.Node)
    Button_continue_game: cc.Node = null;


    _clickEvent : Part_setClickEvent

    onLoad() {
        //点击事件处理实例化
        this._clickEvent = this.getComponent(Enum.compName.clickAgent);
        //点击关闭
        this._clickEvent.registerButton(this.Button_settlement_close, this._onClick_touch.bind(this), this);
        //点击继续游戏
        this._clickEvent.registerButton(this.Button_continue_game, this._onClick_GameChat.bind(this), this);
    }
    _onClick_touch (event){
        ResLoadMgr.getInstance().getPrefab(Enum.prefabName.gameSet, this.node, (uiGameSet)=>{
            viewObj.setShow(uiGameSet,true);
        })
     }

     _onClick_GameChat (event) : void {
        ResLoadMgr.getInstance().getPrefab(Enum.prefabName.chatNode, this.node.parent, (uiGameSet)=>{
            viewObj.setShow(uiGameSet,true);
        })
     }
}
