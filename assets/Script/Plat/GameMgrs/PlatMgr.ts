import BaseMgr from "../Libs/BaseMgr";
import UserMgr from "./UserMgr";
import RoomMgr from "./RoomMgr";
  
export default class PlatMgr extends BaseMgr{
    loadprocess:any = null
    loadarr:Array<Function> = null
    totalcount:number = null
    routes:any = null
    completecb:Function = null
    constructor (){
        super(); 
        this.loadprocess=0;
        this.loadarr = [
            function(){
                UserMgr.getInstance().reqMyInfo();//获取我的信息
            },
            function(){
                RoomMgr.getInstance().reqMyRoomState();//获取我的房间状态
            }
        ];
        this.totalcount=this.loadarr.length;
        this.routes={
            'http.reqMyInfo':this.http_reqMyInfo, 
            'http.reqMyRoomState':this.http_reqMyRoomState,     
        } 
    }

    http_reqMyInfo(msg){
        this.checkIfAllLoaded();
    }
    http_reqMyRoomState(msg){
        this.checkIfAllLoaded();
    }
    checkIfAllLoaded(){
        this.loadprocess=this.loadprocess+1; 
        if(this.loadprocess>=this.totalcount){
            //表示全部加载完成了
            this.completecb();
        }
    }

    initPlat(completecb){
        this.completecb = completecb
        //获取我的信息
        for(let i = 0; i < this.totalcount; i ++){
            this.loadarr[i]();
        }
    } 
    
    
    enterPlat() { 
        this.send_msg('connector.entryHandler.enterPlat');
    } 
    dealConnectorEvent(ev_type,arg1,arg2){
        //ev_type=0表示推送
        //ev_type=1表示连接成功  
        if(ev_type==1){
            this.enterPlat();  
        }
    }


    //单例处理
    private static _instance:PlatMgr;
    public static getInstance ():PlatMgr{
        if(!this._instance){
            this._instance = new PlatMgr();
        }
        return this._instance;
    }
}