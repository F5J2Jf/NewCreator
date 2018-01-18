/*
author: YOYO
日期:2018-01-13 11:24:10
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_shopDetailCtrl;
//模型，数据处理
class Model extends BaseModel{
    private _toBuyNum:number = null
    private _curPrice:number = null
    private _str_total:string = null
    private _leaveNum:number = null
    private _str_leaeveNum:string = null
	constructor()
	{
		super();
        this._toBuyNum = 0;
        this._curPrice = 88.8;
        this._leaveNum = 1000;
        this._str_total = '总价:'
        this._str_leaeveNum = '数量'
    }
    
    public getMoneyName(){
        return '钻石'
    }
    public getLastMoney(){
        return 99.9
    }
    public getNowMoney(){
        return this._curPrice
    }
    public getItemDetail (){
        return 'is a good item'
    }
    public getItemLeaveNum (){
        return this._str_leaeveNum + this._leaveNum
    }
    public getTotalPrice(){
        return this._str_total + this._curPrice * this._toBuyNum
    }
    public getToBuyNum (){
        return this._toBuyNum
    }
    public addToBuyNum(toNum:number = 1){
        this._toBuyNum += toNum;
    }
    public delToBuyNum(delNum:number = 1){
        this._toBuyNum -= delNum;
        this._toBuyNum = Math.max(this._toBuyNum, 0);
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        sprite_money:null,
        lab_moneyName:null,
        lab_leaveNum:null,
        lab_lastMoney:null,
        lab_nowMoney:null,
        lab_detail:null,
        lab_buyNum:null,
        lab_totalPrice:null,
        spriteFrame_jewel:null,
	};
    node=null;
    private _spriteFrame_gold:cc.SpriteFrame = null
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.sprite_money = ctrl.sprite_money;
        this.ui.lab_moneyName = ctrl.lab_moneyName;
        this.ui.lab_leaveNum = ctrl.lab_leaveNum;
        this.ui.lab_lastMoney = ctrl.lab_lastMoney;
        this.ui.lab_nowMoney = ctrl.lab_nowMoney;
        this.ui.lab_detail = ctrl.lab_detail;
        this.ui.lab_buyNum = ctrl.lab_buyNum;
        this.ui.lab_totalPrice = ctrl.lab_totalPrice;
        this.ui.spriteFrame_jewel = ctrl.spriteFrame_jewel;
    }
    
    public showGoldImg (){
        if(this._spriteFrame_gold){
            this.ui.sprite_money.spriteFrame = this._spriteFrame_gold;
        }
    }
    public showJewelImg (){
        if(!this._spriteFrame_gold){
            this._spriteFrame_gold = this.ui.sprite_money.spriteFrame;
        }
        this.ui.sprite_money.spriteFrame = this.ui.spriteFrame_jewel;
    }
    public updateMoneyName(){
        this.ui.lab_moneyName.string = this.model.getMoneyName();
    }
    public updateLeaveNum(){
        this.ui.lab_leaveNum.string = this.model.getItemLeaveNum();
    }
    public updateLastMoney(){
        this.ui.lab_lastMoney.string = this.model.getLastMoney();
    }
    public updateNowMoney(){
        this.ui.lab_nowMoney.string = this.model.getNowMoney();
    }
    public updateItemDetail(){
        this.ui.lab_detail.string = this.model.getItemDetail();
    }
    public updateToBuyNum(){
        this.ui.lab_buyNum.string = this.model.getToBuyNum();
        this.updateTotalPrive();
    }
    public updateTotalPrive(){
        this.ui.lab_totalPrice.string = this.model.getTotalPrice();
    }
}
//c, 控制
@ccclass
export default class Prefab_shopDetailCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Sprite)
    sprite_money:cc.Sprite = null

    @property(cc.Node)
    node_btn_add:cc.Node = null

    @property(cc.Node)
    node_btn_del:cc.Node = null

    @property(cc.Label)
    lab_moneyName:cc.Label = null

    @property(cc.Label)
    lab_leaveNum:cc.Label = null

    @property(cc.Label)
    lab_lastMoney:cc.Label = null

    @property(cc.Label)
    lab_nowMoney:cc.Label = null

    @property(cc.Label)
    lab_detail:cc.Label = null

    @property(cc.Label)
    lab_buyNum:cc.Label = null

    @property(cc.Label)
    lab_totalPrice:cc.Label = null

    @property(cc.SpriteFrame)
    spriteFrame_jewel:cc.SpriteFrame = null

    @property(cc.Node)
    node_close:cc.Node = null

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
        this.connect(G_UiType.image, this.node_btn_add, this.node_btn_add_cb, '点击增加')
        this.connect(G_UiType.image, this.node_btn_del, this.node_btn_del_cb, '点击减少')
        this.connect(G_UiType.image, this.node_close, this.node_close_cb, '点击关闭')
	}
	start () {
        this.view.showJewelImg();
        this.view.updateMoneyName();
        this.view.updateLeaveNum();
        this.view.updateLastMoney();
        this.view.updateNowMoney();
        this.view.updateItemDetail();
        this.view.updateToBuyNum();
        this.view.updateTotalPrive();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_btn_add_cb(){
        console.log('node_btn_add_cb')
        this.model.addToBuyNum();
        this.view.updateToBuyNum();
    }
    private node_btn_del_cb(){
        console.log('node_btn_del_cb')
        this.model.delToBuyNum();
        this.view.updateToBuyNum();
    }
    private node_close_cb(){
        console.log('node_btn_del_cb')
        this.finish();
    }

	//end
}