/*
author: Justin
日期:2018-01-12 16:33:51
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MailDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
		
	}


}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_MailTitle : null,
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
	}
}
//c, 控制
@ccclass
export default class Prefab_MailDetailCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	Closebtn : cc.Node = null;

	@property({
		tooltip : "邮件标题",
		type : cc.Label
	})
	MailTitle : cc.Label = null;
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
		this.connect(G_UiType.image, this.Closebtn, this.Closebtn_cb, "关闭按钮")
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private Closebtn_cb () : void {
		this.finish();
	}
	//end
}