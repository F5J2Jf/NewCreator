import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";
import BetMgr from "./BetMgr";
import LoginMgr from "./LoginMgr";
import VerifyMgr from "./VerifyMgr";
import YySdkMgr from "../SdkMgrs/YySdk";

/**
 * VerifyMgr
 * table
 * g
 * GameType
 * gfun
 * 
 */

enum G_ROOMSTATE
{
    nomal=1, 
    fangka,
    stayinroom,
    oncemore,
    recover,
    ownerrecover,
} 
window['G_ROOMSTATE']=G_ROOMSTATE; 
  
export default class RoomMgr extends BaseMgr{
    roomstate:G_ROOMSTATE = null
    roominfo = null
    roomtype:number = null                        //0表示金币场1表示房卡
  
    routes={}
    //=========
    password:any = null
    users={}
    preparemap={}
    myseatid:any = null
    bGameIsStated:Boolean = null
    rid:any = null  
    constructor (){
        super();
        
        this.roominfo=null;
        this.roomtype=0;
        this.resetData();
     

        this.routes = {
            'http.reqCreateFangKaVerify':this.http_reqCreateFangKaVerify,   
            'onEnterRoom':this.onEnterRoom,
            'onReEnterRoom':this.onReEnterRoom,
            'onLeaveRoom':this.onLeaveRoom,
            'onPrepare':this.onPrepare, 
            'onSyncData':this.onSyncData,
            'onStartGame':this.onStartGame,      
            'http.reqRoomVerify':this.http_reqRoomVerify, 
            'http.reqRoomEntry':this.http_reqRoomEntry, 
            'http.reqRoomUsers':this.http_reqRoomUsers,
            'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom,
            'connector.entryHandler.recoverRoom':this.connector_entryHandler_recoverRoom, 
            'http.reqRoomVerifyOnceMore':this.http_reqRoomVerifyOnceMore,
            'http.reqRoomEntryOnceMore':this.http_reqRoomEntryOnceMore, 
            'http.reqRoomRecover':this.http_reqRoomRecover,
            'room.roomHandler.reEnterRoom':this.room_roomHandler_reEnterRoom,
            'room.roomHandler.stayInRoom':this.room_roomHandler_stayInRoom,
            'onGameFinished':this.onGameFinished, 
            'http.reqCreateFangKaRoom':this.http_reqCreateFangKaRoom,
            'http.reqFangKaEntry':this.http_reqFangKaEntry, 
            'http.reqFangKaVerify':this.http_reqFangKaVerify,
            'http.reqRoomInfo':this.http_reqRoomInfo,
            'http.reqDisbandRoom':this.http_reqDisbandRoom,
            'http.reqEnterMyFangKaRoom':this.http_reqEnterMyFangKaRoom,
            'http.reqFangKaVerifyOnceMore':this.http_reqFangKaVerifyOnceMore,
            'http.reqFangKaEntryOnceMore':this.http_reqFangKaEntryOnceMore,
            'http.reqSettle':this.http_reqSettle,
        }
    }

    //===================所有的请求回调
    http_reqFangKaEntry(msg)
    { 
        this.rid=msg.rid; 
        this.roomstate=G_ROOMSTATE.fangka;
    }
    http_reqSettle()
    {
        this.reqRoomInfo();
    }
    //重新进房卡房间
    reqEnterMyFangKaRoom()
    {
        this.send_msg('http.reqEnterMyFangKaRoom');//获取我的房间状态
    }
    http_reqDisbandRoom()
    {
    }
    //获取我的房间状态
    reqMyRoomState()
    {
        this.send_msg('http.reqMyRoomState');//获取我的房间状态
    }
    setState(state)
    {
        this.roomstate=state;
    }
 
    http_reqEnterMyFangKaRoom()
    {
        this.roomstate=G_ROOMSTATE.ownerrecover; 
    }
    reqFangKaEntry()
    {
        this.send_msg('http.reqFangKaEntry');//进入房卡房间
    }
    http_reqFangKaVerify()
    {
        this.reqFangKaEntry()
    }
    reqFangKaVerify(password)
    {
        this.password=password;
        let msg={
            'password':password,
        }
        this.send_msg('http.reqFangKaVerify',msg);//进入房卡房间
    }
    resetData()
    {
        this.users={};
        this.preparemap={};
        this.myseatid=null; 
        this.bGameIsStated=false;  
    }
    onSyncData()
    {
        // body
        this.bGameIsStated=true;
    }
    room_roomHandler_stayInRoom(msg)
    {
        this.roomstate=G_ROOMSTATE.stayinroom;
        this.reqRoomUsers();
    }
    room_roomHandler_reEnterRoom(msg)
    {
        this.reqRoomUsers();
    }
    http_reqRoomInfo(msg)
    {
        this.roominfo=msg.roominfo;
        if(msg.roominfo.owner==0){
            this.roomtype=0
        }else{
            this.roomtype=1
        }
    }
    reqRoomInfo()
    { 
        this.send_msg('http.reqRoomInfo');//获取房间信息
    } 
    //麻将进度
    onStartGame(msg) 
    { 
        this.bGameIsStated=true;  
    }
    onGameFinished()
    {
        // body
        this.preparemap={};//重置准备状态
        this.bGameIsStated=false; 
    }
    //返回房间桌面
    backToRoom()
    {
        this.send_msg('room.roomHandler.stayInRoom');//留在房间中
    }
    //再来一局
    onceMore(){
        // body 
        if(this.roomtype==0){  
            let ret=VerifyMgr.getInstance().checkCoin()  
            if(ret){
                this.reqRoomVerifyOnceMore();
            }
        }else if(this.roomtype==1){
            let ret=VerifyMgr.getInstance().checkFangKaRound(this.roominfo)   
            if(ret){
                this.reqFangKaVerifyOnceMore();
            } 
        }
    }
    //再来一次房卡验证
    http_reqFangKaVerifyOnceMore(msg)
    {
        this.reqFangKaEntryOnceMore() 
    }
    //再来一次验证
    http_reqRoomVerifyOnceMore(msg)  
    {
        this.reqRoomEntryOnceMore() 
    }
    //验证再来一局
    reqRoomVerifyOnceMore()
    {
        this.send_msg('http.reqRoomVerifyOnceMore');
    }
    //验证再来一局
    reqFangKaVerifyOnceMore()
    {
        this.send_msg('http.reqFangKaVerifyOnceMore');
    }
    onPrepare(msg)
    {
        // body
        this.preparemap[msg.seatid]=true; 
    }
    recoverRoom()
    {
        // body  
        this.send_msg('connector.entryHandler.recoverRoom');
    }
    connector_entryHandler_recoverRoom(msg:any)
    {
        // body 恢复游戏的回调 
        this.rid=msg.rid;
        this.reqRoomUsers();
    }
    reqPrepare()
    {
        // body 
        this.send_msg('http.reqPrepare');
    }
    onEnterRoom(msg) 
    {
        let uid=msg.user;
        this.users[msg.seatid]=uid     
        UserMgr.getInstance().reqUsers([uid]);
    }
    onReEnterRoom(msg)
    {
        let uid=msg.user;
        this.users[msg.seatid]=uid
        UserMgr.getInstance().reqUsers([uid]);
    }

    onLeaveRoom(msg)
    {
        delete this.users[msg.seatid]
        delete this.preparemap[msg.seatid] 
    }
    
    updateRoomUsers(msg)
    {
        // body
        this.users={};
        this.preparemap={}; 
        var uids=[]
         
        for(var i=0;i<msg.users.length;++i)
        {
            var user=msg.users[i] 
            this.users[user.seatid]=user.id;
            this.preparemap[user.seatid]=user.prepared==1;
            uids.push(user.id)
        }   
        console.log('updateRoomUsers=',this.preparemap)
        // 设置我的seatid
        var myuid= LoginMgr.getInstance().getUid() 
        for(var logicseatid in this.users)
        { 
            var  uid = this.users[logicseatid] 
            if (uid && myuid== uid )  
            {
                this.myseatid=parseInt(logicseatid); 
                break;
            } 
        }
        UserMgr.getInstance().reqUsers(uids);
    }
    
    getMySeatId()
    {
        // body
        return this.myseatid;
    }
    reqDisbandRoom()
    {
        // body
        this.send_msg('http.reqDisbandRoom');
    }
    reqExitRoom()
    {
        // body
        this.send_msg('http.reqExitRoom');
        YySdkMgr.getInstance().LeaveRoom();
    } 
    
    getLogicSeatId(target_seatid)
    {  
        let logicseatid = (target_seatid + this.myseatid)%4;
         
        return logicseatid;
    }

    getViewSeatId(logicSeatId)
    {
        // body
        let viewseatid = (logicSeatId-this.myseatid+4)%4; 
        return viewseatid;
    }


    reqRoomVerify() 
    { 
        this.roomstate=G_ROOMSTATE.nomal;   
        let msg={
            'gameid':BetMgr.getInstance().getGameId(),
            'bettype':BetMgr.getInstance().getBetType(),
            'seatcount':4,
        }
        this.send_msg('http.reqRoomVerify',msg);
    }
    http_reqRoomVerify(msg)
    {
        this.reqRoomEntry()
    }
    reqRoomEntry()
    {
        this.send_msg('http.reqRoomEntry');
    }

    reqRoomEntryOnceMore()
    {
        this.send_msg('http.reqRoomEntryOnceMore');
    }


    reqFangKaEntryOnceMore()
    {
        this.send_msg('http.reqFangKaEntryOnceMore');
    }
    reqRoomRecover()
    {
        this.send_msg('http.reqRoomRecover');
    }
    http_reqRoomRecover(msg)
    {
        //恢复游戏要知道是哪个游戏
        let betinfo=msg.betinfo;
        BetMgr.getInstance().setGameId(betinfo.gameid);
        BetMgr.getInstance().setBetType(betinfo.bettype);
        // body 
        //恢复游戏这里应该还要服务器补充游戏id的参数
        this.roomstate=G_ROOMSTATE.recover;   
    }

    http_reqCreateFangKaRoom(msg)
    {
        //获得web服务器上房间分配后,就进入pomelo服务器 
        this.roomstate=G_ROOMSTATE.fangka;  
        this.rid=msg.rid; 
    }
    http_reqRoomEntryOnceMore(msg)
    {
        this.roomstate=G_ROOMSTATE.oncemore;
        this.reEnterRoom();
    }
    http_reqFangKaEntryOnceMore(msg)
    {
        this.roomstate=G_ROOMSTATE.oncemore;
        this.reEnterRoom();
    }
    http_reqRoomEntry(msg)
    {
        //获得web服务器上房间分配后,就进入pomelo服务器 
        this.roomstate=G_ROOMSTATE.nomal;  
        this.rid=msg.rid; 
    }
    reEnterRoom()
    {
        // body
        this.send_msg('room.roomHandler.reEnterRoom');
    }
    enterRoom()
    {
        // body
        this.send_msg('connector.entryHandler.enterRoom');
    }
    
    connector_entryHandler_enterRoom(msg)
    { 
        this.startYaYaSdk();
        this.reqRoomUsers();
    }
    http_reqRoomUsers(msg)
    {
        
        this.updateRoomUsers(msg)
        this.reqRoomInfo(); 
        //判断房间状态自动准备
		switch(this.roomstate)
		{
			case G_ROOMSTATE.nomal:
            case G_ROOMSTATE.oncemore: 
                this.reqPrepare();//
            break;
		} 
    }
    reqRoomUsers()
    {
        this.resetData(); 
        this.send_msg('http.reqRoomUsers');
    } 

    reqCreateFangKaRoom()
    {
        //创建房卡房间
        this.send_msg('http.reqCreateFangKaRoom') 
    }

    http_reqCreateFangKaVerify(msg)
    {
        //收到保存成功后就刷新最新的设置  
        this.reqCreateFangKaRoom(); 
    } 
    reqCreateFangKaVerify()
    {  
        var msg={
            'gameid':BetMgr.getInstance().getGameId()
        }
        this.send_msg('http.reqCreateFangKaVerify',msg)  
    }
    startYaYaSdk () {
		let userinfo = UserMgr.getInstance().getMyInfo();
		YySdkMgr.getInstance().InitYaYaSdk(userinfo.id, userinfo.nickname, this.rid);
    }
    //单例处理
    private static _instance:RoomMgr
    public static getInstance ():RoomMgr{
        if(!this._instance){
            this._instance = new RoomMgr();
        }
        return this._instance;
    }
}