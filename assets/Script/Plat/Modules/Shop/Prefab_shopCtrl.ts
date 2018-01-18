/*
author: YOYO
日期:2018-01-12 11:31:32
*/
import BaseCtrl from "../../Libs/BaseCtrl";
import BaseView from "../../Libs/BaseView";
import BaseModel from "../../Libs/BaseModel";
import UiMgr from "../../GameMgrs/UiMgr";
import Prefab_shopItemCtrl from "./Prefab_shopItemCtrl";
import Prefab_shopDetailCtrl from "./Prefab_shopDetailCtrl";
import GoodsCfg from "../../CfgMgrs/GoodsCfg";
import UserMgr from "../../GameMgrs/UserMgr";
import FrameMgr from "../../GameMgrs/FrameMgr";
import RechargeMgr from "../../GameMgrs/RechargeMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
const STR_BtnIndex = '_btnIndex';
const STR_ItemInfo = '_itemInfo';
const BUY_TYPE = cc.Enum({
    buyCoin:1,
    buyGold:2
})

let ctrl : Prefab_shopCtrl;
//模型，数据处理
class Model extends BaseModel{
    public myinfo=null;
    //格子容器相关
    private _showItemNum:number = null
    private _itemHeight:number = null
    private _itemWidth:number = null
    private _itemOffX:number = null
    private _itemOffY:number = null
    private _startPosX:number = null

    private _lineNum:number = null
	constructor()
	{
        super();
        
        this._lineNum = 4;
        this._itemOffX = 80;
        this._itemOffY = 30;
        this._showItemNum = 0;
    }
    
    public getMoney3(){
        return 999999
    }

    updateMyInfo()
    {
        this.myinfo=UserMgr.getInstance().getMyInfo();
    }

    //====================== scrollow

    public addItem(curNum:number=1){
        this._showItemNum += curNum;
    }
    public initSize(curNode:cc.Node){
        if(!this._itemWidth){
            this._itemWidth = curNode.width;
            this._itemHeight = curNode.height;
        }
    }
    public setStartPosX(startPosX:number){
        this._startPosX = startPosX;
    }


    public getLineNum (){
        return this._lineNum
    }
    public getItemOffX (){
        return this._itemOffX
    }
    public getItemOffY (){
        return this._itemOffY
    }
    public getItemPos (){
        let curLineNum,
            rowNum,
            posX,
            posY;
        if(this._showItemNum == 0) curLineNum = 0;
        else curLineNum = this._showItemNum%this._lineNum;
        rowNum = Math.floor(this._showItemNum/this._lineNum);
        posX = this._startPosX + curLineNum * (this._itemWidth + this._itemOffX) + this._itemWidth/2;
        posY = -rowNum * (this._itemHeight + this._itemOffY) - this._itemHeight/2;
        return cc.p(posX, posY);
    }
    public getContentHeight (){
        let rowNum:number = Math.ceil(this._showItemNum/this._lineNum),
            contentH:number = rowNum * (this._itemHeight + this._itemOffY);
        return contentH;
    }
    public getCurShowNum ():number{
        return this._showItemNum
    }
    public clearItems (){
        this._showItemNum = 0;
        this._itemWidth = null;
        this._itemHeight = null;
    }
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
        //在这里声明ui
        node_leftBtns:null,                         //左边的按钮父节点
        node_goodsList:null,                        //商品列表容器
        lab_money1:null,                            //金钱1
        lab_money2:null,                            //金钱2
        lab_money3:null,                            //金钱3
        prefab_item:null,                            //
        prefab_itemDetail:null
	};
    node:cc.Node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
        this.addGrayLayer();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_leftBtns = ctrl.node_leftBtns;
        this.ui.node_goodsList = ctrl.node_goodsList;
        this.ui.lab_money1 = ctrl.lab_money1;
        this.ui.lab_money2 = ctrl.lab_money2;
        this.ui.lab_money3 = ctrl.lab_money3;
        this.ui.prefab_item = ctrl.prefab_item;
        this.ui.prefab_itemDetail = ctrl.prefab_itemDetail;

        this.model.setStartPosX(-this.ui.node_goodsList.width/2);
    }

    updateMyInfo()
    {       
        if(this.node.active){
            this.updateMoney1();
            this.updateMoney2();
        }
    }
    
    //刷新金钱1信息
    public updateMoney1(){
        this.ui.lab_money1.string = this.model.myinfo.coin;
    }
    //刷新金钱2信息
    public updateMoney2(){
        this.ui.lab_money2.string = this.model.myinfo.gold;
    }
    //刷新金钱3信息
    public updateMoney3(){
        this.ui.lab_money3.string = this.model.getMoney3();
    }
    //切换左边按钮的点击表现
    public setLeftClickIndex (touchIndex){
        let btns = this.ui.node_leftBtns.children,
            childBtn;
        for(let i = 0; i < btns.length; i ++){
            childBtn = btns[i];
            if(childBtn[STR_BtnIndex] == touchIndex) {
                UiMgr.getInstance().setBtnEnable(childBtn, false);
            }else{
                UiMgr.getInstance().setBtnEnable(childBtn, true);
            }
        }
    }

    //显示物品详情界面
    private showItemDetail (){
        let curNode = cc.instantiate(this.ui.prefab_itemDetail);
        curNode.parent = this.node;
        let curComp:Prefab_shopDetailCtrl = curNode.getComponent(this.ui.prefab_itemDetail.name);
        return curComp
    }

    //=========================商品的格子容器

    public addItem (){
        let curNode:cc.Node = cc.instantiate(this.ui.prefab_item);
        curNode.parent = this.ui.node_goodsList;
        this.model.initSize(curNode);
        curNode.position = this.model.getItemPos();
        this.model.addItem();
        this._resetContentSize();
        return curNode.getComponent(this.ui.prefab_item.name);
    }

    public clearItems(){
        let itemList = this.ui.node_goodsList.children;
        for(let i = 0; i < itemList.length; i ++){
            itemList[i].destroy();
        }
        this.model.clearItems();
    }

    private _resetContentSize (){
        let contentH = this.model.getContentHeight();
        this.ui.node_goodsList.height = contentH;
    }
}
//c, 控制
@ccclass
export default class Prefab_shopCtrl extends BaseCtrl {
	//这边去声明ui组件

    @property(cc.Label)
    lab_money1:cc.Label = null

    @property(cc.Label)
    lab_money2:cc.Label = null

    @property(cc.Label)
    lab_money3:cc.Label = null

    @property(cc.Node)
    node_leftBtns:cc.Node = null

    @property(cc.Node)
    node_btn_record:cc.Node = null

    @property(cc.Node)
    node_goodsList:cc.Node = null

    @property(cc.Prefab)
    prefab_item:cc.Prefab = null

    @property(cc.Node)
    node_close:cc.Node = null

    @property(cc.Prefab)
    prefab_itemDetail:cc.Prefab = null

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离

    private _clickType:number = null

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
            'http.reqMyInfo' : this.http_reqMyInfo,
            'http.reqBuyGoods' : this.http_reqBuyGoods,
            'onPay' : this.onPay,
        }
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.node_btn_record, this.node_btn_record_cb, '显示兑换记录')
        this.connect(G_UiType.image, this.node_close, this.node_close_cb, '点击关闭')
        let btns = this.node_leftBtns.children,
            curBtn;
        for(let i = 0; i < btns.length; i ++){
            curBtn = btns[i];
            curBtn[STR_BtnIndex] = i;
            this.connect(G_UiType.image, curBtn, this.node_leftBtns_cb, '左边的切换按钮:btn_'+i)
        }
	}
	start () {
        this.view.updateMoney3();
        this.model.updateMyInfo();
        this.view.updateMyInfo();
	}
    //网络事件回调begin
    //玩家信息更新
    private http_reqMyInfo (msg){
        this.model.updateMyInfo();
        this.view.updateMyInfo();
    }
    private http_reqBuyGoods(msg){
        console.log('http_reqBuyGoods====', msg)
        let goodstype = msg.goodstype,
            goodsid = msg.goodsid;
        switch(goodstype){
            case 1:
                //钻石
                break
            case 2:
                //房卡
                break
            case 3:
                //金币
                let goodsName,
                    goodsList = GoodsCfg.getInstance().getCoinCfg();
                for(let i = 0; i < goodsList.length; i ++){
                    if(goodsid == goodsList[i].id){
                        goodsName = goodsList[i].name;
                        break
                    }
                }
                FrameMgr.getInstance().showHarvest(1, 'sharing_icon_dd', goodsName, ()=>{
                    //确认领取
                    UserMgr.getInstance().reqMyInfo();
                });
                break
        }
    }
    private onPay(msg)
    {
        console.log("msg=",msg)
        let rechargeid = msg.rechargeid;

        let goodsName,
            goodsList = GoodsCfg.getInstance().getGoldCfg();
        for(let i = 0; i < goodsList.length; i ++){
            if(rechargeid == goodsList[i].id){
                goodsName = goodsList[i].name;
                break
            }
        }
        FrameMgr.getInstance().showHarvest(1, 'sharing_icon_zs', goodsName, ()=>{
            //确认领取
            UserMgr.getInstance().reqMyInfo();
        });
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin

    public buyGold(){
        this._clickType = BUY_TYPE.buyGold;
        //钻石充值
        let infoList = GoodsCfg.getInstance().getGoldCfg();
        let itemNum,
            info,
            curItemComp:Prefab_shopItemCtrl;
        this.view.clearItems();
        itemNum = infoList.length;
        for(let i = 0; i < itemNum; i ++){
            info = infoList[i];
            info.strType = 'gold';
            curItemComp = this.view.addItem();
            curItemComp.setInfo(i, info);
            curItemComp.node[STR_ItemInfo] = info;
            this.connect(G_UiType.image, curItemComp.node, this._onClick_item, '选择商品');
        }
        this.view.setLeftClickIndex(2);
    }
    public buyCoin(){
        this._clickType = BUY_TYPE.buyCoin;
        let infoList = GoodsCfg.getInstance().getCoinCfg();
        //换金币
        let itemNum,
            info,
            curItemComp:Prefab_shopItemCtrl;
        this.view.clearItems();
        itemNum = infoList.length;
        for(let i = 0; i < itemNum; i ++){
            info = infoList[i]
            info.strType = 'coin';
            curItemComp = this.view.addItem();
            curItemComp.setInfo(i, info);
            curItemComp.node[STR_ItemInfo] = info;
            this.connect(G_UiType.image, curItemComp.node, this._onClick_item, '选择商品');
        }
        this.view.setLeftClickIndex(1);
    }
    
    //点击兑换记录
    private node_btn_record_cb(node){
        console.log('node_btn_record_cb')
    }
    //点击关闭
    private node_close_cb(node){
        console.log('node_close_cb')
        this.finish();
    }
    //点击左边按钮
    private node_leftBtns_cb(node){
        let index = node[STR_BtnIndex];
        console.log('node_leftBtns_cb', index);
        switch(index){
            case 0:
            //买道具
            break
            case 1:
                //买金币
                this.buyCoin();
            break
            case 2:
                //买钻石
                this.buyGold();
            break
            case 3:
            //实物兑换
            break
            default:
            break;
        }
        this.view.setLeftClickIndex(index);
    }
    private _onClick_item(node, evnet){
        let info = node[STR_ItemInfo];
        console.log('_onClick_item :: ', info)
        switch(this._clickType){
            case BUY_TYPE.buyCoin:
                //购买金币
                if(UserMgr.getInstance().getMyInfo().gold >= info.price){
                    RechargeMgr.getInstance().reqBuyGoods(3, info.id) 
                }else{
                    FrameMgr.getInstance().showMsgBox('钻石不足', ()=>{
                        this.buyGold();
                    });
                }
                break
            case BUY_TYPE.buyGold:
                //钻石
                RechargeMgr.getInstance().reqBill(info.id) 
                break
        }
    }

	//end
}