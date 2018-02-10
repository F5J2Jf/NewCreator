/*
author: JACKY
日期:2018-01-12 16:08:31
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
import QzmjResMgr from "../QzmjMgr/QzmjResMgr";


//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjDoorCardCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;
	logicseatid=null;
	player=null;
	opcards=null;
	mySeatID=null;
	constructor()
	{
		super();

	} 
	initSeat(seatid){
		// body
		this.seatid=seatid;
	}
	updateLogicId(  ){
		// body 
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid);
		this.player=QzmjLogic.getInstance().players[this.logicseatid]; 
		this.mySeatID=RoomMgr.getInstance().getMySeatId();
	}
	recover(  ){
		// body
		this.opcards=this.player.opcards;
	}
	clear(){
		this.opcards=[]
	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
	}; 
	node=null;
	debug=false; 
	doorCardPanel=null;
	constructor(model){
		super(model);
		this.node=ctrl.node; 
		 
		this.debug=false;
		this.initUi();
	}
	//初始化ui
	initUi()
	{ 
		this.doorCardPanel=[];
		for(var i = 0;i<5;++i)
		{  
			this.doorCardPanel.push(this.node.getChildByName(`DoorMaJiang_${i}`)); 
		}  

		this.clear();
	} 
	recover(  ){
		// body
		this.clear();
		var opcards=this.model.opcards;
		for (var i = 0;i<opcards.length;++i){  
			this.addDoorCard(i)
		}
	} 
	addDoorCard(index){
		// body  
		var opcard=this.model.opcards[index];   
		var panel=this.doorCardPanel[index]
		panel.active=true;
		var cardgroup={};
		if (opcard.op==QzmjDef.op_chi){ 
			for(var i = 0;i<3;++i){ 
				var value=opcard.value[i]
				var card=panel.getChildByName(`MaJiang_${i}`);
				card.active=true;
				var sign=card.getChildByName('sign');
				let texture = QzmjResMgr.getInstance().get3DCardTextureByValue(value);
				let frame = new cc.SpriteFrame(texture);
				sign.getComponent(cc.Sprite).spriteFrame = frame;    
			}
			var card=panel.getChildByName(`MaJiang_3`);
			card.active=false;
		}
		else if (opcard.op==QzmjDef.op_peng){ 
			var value=opcard.value
			for (var i = 0;i<3;++i){
				var card=panel.getChildByName(`MaJiang_${i}`);
				card.active=true;
				var sign=card.getChildByName('sign');
				let texture = QzmjResMgr.getInstance().get3DCardTextureByValue(value);
				let frame = new cc.SpriteFrame(texture);
				sign.getComponent(cc.Sprite).spriteFrame = frame;     
			}
			var card=panel.getChildByName(`MaJiang_3`);
			card.active=false;
		}
		else if (opcard.op==QzmjDef.op_gang){ 
			var value=opcard.value
			for (var i = 0;i<4;i++){
				var card=panel.getChildByName(`MaJiang_${i}`);
				card.active=true;
				var sign=card.getChildByName('sign');
				let texture = QzmjResMgr.getInstance().get3DCardTextureByValue(value);
				let frame = new cc.SpriteFrame(texture);
				sign.getComponent(cc.Sprite).spriteFrame = frame;  
			}
		}
		else if (opcard.op==QzmjDef.op_angang){ 
			var value=opcard.value
			for (var i = 0;i<4;++i){
				var card=panel.getChildByName(`MaJiang_${i}`);
				card.active=true;
				var sign=card.getChildByName('sign');
				var majingBg = card.getChildByName("majingBg");
				let flag = i==3 && this.model.logicseatid == this.model.mySeatID;
				sign.active = flag;
				let texture = QzmjResMgr.getInstance().get3DCardTextureByValue(flag ? value : 666);
				let frame = new cc.SpriteFrame(texture);
				let spriteNode = flag ? sign : majingBg;
				spriteNode.getComponent(cc.Sprite).spriteFrame = frame;
			}  
		} 
	}

	updateCards(){
		// body
		var opcards=this.model.opcards; 
		var index=opcards.length-1;
		this.addDoorCard(index)
	}
	clear(){ 
		// body  
		for(var i = 0;i<this.doorCardPanel.length;++i)
		{  
			// this.doorCardPanel[i].active=false;
		} 
	} 
	 
}
//c, 控制
@ccclass
export default class QzmjDoorCardCtrl extends BaseCtrl {
	//这边去声明ui组件 
	@property
    seatId:Number = 0;
	//声明ui组件end
	//这是ui组件的map,将ui和控制器或试图普通变量分离


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
			onSyncData:this.onSyncData,
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
	}
	start () {
	}
	//网络事件回调begin
	onSyncData(  ){
		// body
		this.model.recover();
		this.view.recover()
	}
	http_reqRoomUsers(msg){
		this.model.clear()
		this.view.clear() 
		this.model.updateLogicId();//清空自己所属位置的逻辑位置
	}
	onOp(msg){
		// body 
		if (this.model.logicseatid != msg.opseatid ){
			return;
		} 
		var op=QzmjDef.op_cfg[msg.event]
		//忽略列表
		let ignoreOps=[QzmjDef.op_chupai,QzmjDef.op_hu,QzmjDef.op_zimo,QzmjDef.op_danyou,QzmjDef.op_shuangyou,QzmjDef.op_sanyou,
			QzmjDef.op_bazhanghua,QzmjDef.op_sanjiindao]
		for(let i = 0;i<ignoreOps.length;++i)
		{
			if(ignoreOps[i]==op){
				return;
			}
		}
	
		this.model.opcards=this.model.player.opcards;
		this.view.updateCards();
	}
	onProcess(msg){
		if (msg.process==QzmjDef.process_ready ){ 
			this.process_ready(msg); 
		}
	}
	 
	
	process_ready(msg){
		this.view.clear()
		// body
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
 
 
}
