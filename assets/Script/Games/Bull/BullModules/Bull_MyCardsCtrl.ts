/*
author: YOYO
日期:2018-02-05 10:04:43

自己的卡牌操作
*/
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BullCardsMgr from "../BullMgr/BullCardsMgr";
import Prefab_bull_calculateCtrl from "./Prefab_bull_calculateCtrl";

//MVC模块,
const {ccclass, property} = cc._decorator;
const C_cardAttr = "_cardInfo";
let ctrl : Bull_MyCardsCtrl;

//模型，数据处理
class Model extends BaseModel{
    maxHandlerCardNum:number = null                 //最大操作手牌数量
    cardOffRate:number = null                       //卡牌的间隔
    moveStartPos:cc.Vec2 = null                     //移动的起始位置
    touchUpY:number = null                          //点击卡牌后上升的高度
    myViewSeatId:number = null                      //自己的UI座位
    cardMoveTime:number = null                      //卡牌移动需要时间
    cardIntervalTime:number = null                  //发牌间隔
    touchUpNum:number = null                        //选中的卡牌数量
    maxTouchUpNum:number = null                     //最大的选卡数量
	constructor()
	{
		super();

        this.myViewSeatId = 0;
        this.maxHandlerCardNum = 5;
        this.cardOffRate = 0.4;
        this.moveStartPos = cc.p(0, 0);
        this.touchUpY = 15;
        this.cardMoveTime = 0.25;
        this.cardIntervalTime = 0.1;
        this.touchUpNum = 0;
        this.maxTouchUpNum = 3;
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    list_myCards:Array<cc.Node> = null
    list_hideCards:Array<cc.Node> = null
    num_showCards:number = null
    
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

        this.list_hideCards = [];
        this.list_myCards = [];
        this.num_showCards = 0;
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
     * 显示一组卡牌
     */
    showCard(cardsNum:number){
        let i,
            cardNode;
        for(i = 0; i < this.model.maxHandlerCardNum; i ++){
            cardNode = this.list_myCards[i];
            if(!cardNode){
                cardNode = BullCardsMgr.addMyCard();
                this.list_myCards.push(cardNode);
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
    giveCards (giveNum:number){
        let i,
            cardNode:cc.Node,
            startPos,
            targetPos,
            endPos,
            moveTime,
            intervalTime;

        startPos = this.model.moveStartPos;
        targetPos = this._getGiveTargetPos(0);
        moveTime = this.model.cardMoveTime;
        intervalTime = this.model.cardIntervalTime;

        //create all
        this.showCard(giveNum);

        for(i = 0; i < giveNum; i ++){
            cardNode = this.list_myCards[giveNum - i - 1];
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

    openAllCards (valueList){
        BullCardsMgr.openCards(this.list_myCards, valueList);
    }

    exchangeTouchState(cardNode:cc.Node){
        if(cardNode[C_cardAttr].initPosY){
            cardNode.y = cardNode[C_cardAttr].initPosY;
            cardNode[C_cardAttr].initPosY = null;
            this.model.touchUpNum -= 1;
            this.model.touchUpNum = Math.max(this.model.touchUpNum, 0);
        }else{
            if(this.model.touchUpNum < this.model.maxTouchUpNum){
                cardNode[C_cardAttr].initPosY = cardNode.y;
                cardNode.y += this.model.touchUpY;
                this.model.touchUpNum += 1;
            }            
        }
    }

    

    //隐藏所有的卡牌
    coverAllCards(){
        BullCardsMgr.coverCards(this.list_myCards);
    }

    openTouch (){
        this.node.on(cc.Node.EventType.TOUCH_START, ctrl.onTouchStart, ctrl);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, ctrl.onTouchMove, ctrl);
        this.node.on(cc.Node.EventType.TOUCH_END, ctrl.onTouchEnd, ctrl);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, ctrl.onTouchCancel, ctrl);
    }
    closeTouch(){
        this.node.off(cc.Node.EventType.TOUCH_START, ctrl.onTouchStart, ctrl);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, ctrl.onTouchMove, ctrl);
        this.node.off(cc.Node.EventType.TOUCH_END, ctrl.onTouchEnd, ctrl);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, ctrl.onTouchCancel, ctrl);
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

    //================================= private

    
    private _getGiveTargetPos(viewSeatId:number){
        let target = this.ui.node_givePos.getChildByName("seat_"+viewSeatId);
        return target.position
    }
}
//c, 控制
@ccclass
export default class Bull_MyCardsCtrl extends BaseCtrl {
    model:Model = null
    view:View = null
    private list_giveSeatId:Array<number> = null
    private list_touchPos:Array<cc.Vec2> = null
    private ctrl_calculate:Prefab_bull_calculateCtrl = null
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
        BullCardsMgr.initData(this, this.ui.atlas_cards);
	}

	//定义网络事件
	defineNetEvents()
	{
        this.n_events = {
            'test_onStartGive':this.onStartGive, 
            'test_giveCardEnd':this.onGiveCardEnd,
            'test_calculateDone':this.onCalculateDone,
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
        // this.view.giveCards(5);

        // this.view.openTouch();
	}
    //网络事件回调begin
    
    onStartGive(msg){
        let seatIdList:Array<number> = msg;
        if(seatIdList.indexOf(this.model.myViewSeatId) > -1){
            this.list_giveSeatId = seatIdList.slice(1, seatIdList.length);
            this.view.giveCards(5);
        }
    }
    //某个玩家摊牌
    onCardDone(msg){
        console.log('onCardDone== ',msg)

        this.view.closeTouch();
        this.ctrl_calculate.finish();
        this.ctrl_calculate = null;
        // this.view.coverAllCards();

        BullCardsMgr.resortCardDone(this.view.list_myCards);
        this.view.showResultType(this.model.myViewSeatId, 5);
    }
    //所有卡牌发牌结束
    onGiveCardEnd(){
        console.log('onGiveCardEnd===')
        this.view.openTouch();

        this.start_sub_module(G_MODULE.Bull_calculate, (ctrl)=>{
            this.ctrl_calculate = ctrl;
        })
    }
    //自己点击了摊牌
    onCalculateDone(){
        console.log('onCalculateDone=====')

        G_FRAME.netEmitter.emit("test_cardDone",this.list_giveSeatId);
    }

	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    
    //发牌结束回调
    public onGiveCardsEnd(){
        console.log('on_giveCardsEnd', this.list_giveSeatId)
        this.view.openAllCards([40, 1, 13, 22, 34]);

        G_FRAME.netEmitter.emit("test_onStartGive",this.list_giveSeatId);
        this.list_giveSeatId = null;
    }
    //点击了卡牌容器
    public onTouchStart(event){
        let pos = event.touch.getLocation();
        this.list_touchPos = [];
        this.list_touchPos.push(pos);
    }
    public onTouchMove(event){
        let pos = event.touch.getLocation();
        this.list_touchPos.push(pos);
        this.checkCardsTouch(this.view.list_myCards, [pos]);
    }
    public onTouchEnd(event){
        let cards = this.checkCardsTouch(this.view.list_myCards, this.list_touchPos);

        let i,
            list_down = [],
            list_up = [];
        for(i = 0; i < cards.length; i ++){
            let isDown = Boolean(cards[i][C_cardAttr].initPosY);
            if(isDown){
                //down
                list_down.push(this._getCardValue(cards[i][C_cardAttr].logicValue));
            }else{
                //up
                list_up.push(this._getCardValue(cards[i][C_cardAttr].logicValue));
            }
        }
        this.ctrl_calculate.delValues(list_down);
        this.ctrl_calculate.addValues(list_up);

        //一次最多只能选中三张卡牌
        // cards = cards.slice(0, 3);
        for(let i = 0; i < cards.length; i ++){
            cards[i].opacity = 255;
            console.log('click card VALUE= ', BullCardsMgr.getSixValue(cards[i][C_cardAttr].logicValue));
            this.view.exchangeTouchState(cards[i]);
        }
        this.list_touchPos = null;
    }
    public onTouchCancel(event){
        this.list_touchPos = null;
    }

    //end
    
    private _getCardValue(logicValue:number){
        let sixValue:string = BullCardsMgr.getSixValue(logicValue);
        return sixValue.slice(-1);
    }

    //handler here ======================================

    //检查是否卡牌已经被点击
    checkCardsTouch(cardsList:Array<cc.Node>, posList:Array<cc.Vec2>):Array<cc.Node>{
        let i, j,
            // cardsList = this.list_myCards,
            cardNode:cc.Node = null,
            cardRect,
            winSizeW2 = cc.director.getWinSize().width/2,
            winSizeH2 = cc.director.getWinSize().height/2,
            curX,
            curY,
            list_touchCards:Array<cc.Node> = [];
        for(i = 0; i < cardsList.length; i ++){
            cardNode = cardsList[i];
            if(cardNode.active && cardNode[C_cardAttr].isOpen){
                curX = cardNode.x+winSizeW2 - cardNode.width/2;
                curY = cardNode.y+winSizeH2 - cardNode.height/2;
                if(cardNode.zIndex == this.model.maxHandlerCardNum -1){
                    //最后一张
                    cardRect = cc.rect(curX, curY, cardNode.width, cardNode.height);
                }else{
                    cardRect = cc.rect(curX, curY, this.model.cardOffRate*cardNode.width, cardNode.height);
                }
                for(j = 0; j < posList.length; j ++){
                    if(cc.rectContainsPoint(cardRect, posList[j])) {
                        cardNode.opacity = 120;
                        list_touchCards.push(cardNode);
                        break;
                    }
                }
            }
        }
        return list_touchCards
    }

    onDestroy(){
        BullCardsMgr.clearData();
        super.onDestroy();
    }
}