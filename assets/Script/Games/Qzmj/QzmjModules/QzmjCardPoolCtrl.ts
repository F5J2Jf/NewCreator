/*
author: JACKY
日期:2018-01-12 16:06:45
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
let ctrl : QzmjCardPoolCtrl;
//模型，数据处理
class Model extends BaseModel{
	seatid=null;
	logicseatid=null;
	player=null; 
	constructor()
	{
		super(); 
		this.clear();
	} 
	initSeat(seatid)
	{
		// body 
		this.seatid=seatid; 
	}
	updateLogicId(  )
	{
		// body 
		this.logicseatid=RoomMgr.getInstance().getLogicSeatId(this.seatid); 
		this.player=QzmjLogic.getInstance().players[this.logicseatid];  
	}
	clear(  )
	{
		// body  
	}
    recover(  ){
		// body 
	} 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
	};
	debug=null;
	poolcard=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.debug=false;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.poolcard=[];
		for(var i = 0;i<18;++i)
		{  
			this.poolcard.push(this.node.getChildByName(`MaJiang_${i}`));
		} 
		this.clear();
	}      
	updatePool(  ){
		var index=this.model.player.cardpool.length; 
		var value=this.model.player.cardpool[this.model.player.cardpool.length-1]  
		var card=this.poolcard[index];
		card.active=true; 
		var sign=card.getChildByName('sign');
		let texture = QzmjResMgr.getInstance().getCardTextureByValue(value);
		let frame = new cc.SpriteFrame(texture);
		sign.getComponent(cc.Sprite).spriteFrame = frame;  
	}
		 
	clear(){  
		for(var i = 0;i<this.poolcard.length;++i)
		{  
			this.poolcard[i].active=false;
		} 
	} 
	recover(  ){
		this.clear(); 
	} 
	reducePool()
	{
		let index=this.model.cardpool.length+1; 
		let card=this.poolcard[index];
		card.active=false;
	}
	
}
//c, 控制
@ccclass
export default class QzmjCardPoolCtrl extends BaseCtrl {
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
			//网络消息监听列表 
			onOp:this.onOp,   
			onProcess:this.onProcess,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
		    onSyncData:this.onSyncData,
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
		this.model.updateLogicId()
	}
	http_reqRoomUsers(msg){
		this.model.clear();
		this.view.clear() 
		this.model.updateLogicId();
	}
	onOp(msg){
		// body
		
		var op=QzmjDef.op_cfg[msg.event]
		if (op==QzmjDef.op_chupai ){ 
			this.op_chupai(msg);
		}
		else if (op==QzmjDef.op_chi || op==QzmjDef.op_peng || op==QzmjDef.op_gang ){  
			if (this.model.logicseatid==QzmjLogic.getInstance().curseat ){  
				this.model.cardpool=this.model.player.cardpool;
				this.view.reducePool();
			} 
		}
	}
	
	onProcess(msg){
		if (msg.process==QzmjDef.process_ready){ 
			this.process_ready(msg);
		}
	}
	process_ready(msg){
		// body
		this.model.clear();
		this.view.clear();
	}
	op_chupai(msg){ 
		if (this.model.logicseatid!=QzmjLogic.getInstance().curseat){ 
			return;
		}
		// body   
		this.view.updatePool();
	}  
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end


}