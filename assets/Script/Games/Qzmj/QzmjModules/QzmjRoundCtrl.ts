/*
author: JACKY
日期:2018-01-12 16:15:11
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
let ctrl : QzmjRoundCtrl;
//模型，数据处理
class Model extends BaseModel{
	step=null;
	state=null;
	starttime=null;
	curtime=null;
	curseat=null;
	dirid=null; 
	constructor()
	{
		super();
		this.step=0;
		this.state=0;
		this.starttime=0; 
		this.curtime=0;
	}
    setState(state){
		this.state=state;
		this.step=0; 
	}
 
	resetTime(  ){
		// body
		this.starttime=Date.now();
		this.curtime=QzmjLogic.getInstance().maxoptime;
	} 
	recover(  ){
		// body
		this.updateSeatId();
	} 
	updateSeatId(){
		this.curseat=QzmjLogic.getInstance().curseat; 
		this.dirid =  RoomMgr.getInstance().getViewSeatId(this.curseat);
		if (this.dirid < 0 ){ 
			this.dirid=this.dirid+4;
		}
	} 
	runTo( steps ){
		this.step=this.step+1;
		if(this.step>=steps){ 
			return false;
		}
		return true;
	} 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
 
    tiparr=null;
	lbl_time=null;
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
		this.initUi();
	}
	//初始化ui
	initUi()
	{
		this.lbl_time=ctrl.lbl_time;
		this.tiparr=[ctrl.tip_0,ctrl.tip_1,ctrl.tip_2,ctrl.tip_3]
		
		for (let i=0;i<this.tiparr.length;++i)
		{
			var sp=this.tiparr[i];
			sp.runAction(cc.repeatForever(cc.blink(0.5,1)))
		}
	} 
	tick(){	 
		this.lbl_time.active=true;
		this.lbl_time.getComponent(cc.Label).string=this.model.curtime;  
	}  
	clear(  ){ 
		for (let i=0;i<this.tiparr.length;++i)
		{
			var sp=this.tiparr[i];
			sp.active=false;
		}  
		this.hideTime(); 
	}  
	//更新方向
	updateDir(  ){

	}
 
	dirChange(){
		for (let i=0;i<this.tiparr.length;++i)
		{
			var sp=this.tiparr[i];
			sp.active=false;
		}  
		this.tiparr[this.model.dirid].active=true;
	 
	}
	hideTime()
	{
		this.lbl_time.active=false;
	}
	setNum(index,num)
	{

	}
}
//c, 控制
@ccclass
export default class QzmjRoundCtrl extends BaseCtrl {
	//这边去声明ui组件
 
    @property(cc.Node)
	lbl_time=null;
    @property(cc.Node)
	tip_0=null;
    @property(cc.Node)
	tip_1=null;
    @property(cc.Node)
	tip_2=null;
    @property(cc.Node)
	tip_3=null;
	//声明ui组件end

    timer=null;

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
			onProcess:this.onProcess,
			onSeatChange:this.onSeatChange,
			onSyncData:this.onSyncData,
			onEvent:this.onEvent, 
			onOp:this.onOp, 
			'http.reqRoomUsers':this.http_reqRoomUsers, 
			'onGameFinished':this.onGameFinished,
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
	//end
	//全局事件回调begin
	//end
	//按钮或任何控件操作的回调begin
	//end
 
	onOp(msg){
		// body  
		var opseatid=msg.opseatid;
		if (msg.event==QzmjDef.event_chupai){ 
			opseatid=QzmjLogic.getInstance().curseat;
		}
		if (opseatid==RoomMgr.getInstance().getMySeatId()){
			this.stopTick();
		}
	}
	tick()
	{
		let elapse=Date.now()-this.model.starttime;
		elapse=parseInt(elapse/1000); 
		this.model.curtime=QzmjLogic.getInstance().maxoptime-elapse;
		if(this.model.curtime<0){ 
			this.model.curtime=0;
		}
		this.view.tick()
	}
	startTick(  ){
		// body 
		this.view.hideTime();
		this.model.resetTime();
		this.stopTick();
		this.timer = window.setInterval(this.tick.bind(this),1000);
		this.view.tick()
	}
	stopTick(  ){
		// body 
		if(this.timer)
		{
			window.clearInterval(this.timer);
			this.timer=null;
		} 
	}
	
	onEvent(  ){
		// body
		this.startTick() 
		this.model.resetTime();
		this.view.tick()
	}
    onSyncData( msg ){
		// body
		this.model.recover();
		this.view.dirChange();
		this.model.state=1; 
		this.view.updateDir()
		var event=QzmjLogic.getInstance().cur_eventtype;
		if (event!=0 && event != null){  
			this.stopTick();
			//重置这些时间
			this.model.curtime=QzmjLogic.getInstance().maxoptime - msg.op_tick;
		}

	}
 
	http_reqRoomUsers(  ){
		// body
		this.view.clear();
	} 
	onProcess(msg){
		// body 
		if (msg.process==QzmjDef.process_dingzhuang){
			this.process_dingzhuang(msg); 
		}
		else if (msg.process==QzmjDef.process_fapai){ 
			this.process_fapai(msg);
		}
		else if (msg.process==QzmjDef.process_buhua){
			this.process_buhua(msg)
		}
		else if (msg.process==QzmjDef.process_ready){
			this.process_ready(); 
		}
		else if (msg.process==QzmjDef.process_loop){
			this.process_loop(); 
		}
	}
	process_fapai()
	{

	}
	process_loop(){ 
		this.startTick();
	}
	onGameFinished(  ){
		// body
		this.stopTick(); 
	} 
	process_ready(  ){
		// body
		this.stopTick();
		this.view.clear();
	}
	process_buhua(  ){

	} 
	onSeatChange(msg){
		this.startTick();
		this.model.updateSeatId();
		this.view.dirChange(); 
	}
	process_dingzhuang(msg){  
		this.model.updateSeatId();
		this.view.dirChange();  
	} 
}