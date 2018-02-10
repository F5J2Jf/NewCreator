/*
author: tk
日期:2018-02-5 
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import QzmjResMgr from "../QzmjMgr/QzmjResMgr";
import QzmjLogic from "../QzmjMgr/QzmjLogic";
import { QzmjDef } from "../QzmjMgr/QzmjDef";
import {g_deepClone} from "../../../Plat/Libs/Gfun";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : Prefab_gameDetailResultCtrl;
//模型，数据处理
class Model extends BaseModel{
	Settlement : any;
	curcard=null;
	opcardarr=null;
	cardwallindex=null;
	win_seatid=null;
	lianzhuang=null;
	roomvalue=null;
	players=null;
	fanshus=null;
	huacounts=null;
	difans=null;
	scores=null;
	mysocre=null;
	handcards={};
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
		}

	}
	initData()
	{	
		var qzmjLogicInstance = QzmjLogic.getInstance();
		if(qzmjLogicInstance != null)
		{
			this.curcard=qzmjLogicInstance.curcard;
			this.opcardarr=qzmjLogicInstance.opcardarr;
			this.cardwallindex=qzmjLogicInstance.cardwallindex;
			this.win_seatid=qzmjLogicInstance.win_seatid;
			this.lianzhuang=qzmjLogicInstance.lianzhuang;
			this.roomvalue=qzmjLogicInstance.roomvalue;
			this.players=qzmjLogicInstance.players;
			this.fanshus=qzmjLogicInstance.fanshus;
			this.huacounts=qzmjLogicInstance.huacounts;
			this.difans=qzmjLogicInstance.difans;
			this.scores=qzmjLogicInstance.scores;
			this.mysocre=qzmjLogicInstance.mysocre;
			this.handcards=g_deepClone(qzmjLogicInstance.handcards);

		}
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btnConfirm:null,
		nodePlayer1Cards:null,
		nodePlayer2Cards:null,
		nodePlayer3Cards:null,
		nodePlayer4Cards:null,
		nodePlayer1Head:null,
		nodePlayer2Head:null,
		nodePlayer3Head:null,
		nodePlayer4Head:null,
		imgBanker:null
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
		this.ui.btnConfirm = ctrl.btnConfirm;
		this.ui.nodePlayer1Cards  = ctrl.nodePlayer1Cards;
		this.ui.nodePlayer2Cards  = ctrl.nodePlayer2Cards;
		this.ui.nodePlayer3Cards = ctrl.nodePlayer3Cards;
		this.ui.nodePlayer4Cards = ctrl.nodePlayer4Cards;
		this.ui.nodePlayer1Head = ctrl.nodePlayer1Head;
		this.ui.nodePlayer2Head = ctrl.nodePlayer2Head;
		this.ui.nodePlayer3Head = ctrl.nodePlayer3Head;
		this.ui.nodePlayer4Head = ctrl.nodePlayer4Head;
		this.ui.imgBanker = ctrl.imgBanker;
	}
	showDetailResult()
	{
		var nodeleap = 10;
		var nodeNum = 1;
		for (var i in this.model.players) {
			var cardList = null;
			var playeridx = Number(i);
			if (i == "1") {
				cardList = this.ui.nodePlayer2Cards.getChildByName("cardList");
				nodeNum = 1;
			}
			else if (i == "2") {
				cardList = this.ui.nodePlayer3Cards.getChildByName("cardList");
				nodeNum = 1;
			} else if (i == "3") {
				cardList = this.ui.nodePlayer4Cards.getChildByName("cardList");
				nodeNum = 1;
			}
			else {
				cardList = this.ui.nodePlayer1Cards.getChildByName("cardList");
				nodeNum = 1;
			}
			// 吃碰杠牌
			for (var j = 0; j < this.model.opcardarr[playeridx].length; j++) {
				// QzmjDef.op_angang=2;//暗杠
				// QzmjDef.op_gang=3;//杠
				// QzmjDef.op_peng=4;//碰
				// QzmjDef.op_chi=5;//吃
				switch (this.model.opcardarr[playeridx][j]['op']) {
					case QzmjDef.op_angang:
						for (var k = 1; k <= 4; k++) {
							var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
							cardNode.active = true;
							var cardValue = QzmjResMgr.getInstance().getCardTextureByValue(this.model.opcardarr[playeridx][j]['value']);
							var spriteFrame = new cc.SpriteFrame(cardValue)
							cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						}
						nodeNum++;
						break;
					case QzmjDef.op_gang:
						for (var k = 1; k <= 4; k++) {
							var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
							cardNode.active = true;
							var cardValue = QzmjResMgr.getInstance().getCardTextureByValue(this.model.opcardarr[playeridx][j]['value']);
							var spriteFrame = new cc.SpriteFrame(cardValue)
							cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						}
						nodeNum++;
						break;
					case QzmjDef.op_peng:
						for (var k = 1; k <= 3; k++) {
							var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
							cardNode.active = true;
							var cardValue = QzmjResMgr.getInstance().getCardTextureByValue(this.model.opcardarr[playeridx][j]['value']);
							var spriteFrame = new cc.SpriteFrame(cardValue)
							cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						}
						nodeNum++;
						break;
					case QzmjDef.op_chi:
						for (var k = 1; k <= 3; k++) {
							var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
							cardNode.active = true;
							var cardValue = QzmjResMgr.getInstance().getCardTextureByValue(this.model.opcardarr[playeridx][j]['value'][k-1]);
							var spriteFrame = new cc.SpriteFrame(cardValue)
							cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame; 
						}
						nodeNum++;
						break;
				}
			}
			//去除手牌中的抓牌或者胡牌
			if (this.model.curcard != null && this.model.players[i].seatid == this.model.win_seatid) {
				this.model.handcards[i].removeByValue(this.model.curcard);
			}
			// 手牌	
			var k = 1;
			var HandCardLoop = 0;
			for (var j = 0; j < this.model.handcards[i].length; j++) {
				if (j != 0 && j%3 == 0) {
					nodeNum++;
					HandCardLoop++;
					k = 1;
					var node = cardList.getChildByName("node"+nodeNum);
					node.setPosition(cc.v2(node.getPosition().x-nodeleap*HandCardLoop,node.getPosition().y));
				}
				var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card"+k);
				cardNode.active = true;
				var cardValue = QzmjResMgr.getInstance().getCardTextureByValue(this.model.handcards[i][j]);
				var spriteFrame = new cc.SpriteFrame(cardValue);
				cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame;
				k++;
			}
			//抓牌或者胡牌
			if (this.model.curcard != null && this.model.players[i].seatid == this.model.win_seatid) {
				nodeNum++;
				var cardNode = cardList.getChildByName("node"+nodeNum).getChildByName("card1");
				cardNode.active = true;
				var cardValue = QzmjResMgr.getInstance().getCardTextureByValue(this.model.curcard);
				var spriteFrame = new cc.SpriteFrame(cardValue);
				cardNode.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = spriteFrame;
			}
		}
	}
}
//c, 控制
@ccclass
export default class Prefab_gameDetailResultCtrl extends BaseCtrl {
	//这边去声明ui组件
	@property({
		tooltip : "确定按钮",
		type : cc.Node
	})
	btnConfirm : cc.Node = null;
	@property({
		tooltip : "玩家牌数据1",
		type : cc.Node
	})
	nodePlayer1Cards : cc.Node = null;
	@property({
		tooltip : "玩家牌数据2",
		type : cc.Node
	})
	nodePlayer2Cards : cc.Node = null;
	@property({
		tooltip : "玩家牌数据3",
		type : cc.Node
	})
	nodePlayer3Cards : cc.Node = null;
	@property({
		tooltip : "玩家牌数据4",
		type : cc.Node
	})
	nodePlayer4Cards : cc.Node = null;
	@property({
		tooltip : "玩家头像1",
		type : cc.Node
	})
	nodePlayer1Head : cc.Node = null;
	@property({
		tooltip : "玩家头像2",
		type : cc.Node
	})
	nodePlayer2Head : cc.Node = null;
	@property({
		tooltip : "玩家头像3",
		type : cc.Node
	})
	nodePlayer3Head : cc.Node = null;
	@property({
		tooltip : "玩家头像4",
		type : cc.Node
	})
	nodePlayer4Head : cc.Node = null;
	@property({
		tooltip : "庄家图像",
		type : cc.Sprite
	})
	imgBanker : cc.Sprite = null;

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
		this.connect(G_UiType.image, this.ui.btnConfirm, this.btnConfirm_cb, '点击确认');
	}
	start () {
		// this.view.showDetailResult();
	}
	btnConfirm_cb()
	{
		this.finish();
	}
	showDetailResult()
	{
		this.model.initData();
		console.log("show result");
		this.view.showDetailResult();
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
}