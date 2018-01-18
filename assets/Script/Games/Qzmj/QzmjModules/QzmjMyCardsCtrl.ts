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
	player=null;
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
		this.player=QzmjLogic.getInstance().players[this.mySeatId] 
	}
 
	clear(  ){
		// body
		this.curOp=null;
		this.cursel=null; 
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
			var value=this.model.player.handcard[i]; 
			if (value !=null && value !=undefined){
				card.active=true;
                var sign=card.getChildByName('sign');
                let texture = QzmjResMgr.getInstance().getCardTextureByValue(value);
                let frame = new cc.SpriteFrame(texture);
				sign.getComponent(cc.Sprite).spriteFrame = frame;  
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
		this.model.updateMyInfo();//更新我的信息
	}
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
				QzmjLogic.getInstance().playerOp(index);
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