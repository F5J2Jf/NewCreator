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
        btn_shop:ctrl.btn_shop,
        btn_welfare:ctrl.btn_welfare,
        btn_mail:ctrl.btn_mail,
        btn_more:ctrl.btn_more
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
	btn_shop:cc.Node = null;

    @property(cc.Node)
    btn_welfare:cc.Node = null;

	@property(cc.Node)
	btn_mail:cc.Node = null;

	@property(cc.Node)
	btn_more:cc.Node = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

	onLoad (){
		//创建mvc模式中模型和视图-0
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
        this.connect(G_UiType.button,this.ui.btn_shop,this.btn_shop_cb,"商城");
        this.connect(G_UiType.button,this.ui.btn_welfare,this.btn_welfare_cb,"福利");
        this.connect(G_UiType.button,this.ui.btn_mail,this.btn_mail_cb,"邮件");
        this.connect(G_UiType.button,this.ui.btn_more,this.btn_more_cb,"更多");
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_shop_cb (event){
        this.start_sub_module(G_MODULE.Shop);
	}
    private btn_welfare_cb (event) {
        this.start_sub_module(G_MODULE.LuckDraw);
    }
	private btn_mail_cb (event){
		this.start_sub_module(G_MODULE.Mail);
	}
    private btn_more_cb (event) {
		this.start_sub_module(G_MODULE.More);
    }
	//end
}
