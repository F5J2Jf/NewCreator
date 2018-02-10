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
rescfg[QzmjDef.event_hu]='mj_room_option_hu';//胡
rescfg[QzmjDef.event_angang]='mj_room_option_gan';//暗杠
rescfg[QzmjDef.event_bugang]='mj_room_option_gan';//补杠
rescfg[QzmjDef.event_gang]='mj_room_option_gan';//杠
rescfg[QzmjDef.event_peng]='mj_room_option_pen';//碰
rescfg[QzmjDef.event_chi]='mj_room_option_chi';//吃
rescfg[QzmjDef.event_zimo]='mj_room_option_zm';//自摸 
rescfg[QzmjDef.event_sanjindao]='mj_room_option_sjd';//三金倒
rescfg[QzmjDef.event_danyou]='mj_room_option_yj';//游金
rescfg[QzmjDef.event_shuangyou]='mj_room_option_sy';//双游
rescfg[QzmjDef.event_sanyou]='mj_room_option_sany';//三游
rescfg[QzmjDef.event_bazhanghua]='mj_room_option_bzh';//八张花
 
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
	curEvent=null;
	myself=null;
	updateMySelf(){ 
		var seatid=RoomMgr.getInstance().getMySeatId();
		this.myself=QzmjLogic.getInstance().players[seatid];
	}
	setCurEventIndex(index)
	{
		this.curEvent=this.myself.events[index];
		var cur_op=QzmjDef.op_cfg[this.curEvent] 
		this.carddatas=null;
		if (cur_op==QzmjDef.op_chi){
			this.carddatas=this.myself.getCardsCandChi(); 
		}
		else if (cur_op==QzmjDef.op_angang){
			this.carddatas=this.myself.getCardsCanAnGang();  
		} 
	}
 
	clear(  ){
		// body
		this.curEvent=null;
	}
	recover(  ){
		// body
		
		var seatid=RoomMgr.getInstance().getMySeatId();
		this.myself=QzmjLogic.getInstance().players[seatid];
		 

	}
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
	ui={
		//在这里声明ui
		btnOpArr:null,
		btn_cancel:null,
		three:null,
		four:null, 
		hunode:null,
		threecardpanels:null,
		fourcardpanels:null,
		hucards:[],
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
		this.ui.btnOpArr=[ctrl.btn_0,ctrl.btn_1,ctrl.btn_2,ctrl.btn_3]; 
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

		for(var i = 0;i<14;++i)
		{
			var card=this.ui.hunode.getChildByName(`card_${i}`);
			this.ui.hucards.push(card); 
		} 

	}
 
	recover(){
		// body
		this.clear();

		if(this.model.myself.state!=QzmjDef.state_event){
			return;
		}
		// body 
	 
		this.show();
	}  
	clear(){
		// body
		this.node.active=false
		this.ui.hunode.active=false;
		for (var i = 0;i<this.ui.threecardpanels.length;++i){ 
			this.ui.threecardpanels[i].active=false;
		}
		for (var i = 0;i<this.ui.fourcardpanels.length;++i){ 
			this.ui.fourcardpanels[i].active=false;
		}
	} 
	show(  ){
		// body 
		this.node.active=true; 
 
		this.ui.btn_cancel.active=true;
		for(let i = 0;i<this.ui.btnOpArr.length;++i)
		{
			let btnDo=this.ui.btnOpArr[i];
			let eventLength=this.model.myself.events.length;
			if(i<eventLength)
			{
				let event=this.model.myself.events[eventLength-1-i];
				if(event>=QzmjDef.event_shuangyou)
				{
					this.ui.btn_cancel.active=false;
				}
				var name=rescfg[event]; 
				console.log("name=",`resources/Games/Qzmj/op/${name}.png`)
				var texture=cc.loader.getRes(cc.url.raw(`resources/Games/Qzmj/op/${name}.png`))  
				let frame = new cc.SpriteFrame(texture); 
				btnDo.getComponent(cc.Sprite).spriteFrame = frame; 
				btnDo.active=true;
			} 
			else
			{
				btnDo.active=false;
			} 

		} 

	}
	showSubSel()
	{
		//显示牌面 
		var event=this.model.curEvent; 
		var cur_op=QzmjDef.op_cfg[event]
		if (cur_op==QzmjDef.op_chi ){ 
			this.updateChi();
		} 
		else if (cur_op==QzmjDef.op_angang ){ 
			this.updateAnGang(); 
		} 
	}
	updateHu(  ){
		var cardpairs=this.model.carddatas.cardpairs; 
    	this.ui.hunode.active=true; 
		for(let i = 0;i<this.ui.hucards.length;++i)
		{
			this.ui.hucards[i].active=false;
		}
		var index=0;
		for (let i=0;i<cardpairs.length;++i){
			var cardarr=cardpairs[i];
			for (let k = 0;k<cardarr.length;++k){ 
				var mjnode=this.ui.hucards[index]; 
				mjnode.active=true;
				index++;
				var face=mjnode.getChildByName('face');
				var cardvalue=cardarr[k]; 
				console.log("cardvalue=",cardvalue)
                let texture = QzmjResMgr.getInstance().getCardTextureByValue(cardvalue);
                let frame = new cc.SpriteFrame(texture);
				face.getComponent(cc.Sprite).spriteFrame = frame;   
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
	btn_0=null;
	@property(cc.Node)
	btn_1=null;
	@property(cc.Node)
	btn_2=null;
	@property(cc.Node)
	btn_3=null;
	@property(cc.Node)
	btn_cancel=null; 
	@property(cc.Node)
	three=null;  
	@property(cc.Node)
	four=null;  
	@property(cc.Node)
	hunode=null;   

	//胡牌的牌
	@property(cc.Node)
	card_0=null; 
	@property(cc.Node)
	card_1=null; 
	@property(cc.Node)
	card_2=null; 
	@property(cc.Node)
	card_3=null;
	@property(cc.Node)
	card_4=null;
	@property(cc.Node)
	card_5=null;
	@property(cc.Node)
	card_6=null;
	@property(cc.Node)
	card_7=null;
	@property(cc.Node)
	card_8=null;
	@property(cc.Node)
	card_9=null;
	@property(cc.Node)
	card_10=null;
	
	@property(cc.Node)
	card_11=null; 
	
	@property(cc.Node)
	card_12=null;
	
	@property(cc.Node)
	card_13=null;           
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
			'http.reqRoomUsers':this.http_reqRoomUsers, 
		}
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	http_reqRoomUsers(msg)
	{
		this.model.updateMySelf();
	}
	clickEvent(index)
	{
		//点击了某个事件
		let eventLength=this.model.myself.events.length;//是和事件优先级相反的排版
		this.model.setCurEventIndex(eventLength-1-index); 
		let event=this.model.curEvent;
		if(this.model.carddatas)
		{
			if(this.model.carddatas.length>1)
			{
				this.view.showSubSel();
				return;
			} 
		} 
		this.playerOp(0);
	}
	//绑定操作的回调
	connectUi()
	{  		
		for(let i = 0;i<this.ui.btnOpArr.length;++i)
		{
			var btnOp=this.ui.btnOpArr[i];
			var cb = function()
			{
				this.clickEvent(i);
			}
			this.connect(G_UiType.image,btnOp,cb.bind(this),`操作${i}`);
			
		} 
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
		this.ui.hunode.active=false;
		this.model.recover();
		this.view.recover();
 
	}
	onOp(  ){
		// body 
		this.model.clear();
		this.view.clear() 
	} 
	//事件通知
	onEvent(msg){
		if(this.model.myself.state!=QzmjDef.state_event){
			return;
		}
		// body 
		this.model.clear();
		this.view.clear();
		this.view.show();
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
		if (this.model.curEvent==QzmjDef.event_chi){  
			var chiinfo=this.model.carddatas[id];
			var index=chiinfo.index; 
			QzmjLogic.getInstance().playerOp(this.model.curEvent,index);
		}
		else if (this.model.curEvent==QzmjDef.event_angang){ 
			var card=this.model.carddatas[id];
			QzmjLogic.getInstance().playerOp(this.model.curEvent,card); 
		}
		else {
			QzmjLogic.getInstance().playerOp(this.model.curEvent);
		}
		this.view.clear()
	}
	touchPanel(index){ 
		this.playerOp(index) 
	} 
}