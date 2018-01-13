import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";
import BetMgr from "./BetMgr";
import LoginMgr from "./LoginMgr";
import VerifyMgr from "./VerifyMgr";

/**
 * VerifyMgr
 * table
 * g
 * GameType
 * gfun
 * 
 */
 
const STATE = cc.Enum({
    nomal : "state_nomal",//从房间外进来，直接走准备
    fangka : "state_fangka",//从房间外进入房卡
    stayinroom : "state_stayinroom",//在房间中呆着
    oncemore : "state_oncemore",//再来一局
    recover : "state_recover",//恢复
    ownerrecover : "state_ownerrecover",//房主恢复
})
 
export default class RoomMgr extends BaseMgr{
    roomstate:string = null
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
    gameid:any = null
    bettype:any = null
    constructor (){
        super();
        
        this.roomstate=STATE.nomal;  
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

    }
    http_reqSettle()
    {
        this.reqRoomInfo();
    }
    //重新进房卡房间
    reqEnterMyFangKaRoom()
    {
        this.roomstate=STATE.ownerrecover;
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
        this.enterRoom();
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
        this.roomstate=STATE.fangka;
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
        let msg={
            'rid':this.rid,
        }
        this.send_msg('http.reqRoomInfo',msg);//获取房间信息
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
        this.roomstate=STATE.stayinroom;
        this.send_msg('room.roomHandler.stayInRoom');//留在房间中
    }
    //再来一局
    onceMore(){
        // body
        VerifyMgr
        if(this.roomtype==0){  
            let ret=VerifyMgr.getInstance().checkCoin(BetMgr.getInstance().getGameId(),BetMgr.getInstance().getBetType())  
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
        this.roomstate=STATE.oncemore;
        this.send_msg('http.reqRoomVerifyOnceMore');
    }
    //验证再来一局
    reqFangKaVerifyOnceMore()
    {
        this.roomstate=STATE.oncemore;
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
        this.roomstate=STATE.recover;
        this.send_msg('connector.entryHandler.recoverRoom');
    }
    connector_entryHandler_recoverRoom(msg:any)
    {
        // body 恢复游戏的回调 
        this.rid=msg.rid;
        this.reqRoomUsers();
    }
    prepare()
    {
        // body 
        this.send_msg('http.reqPrepare');
    }
    onEnterRoom(msg) 
    {
        let uid=msg.user;
        this.users[msg.seatid]=uid   
        UserMgr.getInstance().reqUsers({uid});
    }
    onReEnterRoom(msg)
    {
        let uid=msg.user;
        this.users[msg.seatid]=uid   
        UserMgr.getInstance().reqUsers({uid});
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
        this.gameid=null;
        var uids=[]
        
        console.log("typeof(msg)",typeof(msg))
        for(var i=0;i<msg.users.length;++i)
        {
            var user=msg.users[i] 
            this.users[user.seatid]=user.id;
            this.preparemap[user.seatid]=user.prepared==1;
            uids.push(user.id)
        }   
        // 设置我的seatid
        var myuid= LoginMgr.getInstance().getUid() 
        for(var logicseatid in this.users)
        { 
            var  uid = this.users[logicseatid] 
            if (uid && myuid== uid )  
            {
                this.myseatid=logicseatid;
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
    } 
    
    getLogicSeatId(target_seatid)
    {
        let logicseatid = (this.myseatid+target_seatid)%4;
        
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
        this.roomstate=STATE.nomal;   
        let msg={
            'gameid':BetMgr.getInstance().getGameId(),
            'bettype':BetMgr.getInstance().getBetType(),
            'seatcount':BetMgr.getInstance().getSeatCount(),
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
    http_reqRoomRecover()
    {
        // body 
        this.recoverRoom();
    }

    http_reqCreateFangKaRoom(msg)
    {
        //获得web服务器上房间分配后,就进入pomelo服务器 
        this.enterRoom();
    }
    http_reqRoomEntryOnceMore(msg)
    {
        this.reEnterRoom();
    }
    http_reqFangKaEntryOnceMore(msg)
    {
        this.reEnterRoom();
    }
    http_reqRoomEntry(msg)
    {
        //获得web服务器上房间分配后,就进入pomelo服务器 
        this.enterRoom();
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
        this.rid=msg.rid;
        this.reqRoomUsers();
    }
    http_reqRoomUsers(msg)
    {
        //获得web服务器上房间分配后,就进入pomelo服务器 
        this.updateRoomUsers(msg)
        this.reqRoomInfo();
    }
    reqRoomUsers()
    {
        this.resetData();
        let msg={
            'rid':this.rid,
        }
        this.send_msg('http.reqRoomUsers',msg);
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
 
    //单例处理
    private static _instance:RoomMgr
    public static getInstance ():RoomMgr{
        if(!this._instance){
            this._instance = new RoomMgr();
        }
        return this._instance;
    }
}