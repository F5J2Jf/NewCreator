import BaseControl from "../../Libs/BaseControl";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import inGlobal_ChineseConfig from "../../Libs/Configs/inGlobal_ChineseConfig";
//MVC编码示范
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:ChatNode,
    click : Part_setClickEvent;
//m，数据处理
class Model {
    _attr1 : number = null
    _attr2 : string = null
    _attr3 : {} = null
    _attr4 : Array<string> = null
}
//v, 界面显示
class View {
    setContent (content:string):void{
        // ctrlObj.label.string = content;
    }

    setEventTouch (ChatType : cc.Node) : void {
        let arr = ChatType.children;
        for (let i in arr) {
            let funcName = "_onClick_"+arr[i].name;
            let cb : Function = ctrlObj[funcName].bind(ctrlObj);
            click = ctrlObj.getComponent(inGlobal_Enum.compName.clickAgent);
            click.registerButton(arr[i], cb, ctrlObj);
        }
    }
}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class ChatNode extends BaseControl {
    // @property(cc.Label)
    // label: cc.Label = null;
    @property(cc.Node)
    ChatType : cc.Node = null;

    @property(cc.ScrollView)
    ExpressionScroll : cc.ScrollView = null;

    @property(cc.ScrollView)
    TextScroll : cc.ScrollView = null;

    @property(cc.SpriteAtlas)
    FaceFrame : cc.SpriteAtlas = null;

    @property(cc.Prefab)
    ChatText : cc.Prefab = null;

    onLoad (){
        ctrlObj = this;
        // viewObj.setContent('sdfsd');
        viewObj.setEventTouch(this.ChatType);
        this._addExpression();
        this._addChatText();
        click.registerButton(this.node, this._onClick_Close, this);        
        this.TextScroll.node.active = false;
    }

    start () { 
    }

    _onClick_FaceType (event, data) : void {
        this.ExpressionScroll.node.active = true;
        this.TextScroll.node.active = false;
    }

    _addExpression () : void {
        this.ExpressionScroll.content.height = 0;
        let index = 5,
        nodeHeight = 0;
        for (let i = 1; i < 30; i ++) {
            let node = new cc.Node();
            this.ExpressionScroll.content.addChild(node);
            node.name = i+"";
            let face = node.addComponent(cc.Sprite);
            face.spriteFrame = this.FaceFrame.getSpriteFrame(i+"");
            index --;
            if (index == 0) {
                this.ExpressionScroll.content.height += node.height + this.ExpressionScroll.content.getComponent(cc.Layout).spacingY;
                index = 5;
            }
            nodeHeight = node.height;
            click.registerButton(node, this._sendMsg, this, {text : node.name});
        }
        this.ExpressionScroll.content.height += nodeHeight;
    }

    _addChatText () : void {
        let list = inGlobal_ChineseConfig.ChatText;
        let node = this.TextScroll.content;
        this.TextScroll.content.height = 0;
        for (let i in list) {
            let text = list[i];
            let item = cc.instantiate(this.ChatText);
            node.addChild(item);
            item.getChildByName("content").getComponent(cc.Label).string = text;
            setTimeout(()=>{
                item.height = item.getChildByName("content").height;
                this.TextScroll.content.height += item.height + this.TextScroll.content.getComponent(cc.Layout).spacingY;
            }, 500);
            click.registerButton(item, this._sendMsg, this, {text : text});
        }
    }

    _onClick_TextType (event, data) : void {
        this.ExpressionScroll.node.active = false;
        this.TextScroll.node.active = true;
    }

    _sendMsg (event, data) : void {
        // cc.log(data.text);
        this.hideLayer();
        this.node.parent.emit("chat", {msg : data.text});
    }

    _onClick_Close () : void {
        this.hideLayer();
    }
}