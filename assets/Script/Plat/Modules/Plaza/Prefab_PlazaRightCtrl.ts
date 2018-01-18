/*
author: JACKY
日期:2018-01-10 17:16:21
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";
import VerifyMgr from "../../GameMgrs/VerifyMgr";
import ModuleMgr from "../../GameMgrs/ModuleMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeRightCtrl;
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
export default class NodeRightCtrl extends BaseControl {
	//这边去声明ui组件
    @property({
		tooltip : "创建房间按钮",
		type : cc.Node
	})
    CreateRoom:cc.Node = null;

    @property(cc.Node)
    node_quanzhou2:cc.Node = null;

    @property({
		tooltip : "加入房间按钮",
		type : cc.Node
	})
    JoinRoomBtn : cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
    
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//初始化mvc
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
        this.connect(G_UiType.image,this.CreateRoom,this.CreateRoom_cb,'创建房间');
        this.connect(G_UiType.image,this.node_quanzhou2,this.btn_quickstart_cb,'快速开始2');
        this.connect(G_UiType.image,this.JoinRoomBtn,this.JoinRoomBtn_cb,'加入房间');
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_quickstart_cb()
	{
		//在本地先判断下是否有足够金币加入金币场
		var ret=VerifyMgr.getInstance().checkCoin();
		if(!ret)
		{
			return;
		}
		//在这边验证加入
		RoomMgr.getInstance().reqRoomVerify();
	}

	private JoinRoomBtn_cb () : void {
		this.start_sub_module(G_MODULE.joinRoom);
	}

	private CreateRoom_cb () : void {
		this.start_sub_module(G_MODULE.createRoom);
	}
	//end
}