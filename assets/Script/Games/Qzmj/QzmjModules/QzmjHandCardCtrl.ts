/*
author: JACKY
日期:2018-01-12 16:27:16
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
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjHandCardCtrl;
//模型，数据处理
class Model extends BaseModel{
	logicseatid=null;
	seatid=null;
	player=null;
	constructor()
	{
		super();
		//在这里定义视图和控制器数据 
		this.logicseatid=null;
		this.clear();

	} 
	initSeat(seatid)
	{
		this.seatid=seatid; 
	} 
 
	updateLogicId(  ){
		// body 
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid); 
		this.player=QzmjLogic.getInstance().players[this.logicseatid];  
	} 

    recover(  ){
		// body
		this.clear();
		this.player=QzmjLogic.getInstance().players[this.logicseatid];  
	} 
	clear()
	{

	}
 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui 
	}; 
	positions=null;
	debug=false;
	handcard=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.debug=false;  
		this.initUi();
	}
	//初始化ui
	initUi()
	{  
		this.handcard=[];
		for(var i = 0;i<14;++i)
		{  
			this.handcard.push(this.node.getChildByName(`hand_majiang_${i}`));
		}  
		this.clear();
	} 
	//恢复游戏
	recover(  )
	{
		// body
		this.clear();  
		this.updateCards(true);
	} 
	updateCards(bShowChuPai=false){ 
		this.updateHandCards();
		if (bShowChuPai){  
			this.showChuPai();
		}
	}   
 
	clear(){
		for(var i = 0;i<this.handcard.length;++i)
		{
			this.handcard[i].active=false;
		}
	}  
	updateHandCards(  ){
		for (var i=0;i<this.handcard.length;++i){ 
			var value=this.model.player.handcard[i];
			var card=this.handcard[i]; 
			card.active= (value !=null && value !=undefined);
		} 	 
	}
	//显示出牌的
	showChuPai()
	{
		let cardlen=this.model.player.handcard.length;
		// body  
		if (this.model.seatid==0){
			
		}
		else if(this.model.seatid==1) 
		{

		}
		else if (this.model.seatid==2 ){

		}  
		else if (this.model.seatid==3){

		}    
	} 
 
	fapai(  )
	{
		// body 
		this.updateHandCards();
	} 
}
//c, 控制
@ccclass
export default class QzmjHandCardCtrl extends BaseCtrl {
	//这边去声明ui组件

	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离 
	@property
    seatId:Number = 0;
	onLoad (){
		//创建mvc模式中模型和视图
		//控制器
		ctrl = this;
		//数据模型
		this.initMvc(Model,View); 
		this.model.initSeat(this.seatId);
	}

	//定义网络事件
	defineNetEvents()
	{
		this.n_events={
			onProcess:this.onProcess,   
			onOp:this.onOp,  
			onSeatChange:this.onSeatChange, 
			onSyncData:this.onSyncData,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
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
	}
	start () {
	}
	//网络事件回调begin 
 
	onSyncData(  )
	{
		if (this.model.seatid==0){
			return
		}  
		// 恢复游戏
		this.model.recover();
		this.view.recover(); 
	}
 
	http_reqRoomUsers(  )
	{
		// body
		this.model.clear();
		this.view.clear();
	} 
	onOp(msg) 
	{
		// body  
		if (this.model.seatid==0 ){ 
			return
		}
		var op=QzmjDef.op_cfg[msg.event]
		if (op==QzmjDef.op_chupai ){ 
			this.op_chupai(msg) 
		}
		else if (op==QzmjDef.op_hu){
			this.op_hu(msg);
		}
	} 
	op_hu(msg){
 
		// body
		if (this.model.logicseatid != msg.opseatid){ 
			return;
		}
		this.view.updateCards() 
	}
	onSeatChange(msg){
		if (this.model.seatid==0){ 
			return
		}
		// body
		if (this.model.logicseatid != QzmjLogic.getInstance().curseat){ 
			return;
		}
		this.view.updateCards(true) 
	}
	onProcess(msg){
		if (this.model.seatid==0){ 
			return
		}
		// body 
		if (msg.process==QzmjDef.process_fapai){ 
			this.process_fapai(msg);
		}
		else if (msg.process==QzmjDef.process_buhua){ 
			this.process_buhua(msg);
		}
		else if (msg.process==QzmjDef.process_ready){ 
			this.process_ready(msg); 
		}
	}
	http_reqSettle(msg){
		// body 
		this.view.clear();
	}
	process_ready(){
		// body
		this.model.clear();
		this.view.clear();
	}
	process_buhua(msg){
		// body  
		this.view.updateCards() 
	}
 
	op_chupai(msg){
		//收到出牌的指令了
		//不是自己 
		if (this.model.logicseatid != QzmjLogic.getInstance().curseat){ 
			return;
		}
		this.view.updateCards(false); 
	}

    process_fapai(){
		if (this.model.seatid==0){ 
			return
		}
		this.model.updateLogicId(); 
		this.view.fapai()  
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
  
}