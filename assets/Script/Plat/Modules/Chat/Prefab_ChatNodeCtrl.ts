/*
author: Justin
日期:2018-01-11 15:04:46
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_ChatNodeCtrl;
//模型，数据处理
class Model extends BaseModel{
	public ExpressionLen : number;
	public ChatText : Array<string>;
	constructor()
	{
		super();
		this.ExpressionLen = 29;
		this.ChatText = [
			"快点出牌！",
			"大家好！",
			"牌打得太好了！",
			"你会不会打牌啊！",
			"要糊了！",
			"要死了！"
		];
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		scroll_Expression : null,
		scroll_Text : null,
		atlas_Expression : null,
		prefab_ChatText : null,
	};
	private node=null;
	private model:Model =null
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.model=model;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.atlas_Expression = ctrl.ExpressionAtlas;
		this.ui.scroll_Expression = ctrl.ExpressionScroll;
		this.ui.prefab_ChatText = ctrl.Prefab_ChatText;
		this.ui.scroll_Text = ctrl.TextScroll;
		//默认是表情列表，所以文本节点不激活，避免吞噬触摸事件
		this.ui.scroll_Text.node.active = false;
		this.addExpress();
		this.addText();
	}

	addExpress () : void {
		let index = 5,
		allHeight = 0,
		spacingY = this.ui.scroll_Expression.content.getComponent(cc.Layout).spacingY,
        nodeHeight = 0;
		let len : any = this.model.ExpressionLen;
		let width = this.ui.scroll_Expression.content.width;
		this.ui.scroll_Expression.content.height = 0;
		for (let i = 1; i < len + 1; i ++) {
			let node = new cc.Node();
			node.name = i + "";
			let expression = node.addComponent(cc.Sprite);
			expression.spriteFrame = this.ui.atlas_Expression.getSpriteFrame(i);
			this.ui.scroll_Expression.content.addChild(node);
			index --;
            if (index == 0) {
				allHeight += node.height + spacingY;
                index = 5;
            }
            nodeHeight = node.height;
		}
		this.ui.scroll_Expression.content.height = allHeight + nodeHeight;
	}
	
	addText () : void {
		let list = this.model.ChatText;
        let node = this.ui.scroll_Text.content;
        this.ui.scroll_Text.content.height = 0;
        for (let i in list) {
            let text = list[i];
            let item = cc.instantiate(this.ui.prefab_ChatText);
            node.addChild(item);
            item.getChildByName("content").getComponent(cc.Label).string = text;
        //     setTimeout(()=>{
        //         item.height = item.getChildByName("content").height;
        //         this.TextScroll.content.height += item.height + this.TextScroll.content.getComponent(cc.Layout).spacingY;
        //     }, 500);
			// click.registerButton(item, this._sendMsg, this, {text : text});
			this.ui.scroll_Text.content.height += item.height + this.ui.scroll_Text.content.getComponent(cc.Layout).spacingY;
        }
	}

	showExpression () : void {
		this.ui.scroll_Expression.node.active = true;
		this.ui.scroll_Text.node.active = false;
	}

	showText () : void {
		this.ui.scroll_Expression.node.active = false;
		this.ui.scroll_Text.node.active = true;
	}
}
//c, 控制
@ccclass
export default class Prefab_ChatNodeCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "聊天类型，表情还是文本",
		type : cc.ToggleGroup
	})
	ChatType : cc.ToggleGroup = null;

	@property({
		tooltip : "聊天类型，表情按钮",
		type : cc.Node
	})
	ExpressionBtn : cc.Node = null;

	@property({
		tooltip : "聊天类型，文本按钮",
		type : cc.Node
	})
	TextBtn : cc.Node = null;

	@property({
		tooltip : "表情图集",
		type : cc.SpriteAtlas
	})
	ExpressionAtlas : cc.SpriteAtlas = null;

	@property({
		tooltip : "表情容器",
		type : cc.ScrollView
	})
	ExpressionScroll : cc.ScrollView = null;

	@property({
		tooltip : "文本容器",
		type : cc.ScrollView
	})
	TextScroll : cc.ScrollView = null;

	@property({
		tooltip : "聊天文本预制体",
		type : cc.Prefab
	})
	Prefab_ChatText : cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.model = new Model();
		//视图
		this.view = new View(this.model);
		//引用视图的ui
		this.ui=this.view.ui;
		//定义网络事件
		this.defineNetEvents();
		//定义全局事件
		this.defineGlobalEvents();
		//注册所有事件
		this.regAllEvents()
		//绑定ui操作
		this.connectUi();
	}

	//定义网络事件
	defineNetEvents()
	{
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{ 
		this.connect(G_UiType.image, this.ExpressionBtn, this._onClick_ExpressionBtn, "表情类型")
		this.connect(G_UiType.image, this.TextBtn, this._onClick_TextBtn, '文本类型')
	}
	start () {
		// this.view.addExpress();
		// this.view.addText();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private _onClick_ExpressionBtn () : void {
		this.view.showExpression();
	}
	private _onClick_TextBtn () : void {
		this.view.showText();
	}
	
	//end
}