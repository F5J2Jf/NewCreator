/*
author: YOYO
日期:2018-02-01 15:12:03
tip: 牛牛房间控制体
*/
import BaseView from "../../../Plat/Libs/BaseView";
import BaseModel from "../../../Plat/Libs/BaseModel";
import BaseCtrl from "../../../Plat/Libs/BaseCtrl";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";
import BullLogic from "../BullMgr/BullLogic";
import FrameMgr from "../../../Plat/GameMgrs/FrameMgr";
import { BullDef } from "../BullMgr/BullDef";
import BullCardsMgr from "../BullMgr/BullCardsMgr";

//MVC模块,
const {ccclass, property} = cc._decorator;
let ctrl : BullRoomCtrl;
//模型，数据处理
class Model extends BaseModel{
    roomInfo:{
        bettype:null,
        gameid:null,
        gamestarted:null,
        id:null,
        matchid:null,
        owner:null,
        password:null,
        playercount:null,
        preparecount:null,
        roundcount:null,
        roundindex:null,
        seatcount:null
    } = null              //请求到的房间信息
    roomid:number = null
    curRound:number = null              //当前局数
    mySeatId:number = null
    myPrepared:any = null
    myself:any = null

    time_startAni:number = null         //开始动画停留时间
	constructor()
	{
		super();
        this.time_startAni = 0.5;
    }
    
    updateMyInfo()
	{
		// body 
		this.mySeatId=RoomMgr.getInstance().getMySeatId();
		this.myPrepared=RoomMgr.getInstance().preparemap[this.mySeatId] 
        this.myself=BullLogic.getInstance().getPlayerInfo(this.mySeatId);
    }
    
    updateMyPrepared(  )
	{
		// body
		this.myPrepared=RoomMgr.getInstance().preparemap[this.mySeatId]
	} 
}
//视图, 界面显示或动画，在这里完成
class View extends BaseView{
    // model:Model = null
    private dict_readyTag:{} = null             //保存所有的准备标志
	ui={
        //在这里声明ui
        node_seatsContainer:null,
        node_readyFlagContainer:null,

        node_img_ready:null,
        node_img_startAni:null,
        node_btn_done:null,
        node_btn_close:null,

        lab_curRound:null,
        lab_roomid:null
	};
	node=null;
	constructor(model){
		super(model);
		this.node=ctrl.node;
        this.initUi();
	}
	//初始化ui
	initUi()
	{
        this.ui.node_seatsContainer = ctrl.node_seatsContainer;
        this.ui.node_readyFlagContainer = ctrl.node_readyFlagContainer;
        this.ui.node_img_ready = ctrl.node_img_ready;
        this.ui.node_img_startAni = ctrl.node_img_startAni;
        this.ui.node_btn_done = ctrl.node_btn_done;
        this.ui.node_btn_close = ctrl.node_btn_close;
        this.ui.lab_curRound = ctrl.lab_curRound;
        this.ui.lab_roomid = ctrl.lab_roomid;
    }
    //刷新房间信息
    updateRoomInfo (){
        this.ui.lab_curRound.string = this.model.roomInfo.roundcount;
        this.ui.lab_roomid.string = this.model.roomInfo.id;
    }
    updateMyPrepared()
	{
		// body
        this.ui.node_img_ready.active = !this.model.myPrepared;
    }
    //控制准备按钮的显隐
    setReadyBtnShow(isShow:Boolean){
        this.ui.node_img_ready.active = isShow;
    }
    //设置一个对应座位号的准备图标的显隐
    setReadyFlagShow(viewSeatId:number, isShow:Boolean){
        let flag = this.ui.node_readyFlagContainer.children[viewSeatId];
        if(flag){
            flag.active = isShow;
        }
    }
    //清理所有准备标志的显示
    clearAllReadyFlags (){
        let flags = this.ui.node_readyFlagContainer.children;
        for(let i = 0; i < flags.length; i ++){
            flags[i].active = false;
        }
    }
    //显示开始动画
    showStartAni(cb:Function, target){
        this.ui.node_img_startAni.active = true;
        let act1 = cc.delayTime(this.model.time_startAni);
        let act2 = cc.callFunc(function(){
            this.ui.node_img_startAni.active = false;
            cb.call(target);
        }, this);
        this.ui.node_img_startAni.runAction(cc.sequence(act1, act2));
    }
    //是否显示摊牌按钮
    setDoneBtnShow(isShow:Boolean){
        this.ui.node_btn_done.active = isShow;
    }
}
//c, 控制
@ccclass
export default class BullRoomCtrl extends BaseCtrl {
    view:View = null;
    model:Model = null;
    //这边去声明ui组件
    //nodes ----
    @property({
        type:cc.Node,
        displayName:"readyImg"
    })
    node_img_ready:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"startAniImg"
    })
    node_img_startAni:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"closeBtn"
    })
    node_btn_close:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"seatList"
    })
    node_seatsContainer:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"readyFlagList"
    })
    node_readyFlagContainer:cc.Node = null
    @property({
        type:cc.Node,
        displayName:"doneBtn"
    })
    node_btn_done:cc.Node = null
    //labels   ----
    @property(cc.Label)
    lab_roomid:cc.Label = null
    @property(cc.Label)
    lab_curRound:cc.Label = null
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
			'onLeaveRoom':this.onLeaveRoom, 
			'onPrepare':this.onPrepare,     
			// onSeatChange:this.onSeatChange,
			'http.reqRoomUsers':this.http_reqRoomUsers, 
			'http.reqExitRoom':this.http_reqExitRoom,
			onSyncData:this.onSyncData,
			onProcess:this.onProcess,
			// onOp:this.onOp,     
			// 'http.reqSettle':this.http_reqSettle,
			'http.reqDisbandRoom':this.http_reqDisbandRoom,
			'onDisbandRoom':this.onDisbandRoom,
            'http.reqRoomInfo':this.http_reqRoomInfo, 
            
            'test_giveCardEnd':this.onGiveCardEnd,
        } 	
	}
	//定义全局事件
	defineGlobalEvents()
	{

	}
	//绑定操作的回调
	connectUi()
	{
        this.connect(G_UiType.image, this.ui.node_btn_close, this.node_btn_close_cb, '点击关闭');
        this.connect(G_UiType.image, this.ui.node_img_ready, this.node_img_ready_cb, '点击准备');
        this.connect(G_UiType.image, this.ui.node_btn_done, this.node_btn_done_cb, '点击摊牌');
	}
	start () {
        if (RoomMgr.getInstance().roomstate==G_ROOMSTATE.nomal) {  
			RoomMgr.getInstance().enterRoom()
		}
		else if (RoomMgr.getInstance().roomstate==G_ROOMSTATE.recover) {  
			RoomMgr.getInstance().recoverRoom();
		}
		else  if (RoomMgr.getInstance().roomstate==G_ROOMSTATE.fangka) { 
			RoomMgr.getInstance().enterRoom()
		}
		else  if (RoomMgr.getInstance().roomstate==G_ROOMSTATE.ownerrecover) { 
			RoomMgr.getInstance().enterRoom()
		}
	}
    //网络事件回调begin
    http_reqRoomInfo() 
	{
        console.log("RoomMgr.getInstance().roomtype=",RoomMgr.getInstance().roomtype)
        
        this.model.roomInfo = RoomMgr.getInstance().roominfo;
        this.view.updateRoomInfo();
		if(RoomMgr.getInstance().roomtype==1){ 
            //房卡
		}else if(RoomMgr.getInstance().roomtype==0){
            //金币场
        }
    }  
    http_reqDisbandRoom(){
		//解散房间
		//周边平台与子游戏间，子游戏与平台间的切换要统一管理
		this.start_module(G_MODULE.Plaza)
    }
    http_reqExitRoom(  ){
		// body
		//返回游戏选择界面,理论上还要释放资源
		this.start_module(G_MODULE.Plaza)
    }
    http_reqRoomUsers(msg){
		// body  
		// if (RoomMgr.getInstance().roomstate==G_ROO.state_oncemore) {  
		// 	RoomMgr.getInstance().reqPrepare()
        // }
		this.model.updateMyInfo();//更新我的信息
        this.model.updateMyPrepared();
        this.view.updateMyPrepared();
    } 
    //某个玩家离开
    onLeaveRoom(msg){
		var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid)
        this.view.setReadyFlagShow(viewseatid, false);
    }
    onPrepare(msg)
	{
        var viewseatid=RoomMgr.getInstance().getViewSeatId(msg.seatid)
        this.view.setReadyFlagShow(viewseatid, true);
    }
    onProcess(msg){
		if(msg.process==BullDef.process.ready){ 
            this.view.clearAllReadyFlags();
		}
	}
    onSyncData(  ){
        console.log('未知函数onSyncData')
		// body 
		// this.model.recover();
		// this.view.recover();
		// this.ui.lbl_cardcount.node.active=true
		// this.ui.lbl_shen.node.active=true
		// this.view.updateLeftCardCount();  
    }
    //解散房间
    onDisbandRoom(){
		var okcb=function(){
			this.start_module(G_MODULE.Plaza)
		} 
		FrameMgr.getInstance().showMsgBox('房主有事，房间解散',okcb.bind(this)) 
    }
    
    //process-----------------

    onStartGame(){
        console.log('game start')
        G_FRAME.netEmitter.emit("test_onStartGive",[0,1,2,3])
    }

    onGiveCardEnd(){
        this.view.setDoneBtnShow(true);
    }
	//end
	//全局事件回调begin
	//end
    //按钮或任何控件操作的回调begin
    private node_btn_close_cb(){
        console.log('node_btn_close---')
    }
    //点击准备
    private node_img_ready_cb(event){
        console.log("node_img_ready===")
        event.active = false;
        RoomMgr.getInstance().reqPrepare();
        this.view.showStartAni(this.onStartGame, this);
    }
    //点击摊牌
    private node_btn_done_cb(){
        console.log('node_btn_done_cb===')
        this.view.setDoneBtnShow(false);
        G_FRAME.netEmitter.emit("test_calculateDone",null)

        
    }
    //end


}