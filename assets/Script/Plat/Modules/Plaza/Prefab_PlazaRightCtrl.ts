/*
author: JACKY
日期:2018-01-10 17:16:21
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";

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
    @property(cc.Node)
    node_quanzhou1:cc.Node = null;

    @property(cc.Node)
    node_quanzhou2:cc.Node = null;

    @property(cc.Node)
    node_quanzhou3:cc.Node = null;
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
        this.connect(G_UiType.image,this.node_quanzhou1,this.btn_quickstart_cb,'快速开始1');
        this.connect(G_UiType.image,this.node_quanzhou2,this.btn_quickstart_cb,'快速开始2');
        this.connect(G_UiType.image,this.node_quanzhou3,this.btn_quickstart_cb,'快速开始3');
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
		//这边直接GameLoadMgr
		this.start_module(G_MODULE.LoadingGame) 
	}
	//end
}