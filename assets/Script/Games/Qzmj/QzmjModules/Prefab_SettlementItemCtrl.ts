/*
author: Justin
日期:2018-01-19 10:45:02
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import QzmjResMgr from "../QzmjMgr/QzmjResMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_SettlementItemCtrl;
//模型，数据处理
class Model extends BaseModel{
	SettleData : any;
	constructor()
	{
		super();
	}

	public setSettleData (data : any) : void {
		this.SettleData = data;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		node_HuSign : null,
		node_GoldCard : null,
		node_GoldCardImg : null,
		prefab_CardItem : null,
		node_CardLayout : null,
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
		this.ui.node_GoldCard = ctrl.GoldCard;
		this.ui.node_CardLayout = ctrl.CardsNode;
		this.ui.prefab_CardItem = ctrl.CardItem;
		this.ui.node_GoldCardImg = ctrl.GoldCardImg;
		this.ui.node_HuSign = ctrl.HuSign;
		this.ui.node_HuSign.active = false;
		this.ui.node_GoldCard.active = false;
	}

	Show () : void {
		let data = this.model.SettleData;
		//结算胡
		if (data.hu) {
			let hus = data.hu.hucards[0];
			//显示金与胡标志
			if (hus.jincount) {
				this.ui.node_HuSign.active = true;
				this.ui.node_GoldCard.active = true;
				this.ui.node_GoldCardImg.spriteFrame = new cc.SpriteFrame(QzmjResMgr.getInstance().getCardTextureByValue(hus.jincount));
			}
		}
		//牌阵
		let cards = data.cards;
		for (let j = 0; j < cards.length; j ++) {
			let item = cc.instantiate(this.ui.prefab_CardItem);
			let sprite = item.getChildByName("MaJiang").getComponent(cc.Sprite);
			let id = cards[j];
			let textrue = QzmjResMgr.getInstance().getCardTextureByValue(id);
			sprite.spriteFrame = new cc.SpriteFrame(textrue);
			this.ui.node_CardLayout.addChild(item);
			item.x = j * item.width;
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_SettlementItemCtrl extends BaseCtrl {
	//这边去声明ui组件
	
	@property({
		tooltip : "玩家名称",
		type : cc.Label
	})
	PlayerName : cc.Label = null;
	
	@property({
		tooltip : "游戏规则",
		type : cc.Label
	})
	GameMode : cc.Label = null;
	
	@property({
		tooltip : "游戏水",
		type : cc.Label
	})
	GameWater : cc.Label = null;
	
	@property({
		tooltip : "游戏得分",
		type : cc.Label
	})
	GameScore : cc.Label = null;
	
	@property({
		tooltip : "牌阵",
		type : cc.Node
	})
	CardsNode : cc.Node = null;
	
	@property({
		tooltip : "胡牌标志",
		type : cc.Node
	})
	HuSign : cc.Node = null;
	
	@property({
		tooltip : "金牌",
		type : cc.Node
	})
	GoldCard : cc.Node = null;
	
	@property({
		tooltip : "金牌牌面值",
		type : cc.Sprite
	})
	GoldCardImg : cc.Sprite = null;
	
	@property({
		tooltip : "普通牌面值预制资源",
		type : cc.Prefab
	})
	CardItem : cc.Prefab = null;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离
	private _oData : any;

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
		this.model.setSettleData(this._oData);
		this.view.Show();
	
	}

	public initData (data, hu ?: any) : void {
		this._oData = {
			cards : data,
		};
		if (hu) this._oData["hu"] = hu; 
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}