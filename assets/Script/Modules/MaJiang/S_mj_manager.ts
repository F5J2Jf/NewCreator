import BaseScene from "../../Libs/BaseScene";
//MVC编码示范
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:S_mj_manager;
//m，数据处理
class Model {
    // _attr1 : number = null
    // _attr2 : string = null
    // _attr3 : {} = null
    // _attr4 : Array<string> = null
}
//v, 界面显示
class View {
    // setContent (content:string):void{
    //     ctrlObj.label.string = content;
    // }
}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class S_mj_manager extends BaseScene {
    @property(cc.Prefab)
    Prefab_gameChat = null;
    @property(cc.Prefab)
    PreFab_UpMaJiang : cc.Prefab = null;
    @property(cc.Prefab)
    Prefab_clockNode : cc.Prefab = null;
    @property(cc.Prefab)
    PreFab_DownMaJiang : cc.Prefab = null;
    @property(cc.Prefab)
    PreFab_OtherMaJiang : cc.Prefab = null;
    @property(cc.Prefab)
    PreFab_MyMaJiang : cc.Prefab = null;
    @property(cc.Prefab)
    Prefab_ChatText : cc.Prefab = null;
    @property(cc.Prefab)
    Prefab_Dice : cc.Prefab = null;
    @property(cc.Node)
    MyPos : cc.Node = null;
    @property(cc.Node)
    UpPos : cc.Node = null;
    @property(cc.Node)
    DownPos : cc.Node = null;
    @property(cc.Node)
    OtherPos : cc.Node = null;
    @property(cc.Node)
    ChatPos : cc.Node = null;

    private _clockNode:cc.Node = null;
    private _diceNode:cc.Node = null;

    start () {
        let self = this;
        let curNode = cc.instantiate(this.Prefab_gameChat);
        this.node.addChild(curNode); 
        // let chatText = cc.instantiate(this.Prefab_ChatText);
        // this.node.addChild(chatText);
        // chatText.active = false; 
        // chatText.setPosition(self.ChatPos.getPosition());
       
        //骰子
        let diceNode = cc.instantiate(this.Prefab_Dice);
        this.node.addChild(diceNode);
        this._diceNode = diceNode;

        //chat msg
        self.node.on("chat", (event)=>{
            // cc.log(event.detail.msg);
            let chatText = cc.instantiate(this.Prefab_ChatText);
            this.node.addChild(chatText);
            chatText.setPosition(self.ChatPos.getPosition());
            chatText.getComponent("layer_ChatMsg").setMsg(event.detail.msg);
            self.scheduleOnce(()=>{
                // chatText.active = false;
                chatText.destroy();
            }, 1.5);
        });
        
        this._openDice(0,()=>{
            console.log("骰子结束");
            this._diceNode.active = false;
            //发牌
            this._Deal()
        });
    }
    _Deal(){
        let self = this;
        self.scheduleOnce(self._fCreateCard, 0.5);
    }
    _openClock(maxTime:number,endCallFunc:Function):void{
         //时钟
        let clockNode = cc.instantiate(this.Prefab_clockNode);
        this.node.addChild(clockNode);
        this._clockNode = clockNode;
        this._clockNode.getComponent('ui_MaJiangClock').openClock(maxTime,endCallFunc);
    }

    _openDice(diceDirection:number,endCallFunc:Function):void{
        this._diceNode.getComponent('ui_dice').openDice(diceDirection,endCallFunc);
    }

    _fCreateCard () : void {
        let self = this;
        let Up : cc.Node = cc.instantiate(self.PreFab_UpMaJiang);
        let Down : cc.Node = cc.instantiate(self.PreFab_DownMaJiang);
        let Other : cc.Node = cc.instantiate(self.PreFab_OtherMaJiang);
        let My : cc.Node = cc.instantiate(self.PreFab_MyMaJiang);
        let parent : cc.Node = self.node.getChildByName("background");
        parent.addChild(Up);
        parent.addChild(Down);
        parent.addChild(Other);
        parent.addChild(My);
        Up.setPosition(self.UpPos.getPosition());
        Down.setPosition(self.DownPos.getPosition());
        Other.setPosition(self.OtherPos.getPosition());
        My.setPosition(self.MyPos.getPosition());
        let maJiangCard = My.getComponent("MaJiangCard");
        maJiangCard.setEndFun(()=>{
            console.log("发牌结束");
            //显示时钟
            this._openClock(50,()=>{console.log("时钟结束")});
        });
    }
    
    // update (dt) {},
}
