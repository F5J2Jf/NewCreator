import BaseMgr from "./BaseMgr";
import UserMgr from "./UserMgr";

/**
 * VerifyMgr
 * table
 * g
 * GameType
 * gfun
 * 
 */

const {ccclass, property} = cc._decorator;
const STATE = cc.Enum({
    nomal : "state_nomal",//从房间外进来，直接走准备
    fangka : "state_fangka",//从房间外进入房卡
    stayinroom : "state_stayinroom",//在房间中呆着
    oncemore : "state_oncemore",//再来一局
    recover : "state_recover",//恢复
    ownerrecover : "state_ownerrecover",//房主恢复
})

@ccclass
export default class RoomMgr extends BaseMgr{
    roomstate:string = null
    roominfo = null
    roomtype:number = null                        //0表示金币场1表示房卡

    cfg:{} = null
    value:{} = null
    usedefault:{} = null                          //使用默认配置 
    curgameid:number = null
    routes:{} = null
    //=========
    password:any = null
    users:{} = null
    preparemap:any = null
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
    
        this.cfg={}; 
        this.value={}; 
        this.usedefault={}
        this.curgameid=0;

        // this.routes = {
        //     'queCreateFangKaVerify':this.queCreateFangKaVerify.bind(this), 
        //     'http.reqFangKaCfg':this.http_reqFangKaCfg.bind(this),
        //     'queSaveFangKaCfg':this.queSaveFangKaCfg.bind(this),

        //     'onEnterRoom':this.onEnterRoom.bind(this),
        //     'onReEnterRoom':this.onReEnterRoom.bind(this),
        //     'onLeaveRoom':this.onLeaveRoom.bind(this),
        //     'onPrepare':this.onPrepare.bind(this), 
        //     'onSyncData':this.onSyncData.bind(this),
        //     'onStartGame':this.onStartGame.bind(this),      
        //     'queRoomVerify':this.queRoomVerify.bind(this), 
        //     'queRoomEntry':this.queRoomEntry.bind(this), 
        //     'http.reqRoomUsers':this.http_reqRoomUsers.bind(this),
        //     'connector.entryHandler.enterRoom':this.connector_entryHandler_enterRoom.bind(this),
        //     'connector.entryHandler.recoverRoom':this.connector_entryHandler_recoverRoom.bind(this), 
        //     'queRoomVerifyOnceMore':this.queRoomVerifyOnceMore.bind(this),
        //     'queRoomEntryOnceMore':this.queRoomEntryOnceMore.bind(this), 
        //     'queRoomRecover':this.queRoomRecover.bind(this),
        //     'room.roomHandler.reEnterRoom':this.room_roomHandler_reEnterRoom.bind(this),
        //     'room.roomHandler.stayInRoom':this.room_roomHandler_stayInRoom.bind(this),
        //     'onGameFinished':this.onGameFinished.bind(this), 
        //     'queCreateFangKaRoom':this.queCreateFangKaRoom.bind(this),
        //     'queFangKaEntry':this.queFangKaEntry.bind(this), 
        //     'queFangKaVerify':this.queFangKaVerify.bind(this),
        //     'http.reqRoomInfo':this.http_reqRoomInfo.bind(this),
        //     'queDisbandRoom':this.queDisbandRoom.bind(this),
        //     'queEnterMyFangKaRoom':this.queEnterMyFangKaRoom.bind(this),
        //     'queFangKaVerifyOnceMore':this.queFangKaVerifyOnceMore.bind(this),
        //     'queFangKaEntryOnceMore':this.queFangKaEntryOnceMore.bind(this),
        //     'http.reqSettle':this.http_reqSettle.bind(this),
        // }
    }

    //===================所有的请求回调

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
    queDisbandRoom()
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
    queFangKaEntry(msg)
    {
        this.enterRoom();
    }
    queEnterMyFangKaRoom()
    {
        this.enterRoom();
    }
    reqFangKaEntry()
    {
        this.send_msg('http.reqFangKaEntry');//进入房卡房间
    }
    queFangKaVerify()
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
        if(this.roomtype==0){
            // let ret= VerifyMgr.getInstance():checkCoin(this.gameid,this.bettype) 
            let ret = 1;
            if(ret){
                this.reqRoomVerifyOnceMore();
            }
        }else if(this.roomtype==1){
            // local ret=VerifyMgr.getInstance():checkFangKaRound(this.roominfo) 
            let ret = 1;
            if(ret){
                this.reqFangKaVerifyOnceMore();
            } 
        }
    }
    //再来一次房卡验证
    queFangKaVerifyOnceMore(msg)
    {
        this.reqFangKaEntryOnceMore() 
    }
    //再来一次验证
    queRoomVerifyOnceMore(msg)  
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
        // table.remove(this.users,msg.seatid)
        // table.remove(this.preparemap,msg.seatid)
    }
    
    updateRoomUsers(msg)
    {
        // body
        this.users={};
        this.preparemap={};
        this.gameid=null
        let uids={}
        for(let i = 1; i <= msg.users.length; i ++){
            let user=msg.users[i]
            this.gameid=user.gameid;
            this.bettype=user.bettype;
            this.users[user.seatid]=user.id;
            this.preparemap[user.seatid]=user.prepared==1;
            // table.insert(uids,user.id)
        }
        // 设置我的seatid
        // let myuid=g.gamenet.uid;  
        let myuid = 1;
        let uid;
        for(let index in this.users){
            uid = this.users[index];
            console.log(index, this.users[index])
            if(uid && uid == myuid){
                this.myseatid=index;
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


    reqRoomVerify(bettype) 
    {
        this.roomstate=STATE.nomal;
        // let gametype=GameType.getInstance();
        let gametype = {
            gameid : 1,
            seatcount : 2
        };
        this.bettype=bettype;
        let msg={
            'gameid':gametype.gameid,
            'bettype':bettype,
            'seatcount':gametype.seatcount,
        }
        this.send_msg('http.reqRoomVerify',msg);
    }
    queRoomVerify(msg)
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
    queRoomRecover()
    {
        // body 
        this.recoverRoom();
    }

    queCreateFangKaRoom(msg)
    {
        //获得web服务器上房间分配后,就进入pomelo服务器 
        this.enterRoom();
    }
    queRoomEntryOnceMore(msg)
    {
        this.reEnterRoom();
    }
    queFangKaEntryOnceMore(msg)
    {
        this.reEnterRoom();
    }
    queRoomEntry(msg)
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

    
    queSaveFangKaCfg()
    {
        // body
        console.log("收到了保存成功的回复")
    }
    isDefault()
    {
        // body
        return this.usedefault[this.curgameid]
    }
    getValue()
    {
        // body
        return this.value[this.curgameid]
    }
    setCurGameId(gameid)
    {
        // body
        this.curgameid=gameid
    }
    updateCfg(cfg)
    {
        // body
        // this.cfg[this.curgameid]=gfun.deepcopy(cfg) 
    }
    reqSaveFangKaCfg(cfg)
    {
        let msg={
            'gameid':this.curgameid,
            'cfg':cfg,
        }
        this.send_msg('http.reqSaveFangKaCfg',msg) 
    }

    reqCreateFangKaRoom()
    {
        //创建房卡房间
        this.send_msg('http.reqCreateFangKaRoom') 
    }

    queCreateFangKaVerify(msg)
    {
        //收到保存成功后就刷新最新的设置  
        this.reqCreateFangKaRoom(); 
    }
    http_reqFangKaCfg(msg)
    {
        //返回获取配置的结果，如果没有配置，则使用默认配置  
        this.cfg[this.curgameid]=JSON.parse(msg.cfg); 
    }
    getCfg()
    {
        // body
        return this.cfg[this.curgameid]
    }
    //保存配置
    reqCreateFangKaVerify()
    {
        this.setState(STATE.fangka)  
        let msg={
            'gameid':this.curgameid,
        }
        this.send_msg('http.reqCreateFangKaVerify',msg) 
    }
    //获取配置
    reqFangKaCfg()
    {
        // body
        let msg={
            'gameid':this.curgameid, 
        }
        this.send_msg('http.reqFangKaCfg',msg) 
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