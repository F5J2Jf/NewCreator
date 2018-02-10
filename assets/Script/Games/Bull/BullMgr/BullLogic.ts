import BaseMgr from "../../../Plat/Libs/BaseMgr";
import BullPlayer from "./BullPlayer";
import RoomMgr from "../../../Plat/GameMgrs/RoomMgr";

//牛牛管理器
interface t_userInfo {
    bettype:number,
    bowner:any,
    gameid:number,
    gamestarted:any,
    id:number,
    inroom:any,
    password:number,
    prepared:any,
    rid:number,
    roundcount:number,
    seatcount:number,
    seatid:number,
    verified:any
}
export default class BullLogic extends BaseMgr {
    private seatcount:number = null
    private players:{} = null
    constructor()   
    {
        super();
        // this.maxoptime=12; 
        this.players={};  
        this.seatcount=4;//座位个数  
        //创建四个角色
        for (var i = 0; i<this.seatcount; i++)
        {
            this.players[i]=new BullPlayer();
            this.players[i].init(i,this)
        }  

        this.routes={ 
        //     onProcess:this.onProcess,   
        //     onEvent:this.onEvent, 
        //     onSeatChange:this.onSeatChange,
        //     onOp:this.onOp, 
            onSyncData:this.onSyncData,
        //     'onGameFinished':this.onGameFinished,
        //     'http.reqSettle':this.http_reqSettle,
			'http.reqRoomUsers':this.http_reqRoomUsers,  
        }
        // this.resetData();
    }

    http_reqRoomUsers(msg)
    { 
        //同步数据
        if(RoomMgr.getInstance().roomstate==G_ROOMSTATE.recover)
		{
			this.syncData();
		}
    }

    syncData(  )
    {
        // body
        this.notify_msg('room.roomHandler.syncData',null)
    } 

    onSyncData(msg){
        console.log('===================')
        console.log(msg)
    }

    //获取玩家信息
    getPlayerInfo (seatId:number){
        return this.players[seatId];
    }

    //单例处理
    private static _instance:BullLogic;
    public static getInstance ():BullLogic{
        if(!this._instance){
            this._instance = new BullLogic();
        }
        return this._instance;
    }
}

BullLogic.getInstance()