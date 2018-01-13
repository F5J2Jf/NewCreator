/*
author: JACKY
日期:2018-01-12 14:10:41
*/

import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import UiMgr from "../../../Plat/GameMgrs/UiMgr";
import ModuleMgr from "../../../Plat/GameMgrs/ModuleMgr";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import QzmjLogic from "../QzmjMgr/QzmjLogic";
import UserMgr from "../../../Plat/GameMgrs/UserMgr";
import { QzmjDef } from "../QzMjMgr/QzmjDef";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjMyCardsCtrl;
//模型，数据处理
class Model extends BaseModel{
	mySeatId=null; 
	myself=null;
	curOp=null;
	enable_op=null;
	cursel=null;
	jin=null;
	constructor()
	{
		super();
		this.clear();
	} 
	updateMyInfo(  ){
		// body 
		this.mySeatId=RoomMgr.getInstance().getMySeatId(); 
 		this.myself=QzmjLogic.getInstance().players[this.mySeatId]
	}
 
	clear(  ){
		// body
		this.curOp=null;
		this.cursel=0; 
		this.enable_op=false;
	} 
	setCurOp(msg)
	{ 
		this.curOp=msg;
	} 
	recover(  ){
		this.clear();
		this.jin=QzmjLogic.getInstance().jin;
	}
 
	disabledOp(){
		this.enable_op=false;
		this.cursel=0; 
	}
    enabledOp(){
		this.enable_op=true;
	} 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		handcard:null,
	}; 
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui 
	initUi()
	{
		this.ui.handcard=[];
		for(var i = 0;i<14;++i)
		{ 
			this.ui.handcard[i]=this.node.getChildByName(`hand_majing_${i}`);
		} 
	}
	clearMyCard(){
		for (var i=0;i<this.ui.handcard.length;++i){ 
			this.ui.handcard[i].active=false;
		}
	}  
 
	recover(  ){
		// body
		this.clear();
		this.updateJin();
	}
	
	//清除
	clear(){
		// body   
		for (var i=0;i<this.ui.handcard.length;++i){
			this.ui.handcard[i].active=false
		}
	}
 
	//显示金
	updateJin(){
		// body 
 
	}

	//显示操作
	newOp(  ){
		// body
		// var msg=this.model.curOp;
		// var op=QzmjDef.op_cfg[msg.event] 
		// var filename='effects/' .. FqmjRoomModel.aniCfg[op];
		// var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.opseatid)
		// var effect=this.loadCsb(filename) 
		// var effectnode=this.ui.effectnodes[viewseatid] 
		// effectnode:addChild(effect) 
		// var action=this.loadAction(filename)  
		// effect:runAction(action)
		// action:play("show",false);
		// var cb=function (  )
		// 	// body
		// 	effect:removeFromParent();
		// end
		// action:setFrameEventCallFunc(cb) 
	
	}  

	showMyCard(){
		for (var i = 0;i<this.model.myself.ui.handcard.length;++i){
			var value=this.model.myself.ui.handcard[i];
			var card = this.ui.handcard[i];
			card.active=false;
			var sign=card.getChildByName('sign');
			//face:loadTexture(string.format('res/cocosstudio/pics/fqmj/tileface/%s.png',FqmjResMgr.cardpngs[value]),0) 
		}
	}
	showNewCard(){
	}
	updateHandCards(){
		for (var i = 0;i<this.ui.handcard.length;++i){
			var card = this.ui.handcard[i];
			var value=this.model.myself.ui.handcard[i];
			if (value !=null){
				card.active=true;
				var sign=card.getChildByName('sign');
				//sign:loadTexture(FqmjResMgr.getInstance().getCardName(value),0)
			}
			else
			{
				card.active=false;
			}
		}	
	}
	updateCards(bshownewcard=false){ 
		this.updateHandCards();
		if (bshownewcard){  
			this.showNewCard();
		}
		this.updateSel();
	}
	updateSel(){
		for (var i = 0;i<this.ui.handcard.length;++i){ 
			var card = this.ui.handcard[i];
			var pos=card.position;
			if (i == this.model.cursel){
				card.setPosition(cc.p(pos.x,20));
			}
			else{
				card.setPosition(cc.p(pos.x,0));
			}
		} 
	}
}
//c, 控制
@ccclass
export default class QzmjMyCardsCtrl extends BaseCtrl {
	//这边去声明ui组件  
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
		this.n_events={ 
			//网络消息监听列表      
			'onEvent':this.onEvent,  
			onSeatChange:this.onSeatChange,  
			onSyncData:this.onSyncData,
			onProcess:this.onProcess,
			onOp:this.onOp,     
			'http.reqSettle':this.http_reqSettle,   
        } 
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{ 
		this.bindCardTouch();
	}
	start () {
	}
	//网络事件回调begin
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end 
	
	onEvent(msg)
	{
		// body    
		if (msg.event==QzmjDef.event_chupai){ 
			this.model.enabledOp();
		}
	} 
	onSyncData(  )
	{
		// body 
		this.model.recover();
		this.view.recover();   
		var cur_eventtype=QzmjLogic.getInstance().cur_eventtype;
		if (cur_eventtype){
			if (cur_eventtype==QzmjDef.event_chupai){  
				this.model.enabledOp(); 
			}
		}
		this.view.updateCards(this.model.enable_op) 
	}
	onSeatChange(msg){
		// body
		this.view.updateLeftCardCount();
		if (this.model.mySeatId == QzmjLogic.getInstance().curseat){ 
			this.view.updateCards(true) 
		}
	} 
   
	onOp(msg){
		// body   
		var op=QzmjDef.op_cfg[msg.event]
		if (op == QzmjDef.op_chupai){ 
			if (QzmjLogic.getInstance().curseat==this.model.mySeatId){
				this.view.updateCards(false);
			} 
		}
		else{
			this.model.setCurOp(msg);
			this.view.newOp();
			//显示点炮
			if (op==QzmjDef.op_hu){
				var huinfo=QzmjLogic.getInstance().huinfo;
				if (huinfo.hutime == QzmjDef.hutime_dianpao){ 
					this.view.showDianPao();
				}
			}
		}
	} 
	updateMyPrepared(  ){
		// body
		this.model.updateMyPrepared();
		this.ui.btn_prepare.active=!this.model.myPrepared; 
	}
	
	onPrepare(msg){
		var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid) 
		this.ui.prepareflags[viewseatid].active=true;
		if(msg.seatid==this.model.mySeatId){
			this.updateMyPrepared();
		}
	} 
	http_reqSettle(msg)
	{

	}
	onProcess(msg){
		this.view.updateLeftCardCount();
		if (msg.process==QzmjDef.process_kaijin){
 
		}
		else if (msg.process==QzmjDef.process_fapai){ 
			this.view.showMyCard();
		}
		else if (msg.process==QzmjDef.process_ready){ 
			this.process_ready(msg); 
		}
		else if (msg.process==QzmjDef.process_dingzhuang){ 
			this.process_dingzhuang();
		}
		else if (msg.process==QzmjDef.process_buhua){ 
			this.process_buhua(msg);
		}
	}
    process_buhua(msg){

		this.view.updateCards()
	}
    process_ready(){
		// body
		this.model.clear();
		this.view.clear();
	}
  
 
	bindCardTouch(){
		var cb =function(index){ 
			var innerfun=function(){
				if(this.model.enable_op){
					return;
				}
				if(this.model.cursel==index){
					QzmjLogic.getInstance().playerOp(index);
					this.model.disabledOp();
					return;
				}
				this.model.cursel=index;
				this.view.updateSel();
			}
			return innerfun;
		}  
		for(var i=0;i<this.view.handcard.length;++i){  
			var node=this.view.handcard[i];
			var callback=cb(i); 
			node.on(cc.Node.EventType.TOUCH_END, function (event) {
				callback();
			},this); 
		}
	} 
 
 
	op_chupai(msg){
		//收到出牌的指令了
		//不是自己 
		if (this.model.mySeatId != QzmjLogic.getInstance().curseat ){ 
			return;
		}
		this.model.disabledOp();
		this.model.cursel=0; 
		this.view.updateCards(false);
		
	} 
}