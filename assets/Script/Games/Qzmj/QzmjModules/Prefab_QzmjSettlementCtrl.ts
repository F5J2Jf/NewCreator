/*
author: Justin
日期:2018-01-19 10:15:29
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_QzmjSettlementCtrl;
//模型，数据处理
class Model extends BaseModel{
	Settlement : any;
	constructor()
	{
		super();
		this.Settlement = {
			"process": 7,
			"handcards": {
				"0": [17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20],
				"1": [20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23],
				"2": [0, 0, 23, 23, 25, 25, 25, 25, 33, 33, 33],
				"3": [33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36]
			},
			"huinfo": {
				"hucards": [{
					"type": 0,
					"jincount": 1,
					"cards": [23]
				}, {
					"type": 2,
					"jincount": 1,
					"cards": [23, 25]
				}, {
					"type": 1,
					"cards": [25]
				}, {
					"type": 1,
					"cards": [33]
				}],
				"hutime": 5,
				"hutype": 0
			},
			"fanshus": {
				"0": -7,
				"1": -7,
				"2": 21,
				"3": -7
			},
			"difans": {
				"0": 1,
				"1": 1,
				"2": 2,
				"3": 1
			},
			"scores": {
				"0": -8400,
				"1": -8400,
				"2": 25200,
				"3": -8400
			},
			"roomvalue": {
				"seatcount": 4,
				"dizhu": 1200,
				"roundcount": 1,
				"jincount": 1,
				"sanjinbeishu": 3,
				"jinquebeishu": 3,
				"jinqueextra": 40,
				"jinfubeishu": 3,
				"jinfuextra": 3,
				"jinkanbeishu": 3,
				"jinkanextra": 3
			},
			"huacounts": {
				"0": 0,
				"1": 0,
				"2": 0,
				"3": 0
			},
			"lianzhuang": 1,
			"win_seatid": 2,
			"cardwallindex": 55
			// "process": 7,
			// "handcards": {
			// 	"0": [17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20],
			// 	"1": [0, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 23, 23],
			// 	"2": [23, 23, 24, 24, 24, 24, 25, 25, 25, 25, 33, 33, 33],
			// 	"3": [33, 34, 34, 34, 34, 35, 35, 35, 35, 36, 36, 36, 36]
			// },
			// "huinfo": {
			// 	"hucards": [{
			// 		"type": 0,
			// 		"jincount": 1,
			// 		"cards": [20]
			// 	}, {
			// 		"type": 2,
			// 		"cards": [20]
			// 	}, {
			// 		"type": 2,
			// 		"cards": [20]
			// 	}, {
			// 		"type": 2,
			// 		"cards": [21]
			// 	}, {
			// 		"type": 2,
			// 		"cards": [21]
			// 	}],
			// 	"hutime": 1,
			// 	"hutype": 0
			// },
			// "fanshus": {
			// 	"0": -4,
			// 	"1": 12,
			// 	"2": -4,
			// 	"3": -4
			// },
			// "difans": {
			// 	"0": 1,
			// 	"1": 2,
			// 	"2": 1,
			// 	"3": 1
			// },
			// "scores": {
			// 	"0": -1600,
			// 	"1": 4800,
			// 	"2": -1600,
			// 	"3": -1600
			// },
			// "roomvalue": {
			// 	"seatcount": 4,
			// 	"dizhu": 400,
			// 	"roundcount": 1,
			// 	"jincount": 1,
			// 	"sanjinbeishu": 3,
			// 	"jinquebeishu": 3,
			// 	"jinqueextra": 40,
			// 	"jinfubeishu": 3,
			// 	"jinfuextra": 3,
			// 	"jinkanbeishu": 3,
			// 	"jinkanextra": 3
			// },
			// "huacounts": {
			// 	"0": 0,
			// 	"1": 0,
			// 	"2": 0,
			// 	"3": 0
			// },
			// "lianzhuang": 1,
			// "win_seatid": 1,
			// "cardwallindex": 54
		}

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		// node_PlayerOne : null,
		// node_PlayerTwo : null,
		// node_PlayerThree : null,
		// node_PlayerFour : null,
		prefab_PlayerCards : null,
		node_PlayerCardsDetails : null,
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
		// this.ui.node_PlayerFour = ctrl.PlayerCardsFour;
		// this.ui.node_PlayerThree = ctrl.PlayerCardsThree;
		// this.ui.node_PlayerTwo = ctrl.PlayerCardsTwo;
		// this.ui.node_PlayerOne = ctrl.PlayerCardsOne;
		this.ui.prefab_PlayerCards = ctrl.PlayerCards;
		this.ui.node_PlayerCardsDetails = ctrl.PlayerCardDetails;
		let cards = this.model.Settlement.handcards;
		let huInfo = this.model.Settlement.huinfo;
		for (let i in cards) {
			let item = cc.instantiate(this.ui.prefab_PlayerCards);
			if (cards[i].length == 14) {
				item.getComponent(item.name+"Ctrl").initData(cards[i], huInfo);
			} else {
				item.getComponent(item.name+"Ctrl").initData(cards[i]);				
			}
			this.ui.node_PlayerCardsDetails.addChild(item);
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_QzmjSettlementCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "麻将的预制资源",
		type : cc.Prefab
	})
	MaJiangItem : cc.Prefab = null;
	@property({
		tooltip : "玩家牌数据的预制资源",
		type : cc.Prefab
	})
	PlayerCards : cc.Prefab = null;
	@property({
		tooltip : "玩家牌详情的节点",
		type : cc.Node
	})
	PlayerCardDetails : cc.Node = null;
	// @property({
	// 	tooltip : "玩家1的牌位置",
	// 	type : cc.Node
	// })
	// PlayerCardsOne : cc.Node = null;
	// @property({
	// 	tooltip : "玩家2的牌位置",
	// 	type : cc.Node
	// })
	// PlayerCardsTwo : cc.Node = null;
	// @property({
	// 	tooltip : "玩家3的牌位置",
	// 	type : cc.Node
	// })
	// PlayerCardsThree : cc.Node = null;
	// @property({
	// 	tooltip : "玩家4的牌位置",
	// 	type : cc.Node
	// })
	// PlayerCardsFour : cc.Node = null;

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
		this.connect(G_UiType.image, this.ui.node_PlayerCardsDetails.node, this.node_PlayerCardsDetails_cb, '点击详情');
	}
	node_PlayerCardsDetails_cb(event)
	{
		console.log("点击详情")；
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