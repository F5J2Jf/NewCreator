/*
author: Justin
日期:2018-01-10 21:34:44
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SettingCtrl;
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
	private node=null;
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
export default class Prefab_SettingCtrl extends BaseControl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭界面按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "提交兑换码按钮",
		type : cc.Node
	})
	SubmitCode : cc.Node = null;

	@property({
		tooltip : "复制微信号按钮",
		type : cc.Node
	})
	CopyWeChat : cc.Node = null;

	@property({
		tooltip : "绑定代理按钮",
		type : cc.Node
	})
	AgencyBind : cc.Node = null;

	@property({
		tooltip : "绑定账号按钮",
		type : cc.Node
	})
	AccountBind : cc.Node = null;

	@property({
		tooltip : "切换账号按钮",
		type : cc.Node
	})
	ChangeAccount : cc.Node = null;

	@property({
		tooltip : "语言选择",
		type : cc.Node
	})
	LanguageSelect : cc.Node = null;

	@property({
		tooltip : "兑换码",
		type : cc.EditBox
	})
	RedeemCode : cc.EditBox = null;

	@property({
		tooltip : "客服微信号",
		type : cc.Node
	})
	WeChat : cc.Node = null;

	@property({
		tooltip : "音乐开关",
		type : cc.Node
	})
	MusicBtn : cc.Node = null;

	@property({
		tooltip : "音效开关",
		type : cc.Node
	})
	EffectBtn : cc.Node = null;
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
		this.connect(G_UiType.image, this.CloseBtn, this._onClick_Close, '点击关闭')
		this.connect(G_UiType.image, this.SubmitCode, this._onClick_Close, '提交兑换码')
		this.connect(G_UiType.image, this.CopyWeChat, this._onClick_Close, '复制客服微信')
		this.connect(G_UiType.image, this.AgencyBind, this._onClick_AgencyBind, '绑定代理')
		this.connect(G_UiType.image, this.AccountBind, this._onClick_AccountBind, '绑定账号')
		this.connect(G_UiType.image, this.ChangeAccount, this._onClick_Close, '切换账号')
		this.connect(G_UiType.image, this.MusicBtn, this._onClick_Close, '音乐控制')
		this.connect(G_UiType.image, this.EffectBtn, this._onClick_Close, '音效控制')
		this.connect(G_UiType.edit, this.RedeemCode.node, this._onClick_Close, '兑换码')
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin

	/**
	 * 点击关闭
	 * @param event 
	 */
	private _onClick_Close (event) : void {
		this.finish();
	}

	/**
	 * 绑定账号
	 * @param event 
	 */
	private _onClick_AccountBind (event) : void {
		this.finish();
		this.start_sub_module(G_MODULE.AccountBind);
	}

	/**
	 * 绑定代理
	 * @param event 
	 */
	private _onClick_AgencyBind (event) : void {
		this.finish();
		this.start_sub_module(G_MODULE.AgencyBind);
	}

	/**
	 * 兑换码
	 * @param event 
	 */
	private _onEdit_Code (event) : void {

	}
	//end
}