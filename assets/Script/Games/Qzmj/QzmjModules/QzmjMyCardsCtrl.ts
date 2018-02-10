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
import QzmjResMgr from "../QzmjMgr/QzmjResMgr";

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
	myNodeX=null;
	node_pox_gap=null;
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
		this.cursel=null; 
		this.enable_op=false;
		this.myNodeX = 0;
		//自适应的偏移值（用于吃碰杠）
		this.node_pox_gap = 140;
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
		this.cursel=null; 
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
			this.ui.handcard.push(this.node.getChildByName(`hand_majing_${i}`));
		} 
		this.clear(); 
	}
	clearMyCard(){
		for (var i=0;i<this.ui.handcard.length;++i){ 
			this.ui.handcard[i].active=false;
		}
	}  
 
	recover(  ){
		// body
		this.clear(); 
	}
	
	//清除
	clear(){
		// body   
		for (var i=0;i<this.ui.handcard.length;++i){
			this.ui.handcard[i].active=false
		}
	}
 
  
	showNewCard(){
	}
	updateHandCards(){ 
		for (var i = 0;i<this.ui.handcard.length;++i){
			var card = this.ui.handcard[i];
			var value=this.model.myself.handcard[i]; 
			if (value !=null && value !=undefined){
                var sign=card.getChildByName('sign');
                let texture = QzmjResMgr.getInstance().getCardTextureByValue(value);
                let frame = new cc.SpriteFrame(texture); 
				sign.getComponent(cc.Sprite).spriteFrame = frame;  
				card.active=true;
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
				card.position=cc.p(pos.x,20);
			}
			else{
				card.position=cc.p(pos.x,0);
			}
		} 
	}
	
	//吃碰杠  牌的偏移
	refreshCardsMove(){
		if (this.model.myNodeX == 0){
			this.model.myNodeX = this.node.x
		}
		let opcards = this.model.myself.opcards,
			opcards_count = opcards.length;
		if (opcards_count != 0){
			this.node.x = this.model.myNodeX + (this.model.node_pox_gap * opcards_count);
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
			'http.reqRoomUsers':this.http_reqRoomUsers,  
            onGmOp:this.onGmOp,
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
	http_reqRoomUsers(msg)
	{
		//清空数据和牌
		this.model.clear();
		this.view.clear();
		this.model.updateMyInfo();//更新我的信息
	}
	onEvent(msg)
	{
		// body  
		if(this.model.myself.state!=QzmjDef.state_chupai)
		{
			return;
		}   
		this.model.enabledOp(); 
	} 
	//广播gm操作
	onGmOp(msg)
	{ 
		switch(msg.optype)
		{
			case QzmjDef.gmop_changecard:{
				if(msg.opseatid==RoomMgr.getInstance().getMySeatId())
				{
					console.log("updatecards1")
					//自己换牌
					this.view.updateHandCards();
				}
				if(msg.data.target==RoomMgr.getInstance().getMySeatId())
				{
					console.log("updatecards2")
					//我的牌被别人换了
					this.view.updateHandCards();
				}
			}
			break;
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
			if (msg.opseatid == this.model.mySeatId){
				if (op == QzmjDef.op_angang || op == QzmjDef.op_gang || op == QzmjDef.op_peng 
					|| op == QzmjDef.op_chi){
					this.view.refreshCardsMove();
				}
			}
		}
	}   
	onProcess(msg){ 
		if (msg.process==QzmjDef.process_kaijin){
			this.view.updateCards();
		}
		else if (msg.process==QzmjDef.process_fapai){ 
			this.view.updateCards();
		}
		else if (msg.process==QzmjDef.process_ready){ 
			this.process_ready(msg); 
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
		var touchCard=function(index){
			if(!this.model.enable_op){
				return;
			}
			if(this.model.cursel==index){
				QzmjLogic.getInstance().playerOp(QzmjDef.event_chupai,index);
				this.model.disabledOp();
				return;
			}
			this.model.cursel=index;
			this.view.updateSel();
		} 
		for(let i=0;i<this.ui.handcard.length;++i){  
			let node=this.ui.handcard[i]; 
			node.on(cc.Node.EventType.TOUCH_END, function (event) {
				touchCard.bind(this)(i);
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
		this.model.cursel=null; 
		this.view.updateCards(false);
		
	} 
}