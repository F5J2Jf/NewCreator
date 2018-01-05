import DataTools from "../../GameManager/inGlobal_DataTools";
import ResLoadMgr from "../../GameManager/inGlobal_ResLoadMgr";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import BaseScene from "../../Libs/BaseScene";
import Enum from "../../Libs/Configs/inGlobal_Enum";
import BaseControl from "../../Libs/BaseControl";
const {ccclass, property} = cc._decorator;
let moduleObj:Model,
    viewObj:View,
    ctrlObj:GameSet;
//m，数据处理
class Model {
}
//v, 界面显示
class View {
    setShow(node:cc.Node,isShow:boolean){
        node.active = isShow;
    }
    setInteractable(isInteractable:boolean,target:cc.Node){
        let curButton:cc.Button = target.getComponent(cc.Button);
        curButton.interactable = isInteractable;
     }
     setButtonHigh(button:cc.Node,parentNode:cc.Node){
        let children,child;
        children = parentNode.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            (button == child)?this.setInteractable(false,child):this.setInteractable(true,child);            
        }
     }
     setChecked(node:cc.Node,isChecked:boolean){
        let curToggle:cc.Toggle = node.getComponent(cc.Toggle);
        curToggle.isChecked = isChecked;
     }
}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class GameSet extends BaseControl {
    _clickEvent : Part_setClickEvent
    @property(cc.Node)
    node_closeSet:cc.Node = null;
    @property(cc.Node)
    node_mandarin_check:cc.Node = null;
    @property(cc.Node)
    node_local_dialect_check:cc.Node = null;
    @property(cc.Node)
    node_game_exit:cc.Node = null;
    @property(cc.Node)
    node_local_dialect:cc.Node = null;
    @property(cc.Node)
    node_mandarin:cc.Node = null;
    @property(cc.Node)
    node_mode:cc.Node = null;
    @property(cc.Node)
    node_color:cc.Node = null;
    @property(cc.Node)
    node_music:cc.Node = null;
    @property(cc.Node)
    node_sound:cc.Node = null;
    onLoad() {
        
        //点击事件处理实例化
        this._clickEvent = this.getComponent(Enum.compName.clickAgent);
        //退出界面
        this._clickEvent.registerButton(this.node_closeSet, this._onClick_touch.bind(this), this,1);
        //点击地方话
        this._clickEvent.registerButton(this.node_local_dialect_check, this._onClick_touch.bind(this), this,2);
        //点击普通话
        this._clickEvent.registerButton(this.node_mandarin_check, this._onClick_touch.bind(this), this,3);
        //退出游戏
        this._clickEvent.registerButton(this.node_game_exit, this._onClick_touch.bind(this), this,4);
        //2种模式
        let children,child;
        children = this.node_mode.children;
        for(let i = 0; i < children.length; i ++){
            child = children[i];
            this._clickEvent.registerButton(child, this._onClick_touch, this, i+5);
        }
        //3种颜色
        children = this.node_color.children;
        for(let i = 0; i < children.length ; i ++){
            child = children[i];
            this._clickEvent.registerButton(child, this._onClick_touch, this, i+7);
        }
    }
    _onClick_touch (event, index){
        switch(index){
            case 1://关闭按钮
            this.hideLayer();
            break;
            case 2://地方话
            viewObj.setChecked(this.node_local_dialect,true);
            viewObj.setChecked(this.node_mandarin,false);
            break;
            case 3://普通话
            viewObj.setChecked(this.node_local_dialect,false);
            viewObj.setChecked(this.node_mandarin,true);
            break;
            case 4://退出游戏
            let changeData = {};
            changeData['sceneName'] = Enum.sceneName.Hall;
            DataTools.getInstance().changeScene(changeData);
            break;
            case 5://3D按钮
            viewObj.setButtonHigh(event.target,this.node_mode)
            break;
            case 6://2D按钮
            viewObj.setButtonHigh(event.target,this.node_mode)
            break;
            case 7://经典色
            viewObj.setButtonHigh(event.target,this.node_color)
            break;
            case 8://普蓝色
            viewObj.setButtonHigh(event.target,this.node_color)
            break;
            case 9://炫绿色
            viewObj.setButtonHigh(event.target,this.node_color)
            break;
        }
     }
    
    onSliderSEvent (sender, eventType) {
        //this.updateSoundVolume(sender.progress);
    }
    onSliderMEvent (sender, eventType) {
        //this.updateMusicVolume(sender.progress);
    }
    updateSoundVolume (progress) {
        
    }
    updateMusicVolume (progress) {
        
    }
}

