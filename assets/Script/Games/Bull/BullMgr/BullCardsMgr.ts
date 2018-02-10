import BaseMgr from "../../../Plat/Libs/BaseMgr";

//牛牛卡牌

const C_cardAttr = "_cardInfo";
const C_config = {
    otherCardSizeRate:0.5
}
const C_CardType = cc.Enum({
    block : 0,//方块
    flower : 1,//梅花
    redHeart : 2,//红心
    blackHeart : 3//黑桃
}) 

class BullCardsMgr extends BaseMgr{
    atlas_cards:cc.SpriteAtlas = null
    node_handler:cc.Node = null
    ctrl_handler:any = null
    /**
     * 
     * @param handler 自己的卡牌操作类
     * @param atlas_cards 卡牌值的切换图集
     */
    initData(handler, atlas_cards){
        this.ctrl_handler = handler;
        this.node_handler = handler.node;
        this.atlas_cards = atlas_cards;
    }
    clearData(){
        this.atlas_cards = null;
        this.ctrl_handler = null;
        this.node_handler = null;
        BullCardsMgr._instance = null;
    }

    // //获取card花色
    // getCardColor(cardData) {
    //     return (cardData & 0xf0) >> 4
    // }
    // //获取card值
    // getCardValue (cardData){
    //     return (cardData & 0x0f)
    // }
    /**
     * 
     * @param logicNum 逻辑值，返回二进制命名
     */
    getSixValue(logicNum){
        logicNum = parseInt(logicNum);
        let str = logicNum < 14 ?  "0x0" : "0x";
        return str + logicNum.toString(16);
    }
    /**
     * 
     * @param cardNode 需要更新值的卡牌节点对象
     */
    setCardValue(cardNode:cc.Node){
        let value = parseInt(cardNode[C_cardAttr].logicValue);
        let sixValue = this.getSixValue(value);
        let name = "bull_"+sixValue;
        let frame = this.atlas_cards.getSpriteFrame(name);
        if(frame){
            cardNode.getComponent(cc.Sprite).spriteFrame = frame;
            cardNode.width *= cardNode[C_cardAttr].cardScale;
            cardNode.height *= cardNode[C_cardAttr].cardScale;
        }else{
            cc.error('atlas lost frame= '+name+', user value= ',value);
        }
    }
    //增加一张自己的卡牌
    addMyCard(){
        let curNode = new cc.Node();
        curNode.parent = this.node_handler;
        curNode.addComponent(cc.Sprite);
        curNode[C_cardAttr] = {
            logicValue:0,
            isOpen:false,
            cardScale:1,
            initPosY:null
        }
        this.setCardValue(curNode);
        return curNode
    }
    //增加一张他人的卡牌
    addOtherCard(){
        let curNode = new cc.Node();
        curNode.parent = this.node_handler;
        curNode.addComponent(cc.Sprite);
        curNode[C_cardAttr] = {
            logicValue:0,
            cardScale:C_config.otherCardSizeRate,
            isOpen:false
        }
        this.setCardValue(curNode);
        return curNode
    }
    /**
     * 隐藏所有的卡牌
     * @param cardsList 需要翻到背面的卡牌列表
     */
    coverCards(cardsList:Array<cc.Node>){
        let len = cardsList.length;
        for(let i = 0; i < len; i ++){
            this._coverCard(cardsList[i]);
        }
    }
    /**
     * 打开一组牌
     * @param cardsList 需要翻开牌的列表
     * @param valueList 翻牌后需要显示的值列表
     */
    openCards(cardsList:Array<cc.Node>, valueList:Array<number>){
        let cardNode;
        for(let i = 0; i < cardsList.length; i ++){
            cardNode = cardsList[i];
            if(cardNode.active){
                cardNode[C_cardAttr].logicValue = valueList[i];
                this._openCard(cardNode);
            }
        }
    }
    /**
     * 根据x值大小排序
     * @param cardsList 需要根据x坐标重新整理的卡牌列表
     */
    reSortCardByPosX(cardsList:Array<cc.Node>){
        let resort = function(a, b){
            return a.x - b.x;
        }
        cardsList = cardsList.sort(resort);
        return cardsList
    }
    resetCardsValue(cardNodeList:Array<cc.Node>, valueList:Array<number>){
        let cardNode;
        for(let i = 0; i < cardNodeList.length; i ++){
            cardNode = cardNodeList[i];
            cardNode[C_cardAttr].logicValue = valueList[i];
            this.setCardValue(cardNode);
        }
    }
    /**
     * 显示牌型结果，牛几,重新整理卡牌, 摊牌后卡牌的整理
     * @param cardsList 传入整理好的5张牌的list，会将后两张特殊表现，突出牛几
     */
    resortCardDone(cardsList:Array<cc.Node>){
        cardsList = this.reSortCardByPosX(cardsList.concat([]));
        let len = cardsList.length;
        let oprList = cardsList.slice(len-2, len);
        let card;
        for(let i = 0; i < oprList.length; i ++){
            card = oprList[i];
            card.zIndex = 0;
            card.y += card.height*0.35;
            card.x -= card.width*0.9;
        }
    }
    /**
     * 获取牌型的名字
     * @param value 传入牛几的值，返回显示的名称，如牛五
     */
    getTypeName(value){
        value = parseInt(value);
        let name;
        switch(value){
            case 0:
                name = '无牛';
                break;
            case 10:
                name = '牛牛';
                break;
            default:
                name = '牛'+value;
                break;
        }
        return name
    }

    //======================

    private _hideCard (cardNode:cc.Node){
        cardNode.active = false;
        cardNode[C_cardAttr].isOpen = false;
        // this.num_showCards -= 1;
        // this.list_hideCards.push(cardNode);
    }

    private _coverCard(cardNode:cc.Node){
        cardNode[C_cardAttr].logicValue = 0;
        this.setCardValue(cardNode);
    }

    private _openCard(cardNode:cc.Node){
        let intervalTime = 0.3;
        cardNode[C_cardAttr].isOpen = true;
        let act1 = cc.scaleTo(intervalTime, 0, 1);
        let act2 = cc.callFunc(()=>{
            act1 = cc.scaleTo(intervalTime, 1, 1);
            this.setCardValue(cardNode);
            cardNode.runAction(act1);
        });
        cardNode.runAction(cc.sequence(act1, act2));
    }

    //单例
    private static _instance:BullCardsMgr;
    public static getInstance ():BullCardsMgr{
        if(!this._instance){
            this._instance = new BullCardsMgr();
        }
        return this._instance;
    }
}

export default BullCardsMgr.getInstance()