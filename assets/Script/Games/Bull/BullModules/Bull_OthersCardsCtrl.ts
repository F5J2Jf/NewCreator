/*
author: YOYO
日期:2018-02-05 10:05:18

他人的卡牌操作
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BullCardsMgr from "../BullMgr/BullCardsMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const C_cardAttr = "_cardInfo";
let ctrl : Bull_OthersCardsCtrl;
//模型，数据处理
class Model extends BaseModel{
    moveStartPos:cc.Vec2 = null
    maxHandlerCardNum:number = null                 //最大操作手牌数量
    cardOffRate:number = null                       //卡牌的间隔占卡牌本身的比例
    lowScaleRate:number = null                      //缩小的比例
    myViewSeatId:number = null                      //自己的UI座位
    cardMoveTime:number = null                      //卡牌移动需要时间
    cardIntervalTime:number = null                  //发牌间隔
	constructor()
	{
        super();
        this.myViewSeatId = 0;
        this.moveStartPos = cc.p(0, 0);
        this.maxHandlerCardNum = 5;
        this.cardOffRate = 0.4;
        this.lowScaleRate = 0.5;
        this.cardMoveTime = 0.25;
        this.cardIntervalTime = 0.1;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    dict_cards:{} = null
	ui={
        //在这里声明ui
        atlas_cards:null,
        node_givePos:null,
        node_resultType:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        
        this.dict_cards = {};
	}
	//初始化ui
	initUi()
	{
        this.ui.atlas_cards = ctrl.atlas_cards;
        this.ui.node_givePos = ctrl.node_givePos;
        this.ui.node_resultType = ctrl.node_resultType;
    }
    
    /**
     * 
     * 显示某个座位上的一组多张卡牌
     * @param viewSeatId: 视图上的座位id
     * @param cardsNum: 显示的卡牌数量
     */
    showCard(viewSeatId:number, cardsNum:number){
        if(!this.dict_cards[viewSeatId]) this.dict_cards[viewSeatId] = [];
        let i,
            cardNode;
        for(i = 0; i < this.model.maxHandlerCardNum; i ++){
            cardNode = this.dict_cards[viewSeatId][i];
            if(!cardNode){
                cardNode = BullCardsMgr.addOtherCard();
                this.dict_cards[viewSeatId].push(cardNode);
            }
            cardNode.zIndex = i;
            if(cardsNum > 0 && cardNode.active == false){
                cardsNum -= 1;
                cardNode.active = true;
                cardNode[C_cardAttr].logicValue = 0;
                cardNode[C_cardAttr].isOpen = false;
                BullCardsMgr.setCardValue(cardNode);
            }
        }
    }
    /**
     * 发牌
     * @param giveNum 发牌的数量
     */
    giveCards (viewSeatId:number, giveNum:number){
        let i,
            cardNode:cc.Node,
            startPos,
            targetPos,
            endPos,
            moveTime,
            intervalTime;

        startPos = this.model.moveStartPos;
        targetPos = this._getGiveTargetPos(viewSeatId);
        moveTime = this.model.cardMoveTime;
        intervalTime = this.model.cardIntervalTime;

        //create all
        this.showCard(viewSeatId, giveNum);

        for(i = 0; i < giveNum; i ++){
            cardNode = this.dict_cards[viewSeatId][giveNum - i - 1];
            if(cardNode){
                cardNode.position = startPos;
                cardNode.zIndex = i + 1;
                endPos = cc.p(targetPos.x, targetPos.y);
                endPos.x += i * this.model.cardOffRate * cardNode.width;
                let act1 = cc.delayTime(i * intervalTime);
                let act2 = cc.moveTo(moveTime, endPos);
                if(i == giveNum - 1){
                    let act3 = cc.callFunc(ctrl.onGiveCardsEnd, ctrl);
                    cardNode.runAction(cc.sequence(act1, act2, act3));
                }else{
                    cardNode.runAction(cc.sequence(act1, act2));
                }
            }
        }
    }

    //隐藏所有的卡牌
    coverAllCards(viewSeatId:number){
        BullCardsMgr.coverCards(this.dict_cards[viewSeatId]);
    }

    /**
     * 显示结果牌型
     * @param viewSeatId 界面上设置的id，从0开始
     * @param value 需要显示的牌型值
     */
    showResultType(viewSeatId:number, value){
        let typeNode = this.ui.node_resultType.children[viewSeatId];
        if(typeNode){
            typeNode.active = true;
            let target = typeNode.children[0].children[0];
            target.getComponent(cc.Label).string = BullCardsMgr.getTypeName(value);

        }
    }
    //隐藏所有的牌型结果体现
    hideAllResultType(){
        let nodeList = this.ui.node_resultType.children;
        for(let i = 0; i < nodeList.length; i ++){
            nodeList[i].active = false;
        }
    }

    //======================

    private _getGiveTargetPos(viewSeatId:number){
        let target = this.ui.node_givePos.getChildByName("seat_"+viewSeatId);
        return target.position
    }
}
//c, 控制
@ccclass
export default class Bull_OthersCardsCtrl extends BaseCtrl {
    model:Model = null
    view:View = null
    list_giveSeatId:Array<number> = null
	//这边去声明ui组件
    @property({
        type:cc.SpriteAtlas,
        displayName:"cardsAtlas"
    })
    atlas_cards:cc.SpriteAtlas = null
    @property({
        type:cc.Node,
        displayName:"giveCardPos"
    })
    node_givePos:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"resultType"
    })
    node_resultType:cc.Node = null
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
        this.n_events = {
            'test_onStartGive':this.onStartGive, 
            'test_cardDone':this.onCardDone
        }
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
    onStartGive(msg){
        console.log('开始给牌=====',  msg)
        let seatIdList:Array<number> = msg;
        if(seatIdList.indexOf(this.model.myViewSeatId) > -1){
            return;
        }
        this.list_giveSeatId = seatIdList;
        this._inGiveRound();
    }
    //某个玩家摊牌
    onCardDone(msg){
        console.log('onCardDone== ',msg)
        let idList = [1,2,3]
        let intervalId = setInterval(()=>{
            let id = idList.pop();
            if(id){
                let nodeList = this.view.dict_cards[id];
                BullCardsMgr.resetCardsValue(nodeList, [2,8,1,8,1]);
                BullCardsMgr.resortCardDone(nodeList);
                this.view.showResultType(id, 10);
            }else{
                clearInterval(intervalId);
            }
        }, 500)
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    //发牌结束回调
    public onGiveCardsEnd(){
        console.log('on_giveCardsEnd')
        this._inGiveRound();
        // this.view.openAllCards([40, 1, 13, 22, 34]);
    }
    //end
    
    private _inGiveRound(){
        if(this.list_giveSeatId && this.list_giveSeatId.length > 0){
            let id = this.list_giveSeatId.splice(0, 1)[0];
            this.view.giveCards(id, 5);
        }else {
            this.list_giveSeatId = null;
            G_FRAME.netEmitter.emit("test_giveCardEnd",null);
        }
    }
}