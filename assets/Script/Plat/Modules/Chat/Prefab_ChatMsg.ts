import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_ChatNodeCtrl;
//m，数据处理
class Model extends BaseModel{
    constructor()
	{
        super();
	}
}
//v, 界面显示
class View extends BaseView{
    ui={
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.model=model;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		
	}
    setContent (content:string):void{
        ctrl.ChatText.string = content;
        let width = ctrl.ChatText.node.width;
        if (width > 300) {
            ctrl.ChatText.node.parent.width = 300 + 10;
            ctrl.ChatText.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
            ctrl.ChatText.node.width = 300;
            let height = ctrl.ChatText.node.height;
            ctrl.ChatText.node.parent.height = height * 1.5;                
        } else {
            ctrl.ChatText.overflow = cc.Label.Overflow.NONE;//更改文本布局
            let width = ctrl.ChatText.node.width;
            let height = ctrl.ChatText.node.height;
            ctrl.ChatText.node.parent.width = width + 10;                
            ctrl.ChatText.node.parent.height = height * 2.5;                
            ctrl.ChatText.node.height = height;
            ctrl.ChatText.node.width = width;
        }
        ctrl.ChatText.node.y = 40;
        ctrl.ChatText.node.active = true;
        ctrl.ChatImg.node.active = false;
    }
    setImg(img):void{
        ctrl.ChatImg.spriteFrame = img.spriteFrame;
        ctrl.ChatText.node.active = false;
        ctrl.ChatImg.node.active = true;
    }
}

//c, 控制
@ccclass
export default class Prefab_ChatNodeCtrl extends BaseControl {
    @property(cc.Label)
    ChatText : cc.Label = null;
    @property(cc.Sprite)
    ChatImg : cc.Sprite = null;
    onLoad (){
        ctrl = this;
		//初始化mvc
		this.initMvc(Model,View);
    }

    setMsg (text : string) : void {
        this.view.setContent(text);
        setTimeout(() => {
            this.finish();
        }, 1000);
    }
    setImg(img:cc.Sprite):void{
        this.view.setImg(img);
        setTimeout(() => {
            this.finish();
        }, 1000);
    }

    start () { 
    }
}
