/*
author: YOYO
日期:2018-01-12 14:50:18
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import BehaviorMgr from "../../GameMgrs/BehaviorMgr";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_shopItemCtrl;
//模型，数据处理
class Model extends BaseModel{
    public m_goodsType:string = null
    public goodsId:number = null
    public m_moneyName:string = null
    public m_lastMoney:number = null
    public m_nowMoney:number = null
    public m_leaveNum:number = null
    public m_price:number = null

	constructor()
	{
        super();
        let infoList = null;
        var item_data = BehaviorMgr.getInstance().getGoodsItemData();

        this.goodsId = item_data[0];
        this.m_goodsType = item_data[1];
        
        if (this.m_goodsType == "coin"){
            infoList = GoodsCfg.getInstance().getCoinCfg();
        }else if (this.m_goodsType == "gold"){
            infoList = GoodsCfg.getInstance().getGoldCfg();
        }
        var infoObj = infoList[this.goodsId];
        this.m_moneyName = infoObj.name;
        this.m_lastMoney = infoObj.oprice;
        this.m_nowMoney = infoObj.price;
        this.m_leaveNum = infoObj.amount;
        this.m_price = infoObj.price;
    }
    
    public getIsActivity(){
        return true
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        lab_name:null,
        lab_last:null,
        lab_now:null,
        node_lab_now:null,
        lab_leaveNum:null,
        node_img_activity:null,
        sprite_money:null,
        spriteFrame_moneyType1:null,
        spriteFrame_moneyType2:null,
        sprite_buy:null,
        spriteFrame_buyType1:null,
        spriteFrame_buyType2:null,
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
        this.ui.lab_name = ctrl.lab_name;
        this.ui.lab_last = ctrl.lab_last;
        this.ui.lab_now = ctrl.lab_now;
        this.ui.node_lab_now = ctrl.node_lab_now;
        this.ui.lab_leaveNum = ctrl.lab_leaveNum;
        this.ui.node_img_activity = ctrl.node_img_activity;
        this.ui.sprite_money = ctrl.sprite_money;
        this.ui.spriteFrame_moneyType1 = ctrl.spriteFrame_moneyType1;
        this.ui.sprite_buy = ctrl.sprite_buy;
        this.ui.spriteFrame_buyType1 = ctrl.spriteFrame_buyType1;

        
        this.updateName();
        this.updateLeaveNum();
        this.updateLastMoney();
        this.updateNowMoney();
        this.updateActivity();
        this.showPromotionImg(this.model.m_goodsType);
        this.showDiscountsImg(this.model.m_goodsType);
        
        if(this.model.m_goodsType == 'coin') this.showGoldImg();
        else this.showJewelImg();
    }
    
    public updateName(){
        this.ui.lab_name.string = this.model.m_moneyName;
    }
    public updateLastMoney(){
        this.ui.lab_last.string = this.model.m_lastMoney;
    }
    public updateNowMoney(){
        this.ui.lab_now.string = this.model.m_nowMoney;
    }
    public updateActivity(){
        this.ui.node_img_activity.active = this.model.getIsActivity();
    }
    public updateLeaveNum(){
        this.ui.lab_leaveNum.string = this.model.m_leaveNum;
    }
    public showJewelImg (){
        if(!this.ui.spriteFrame_moneyType2) {
            this.ui.spriteFrame_moneyType2 = this.ui.sprite_money.spriteFrame;
        }else{
            this.ui.sprite_money.spriteFrame = this.ui.spriteFrame_moneyType2;
        }
        if(!this.ui.spriteFrame_buyType2) {
            this.ui.spriteFrame_buyType2 = this.ui.sprite_buy.spriteFrame;
        }else{
            this.ui.sprite_buy.spriteFrame = this.ui.spriteFrame_buyType2;
        }
    }
    public showGoldImg (){
        if(this.ui.spriteFrame_moneyType1) {
            this.ui.sprite_money.spriteFrame = this.ui.spriteFrame_moneyType1;
        }

        if(this.ui.spriteFrame_buyType1) {
            this.ui.sprite_buy.spriteFrame = this.ui.spriteFrame_buyType1;
        }
    }
    public showPromotionImg (strType){
        if (strType == 'coin') this.ui.node_img_activity.active = false;
        else this.ui.node_img_activity.active = true;
    }
    public showDiscountsImg (strType){
        if (strType == 'coin') {
            this.ui.lab_last.string = "";
            this.ui.node_lab_now.y = 0;
        }
    }
}
//c, 控制
@ccclass
export default class Prefab_shopItemCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Label)
    lab_name:cc.Label = null

    @property(cc.Label)
    lab_last:cc.Label = null

    @property(cc.Label)
    lab_now:cc.Label = null

    @property(cc.Node)
    node_lab_now:cc.Node = null

    @property(cc.Label)
    lab_leaveNum:cc.Label = null

    @property(cc.Node)
    node_img_activity:cc.Node = null

    @property(cc.Sprite)
    sprite_money:cc.Sprite = null

    @property(cc.SpriteFrame)
    spriteFrame_moneyType1:cc.SpriteFrame = null

    @property(cc.Sprite)
    sprite_buy:cc.Sprite = null

    @property(cc.SpriteFrame)
    spriteFrame_buyType1:cc.SpriteFrame = null

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
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin

    //end
}