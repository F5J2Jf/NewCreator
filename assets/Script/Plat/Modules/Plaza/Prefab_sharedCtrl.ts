/*
author: YOYO
日期:2018-01-12 11:02:08
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import WxSdkMgr from "../../SdkMgrs/WxSdk";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_sharedCtrl;
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
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
	}
}
//c, 控制
@ccclass
export default class Prefab_sharedCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Node)
    node_weixin:cc.Node = null

    @property(cc.Node)
    node_phone:cc.Node = null
    
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
        this.connect(G_UiType.image, this.node_close, this.node_close_cb, '点击关闭')
        this.connect(G_UiType.image, this.node_weixin, this.node_weixin_cb, '微信分享')
        this.connect(G_UiType.image, this.node_phone, this.node_phone_cb, '点击关闭')
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    private node_close_cb(event){
        console.log('node_close_cb')
        this.finish();
    }
    private node_weixin_cb(event){
		console.log('node_weixin_cb');
		WxSdkMgr.getInstance().WxShare(1, "分享标题", "分享内容", "http://www.baidu.com", true);
    }
    private node_phone_cb(event){
        console.log('node_phone_cb')
    }

	//end
}