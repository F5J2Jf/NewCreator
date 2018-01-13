/*
author: JACKY
日期:2018-01-10 17:17:40
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeBottomCtrl;
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
	};
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
export default class NodeBottomCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property(cc.Node)
	btn_task:cc.Node = null;

	@property(cc.Node)
	btn_competition:cc.Node = null;

	@property(cc.Node)
	btn_shop:cc.Node = null;

	@property(cc.Node)
	btn_mail:cc.Node = null;

	@property(cc.Node)
	btn_backpack:cc.Node = null;

	@property(cc.Node)
	btn_friend:cc.Node = null;

	@property(cc.Node)
	btn_box:cc.Node = null;
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
		this.connect(G_UiType.image,this.btn_task,this.btn_task_cb,"任务");
		this.connect(G_UiType.image,this.btn_competition,this.btn_competition_cb,"竞赛");
		this.connect(G_UiType.image,this.btn_shop,this.btn_shop_cb,"商城");
		this.connect(G_UiType.image,this.btn_mail,this.btn_mail_cb,"邮件");
		this.connect(G_UiType.image,this.btn_backpack,this.btn_backpack_cb,"背包");
		this.connect(G_UiType.image,this.btn_friend,this.btn_friend_cb,"牌友");
		this.connect(G_UiType.image,this.btn_box,this.btn_box_cb,"包厢");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_task_cb (node,event){
		console.log('1')
	}
	private btn_competition_cb (node,event){
		console.log('1')
	}
	private btn_shop_cb (node,event){
		console.log('1')
	}
	private btn_mail_cb (node,event){
		console.log('1')
		this.start_sub_module(G_MODULE.Mail);
	}
	private btn_backpack_cb (node,event){
		console.log('1')
	}
	private btn_friend_cb (node,event){
		console.log('1')
	}
	private btn_box_cb (node,event){
		console.log('1')
	}
	//end
}