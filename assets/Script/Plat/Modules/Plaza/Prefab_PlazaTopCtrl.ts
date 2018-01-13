/*
author: JACKY
日期:2018-01-10 17:16:06
*/
import BaseControl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import RoomMgr from "../../GameMgrs/RoomMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : NodeTopCtrl;
//模型，数据处理
class Model extends BaseModel{
    private _lv:number = null                       //等级
    private _name:string = null                     //名字
    private _leftMoney:number = null                //左边金钱
    private _rightMoney:number = null               //右边金钱
	constructor()
	{
		super();
        //test================
        this._lv = 999;
        this._name = 'testName';
        this._leftMoney = 989999999;
        this._rightMoney = 989999999;
    }
    
    public getCurLv (){
        return this._lv
    }
    public getName(){
        return this._name
    }
    public getLeftMoney(){
        return this._leftMoney
    }
    public getRightMoney(){
        return this._rightMoney
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        sprite_head : null,                 //头像图片
        lab_lv : null,                      //等级
        lab_name : null,                    //名字
        lab_leftMoney : null,               //左边金钱
        lab_rightMoney : null,              //右边金钱
	};
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.ui.sprite_head = ctrl.sprite_head;
		this.ui.lab_lv = ctrl.lab_lv;
		this.ui.lab_name = ctrl.lab_name;
		this.ui.lab_leftMoney = ctrl.lab_leftMoney;
		this.ui.lab_rightMoney = ctrl.lab_rightMoney;
    }
    
    //更新头像图片
    public setHead (toSprite:cc.SpriteFrame){
        this.ui.sprite_head.spriteFrame = toSprite; 
    }
    //等级
    public updateLv(){
        this.ui.lab_lv.string = this.model.getCurLv();
    }
    //名字
    public updateName(){
        this.ui.lab_name.string = this.model.getName();
    }
    //左边金钱
    public updateLeftMoney(){
        this.ui.lab_leftMoney.string = this.model.getLeftMoney();
    }
    //右边金钱
    public updateRightMoney(){
        this.ui.lab_rightMoney.string = this.model.getRightMoney();
    }
}
//c, 控制
@ccclass
export default class NodeTopCtrl extends BaseControl {
	//这边去声明ui组件
	@property(cc.Node)
	node_rightBtns:cc.Node = null
    
    @property(cc.Node)
    node_clickHead:cc.Node = null;
    
    @property(cc.Node)
    node_clickLeftMoney:cc.Node = null;
    
    @property(cc.Node)
    node_clickRightMoney:cc.Node = null;
    
    @property(cc.Sprite)
    sprite_head:cc.Sprite = null

    @property(cc.Label)
	lab_name:cc.Label = null;
	
	@property(cc.Label)
    lab_lv:cc.Label = null;

    @property(cc.Label)
	lab_leftMoney:cc.Label = null;
	
	@property(cc.Label)
    lab_rightMoney:cc.Label = null;
	
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
        let btns = this.node_rightBtns.children;
		this.connect(G_UiType.image,btns[0],this.btn_notice_cb,"公告");
		this.connect(G_UiType.image,btns[1],this.btn_setting_cb,"设置");
        this.connect(G_UiType.image,btns[2],this.btn_share_cb,"分享");
		this.connect(G_UiType.image,this.node_clickHead,this._onclick_head,"头像");
		this.connect(G_UiType.image,this.node_clickLeftMoney,this._onclick_leftMoney,"左边金钱");
		this.connect(G_UiType.image,this.node_clickRightMoney,this._onclick_rightMoney,"右边金钱");
	}
	start () {
        this.view.updateLv();
        this.view.updateName();
        this.view.updateLeftMoney();
        this.view.updateRightMoney();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	private btn_notice_cb (node,event){
		console.log('btn_notice_cb')
		RoomMgr.getInstance().reqRoomVerify();
	}
	private btn_setting_cb (node,event){
		console.log('btn_setting_cb')
		this.start_sub_module(G_MODULE.PlazaSetting);
	}
	private btn_share_cb (node,event){
		console.log('btn_share_cb')
    }
    private _onclick_head (node,event){
		console.log('_onclick_head')
    }
    private _onclick_leftMoney (node,event){
		console.log('_onclick_leftMoney')
    }
    private _onclick_rightMoney (node,event){
		console.log('_onclick_rightMoney')
	}
	//end
}