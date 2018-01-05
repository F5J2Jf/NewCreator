import BaseControl from "../../Libs/BaseControl";
//MVC编码示范
const {ccclass, property} = cc._decorator;

let moduleObj:Model,
    viewObj:View,
    ctrlObj:Demo;
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
        ctrlObj.label.string = content;
    }
}
moduleObj = new Model();
viewObj = new View();
//c, 控制
@ccclass
export default class Demo extends BaseControl {
    @property(cc.Label)
    label: cc.Label = null;

    onLoad (){
    
        ctrlObj = this;
        viewObj.setContent('sdfsd');
    }

    start () { 
        
    }
}