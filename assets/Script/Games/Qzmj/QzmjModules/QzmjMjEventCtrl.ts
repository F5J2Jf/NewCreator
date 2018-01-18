/*
author: JACKY
日期:2018-01-12 16:09:05
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

var rescfg={}; 
rescfg[QzmjDef.event_hu]='pic_hu2';
rescfg[QzmjDef.event_angang]='pic_gang2';
rescfg[QzmjDef.event_bugang]='pic_gang2';
rescfg[QzmjDef.event_gang]='pic_gang2';
rescfg[QzmjDef.event_peng]='pic_peng2';
rescfg[QzmjDef.event_chi]='pic_chi2';
rescfg[QzmjDef.event_zimo]='pic_zimo2';
rescfg[QzmjDef.event_tianhu]='pic_hu2';
rescfg[QzmjDef.event_qiangjinhu]='pic_hu2';
rescfg[QzmjDef.event_sanjindao]='pic_hu2';
 
//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : QzmjMjEventCtrl;
//模型，数据处理
class Model extends BaseModel{
	constructor()
	{
		super();
		this.clear();
	}
	carddatas=null;
	event=null;
	setEvent(msg){
		// body
		this.event=msg.event;
		var seatid=RoomMgr.getInstance().getMySeatId();
		var player=QzmjLogic.getInstance().players[seatid];
		var cur_op=QzmjDef.op_cfg[this.event] 
		if (cur_op==QzmjDef.op_chi){
			this.carddatas=player.getCardsCandChi(); 
		}
		else if (cur_op==QzmjDef.op_angang){
			this.carddatas=player.getCardsCanAnGang();  
		}
		else if (cur_op==QzmjDef.op_hu || 
			   cur_op==QzmjDef.op_zimo){ 
			this.carddatas=QzmjLogic.getInstance().huinfo;
		}
	}
	clear(  ){
		// body
		this.event=0;
	}
	recover(  ){
		// body
		this.event=QzmjLogic.getInstance().cur_eventtype;
		var seatid=RoomMgr.getInstance().getMySeatId();
		var player=QzmjLogic.getInstance().players[seatid];
		var cur_op=QzmjDef.op_cfg[this.event]
	 
		if (cur_op==QzmjDef.op_chi){
			this.carddatas=player.getCardsCandChi(); 
		}
		else if(cur_op==QzmjDef.op_angang){ 
			this.carddatas=player.getCardsCanAnGang(); 
		} 
		else if(cur_op==QzmjDef.op_hu || 
			   cur_op==QzmjDef.op_zimo){ 
			this.carddatas=QzmjLogic.getInstance().huinfo;
		}

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btn_do:null,
		btn_cancel:null,
		three:null,
		four:null, 
		hunode:null,
		threecardpanels:null,
		fourcardpanels:null,
	};
	threecardfaces={};
	fourcardfaces={};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{ 
		this.node.active=false;
		this.ui.btn_do=ctrl.btn_do;
		this.ui.btn_cancel=ctrl.btn_cancel;
		this.ui.three=ctrl.three;
		this.ui.four=ctrl.four; 
		this.ui.hunode=ctrl.hunode;
		this.ui.threecardpanels=[]
		this.ui.fourcardpanels=[]
		this.threecardfaces=[]
		this.fourcardfaces=[]
		for (var i = 0;i<3;++i){ 
			var cardpanel=this.ui.three.getChildByName(`panel_${i}`);
			console.log("name=",`panel_${i}`)
			this.ui.threecardpanels.push(cardpanel);
			cardpanel.active=false
			cardpanel.tag=i;
			var faces=[];
			for (var j=0; j<3;++j){ 
				var cardnode=cardpanel.getChildByName(`card_${j}`);
				var face=cardnode.getChildByName('face'); 
				faces.push(face);
			}
			this.threecardfaces.push(faces); 
		}
		for (var i = 0;i<4;++i){ 
			var cardpanel=this.ui.four.getChildByName(`panel_${i}`); 
			this.ui.fourcardpanels.push(cardpanel);
			cardpanel.active=false;
			cardpanel.tag=i;
			var faces=[];
			for (var j = 0;j<4;++j){ 
				var cardnode=cardpanel.getChildByName(`card_${j}`);
				var face=cardnode.getChildByName('face'); 
				faces.push(face);
			}
			this.fourcardfaces.push(faces); 
		}
	}
 
	recover(){
		// body
		this.clear();
		var event=this.model.event; 
		if  (null==event){ 
			return;
		}
		if (event==QzmjDef.event_chupai ){ 
			return;
		}
		this.show(); 
	}  
	clear(){
		// body
		this.node.active=false
		this.ui.hunode.removeAllChildren(); 
		for (var i = 0;i<this.ui.threecardpanels.length;++i){ 
			this.ui.threecardpanels[i].active=false;
		}
		for (var i = 0;i<this.ui.fourcardpanels;++i){ 
			this.ui.fourcardpanels[i].active=false;
		}
	} 
	show(  ){
		// body
		var event=this.model.event; 
		this.node.active=true;
		var name=rescfg[this.model.event]; 
		var texture=cc.loader.getRes(cc.url.raw(`resources/Games/Qzmj/${name}.png`))  
		let frame = new cc.SpriteFrame(texture); 
		this.ui.btn_do.getComponent(cc.Sprite).spriteFrame = frame;   
		//显示牌面 
		var cur_op=QzmjDef.op_cfg[event]
		if (cur_op==QzmjDef.op_chi ){ 
			this.updateChi();
		}
		else if (cur_op==QzmjDef.op_peng ){ 
			this.updatePeng();
		}
		else if (cur_op==QzmjDef.op_gang ){ 
			this.updateGang();
		}
		else if (cur_op==QzmjDef.op_angang ){ 
			this.updateAnGang(); 
		}
		else if (cur_op==QzmjDef.op_hu || 
			 cur_op==QzmjDef.op_zimo){ 
			this.updateHu(); 
		}
	}
	
	updateHu(  ){
		var cardpairs=this.model.carddatas.cardpairs; 
	  
		for (var i=0;i<cardpairs.length;++i){
			var cardarr=cardpairs[i];
			for (var k = 0;i<cardarr.length;++k){ 
		 
			} 
		}   
	}
	updateChi(  ){
		// body 
		for (var i = 0;i<this.model.carddatas.length;++i){
			var chiinfo=this.model.carddatas[i];
			var cards=chiinfo.cards;
			var cardpanel=this.ui.threecardpanels[i];
			cardpanel.active=true
			var cardface=this.threecardfaces[i];
			for (var j =0;j<cards.length;++j){  
				var cardvalue=cards[j];
				var face=cardface[j];  
                let texture = QzmjResMgr.getInstance().getCardTextureByValue(cardvalue);
                let frame = new cc.SpriteFrame(texture);
				face.getComponent(cc.Sprite).spriteFrame = frame;  
			} 
		}
	}
	updatePeng(  ){
		// body 
		var cardpanel=this.ui.threecardpanels[0];
		cardpanel.active=true;
		var cardface=this.threecardfaces[0];
		var cardvalue=QzmjLogic.getInstance().curcard;
		for (var j =0;j<3;++j){  
			var face=cardface[j];   
			let texture = QzmjResMgr.getInstance().getCardTextureByValue(cardvalue);
			let frame = new cc.SpriteFrame(texture);
			face.getComponent(cc.Sprite).spriteFrame = frame;   
		}
	}
	updateGang(  ){
		// body  
		var cardpanel=this.ui.fourcardpanels[0];
		cardpanel.active=true;
		var cardface=this.fourcardfaces[0];
		var cardvalue=QzmjLogic.getInstance().curcard;
		for (var j =0;j<4;++j){  
			var face=cardface[j];   
			let texture = QzmjResMgr.getInstance().getCardTextureByValue(cardvalue);
			let frame = new cc.SpriteFrame(texture);
			face.getComponent(cc.Sprite).spriteFrame = frame;
		}
	}
	updateAnGang(  ){
		// body 
		for(var  i = 0;i<this.model.carddatas.length;++i){
			var cardvalue=this.model.carddatas[i];
			var cardpanel=this.ui.fourcardpanels[i];
			cardpanel.active=true;
			var cardface=this.fourcardfaces[i];
			for (var j =0;j<4;++j){   
				var face=cardface[j];  
				let texture = QzmjResMgr.getInstance().getCardTextureByValue(cardvalue);
				let frame = new cc.SpriteFrame(texture);
				face.getComponent(cc.Sprite).spriteFrame = frame;  
			} 
		}   
	}
}
//c, 控制
@ccclass
export default class QzmjMjEventCtrl extends BaseCtrl {
	//这边去声明ui组件

	@property(cc.Node)
	btn_do=null;
	@property(cc.Node)
	btn_cancel=null; 
	@property(cc.Node)
	three=null;  
	@property(cc.Node)
	four=null;  
	@property(cc.Node)
	hunode=null;   
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
			onEvent:this.onEvent,
			onProcess:this.onProcess,   
			onOp:this.onOp,
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
		this.connect(G_UiType.image,this.ui.btn_do,this.btn_do_cb,'确认事件')
		this.connect(G_UiType.image,this.ui.btn_cancel,this.btn_cancel_cb,'取消事件') 
		for (let i=0;i<this.ui.threecardpanels.length;++i){
			var cardpanel=this.ui.threecardpanels[i]; 
			cardpanel.on(cc.Node.EventType.TOUCH_END, function (event) {
				//加入操作日志
				this.touchPanel(i) 
			},this);	
		}
		for (let i=0;i<this.ui.fourcardpanels.length;++i){
			var cardpanel=this.ui.fourcardpanels[i];
			cardpanel.on(cc.Node.EventType.TOUCH_END, function (event) {
				//加入操作日志
				this.touchPanel(i) 
			},this);
		}
	}
	start () {
	}
	//网络事件回调begin
	
	onSyncData(  ){
		// body
		this.ui.hunode.removeAllChildren(); 
		this.model.recover();
		this.view.recover();
	}
	onOp(  ){
		// body
		this.view.clear() 
	} 
	//事件通知
	onEvent(msg){
		if (msg.event==QzmjDef.event_chupai){
			return;
		}
		// body
		this.model.setEvent(msg);
	 
		this.view.show();
	}
	btn_do_cb(  ){
		// body 
		this.playerOp(0);
	}
	process_ready(  ){
		// body
		this.model.clear();
		this.view.clear()
	}
	onProcess(msg){ 
		if (msg.process==QzmjDef.process_ready){ 
			this.process_ready(msg);
		}
	}
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	btn_cancel_cb(  ){
		// body
		QzmjLogic.getInstance().playerCancel()
		this.view.clear()
	}
	//end
	playerOp(id){
		// body
		if (this.model.event==QzmjDef.event_chi){  
			var chiinfo=this.model.carddatas[id];
			var index=chiinfo.index; 
			QzmjLogic.getInstance().playerOp(index);
		}
		else if (this.model.event==QzmjDef.event_angang){
	 
			var card=this.model.carddatas[id];
			QzmjLogic.getInstance().playerOp(card); 
		}
		else {
			QzmjLogic.getInstance().playerOp();
		}
		this.view.clear()
	}
	touchPanel(index){ 
		this.playerOp(index) 
	} 
}