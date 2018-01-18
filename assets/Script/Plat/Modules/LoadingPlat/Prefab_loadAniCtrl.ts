/*
author: YOYO
日期:2018-01-16 16:24:48
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_loadAniCtrl;
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
        node_img_load:null,
        node_img_bg:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.runLoading();
        this.setLoadAniShow(false);
        this.setBGShow(false);
	}
	//初始化ui
	initUi()
	{
        this.ui.node_img_load = ctrl.node_img_load;
        this.ui.node_img_bg = ctrl.node_img_bg;
    }
    
    public runLoading (){
        this.ui.node_img_load.runAction(cc.repeatForever(cc.rotateBy(1.5, 360)));
    }

    public setLoadAniShow(isShow){
        this.ui.node_img_load.active = isShow;
    }
    public setBGShow(isShow){
        this.ui.node_img_bg.active = isShow;
    }
}
//c, 控制
@ccclass
export default class Prefab_loadAniCtrl extends BaseCtrl {
	//这边去声明ui组件
    @property(cc.Node)
    node_img_load:cc.Node = null

    @property(cc.Node)
    node_img_bg:cc.Node = null
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

    private _inDelay:Boolean = null

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
	}
	start () {
        this._addTouchLimit();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
    //end

    private _addTouchLimit (){
        this.node.on(cc.Node.EventType.TOUCH_START, ()=>{
            console.log('touch limit')
        }, this);
    }
    
    public showLoad (){
        if(this._inDelay) return;
        this._inDelay = true;
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(()=>{
            this._inDelay = false;
            this.view.setBGShow(true);
            this.view.setLoadAniShow(true);
        })))
    }
    public clearLoad(){
        this.finish();
    }
}