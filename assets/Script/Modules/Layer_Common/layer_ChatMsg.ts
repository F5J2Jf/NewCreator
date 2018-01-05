import BaseControl from "../../Libs/BaseControl";
import Part_setClickEvent from "../../Libs/Components/Part_setClickEvent";
import inGlobal_Enum from "../../Libs/Configs/inGlobal_Enum";
import inGlobal_ChineseConfig from "../../Libs/Configs/inGlobal_ChineseConfig";
//MVC编码示范
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:ChatNode;
//m，数据处理
class Model {
}
//v, 界面显示
class View {
    setContent (content:string):void{
        ctrlObj.ChatText.string = content;
        let width = ctrlObj.ChatText.node.width;
        if (width > 300) {
            ctrlObj.ChatText.node.parent.width = 300 + 10;
            ctrlObj.ChatText.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            ctrlObj.ChatText.node.width = 300;
            let height = ctrlObj.ChatText.node.height;
            ctrlObj.ChatText.node.parent.height = height * 1.5;                
        } else {
            ctrlObj.ChatText.overflow = cc.Label.Overflow.NONE;//更改文本布局
            let width = ctrlObj.ChatText.node.width;
            let height = ctrlObj.ChatText.node.height;
            ctrlObj.ChatText.node.parent.width = width + 10;                
            ctrlObj.ChatText.node.parent.height = height * 2.5;                
            ctrlObj.ChatText.node.height = height;
            ctrlObj.ChatText.node.width = width;
        }
        ctrlObj.ChatText.node.y = 40;
    }
}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class ChatNode extends BaseControl {
    @property(cc.Label)
    ChatText : cc.Label = null;

    onLoad (){
        ctrlObj = this;
        // viewObj.setContent('sdfsd');
    }

    setMsg (text : string) : void {
        viewObj.setContent(text);
    }

    start () { 
    }
}