/*
author: Justin
日期:2018-01-13 16:32:58
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_CreateRoomCtrl;
//模型，数据处理
class Model extends BaseModel{
	GameType : number;
	RoomName : string;
	constructor()
	{
		super();
		this.RoomName = "推倒胡";
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		label_RoomName : ctrl.RoomName,
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
		this.ui.label_RoomName.string = this.model.RoomName;
	}

	updateRoomName () :void {
		this.ui.label_RoomName.string = this.model.RoomName;		
	}
}
//c, 控制
@ccclass
export default class Prefab_CreateRoomCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "关闭按钮",
		type : cc.Node
	})
	CloseBtn : cc.Node = null;

	@property({
		tooltip : "创建按钮",
		type : cc.Node
	})
	CreateBtn : cc.Node = null;

	@property({
		tooltip : "推到胡",
		type : cc.Node
	})
	TearDownBtn : cc.Node = null;

	@property({
		tooltip : "做牌推倒胡",
		type : cc.Node
	})
	DoTearDownBtn : cc.Node = null;

	@property({
		tooltip : "房间类型",
		type : cc.Label
	})
	RoomName : cc.Label = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View);

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
		this.connect(G_UiType.image, this.CreateBtn, this.CreateBtn_cb, "创建按钮");
		this.connect(G_UiType.image, this.TearDownBtn, this.TearDownBtn_cb, "推倒胡");
		this.connect(G_UiType.image, this.DoTearDownBtn, this.DoTearDownBtn_cb, "做牌推倒胡");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private CloseBtn_cb () : void {
		this.finish();
	}
	private CreateBtn_cb () : void {
		this.start_module(G_MODULE.LoadingGame) 
	}
	private TearDownBtn_cb () : void {
		this.model.RoomName = "推倒胡";
		this.view.updateRoomName();
	}
	private DoTearDownBtn_cb () : void {	
		this.model.RoomName = "做牌推倒胡";
		this.view.updateRoomName();
	}
	//end
}