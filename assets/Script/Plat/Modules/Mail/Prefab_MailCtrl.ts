/*
author: Justin
日期:2018-01-12 11:07:01
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_MailCtrl;
//模型，数据处理
class Model extends BaseModel{
	public MailList : Array<any>;
	constructor()
	{
		super();
		this.MailList = [
			{
				id : 1,
				name : "系统邮件",
				detail : "这是一封系统邮件",
				read : false//是否已读
			},
			{
				id : 2,
				name : "mack",
				detail : "这是一封邀请邮件",
				read : false//是否已读
			},
			{
				id : 3,
				name : "jaci",
				detail : "这是一封交友邮件",
				read : false//是否已读
			},
			{
				id : 4,
				name : "eeee",
				detail : "这是一封约会邮件",
				read : false//是否已读
			},
			{
				id : 5,
				name : "rere",
				detail : "这是一封嗯邮件",
				read : false//是否已读
			},
			{
				id : 6,
				name : "tttt",
				detail : "这是一封好玩邮件",
				read : false//是否已读
			},
			{
				id : 7,
				name : "duleisi",
				detail : "这是一封好看邮件",
				read : false//是否已读
			},
			{
				id : 8,
				name : "juack",
				detail : "这是一封友好邮件",
				read : false//是否已读
			}
		]
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_ExitsMail : null,
		node_NotExitsMail : null,
		scroll_MailList : null,
		prefab_MailItem : null,
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
		this.ui.prefab_MailItem = ctrl.Prefab_MailItem;
		this.ui.scroll_MailList = ctrl.Scroll_MailList;
		this.ui.node_ExitsMail = ctrl.ExitsMail;
		this.ui.node_NotExitsMail = ctrl.NotExitsMail;
		this.ui.node_ExitsMail.active = true;
		this.ui.node_NotExitsMail.active = false;
		this.showInitMail();
	}

	showInitMail () : void {
		let list = this.model.MailList;
		let content : any = this.ui.scroll_MailList.content;
		let width = content.height;
		content.height = 0;
		for (let i = 0; i < list.length; i ++) {
			let item = cc.instantiate(this.ui.prefab_MailItem);
			content.addChild(item);
			item.getChildByName("FriendMail").getComponent(cc.Label).string = list[i].name;
			item.getChildByName("MailDetails").getComponent(cc.Label).string = list[i].detail;
			item.name = list[i].id+"";
			let readbtn = item.getChildByName("btn_readed");
			ctrl.connect(G_UiType.image, readbtn, ctrl.ReadMail_cb, "id:"+list[i].id+"一封邮件");
			content.height += item.height + content.getComponent(cc.Layout).spacingY;
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_MailCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "确定按钮",
		type : cc.Node
	})
	OkBtn : cc.Node = null;
	
	@property({
		tooltip : "不存在邮件节点界面",
		type : cc.Node
	})
	NotExitsMail : cc.Node = null;
	
	@property({
		tooltip : "存在邮件节点界面",
		type : cc.Node
	})
	ExitsMail : cc.Node = null;
	
	@property({
		tooltip : "一键领取",
		type : cc.Node
	})
	GetAllBtn : cc.Node = null;
	
	@property({
		tooltip : "一键阅读",
		type : cc.Node
	})
	ReadAllBtn : cc.Node = null;
	
	@property({
		tooltip : "刷新列表",
		type : cc.Node
	})
	RefreshBtn : cc.Node = null;
	
	@property({
		tooltip : "邮件列表",
		type : cc.ScrollView
	})
	Scroll_MailList : cc.ScrollView = null;
	
	@property({
		tooltip : "邮件列表部件",
		type : cc.Prefab
	})
	Prefab_MailItem : cc.Prefab = null;

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
		this.connect(G_UiType.image, this.CloseBtn, this.CloseBtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.OkBtn, this.CloseBtn_cb, "关闭按钮");
		this.connect(G_UiType.image, this.RefreshBtn, this.RefreshBtn_cb, "刷新按钮");
		this.connect(G_UiType.image, this.ReadAllBtn, this.ReadAllBtn_cb, "一键阅读按钮");
		this.connect(G_UiType.image, this.GetAllBtn, this.GetAllBtn_cb, "一键领取按钮");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private CloseBtn_cb (event) : void {
		this.finish();
	}
	private RefreshBtn_cb (event) : void {
		// this.finish();
	}
	private ReadAllBtn_cb (event) : void {
		// this.finish();
	}
	private GetAllBtn_cb (event) : void {
		// this.finish();
	}
	public ReadMail_cb (event) : void {
		this.start_sub_module(G_MODULE.MailItem);
	}
	//end
}